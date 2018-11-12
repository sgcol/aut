(function(exports) {
	const sortObj=require('sort-object'), qs=require('querystring').stringify, url=require('url'), crypto=require('crypto');
	const merge=require('gy-merge'), sortObj=require('sort-object');
	const accessKey='8ec6e926-fa23645b-1aba961a-9ad42', secretKey='760252a2-0b814bfb-dd6e61d0-2f102';
	exports.md5 = function (str, length) {
		var buf = new Buffer(str.length * 2 + 1);
		var len = buf.write(str, 0);
		str = buf.toString('binary', 0, len);
		var md5sum = crypto.createHash('md5');
		md5sum.update(str);
		str = md5sum.digest('hex');
		if (length == 16) {
			str = str.substr(8, 16);
		}
		return str;
	}
	exports.sign=function(obj, method, url) {
		assert(!obj.Signature);
		obj.AccessKeyId=accessKey;
		obj.SignatureMethod='HmacSHA256';
		obj.SignatureVersion=2;
		obj.Timestamp=new Date().toISOString();
		var hmac=crypto.createHmac('sha256', secretKey);
		hmac.update(method+'\n');
		hmac.update(url+'\n');
		hmac.update(qs(sortObj(obj)));
		obj.Signature=hmac.digest('base64');
		return obj;
	}
})(module.exports);
