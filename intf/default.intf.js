(function(exports) {
    const sortObj=require('sort-object'), qs=require('querystring').stringify, url=require('url'), crypto=require('crypto'), merge=require('gy-merge');
    const router=require('express').Router(), httpf=require('httpf');
    const getMerchant=require('../merchants.js').getMerchant;
    function verifySign(req, res, next) {
        var _p=merge(req.query, req.body), sign=_p.sign;
        if (!_p.merchantid) return res.send({err:'no merchantid'});
        if (!sign) return callback({err:'没有签名sign'});
        getMerchant(_p.merchantid, function(err, mer) {
            if (err) return res.send({err:err});
            delete _p.sign;
            var wanted=md5(key+qs.stringify(sortObj(_p)));
            if (sign!=wanted) {
                var e={err:'签名错误'};
                if (mer.debugMode) {
                    e.wanted=wanted;
                    e.str=key+qs.stringify(sortObj(_p));
                }
                return res.send(e);
            }
            next();
        })
    }
    router.all('order', verifySign, httpf({orderid:'string', merchantid:'string', money:'number', callback:true}, function(orderid, merchantid, money, callback) {
        verifySign(merchantid, this.req, function(err) {
            if (err) return callback(err);
            createOrder(orderid, money, merchantid, function(err, order) {
                callback(err, order);
            });
        })
    }));
    process.on('message', function(msg) {
        if (msg.type=='admin:updateMerchant') {
            if (!merchantData[merchantid]) {
                merchantData[merchantid]={};
                //query from db & change it
            }
            var o=merchantData[merchantid];
            o.key=msg.key||o.key;
            o.debugMode=msg.debugMode||o.debugMode||false;

            // change db
        }
    });
})(module.exports);