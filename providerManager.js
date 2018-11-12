var external_provider ={};
const path=require('path'), async=require('async')
var tt = require('gy-module-loader')(path.join(__dirname, 'provider/*.pd.js'), function () {
    var keys = Object.keys(tt);
    for (var i = 0; i < keys.length; i++) {
        external_provider[path.basename(keys[i], '.pd.js')] = tt[keys[i]];
    }
});

exports.providers=external_provider;

const filter = require('filter-object');
function order(orderid, money,mer, callback) {
    if (!mer.providers) return callback('联系对接小伙伴，他忘记给商户配置渠道了');
    async.map(filter(external_provider, Object.keys(mer.providers)), function(prd, cb) {
        prd.bestPair(money, function(err, gap, coinType){
            if (err) return cb(null, {gap:Number.MAX_VALUE, coinType:''});
            return cb(null, {gap:gap, coinType:coinType, prd:prd});
        });
    }, function(err, r) {
        r.sort((a, b)=>{return b.gap-a.gap});
        for (var i=0; i<r.length; i++) {
            if (r[i].coinType) break;
        }
        if (!r[i].coinType) return callback('没有可用的交易提供方');
        r[i].prd.order(orderid, money, mer, r[i].coinType, callback);
    });
}

exports.order=order;