const getDB=require('./db.js')
, pify=require('pify')
, objectPath =require('object-path')
, async =require('async');

var waitToSell={}, balance={};

var db,sellOrder, getBalance, getProvider;
getDB((err, _db)=>{
    db=_db;
    db.balance.find({_id:'default'}).toArray((err, r)=>{
        if (err) return;
        if (r.length==0) return;
        var dbbalance=r[0];
        for (var p in dbbalance) {
            if (p=='_id') continue;
            var pvd=dbbalance[p];
            for (var coin in pvd) {
                objectPath.ensureExists(balance, [p, coin], new Map());
                var bc=objectPath.get(balance, [p, coin]);
                var merlist=pvd[coin];
                for (var mer in merlist) {
                    bc.set(mer, merlist[mer]);
                }
            }
        }
    })
    sellOrder =require('./providerManager.js').sellOrder
    getBalance =require('./providerManager.js').getBalance
    getProvider = require('./providerManager.js').getProvider
});

exports.notifySellSystem=function notifyMe(order) {
    objectPath.ensureExists(balance, [order.provider, order.coin], new Map());
    var bc=objectPath.get(balance, [order.provider, order.coin]);
    if (bc.has(order.merchantid)) {
        bc.set(order.merchantid, bc.get(order.merchantid)+order.paidmoney);
    }
    else {
        bc.set(order.merchantid, order.paidmoney);
    }
    db.balance.update({_id:'default'}, balance, {upsert:true});
    // bp+=order.paidmoney;
    // balance[order.merchantid][order.provider][order.coin]=bp;
    // if (bp>=20000) {
    //     objectPath.push(waitToSell, [''+order.provider, ''+order.coin], {money:bp, merchantid:order.merchantid});
    // }
}

// function clearBalance() {
//     // run every 5 mins
//     for (var merchantid in balance) {
//         var b=balance[merchantid];
//         for (var provider in b) {
//             var bp=b[p];
//             for (var coin in bp) {
//                 objectPath.set(waitToSell, [''+provider, ''+coin], {money:bp[coin], merchantid:merchantid});
//             }
//         }
//     }
// }
const MIN_OF_BALANCE=0.00000001;
var checking=false;
function checkPlatformBalance(specMerchant, backCall) {
    if (!backCall) backCall=function() {};
    if (checking) return backCall('正在清帐');
    var createSellOrder=require('./order.js').createSellOrder;
    checking=true;
    getDB((err, db)=>{
        async.eachOf(balance, (balanceByProviders, providerName, callback)=>{
            async.eachOf(balanceByProviders, (balanceByCoins, coin, cb) =>{
                var p=getProvider(providerName);
                async.parallel([
                    (_cb)=>{
                        p.getBalance(coin, _cb);        
                    },
                    (_cb)=>{
                        p.bestSell(coin, _cb);
                    }
                ], (err, r)=>{
                    if (err) return cb(err);
                    var leftCoins=r[0], buyers=r[1];
                    var usedBuyer=0;
                    balanceByCoins.forEach((balanceByMerchants, merchantid)=>{
                        if (leftCoins==0) return;
                        if (specMerchant && specMerchant!=merchantid) return;   //如果指定merchant，那么只处理指定的
                        if (balanceByMerchants<MIN_OF_BALANCE) return;
                        for (var i=usedBuyer; i<buyers.length; i++) {
                            let buyer=buyers[i];
                            if (buyer.leftCoins==0) continue;
                            let tosell=Math.min(leftCoins, balanceByMerchants/buyer.unitPrice, buyer.leftCoins);                            
                            // let selltotheone=Math.min(buyer.leftCoins, tosell);
                            createSellOrder(merchantid, tosell*buyer.unitPrice, providerName,coin, (err, orderid)=>{
                                p.sell(orderid, coin, tosell*buyer.unitPrice, buyer);
                            })
                            buyer.leftCoins-=tosell;
                            leftCoins-=tosell;
                            balanceByMerchants-=tosell*buyer.unitPrice;
                            if (balanceByMerchants<MIN_OF_BALANCE) {
                                break;
                            }
                        }
                        var chg={};
                        if (balanceByMerchants<0.00000001) {
                            balanceByCoins.delete(merchantid);
                            chg[[providerName, coin, merchantid].join('.')]=1;
                            db.balance.update({_id:'default'}, {$unset:chg});
                        } else {
                            balanceByCoins.set(merchantid, balanceByMerchants);
                            chg[[providerName, coin, merchantid].join('.')]=balanceByMerchants;;                            
                            db.balance.update({_id:'default'}, {$set:chg});   
                        }
                        usedBuyer=i;
                    });
                    cb();
                })
             }, callback);
        }, function() {
            checking=false;
            backCall();
        })    
    })
}
setInterval(checkPlatformBalance, 30*1000);

exports.checkPlatformBalance=checkPlatformBalance;

// function sell() {
//     waitToSell.forEach((order)=>{
//         sellOrder(order._id, order.paidmoney, order.provider, function(err) {
//             if (err) return;
//             waitToSell.delete(order);
//         })
//     });
// }
// setInterval(sell, 60*1000);