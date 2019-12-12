const router=require('express').Router()
, httpf =require('httpf')
, bestProvider =require('./providerManager.js').bestProvider
, getDB=require('../db.js')
, ObjectId =require('mongodb').ObjectId
, Decimal128 =require('mongodb').Decimal128
, createOrder =require('./order.js').createOrder
, confirmOrder =require('./order.js').confirmOrder
, updateOrder =require('./order.js').updateOrder
, cancelOrder =require('./order.js').cancelOrder
, getOrderDetail=require('./order.js').getOrderDetail
, notifyMerchant =require('./order').notifyMerchant
, pify =require('pify')
, getvalue=require('get-value')
, notifier=require('./sysnotifier.js')
, argv=require('yargs').argv
, dec2num =require('../etc.js').dec2num
, dedecaimal=require('../etc.js').dedecimal
, sysevents=require('../sysevents.js')
, objPath=require('object-path')
, CsvParse=require('csv-parse')
, decimalfy=require('./etc').decimalfy;

const decimaly=Decimal128.fromString;
exports.router=router;
exports.confirmOrder=async function(orderid, received, tollfee, callback) {
	received=Number(received); tollfee=Number(tollfee);
	var upd={used:true};
	if (tollfee) var gross=Math.floor((received-tollfee)*100)/100;
	else gross=received;
	upd.net=decimaly(gross);

	var db=await pify(getDB)();
	var r=await db.bills.findAndUpdate({_id:ObjectID(orderid), used:{$ne:true}}, {$set:upd}, {w:'majority'});
	var orderdata=r.value;
	if (!orderdata) {
		return db.bills.findOne({_id:ObjectID(orderid)}, (err, r)=>{
			if (r) return callback('used order');
			return callback('no such orderid');
		})
	}

	upd.paidmoney=received;
	upd.gross=gross;
	// add money profit to according account
	db.bills.updateOne({_id:ObjectID(orderid)}, {$set:decimalfy(upd)});
	var userId=orderdata.partnerId||orderdata.merchantId;
	var userdata=await db.users.findOne({_id:userId});
	var gross_delta=upd.paidmoney, net_delta=Math.floor(received*userdata.share*100)/100, sysprofit_delta=gross-net_delta;
	var inc={};
	inc[`daily.gross.${orderdata.provider}`]=gross_delta;
	inc[`daily.net.${orderdata.provider}`]=net_delta;
	inc[`gross.${orderdata.provider}`]=gross_delta;
	inc[`net.${orderdata.provider}`]=net_delta;
	db.users.bulkWrite([
		{filter:{_id:userId}, update:{$inc:decimalfy(inc)}},
		{filter:{_id:'system'}, update:{$inc:{profit:decimaly(sysprofit_delta), daily:decimaly(sysprofit_delta)}}}
	],{ordered:false});
	sysevents.emit('forecoreOrderConfirmed', r);
	notifyMerchant()
	callback();
}

(function init(cb) {
	getDB(cb);
})(start);

function start(err, db) {
	if (err) return console.error(err);

	//currecny defined at https://intlmapi.alipay.com/gateway.do?service=forex_rate_file&sign_type=MD5&partner=2088921303608372&sign=75097bd6553e1e94aabc6e47b54ec42e, uppercase
	router.all('/order', httpf({partnerId:'?string', merchantId:'string', userid:'string', outOrderId:'string', money:'number', currency:'string', notify_url:'string', return_url:'?string', sign:'string', callback:true}, 
	async function(partnerId, merchantId, outOrderId, money, currency, notify_url, return_url, sign, callback){
		var userId=partnerId||merchantId;
		if (!sign) return callback('sign must be set');
		if (!userId) return callback('partnerId or merchantId must be set');
		var user =await db.users.findOne({_id:userId});
		if (merSign(user, Object.assign(this.req.query, this.req.body)).sign!=sign) return callback('sign error, use sign-verify-url to find what is wrong');
		
		var merchant =await pify(getMerchant)(merchantId);
		var provider=await pify(bestProvider)(money, merchant, {forecoreOnly:true});
		var params=Object.assign(this.req.query, this.req.body);
		// if (provider.checkParams) {
		// 	var paramsErr=provider.checkParams(params);
		// 	if (paramsErr) return callback(paramsErr);
		// }

		var orderId=new ObjectId();
		params.merchant=merchant;
		params.orderId=orderId.toHexString();
		var [ret] =await Promise.all([
			pify(provider.forwardOrder)(params),
			db.bills.insertOne({
				_id:orderId
				, merchantOrderId:outOrderId
				, parnterId:partnerId
				, userid:merchant._id
				, merchantid:merchantId
				, mer_userid:userid
				, provider:provider.internal_name
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
				, status:'prepare'}
				,{w:1})
		])
		db.bills.updateOne({_id:orderId}, {$set:{providerOrderId:ret.providerOrderId, status:'forward'}});
		Object.assign(ret ,{outOrderId:outOrderId, sinopayOrderId:orderId.toHexString()});
		callback(null, merSign(user, ret));
	}));
	router.all('/rates', httpf({callback:true}, async function(callback) {
		var rateParser=CsvParse({delimiter:'|', columns:['date', 'no', 'currency', 'rate', 'unused']}), out=[];
		request('https://intlmapi.alipay.com/gateway.do?service=forex_rate_file&sign_type=MD5&partner=2088921303608372&sign=75097bd6553e1e94aabc6e47b54ec42e')
		.pipe(rateParser)
		.on('readable', ()=>{
			let record
			while (record = rateParser.read()) {
				out.push(record)
			}
		})
		.on('error', (err)=>{
			callback(err);
		})
		.on('end', ()=>{
			var ret={};
			out.forEach((r)=>{
				ret[r.currency]=Number(r.rate);
			});
			callback(null, ret);
		})
	}));
	router.all('/stat', httpf({from:'?date', to:'?date', callback:true}, async function (from, to, callback) {

	}))
}
