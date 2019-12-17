const merge=require('gy-merge'), md5=require('md5'), qs=require('querystring'),sortObj=require('sort-object'), _=require('./etc.js');
const getDB=require('./db.js');

function getMerchant(merchantid, cb) {
	getDB((err, db)=>{
		if (err) return cb(err);
		db.users.find({merchantid:merchantid}).toArray((err, r) =>{
			if (err) return cb(err);
			if (r.length==0) return cb('no such merchant');
			return cb(null, _.dedecimal(r[0]));
		})
	})
}
exports.verifySign=	function verifySign(req, res, next) {
	var _p=merge(req.query, req.body), sign=_p.sign;
	if (!sign) return res.render('error', {err:'没有签名sign'});
	delete _p.sign;
	var userId=_p.partnerId||_p.partnerid||_p.merchantId||_p.merchantid;
	if (!userId) return res.render('error', {err:'没有指定商户号'});
	getMerchant(userId, function(err, mer) {
		if (err) return res.render('error', {err:err});
		var wanted=md5(mer.key+qs.stringify(sortObj(_p, {sort:(a, b)=>{return a>b?1:-1}})));
		if (sign!=wanted) {
			var e={err:'签名错误'};
			if (mer.debugMode) {
				e.wanted=wanted;
				e.str=mer.key+qs.stringify(sortObj(_p));
			}
			return res.render('error', e);
		}
		req.merchant=mer;
		req.params=_p;
		next();
	})

}
exports.getMerchant=getMerchant;