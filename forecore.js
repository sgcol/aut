const router=require('express').Router()
, httpf =require('httpf')
, bestProvider =require('./providerManager.js').bestProvider
, getProvider=require('./providerManager').getProvider
, getDB=require('./db.js')
, ObjectId =require('mongodb').ObjectId
, verifyMchSign =require('./merchants').verifySign
, mchSign =require('./order').merSign
, pify =require('pify')
, url =require('url')
, path =require('path')
, decimalfy=require('./etc').decimalfy
, dedecimal=require('./etc').dedecimal
, argv=require('yargs').argv

const allPayType=['ALIPAYH5', 'WECHATPAYH5', 'UNIONPAYH5', 'ALIPAYAPP', 'WECHATPAYAPP', 'ALIPAYMINI', 'WECHATPAYMINI', 'ALIPAYPC', 'WECHATPAYPC', 'UNIONPAYPC'];

const {verifyAuth, verifyManager}=require('./auth.js');

exports.router=router;

function err_h(err, req, res, next) {
	if (err) res.send({err:err});
	else next();
}
(function init(cb) {
	getDB(cb);
})(start);

function start(err, db) {
	if (err) return console.error(err);

	//currecny defined at https://intlmapi.alipay.com/gateway.do?service=forex_rate_file&sign_type=MD5&partner=2088921303608372&sign=75097bd6553e1e94aabc6e47b54ec42e, uppercase
	router.all('/order', verifyMchSign, err_h, httpf({partnerId:'?string', merchantId:'?string', userId:'string', outOrderId:'string', money:'number', currency:'string', cb_url:'string', return_url:'?string', callback:true}, 
	async function(partnerId, merchantId, mchuserid, outOrderId, money, currency, cb_url, return_url, callback){
		// var userId=partnerId||merchantId;
		// if (!sign) return callback('sign must be set');
		// if (!userId) return callback('partnerId or merchantId must be set');
		// var user =await db.users.findOne({_id:userId});
		// var params=Object.assign(this.req.query, this.req.body);
		// if (merSign(user, params).sign!=sign) return callback('sign error, use sign-verify-url to find what is wrong');

		var params =this.req.params;
		
		var merchant =this.req.merchant;
		var provider=await pify(bestProvider)(money, merchant, {forecoreOnly:true, currency:currency});
		
		var req=this.req;
		var basepath=argv.host||url.format({protocol:req.protocol, host:req.headers.host, pathname:path.resolve(req.baseUrl, '..')});
		if (basepath.slice(-1)!='/') basepath=basepath+'/';

		params._host=basepath;
		// if (provider.checkParams) {
		// 	var paramsErr=provider.checkParams(params);
		// 	if (paramsErr) return callback(paramsErr);
		// }

		var orderId=new ObjectId();
		params.merchant=merchant;
		params.orderId=orderId.toHexString();
		try {
			var [ret] =await Promise.all([
				pify(provider.forwardOrder)(params),
				db.bills.insertOne(decimalfy({
					_id:orderId
					, merchantOrderId:outOrderId
					, parnterId:partnerId
					, userid:merchant._id
					, merchantid:merchant.merchantid
					, merchantName:merchant.name
					, mer_userid:mchuserid
					, provider:provider.internal_name||provider.name
					, providerOrderId:''
					, share:merchant.share
					, money:money
					, paidmoney:-1
					, currency: currency
					, time:new Date()
					, lasttime:new Date()
					, lasterr:''
					, cb_url:cb_url
					, return_url:return_url
					, status:'prepare'})
					,{w:1})
			])
		}catch(e) {
			return callback(e)
		}
		db.bills.updateOne({_id:orderId}, {$set:{providerOrderId:ret.providerOrderId, status:'forward'}});
		Object.assign(ret ,{outOrderId:outOrderId, orderId:orderId.toHexString()});
		callback(null, mchSign(merchant, ret));
	}));
	router.all('/queryOrder', verifyMchSign, err_h, httpf({outOrderId:'string', partnerId:'string', callback:true},
	async function(outOrderId, partnerId, callback) {
		try {
			var order = await db.bills.findOne({merchantOrderId:outOrderId}, {projection:{share:0, provider:0, snappay_account:0, snappay_data:0}});
			if (!order) return callback('无此订单');
			if (order.merchantid!=partnerId) return callback('该订单不属于指定的partner');
			order.outOrderId=order.merchantOrderId
			order.received=order.paidmoney;
			order.paidmoney=undefined;
			callback(null, dedecimal(order));
		}catch(e) {callback(e)}
	}))
	router.all('/exchangeRate', verifyMchSign, err_h, httpf({currency:'string', payment:'?string', callback:true}, async function(currency, payment, callback) {
		try {
			callback(null, await getProvider('snappay-toll').exchangeRate(currency, payment||'WECHATH5'));
		}catch(e) {callback(e)}
	}));
	router.all('/refund', verifyMchSign, err_h, httpf({partnerId:'string', outOrderId:'string', money:'number', callback:true}, async function(partnerId, outOrderId, money, callback) {
		try {
			var order=await db.bills.findOne({merchantOrderId:outOrderId});
			if (!order) return callback('无此订单');
			if (order.merchantid!=partnerId) return callback('该订单不属于指定的partner');
			if (!order.provider || !order.paidmoney) return callback('订单尚未支付');
			var pvd=getProvider(order.provider);
			if (!pvd) return callback('订单尚未支付');
			if (!pvd.refund) return callback('提供方不支持退单')
			var result=await pvd.refund(order, money);
			await db.bills.updateOne({_id:order._id}, {$set:{status:'refund'}}, {w:1});
			callback(null, result);
		} catch(e) {callback(e)}
	}));
	router.all('/admin/refund', verifyAuth, verifyManager, httpf({orderid:'string', callback:true}, async function(orderid, callback) {
		try {
			var order=await db.bills.findOne({_id:ObjectId(orderid)});
			if (!order) return callback('无此订单');
			if (order.status=='refund') return callback('已经退单');
			var pvd=getProvider(order.provider);
			if (!pvd) return callback('订单尚未支付');
			if (!pvd.refund) return callback('提供方不支持退单')
			var result=await pvd.refund(order, order.paidmoney);
			await db.bills.updateOne({_id:order._id}, {$set:{status:'refund'}}, {w:1});
			callback(null, result);
		} catch(e) {callback(e)}
	}));
	router.all('/admin/invalidOrder', verifyAuth, verifyManager, httpf({orderid:'string', callback:true}, async function(orderid, callback) {
		try {
			var {order}=await db.bills.findOneAndUpdate({_id:ObjectId(orderid)}, {status:'作废'});
			if (!order) return callback('无此订单');
			callback(null);
		} catch(e) {callback(e)}
	}));
}


if (module==require.main) {
	// debug

}