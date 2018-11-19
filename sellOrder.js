const getDB=require('./db.js')
, pify=require('pify')
, sellOrder =require('./providerManager.js').sellOrder;

var waitToSell=new Set();

exports.notifySellSystem=function notifyMe(order) {
    checkMerchantBalance();
    checkPlatformBalance();
}


function checkMerchantBalance() {
    
}

function checkPlatformBalance() {
    
}

function sell() {
    waitToSell.forEach((order)=>{
        sellOrder(order._id, order.paidmoney, order.provider, function(err) {
            if (err) return;
            waitToSell.delete(order);
        })
    });
}
setInterval(sell, 60*1000);