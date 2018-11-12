const merge=require('gy-merge'), getDB=require('./db.js'), md5=require('md5'), qs=require('querystring'),sortObj=require('sort-object');

var merchants={};
function getMerchant(id, callback) {
	if (merchants[id]) return callback(null, merchants[id]);
	getDB((err, db)=>{
		if (err) return callback(err);
		db.users.find({merchantid:id}).limit(1).toArray(function(err, r) {
			if (err) return callback(err);
			if (r.length==0) return callback('no such merchant');
			if (r[0].acl!='merchant') return callback('no such merchant');
			merchants[id]=r[0]||{};
			return callback(null, merchants[id]);
		})	
	})
}
exports.verifySign=	function verifySign(req, res, next) {
	var _p=merge(req.query, req.body), sign=_p.sign;
	if (!sign) return res.send({err:'没有签名sign'});
	delete _p.sign;
	if (!_p.merchantid) return res.send({err:'没有商户号'});
	getMerchant(_p.merchantid, function(err, mer) {
		if (err) return res.send({err:err});
		var wanted=md5(mer.key+qs.stringify(sortObj(_p)));
		if (sign!=wanted) {
			var e={err:'签名错误'};
			if (mer.debugMode) {
				e.wanted=wanted;
				e.str=mer.key+qs.stringify(sortObj(_p));
			}
			return res.send(e);
		}
		next();
	})

}
exports.getMerchant=getMerchant;