const getDB=require('./db.js')
, pify=require('pify')
, sellOrder =require('./providerManager.js').sellOrder
, getBalance =require('./providerManager.js').getBalance
, providers = require('./providerManager.js').providers
, objectPath =require('object-path')
, async =require('async');

var waitToSell={}, balance={};

exports.notifySellSystem=function notifyMe(order) {
    var bc=objectPath.get(balance, [order.provider, order.coin], new Map());
    if (bc.has(order.merchantid)) bc.set(order.merchantid, bc.get(order.merchantid)+order.paidmoney);
    else bc.set(order.merchantid, order.paidmoney);
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
var checking=false;
function checkPlatformBalance() {
    if (checking) return;
    var createSellOrder=require('./order.js').createSellOrder;
    checking=true;
    getDB((err, db)=>{
        async.eachOf(balance, (provider, bp, callback)=>{
            async.eachOf(bp, (coin, sells, cb) =>{
                var p=providers[provider];
                async.parallel([
                    (_cb)=>{
                        p.getBalance(coin, _cb);        
                    },
                    (_cb)=>{
                        p.bestSell(coin, _cb);
                    }
                ], (err, r)=>{
                    if (err) return;
                    var left=r[0], buyers=r[1];
                    var usedBuyer=0;
                    sells.forEach((bm, merchantid)=>{
                        if (left==0) return;
                        var tosell=Math.min(left, bm);
                        for (var i=usedBuyer; i<buyers.length; i++) {
                            let buyer=buyers[i];
                            if (buyer.left==0) continue;
                            let selltotheone=Math.min(buyers[i].left, tosell);
                            createSellOrder(merchantid, selltotheone, provider,coin, (err, orderid)=>{
                                p.sell(orderid, coin, selltotheone, buyer);
                            })
                            buyer.left-=selltotheone;
                            tosell-=selltotheone;
                            if (tosell==0) break;
                        }
                        bm-=tosell;
                        if (bm==0) sells.delete(merchantid);
                        usedBuyer=i;
                    });
                })
                providers[provider].getBalance(coin, (err, left, _cb) =>{
                    if (err) return _cb();
                    for (var i=0; i<sells.length; i++) {
                        if (left<sells[i].money) break;
                        createSellOrder(sellOrder);
                        left-=sells[i].money;
                    }
                    return _cb();
                })
            }, callback);
        }, function() {
            checking=false;
        })    
    })
}

setInterval(checkPlatformBalance, 30*1000);

// function sell() {
//     waitToSell.forEach((order)=>{
//         sellOrder(order._id, order.paidmoney, order.provider, function(err) {
//             if (err) return;
//             waitToSell.delete(order);
//         })
//     });
// }
// setInterval(sell, 60*1000);