const getDB=require('./db.js'), pify=require('pify'), getMerchant=require('./merchants.js').getMerchant,ObjectID = require('mongodb').ObjectID
    ,request=require('request'), notifySellSystem=require('./sellOrder.js').notifySellSystem, async=require('async')
    , sortObj=require('sort-object'), qs=require('querystring').stringify, sysnotifier=require('./sysnotifier.js')
    , md5=require('md5');

function getUser(id, cb) {
    getDB((err, db)=>{
        db.users.find({_id:id}).toArray((err, r)=>{
            if (err) return cb(err);
            if (r.length==0) return cb('no such user');
            cb(null, r[0]);
        })
    })
}

function createOrder(merchantid, userid, merchantOrderId, money, preferredPay, cb_url, callback) {
    if (typeof preferredPay=='function') {
        callback=preferredPay;
        preferredPay=null;
    }
    getDB((err, db)=>{
        db.bills.find({merchantid:merchantid, merchantOrderId:merchantOrderId}).toArray((err, r)=>{
            if (err) return callback(err);
            if (r.length>0) return callback('orderid重复');
            pify(getMerchant)(merchantid).then((mer)=>{
                if ((mer.daily||0)+money>(mer.limitation||2000000)) throw '超出每日收款上限';
                var start=new Date(mer.validfrom||Date.UTC(1971, 1,1, 0, 0, 0))
                , end=new Date(mer.validend||Date.UTC(1971, 1, 1, 13, 0, 0));
                var nowtime=new Date();
                nowtime.setUTCFullYear(1971, 0, 0);
                if (nowtime<start || nowtime>end) throw '本时段不开放充值';
                return db.bills.insertOne({merchantOrderId:merchantOrderId, userid:mer._id, merchantid:merchantid, mer_userid:userid, provider:'', providerOrderId:'', share:mer.share, money:money, paidmoney:-1, time:new Date(), lasttime:new Date(), lasterr:'', preferredPay:preferredPay, cb_url:cb_url, status:'created'}, {w:1});
            })
            .then((r)=>{
                callback(null, r.insertedId.toHexString());            
            }).catch((e)=>{
                callback(e);
            })
        })
    })
}
function createSellOrder(merchantid, money, provider, coin, callback) {
    getDB((err, db)=>{
        if (err) return callback(err);
        db.bills.insertOne({type:'sell', merchantid:merchantid, provider:provider||'unknown', providerOrderId:'', coin:coin, money:money, time:new Date(), lasttime:new Date(), lasterr:'', status:'created'}, {w:1})
        .then((r)=>{
            callback(null, r.insertedId.toHexString());            
        }).catch((e)=>{
            callback(e);
        })
    })    
}
function getOrderDetail(orderid, callback) {
    getDB((err, db) =>{
        if (err) return callback(err);
        db.bills.findOne({_id:ObjectID(orderid)}, (err, r)=>{
            if (err) return callback(err);
            if (!r) return callback('no such order');
            callback(null, r.merchantid, r.money, r.mer_userid, r.cb_url);
        })
    });
}
function cancelOrder(orderid, callback) {
    getDB((err, db)=>{
        if (err) return callback(err);
        db.bills.find({_id:ObjectID(orderid), status:{$ne:'canceled'}}).toArray((err, r)=>{
            if (err) return callback(err);
            if (r.length==0) return callback('no such order');
            db.bills.updateOne({_id:ObjectID(orderid)}, {$set:{status:'canceled'}});
            if (r[0].type=='sell') notifySellSystem(r[0]);
            callback();
        })
    });
}
function confirmOrder(orderid, money, net, callback) {
    if (typeof money=='function') {
        callback=money;
        money=null;
        net=null;
    }
    if (typeof net=='function') {
        callback=net;
        net=money;
    }
    callback=callback||function(){};
    getDB((err, db)=>{
        db.bills.findOneAndUpdate({_id:ObjectID(orderid), used:{$ne:true}}, {$set:{used:true}}, {w:'majority'}, function(err, r) {
            if (err) return callback(err);
            if (!r.value) {
                return db.bills.findOne({_id:ObjectID(orderid)}, (err, r)=>{
                    if (r) return callback('used order');
                    return callback('no such orderid');
                })
            }
            r=r.value;

            if (!money) money=r.money;
            if (!net) net=money;
            r.paidmoney=money;
            var provider=r.provider||'unknown';
            callback();
            var shares=[];
            // shares.push((money*(r[0].share||0.985)).toFixed(2));
            function getParent(user, cb) {
                db.users.findOne({_id:user.parent}, (err, r) =>{
                    if (err) return cb(err);
                    if (!r) return cb('no such user');
                    cb(null, r);
                })
            }
            var findkey={};
            if (r.userid) findkey._id=r.userid;
            else if (r.merchantid) findkey.merchantid=r.merchantid;
            db.users.findOne(findkey)
            .then(function (user) {
                return new Promise((resolve, reject)=>{
                    if (!user) return reject('no such merchant');
                    (function getShare(user, cb) {
                        shares.push({m:Number((money*(user.share||1)).toFixed(2)), user:user});
                        if (!user.parent) return cb();
                        getParent(user, function(err, parent) {
                            if (err || !parent) return cb();
                            getShare(parent, cb);
                        })
                    })(user, resolve);
                });
            })
            .then(()=>{
                var last=0;
                var upds=[];
                for (var i=0; i<shares.length; i++) {
                    var ele=shares[i];
                    var inc={};
                    var delta=Number((ele.m-last).toFixed(2));
                    if (delta<0) {
                        sysnotifier.add(`${ele.user.name||ele.user._id}的分成小于他的下级，请修改`);
                        shares.splice(i);
                        break;
                    }
                    inc[`in.${provider.name||provider}`]=delta;
                    inc.profit=delta;
                    inc.daily=delta;
                    last=delta;
                    upds.push({updateOne:{filter:{_id:ele.user._id}, update:{$inc:inc}}});
                }
                db.users.bulkWrite(upds, {ordered:false});
                var now=new Date();
                var firstOne=true;
                db.balance.insertMany(shares.map((ele=>{
                    var r={user:ele.user, delta:ele.m, orderid:orderid, desc:firstOne?'充值收入':'充值分账', t:now}
                    firstOne=false;
                    return r;
                })))
                updateWithLog('system', Number((net-shares[shares.length-1].m).toFixed(2)), '充值利润', orderid,provider);
            })
            .catch((e)=>{
                console.log(e);
            });
            // async.parallel([
            //     db.users.update.bind(db.users, {merchantid:r[0].merchantid}, {$inc:{total:delta}}, {w:1}),
            //     db.stat.update.bind(db.stat, {_id:r[0].merchantid}, {$inc:{incoming:r[0].paidmoney, profit:r[0].paidmoney-delta}, $set:{provider:r.provider}}, {upsert:true, w:1})
            // ], (err)=>{
            //     notifySellSystem(r[0]);
            // })    
            var upd={status:'已支付', paidmoney:money, net:net, lasttime:new Date()};
            db.bills.update({_id:ObjectID(orderid)}, {$set:upd}, {w:1}, function(_e) {
                if (_e || err) return callback(_e||err);
                notifyMerchant(r);
                callback();
            })
        });
    })
}
function merSign(merchantData, o) {
    if (o.sign) delete o.sign;
    o.sign=md5(merchantData.key+qs(sortObj(o,{sort:(a, b)=>{return a>b?1:-1}})));
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
                if (body.err) return reject(body.err);
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
        db.bills.updateOne({_id:ObjectID(orderid)}, {$set:upd}, function(err, r) {
            callback(err, r);
        });
    });
}

function balancelog(user, delta, desc) {
    (function check(cb) {
        if (typeof user=='object') return cb(null, user);
        // get from db
        getDB((err, db)=>{
            db.users.findOne({_id:user}, (err, r)=>{
                if (err) return cb(err);
                if (!r) return cb('no such user');
                cb(err, r);
            })    
        })
    })((err, userdata) =>{
        db.balance.insertOne({user:userdata._id, before:userdata.total||0, delta:delta, desc:desc});
    });
}
function updateWithLog(user, delta, desc, orderid, provider) {
    (function check(cb) {
        if (typeof user=='object') return cb(null, user);
        // get from db
        cb(null, {_id:user});
    })((err, userdata) =>{
        getDB((err, db)=>{
            db.balance.insertOne({user:userdata, delta:delta, desc:desc, orderid:orderid, t:new Date()});
            var inc={};
            inc[`in.${provider}`]=delta;
            db.users.update({_id:userdata._id}, {$inc:inc}, {upsert:true});
            // if (!userdata.total) {
            //     userdata.total={};
            //     userdata.total[provider]=delta;
            // }else {
            //     if (!userdata.total[provider]) userdata.total[provider]=delta;
            //     else userdata.total[provider]+=delta;
            // }    
        })
    });    
}
var today=new Date();
setInterval(()=>{
    var now=new Date();
    if (now.getDate()!=today.getDate()) {
        today=now;
        getDB((err, db)=>{
            !err && db.users.updateMany({}, {$set:{daily:0}});
        })
    }
}, 30*60*1000);

module.exports={
    updateOrder:updateOrder,
    createOrder:createOrder,
    getOrderDetail:getOrderDetail,
    confirmOrder:confirmOrder,
    notifyMerchant:notifyMerchant,
    createSellOrder:createSellOrder,
    cancelOrder:cancelOrder,
    merSign:merSign
}