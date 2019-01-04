const getDB=require('./db.js'), pify=require('pify'), getMerchant=require('./merchants.js').getMerchant,ObjectID = require('mongodb').ObjectID
    ,request=require('request'), notifySellSystem=require('./sellOrder.js').notifySellSystem, async=require('async')
    , sortObj=require('sort-object'), qs=require('querystring').stringify
    , md5=require('md5'), getUser=require('./users.js').get;

function createOrder(merchantid, merchantOrderId, money, preferredPay, cb_url, callback) {
    if (typeof preferredPay=='function') {
        callback=preferredPay;
        preferredPay=null;
    }
    getDB((err, db)=>{
        db.bills.find({merchantid:merchantid, merchantOrderId:merchantOrderId}).toArray((err, r)=>{
            if (err) return callback(err);
            if (r.length>0) return callback('orderid重复');
            pify(getMerchant)(merchantid).then((mer)=>{
                return db.bills.insert({merchantOrderId:merchantOrderId, merchantid:merchantid, provider:'', providerOrderId:'', share:mer.share, money:money, paidmoney:-1, time:new Date(), lasttime:new Date(), lasterr:'', preferredPay:preferredPay, cb_url:cb_url, status:'created'}, {w:1});
            })
            .then((r)=>{
                callback(null, r.insertedIds[0].toHexString());            
            }).catch((e)=>{
                callback(e);
            })
        })
    })
}
function createSellOrder(merchantid, money, provider, coin, callback) {
    getDB((err, db)=>{
        if (err) return callback(err);
        db.bills.insert({type:'sell', merchantid:merchantid, provider:provider||'unknown', providerOrderId:'', coin:coin, money:money, time:new Date(), lasttime:new Date(), lasterr:'', status:'created'}, {w:1})
        .then((r)=>{
            callback(null, r.insertedIds[0].toHexString());            
        }).catch((e)=>{
            callback(e);
        })
    })    
}
function getOrderDetail(orderid, callback) {
    getDB((err, db) =>{
        if (err) return callback(err);
        db.bills.find({_id:ObjectID(orderid)}).toArray((err, r)=>{
            if (err) return callback(err);
            if (r.length==0) return callback('no such order');
            callback(null, r[0].merchantid, r[0].money, r[0].cb_url);
        })
    });
}
function cancelOrder(orderid, callback) {
    getDB((err, db)=>{
        if (err) return callback(err);
        db.bills.find({_id:ObjectID(orderid), status:{$ne:'canceled'}}).toArray((err, r)=>{
            if (err) return callback(err);
            if (r.length==0) return callback('no such order');
            db.bills.update({_id:ObjectID(orderid)}, {$set:{status:'canceled'}});
            if (r[0].type=='sell') notifySellSystem(r[0]);
            callback();
        })
    });
}
function confirmOrder(orderid, money, callback) {
    if (typeof money=='function') {
        callback=money;
        money=null;
    }
    getDB((err, db)=>{
        db.bills.find({_id:ObjectID(orderid), paidmoney:-1}).toArray(function(err, r) {
            if (err) return callback(err);
            if (r.length==0) return callback('no such orderid');
            if (!money) money=r[0].money;
            r[0].paidmoney=money;
            var upd={status:'已支付', paidmoney:money, lasttime:new Date()};
            db.bills.update({_id:ObjectID(orderid)}, {$set:upd}, {w:1}, function(err) {
                if (err) return callback(err);
                notifyMerchant(r[0]);
                callback();
            })
            var shares=[];
            // shares.push((money*(r[0].share||0.985)).toFixed(2));
            function getParent(user, cb) {
                db.users.find({_id:user.parent}).toArray((err, r) =>{
                    if (err) return cb(err);
                    if (r.length==0) return cb('no such user');
                    cb(null, r[0]);
                })
            }
            var findkey={};
            if (r[0].userid) findkey.id=r[0].userid;
            else if (r[0].merchantid) findkey.merchantid=r[0].merchantid;
            db.users.find(findkey).toArray()
            .then((merchants)=>{
                return new Promise((resolve, reject)=>{
                    (function getShare(user, cb) {
                        shares.push({m:Number((money*(user.share||0)).toFixed(2)), user:user});
                        if (!user.parent) return cb();
                        getParent(user, function(err, parent) {
                            if (err || !parent) return cb();
                            getShare(parent, cb);
                        })
                    })(merchants[0], resolve);
                });
            })
            .then(()=>{
                updateWithLog(shares[0].user, shares[0].m, '充值收入', orderid);
                // db.users.update({_id:shares[0].id}, {$inc:{total:shares[0].m}});
                for (var i=1; i<shares.length; i++) {
                    // db.users.update({_id:shares[i].id}, {$inc:{total:(shares[i].m-shares[i-1].m)}})
                    updateWithLog(shares[i].user, shares[i].m-shares[i-1].m, '充值分账', orderid);
                }
                updateWithLog('system', money-shares[shares.length-1].m, '充值利润', orderid);
            })
            .catch((e)=>{
        
            });
            // async.parallel([
            //     db.users.update.bind(db.users, {merchantid:r[0].merchantid}, {$inc:{total:delta}}, {w:1}),
            //     db.stat.update.bind(db.stat, {_id:r[0].merchantid}, {$inc:{incoming:r[0].paidmoney, profit:r[0].paidmoney-delta}, $set:{provider:r.provider}}, {upsert:true, w:1})
            // ], (err)=>{
            //     notifySellSystem(r[0]);
            // })
        });
    })
}
function merSign(merchantData, o) {
    if (o.sign) delete o.sign;
    o.sign=md5(merchantData.key+qs(sortObj(o)));
    return o;
}
function notifyMerchant(orderdata) {
    getDB((err, db)=>{
        pify(getMerchant)(orderdata.merchantid).then((mer)=>{
            return pify(request)({uri:orderdata.cb_url, form:merSign(mer, {orderid:orderdata.merchantOrderId, money:orderdata.paidmoney})});
        }).then((header, body)=>{
            return new Promise((resolve, reject)=>{
                try {
                    var ret=JSON.parse(body);
                } catch(e) {
                    return reject(e);
                }
                if (body.err) return reject(e);
                resolve(ret);
            });
        }).then(()=>{
            retryNotifyList.delete(orderdata._id);
            db.bills.update({_id:orderdata._id}, {$set:{status:'complete', lasttime:new Date()}});
        }).catch((e)=>{
            // put into retry list
            var rn=retryNotifyList.get(orderdata._id);
            if (!rn) {
                rn=orderdata;
                rn.retrytimes=1;
                retryNotifyList.set(orderdata._id, rn);
                db.bills.update({_id:orderdata._id}, {$set:{lasttime:new Date(), status:'通知商户', lasterr:e.message}});
            }
            else {
                rn.retrytimes++;
                if (rn.retrytimes>5) {
                    retryNotifyList.delete(orderdata._id);
                    db.bills.update({_id:orderdata._id}, {$set:{lasttime:new Date(), status:'通知失败', lasterr:e.message}});
                }
            }
        });    
    });
}
var retryNotifyList=new Map();
(function() {
    getDB((err, db)=>{
        db.bills.find({status:'通知商户'}).toArray((err, r)=>{
            if (err) return;
            for (var i=0; i<r.length; i++) {
                retryNotifyList.set(r[i]._id, r[i]);
            }
        });
    })
    setInterval(()=>{
        retryNotifyList.forEach(notifyMerchant);
    }, 60*1000);
})();

function updateOrder(orderid, upd, callback) {
    if (!callback) callback=function() {};
    if (typeof upd!='object') return callback('param error');
    getDB((err, db)=>{
        db.bills.update({_id:ObjectID(orderid)}, {$set:upd}, function(err, r) {
            callback(err, r);
        });
    });
}

function balancelog(user, delta, desc) {
    (function check(cb) {
        if (typeof user=='object') return cb(null, user);
        // get from db
        db.users.find({_id:user}).toArray((err, r)=>{
            if (err) return cb(err);
            if (r.length==0) return cb('no such user');
            cb(err, r[0]);
        })
    })((err, userdata) =>{
        db.balance.insert({user:userdata._id, before:userdata.total||0, delta:delta, desc:desc});
    });
}
function updateWithLog(user, delta, desc, orderid) {
    (function check(cb) {
        if (typeof user=='object') return cb(null, user);
        // get from db
        getUser(user, cb);
    })((err, userdata) =>{
        db.balance.insert({user:userdata._id, total:userdata.total, delta:delta, desc:desc, orderid:orderid, _t:new Date()});
        db.users.update({_id:userdata._id}, {$inc:{total:delta}}, {upsert:true});
        userdata.total+=delta;
    });    
}
module.exports={
    updateOrder:updateOrder,
    createOrder:createOrder,
    getOrderDetail:getOrderDetail,
    confirmOrder:confirmOrder,
    notifyMerchant:notifyMerchant,
    createSellOrder:createSellOrder,
    cancelOrder:cancelOrder
}