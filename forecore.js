const router=require('express').Router()
, httpf =require('httpf')
, bestProvider =require('./providerManager.js').bestProvider
, getDB=require('./db.js')
, ObjectId =require('mongodb').ObjectId
, verifyMchSign =require('./merchants').verifySign
, mchSign =require('./order').merSign
, pify =require('pify')
, url =require('url')
, decimalfy=require('./etc').decimalfy
, argv=require('yargs').argv

const allPayType=['ALIPAYH5', 'WECHATPAYH5', 'UNIONPAYH5', 'ALIPAYAPP', 'WECHATPAYAPP', 'ALIPAYMINI', 'WECHATPAYMINI', 'ALIPAYPC', 'WECHATPAYPC', 'UNIONPAYPC'];

exports.router=router;
// exports.confirmOrder=async function(orderid, received, tollfee, callback) {
// 	received=Number(received); tollfee=Number(tollfee);
// 	var upd={used:true};
// 	if (tollfee) var gross=Math.floor((received-tollfee)*100)/100;
// 	else gross=received;
// 	upd.net=decimaly(gross);

// 	var db=await pify(getDB)();
// 	var r=await db.bills.findAndUpdate({_id:ObjectID(orderid), used:{$ne:true}}, {$set:upd}, {w:'majority'});
// 	var orderdata=r.value;
// 	if (!orderdata) {
// 		return db.bills.findOne({_id:ObjectID(orderid)}, (err, r)=>{
// 			if (r) return callback('used order');
// 			return callback('no such orderid');
// 		})
// 	}

// 	upd.paidmoney=received;
// 	upd.gross=gross;
// 	// add money profit to according account
// 	db.bills.updateOne({_id:ObjectID(orderid)}, {$set:decimalfy(upd)});
// 	var userId=orderdata.partnerId||orderdata.merchantId;
// 	var userdata=await db.users.findOne({_id:userId});
// 	var gross_delta=upd.paidmoney, net_delta=Math.floor(received*userdata.share*100)/100, sysprofit_delta=gross-net_delta;
// 	var inc={};
// 	inc[`daily.gross.${orderdata.provider}`]=gross_delta;
// 	inc[`daily.net.${orderdata.provider}`]=net_delta;
// 	inc[`gross.${orderdata.provider}`]=gross_delta;
// 	inc[`net.${orderdata.provider}`]=net_delta;
// 	db.users.bulkWrite([
// 		{filter:{_id:userId}, update:{$inc:decimalfy(inc)}},
// 		{filter:{_id:'system'}, update:{$inc:{profit:decimaly(sysprofit_delta), daily:decimaly(sysprofit_delta)}}}
// 	],{ordered:false});
// 	sysevents.emit('forecoreOrderConfirmed', r);
// 	notifyMerchant()
// 	callback();
// }

(function init(cb) {
	getDB(cb);
})(start);

function start(err, db) {
	if (err) return console.error(err);

	//currecny defined at https://intlmapi.alipay.com/gateway.do?service=forex_rate_file&sign_type=MD5&partner=2088921303608372&sign=75097bd6553e1e94aabc6e47b54ec42e, uppercase
	router.all('/order', verifyMchSign, httpf({partnerId:'?string', merchantId:'?string', userId:'string', outOrderId:'string', money:'number', currency:'string', cb_url:'string', return_url:'?string', callback:true}, 
	async function(partnerId, merchantId, mchuserid, outOrderId, money, currency, cb_url, return_url, callback){
		// var userId=partnerId||merchantId;
		// if (!sign) return callback('sign must be set');
		// if (!userId) return callback('partnerId or merchantId must be set');
		// var user =await db.users.findOne({_id:userId});
		// var params=Object.assign(this.req.query, this.req.body);
		// if (merSign(user, params).sign!=sign) return callback('sign error, use sign-verify-url to find what is wrong');

		var params =this.req.params;
		
		var merchant =this.req.merchant;
		var provider=await pify(bestProvider)(money, merchant, {forecoreOnly:true});
		
		var req=this.req;
		var basepath=argv.host||url.format({protocol:req.protocol, host:req.headers.host, pathname:url.parse(req.originalUrl).pathname});
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
	router.all('/exchangeRate', verifyMchSign, httpf({currency:'string', callback:true}, async function(callback) {
		// var rateParser=CsvParse({delimiter:'|', columns:['date', 'no', 'currency', 'rate', 'unused']}), out=[];
		// request('https://intlmapi.alipay.com/gateway.do?service=forex_rate_file&sign_type=MD5&partner=2088921303608372&sign=75097bd6553e1e94aabc6e47b54ec42e')
		// .pipe(rateParser)
		// .on('readable', ()=>{
		// 	let record
		// 	while (record = rateParser.read()) {
		// 		out.push(record)
		// 	}
		// })
		// .on('error', (err)=>{
		// 	callback(err);
		// })
		// .on('end', ()=>{
		// 	var ret={};
		// 	out.forEach((r)=>{
		// 		ret[r.currency]=Number(r.rate);
		// 	});
		// 	callback(null, ret);
		// })
		callback('not impl');
	}));
	router.all('/stat', httpf({from:'?date', to:'?date', callback:true}, async function (from, to, callback) {

	}))
}
