const getDB=require('./db.js'), pify=require('pify'), getMerchant=require('./merchants.js').getMerchant,ObjectID = require('mongodb').ObjectID
    ,request=require('request'), notifySellSystem=require('./sellOrder.js').notifySellSystem, async=require('async');

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
            var delta=(r[0].paidmoney*(r[0].share||0.985)).toFixed(2);
            async.parallel([
                db.users.update.bind(db.users, {merchantid:r[0].merchantid}, {$inc:{total:delta}}, {w:1}),
                db.stat.update.bind(db.stat, {_id:r[0].merchantid}, {$inc:{incoming:r[0].paidmoney, profit:r[0].paidmoney-delta}, $set:{provider:r.provider}}, {upsert:true, w:1})
            ], (err)=>{
                notifySellSystem(r[0]);
            })
        });
    })
}
function notifyMerchant(orderdata) {
    getDB((err, db)=>{
        pify(getMerchant)(orderdata.merchantid).then((mer)=>{
            return pify(request)({uri:orderdata.cb_url, form:merSign({orderid:orderdata.merchantOrderId, money:orderdata.paidmoney})});
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

module.exports={
    updateOrder:updateOrder,
    createOrder:createOrder,
    getOrderDetail:getOrderDetail,
    confirmOrder:confirmOrder,
    notifyMerchant:notifyMerchant,
    createSellOrder:createSellOrder,
    cancelOrder:cancelOrder
}