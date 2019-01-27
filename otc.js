const md5=require('md5'), qs=require('querystring'), sortObj=require('sort-object');
const OTCKey='$mVd!w9R%Wr4NDSJr8';
module.exports={
    verifyOTC:(function createVerifyOTC(lastT) {
        return function (req, res, next) {
            var _p=merge(req.query, req.body), sign=_p.sign;
            if (!sign) return res.send({err:'没有签名sign'});
            delete _p.sign;
            if (_p.t==null) return res.send({err:'没有时间戳'});
            var wanted=md5(qs.stringify(sortObj(_p))+OTCKey);
            if (sign!=wanted) {
                var e={err:'签名错误'};
                if (argv.debugout) {
                    e.wanted=wanted;
                    e.str=qs.stringify(sortObj(_p))+OTCKey;
                }
                return res.send(e);
            }
            if (Number(_p.t)<=lastT) return res.send({err:'时间戳异常'});
            lastT=Number(_p.t);
            next();
        }
    })(0),
    makeOTCSign(obj) {
        if (!obj.t) obj.t=new Date().getTime();
        if (obj.sign) delete obj.sign;
        obj.sign=md5(qs.stringify(sortObj(obj))+OTCKey);
        return obj;
    }
}

if (module==require.main) {
    // test mode
    const request=require('request');
    request.post({uri:'http://usdt.cs8.us:89/api/merchant/confirmOrder', form:module.exports.makeOTCSign({transactionid:'183', userid:'16'})}, function(err, header, body) {
        console.log(JSON.parse(body));
    })
}