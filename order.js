const getDB=require('./db.js'), pify=require('pify');

exports.createOrder =function createOrder(merchantid, merchantOrderId, money, preferredPay, cb_url, callback) {
    if (typeof preferredPay=='function') {
        callback=preferredPay;
        preferredPay=null;
    }
    getDB((err, db)=>{
        db.bills.insert({merchantOrderId:merchantOrderId, merchantid:merchantid, money:money, paidmoney:-1, time:new Date(), lasttime:new Date(), lasterr:'', preferredPay:preferredPay, cb_url:cb_url, status:'created'}, {w:1}, callback);
    })
}
exports.confirmOrder =function confirmOrder(orderid, money, callback) {
    getDB((err, db)=>{
        db.bills.findOneAndUpdate({_id:orderid}, {$set:{status:'providerCompleted', paidmoney:money, lasttime:new Date()}}, function(err, r) {
            if (err) return callback(err);
            notifyMerchant(r.value);
        });    
    })
}
function notifyMerchant(orderdata) {
    getDB((err, db)=>{
        pify(getMerchant)(orderdata.merchantid).then((mer)=>{
            return pify(request)({uri:orderdata.cb_url, form:merSign({orderid:orderdata.merchantOrderId, money:paidmoney})});
        })
        .then((header, body)=>{
            return new Promise((resolve, reject)=>{
                try {
                    var ret=JSON.parse(body);
                } catch(e) {
                    return reject(e);
                }
                if (body.err) return reject(e);
                resolve(ret);
            });
        })
        .then(()=>{
            retryNotifyList.delete(orderdata._id);
            db.bills.update({_id:orderdata._id}, {$set:{status:'complete', lasttime:new Date()}});
        }).catch((e)=>{
            // put into retry list
            if (retryNotifyList.has(orderdata._id)) {
                retryNotifyList[orderdata._id]=orderdata;
                retryNotifyList[orderdata._id].retrytimes=1;
                db.bills.update({_id:orderdata._id}, {$set:{lasttime:new Date(), status:'notify merchant failed, retrying...', lasterr:e.message}});
            }
            else {
                retryNotifyList[orderdata._id].retrytimes++;
                if (retryNotifyList[orderdata._id].retrytimes>5) {
                    retryNotifyList.delete(orderdata._id);
                    db.bills.update({_id:orderdata._id}, {$set:{lasttime:new Date(), status:'notify merchant failed', lasterr:e.message}});
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
