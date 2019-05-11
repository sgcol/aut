var external_provider ={}, providerNameMap={};
const updateOrder=require('./order.js').updateOrder, path=require('path'), async=require('async');
var tt = require('gy-module-loader')(path.join(__dirname, 'provider/*.pd.js'), function () {
    var keys = Object.keys(tt);
    for (var i = 0; i < keys.length; i++) {
        var prd=tt[keys[i]];
        external_provider[path.basename(keys[i], '.pd.js')] = prd;
        if (prd.name) providerNameMap[prd.name]=path.basename(keys[i], '.pd.js');
    }
});

exports.getProvider=function(pid) {
    if (pid==null) return external_provider;
    if (external_provider[pid]) return external_provider[pid];
    if (providerNameMap[pid] && external_provider[providerNameMap[pid]]) return external_provider[providerNameMap[pid]] 
    return null;
}

const filter = require('filter-object');
function order(orderid, money,mer, mer_userid, host, callback) {
    if (!mer.providers) return callback('联系对接小伙伴，他忘记给商户配置渠道了');
    async.map(filter(external_provider, Object.keys(mer.providers)), function(prd, cb) {
        if (!prd.bestPair) return cb(null, {gap:Number.MAX_VALUE, coinType:''});
        prd.bestPair(money, function(err, gap, coinType){
            if (err) return cb(null, {gap:Number.MAX_VALUE, coinType:''});
            return cb(null, {gap:gap, coinType:coinType, prd:prd});
        });
    }, function(err, r) {
        r.sort((a, b)=>{return a.gap-b.gap});
        for (var i=0; i<r.length; i++) {
            if (r[i].coinType) break;
        }
        if (!r[i].coinType) return callback('没有可用的交易提供方');
        updateOrder(orderid, {provider:r[i].prd.name, providerOrderId:orderid, coin:r[i].coinType});
        r[i].prd.order(orderid, money, mer, mer_userid, r[i].coinType, host, callback);
    });
}

exports.order=order;

function sellOrder(orderid, money, providername, callback) {
    var prd=external_provider[providername];
    if (!prd) return callback('no such provider');
    prd.sell(orderid, money, callback);
}