const url = require('url')
, request = require('request')
, md5 =require('md5')
, router=require('express').Router()
, httpf =require('httpf')
, async =require('async')
, getDB=require('../db.js')
, ObjectID =require('mongodb').ObjectID
, confirmOrder =require('../order.js').confirmOrder
, updateOrder =require('../order.js').updateOrder
, getOrderDetail=require('../order.js').getOrderDetail
, decimalfy =require('../etc.js').decimalfy
, dedecimal=require('../etc').dedecimal
, sysevents=require('../sysevents.js')
, objPath=require('object-path')
, CsvParse=require('csv-parse')
, pify =require('pify')
, JSZip =require('jszip')
, stringify=require('csv-stringify/lib/sync')
, multer=require('multer')


const _noop=function() {};
const supportedType={'WECHATPAYH5':{type:'WECHATPAY', method:'pay.h5pay'}, 'ALIPAYH5':{type:'ALIPAY', method:'pay.h5pay'}}
, supportedCurrency=['CAD', 'USD'];
const testAccount={_id:'testAccount', merchant_no:'901800000116', app_id:'9f00cd9a873c511e', key:'7e2083699dd510575faa1c72f9e35d43', supportedCurrency:'CAD'};
const request_post=pify(request.post, {multiArgs:true});

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

const timestring =(t)=>{
	return `${t.getUTCFullYear().pad(4)}-${(t.getUTCMonth()+1).pad()}-${t.getUTCDate().pad()} ${t.getUTCHours().pad()}:${t.getUTCMinutes().pad()}:${t.getUTCSeconds().pad()}`;
}

const localtimestring =(t)=>{
	return `${t.getFullYear().pad(4)}-${(t.getMonth()+1).pad()}-${t.getDate().pad()} ${t.getHours().pad()}:${t.getMinutes().pad()}`;
}

const makeSign=function(data, account, options) {
	delete data.sign;
	var message ='', o=Object.assign({app_id:account.app_id, version:'1.0', format:'JSON', sign_type:'MD5', charset:'UTF-8', timestamp:timestring(new Date())}, data);
	Object.keys(o).sort().map((key)=>{
		if (key=='sign') return;
		if (key=='sign_type' && ((!options) || (!options.includeSignType))) return;
		message+=''+key+'='+o[key]+'&';
	})
	var encoded_sign=md5(message.substr(0, message.length-1)+account.key);
	o['sign'] = encoded_sign.toLowerCase();
	return o;
}

var order=function() {
	var callback=arguments[arguments.length-1];
	if (typeof callback=='function') callback('启动中');
}
var forwardOrder=function() {
	var callback=arguments[arguments.length-1];
	if (typeof callback=='function') callback('启动中');
}

function normalizeFee(f) {
	f=Number(f);
	if (f>=1) return f/100;
	return f;
}

const request_url = 'https://open.snappay.ca/api/gateway';

exports.order=function() {
	order.apply(null, arguments);
};
exports.forwardOrder=function () {
	forwardOrder.apply(this, arguments);
}
exports.bestSell=null;
exports.getBalance=_noop;
exports.sell=_noop;
exports.bestPair=(money, cb)=>{
	return cb(null, 0.007, ['USD', 'CAD']);
};
exports.router=router;
exports.name='snappay';
exports.params=['accountNumber', 'customName', 'customNumber'];
exports.forecore=true;
exports.refund=async function(orderData, money, callback) {
	callback=callback||((err, r)=>{
		if (err) throw err;
		else return r
	});
	if (!orderData.snappay_account) return callback('订单不属于snapppay');
	var data={
		method:'pay.orderrefund',
		merchant_no:orderData.snappay_account.merchant_no,
		out_order_no: orderData.merchantOrderId,
		out_refund_no:new ObjectID().toHexString(),
		refund_amount:money
	}
	var [, ret]=await request_post({uri:request_url, json:makeSign(data, orderData.snappay_account)});
	if (ret.code!='0') return callback(ret.msg);
	if (ret.data[0].trans_status=='CLOSE') return callback('transaction closed, refund failed');
	return callback(null, ret.data);
}
exports.exchangeRate=async function(currency, payment, callback) {
	callback=callback||((err, r)=>{
		if (err) throw err;
		else return r
	});
	var data={
		method:'pay.exchangerate',
		basic_currency_unit:currency,
		payment_method:supportedType[payment].type,
	};
	var [,ret]=request_post({uri:request_url, json:makeSign(data, testAccount)});
	if (ret.code!='0') return callback(ret.msg);
	return callback(null, ret.data[0].exchange_rate);
}
//'merchant_no', 'app_id', 'key', 'supportedCurrency'

const _auth=require('../auth.js'), aclgt=_auth.aclgt, verifyManager=_auth.verifyManager, verifyAdmin=_auth.verifyAdmin, getAuth=_auth.getAuth, verifyAuth=_auth.verifyAuth;

const defaultBankData={
	clientNumber:'4806920000'
	, clientName: 'SnapPay Inc.'
	, RoyalBankProcessingCentre:'00320'
	, transactionCode:'729'
	, CADFinancialInstitution:'088855555'
}
Number.prototype.pad=function(size) {
	var s=String(this);
	return s.padStart(size, '0');
}
function daysIntoYear(date){
	return Math.floor((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000);
}
function transaction(arr, dates, setting) {
	var {transactionCode, CADFinancialInstitution, clientName,clientNumber}=setting;
	var total=0, ret='';
	for (var i=0; i<(arr.length); i++) {
		var {amount, accountNumber, customName, customNumber}=Object.assign({accountNumber:'', customName:'', customNumber:''}, arr[i]);
		// var money=Math.floor(Math.random()*100000), accountNumber=randstring(12), customName=randstring(5), customNumber=randstring(19);
		total+=amount;
		var trans=`${transactionCode}${amount.pad(10)}${dates}${CADFinancialInstitution}${accountNumber.padEnd(12, 'X')}${''.padEnd(25, '0')}${clientName.padEnd(15, ' ')}${customName.padEnd(30, ' ')}${clientName.padEnd(30, ' ')}${clientNumber}${customNumber.padEnd(19, ' ')}${''.padEnd(9, '0')}${''.padEnd(12, ' ')}${'settlement'.padEnd(15, ' ')}${''.padEnd(35, ' ')}`;
		ret+=trans;
	}
	return {str:ret.padEnd(1464-24, ' '), total:total};
}

function makeBTF(currency, arr, testMode, setting) {
	setting=Object.assign(defaultBankData, setting)
	var {clientNumber, RoyalBankProcessingCentre} =setting;
	var year=String(new Date().getUTCFullYear()), doy=daysIntoYear(new Date()), dates=`${year.substring(year.length-3)}${doy.pad(3)}`;
	if (testMode) {
	  var uniqueTag='TEST';
	} else {
	  var now=Date.now(), sec=String(Math.floor(now/10000)), uniqueTag=sec.substring(sec.length-4);
	}

	var out=`$$AA01CPA1464[${testMode?'TEST':'PROD'}[NL$$\r\n`, count=0;
	// first, a A record
	out+=`A${(++count).pad(9)}${clientNumber}${uniqueTag}${dates}${RoyalBankProcessingCentre}${''.padEnd(20, ' ')}${currency}${''.padEnd(1406, ' ')}\r\n`;
	// next a C record
	var total=0;
	for (var i=0; i<arr.length; i+=6) {
		out+=`C${(++count).pad(9)}${clientNumber}${uniqueTag}`
		var ret =transaction(arr.slice(i, i+6), dates, setting);
		out+=ret.str+'\r\n';
		total+=ret.total;
	}
	// finally, Z record
	out+=`Z${(++count).pad(9)}${clientNumber}${uniqueTag}${''.padEnd(22, '0')}${total.pad(14)}${Number(9).pad(8)}${''.padEnd(1396, '0')}`
	out+='\r\n';
	return out;
}
// get which those accounts availble
var snappayGlobalSetting, snappayFee;
(function start(cb) {
	getDB((err, db)=>{
		if (err) return cb(err);
		async.parallel([
			function getSetting(cb) {
				db.snappay_toll_settings.findOne({}, (err, r)=>{
					cb(err, r||{});
				})
			}
		],
		function (err, results) {
			if (!err) {
				snappayGlobalSetting=results[0];
				snappayFee=snappayGlobalSetting.tollfee||0.007;
			}
			cb(err, db);
		})
	});
})(init);
function init(err, db) {
	if (err) return console.log('启动snappay-toll.pd失败', err);
	router.all('/updateAccount', verifyAuth, verifyManager, httpf({_id:'?string', app_id:'?string', key:'?string', merchant_no:'string', name:'?string', disable:'?boolean', callback:true}, 
	function(id, app_id, key, merchant_no, name, disable, callback) {
		var upd={}
		app_id && (upd.app_id=app_id);
		key &&(upd.key=key);
		merchant_no &&(upd.merchant_no=merchant_no);
		name && (upd.name=name);
		disable!=null && (upd.disable=disable);
		var defaultValue={createTime:new Date()};
		id=ObjectID(id)||new ObjectID();
		db.snappay_toll_accounts.updateOne({_id:id}, {$set:upd,$setOnInsert:defaultValue}, {upsert:true, w:1}, (err, r)=>{
			if (err) return callback(err);
			if (r.upsertedCount) {
				sysevents.emit('newSnapPayTollAccount', upd);
			}
			callback();
		});
	}))
	router.all('/listAccounts', verifyAuth, verifyManager, httpf({sort:'?string', order:'?string', offset:'?number', limit:'?number', callback:true}, 
	async function(sort, order, offset, limit, callback) {
	try {
		var cur=db.snappay_toll_accounts.find({});
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cur=cur.sort(so);
		}
		if (offset) cur=cur.skip(offset);
		if (limit) cur=cur.limit(limit);

		var [c, rows]=await Promise.all([cur.count(), cur.toArray()]);
		callback(null, {total:c, rows:dedecimal(rows)});
	} catch(e) {callback(e)}
	}));
	router.all('/removeAccount', httpf({_id:'string', callback:true}, function(id, callback) {
		db.snappay_toll_accounts.deleteOne({_id:ObjectID(id)}, {w:1}, (err, r)=>{
			if (err) return callback(err);
			if (r.deletedCount<1) return callback('no such account');
			callback();
		});
	}));
	var storage = multer.memoryStorage()
	var upload = multer({ storage: storage });

	router.post('/uploadAccounts', verifyAuth, verifyManager, upload.single('file'), (req, res)=>{
		var now=new Date();
		CsvParse(req.file.buffer, {columns:true}, async (err, accounts)=>{
			if (err) return res.send({err:err});
			var count=0;
			if (accounts.length>10000) return res.send({err:'记录数超过了10000，每次提交请减少到10000以内'})
			for (var i=0; i<accounts.length; i++) {
				var acc=accounts[i];
				if (!(acc.app_id &&acc.key &&acc.supportedCurrency && acc.merchant_no)) {
					accounts[i]=accounts[accounts.length-1];
					accounts.pop();
					i--;
					continue;
				}
				acc.name=acc.name||acc.merchant_no;
				acc.createTime=now;
				// acc._id=acc.merchant_no;
				count++;
			}
			if (accounts.length) {
				try {
					var r=await db.snappay_toll_accounts.insertMany(accounts, {w:1,ignoreUndefined:true});
					res.send({count:r.insertedCount});
				} catch(e) {res.send({err:e})}
			}else res.send({count:0});
		})
	});
	router.all('/BTF', verifyAuth, verifyManager, httpf({
		from:'date'
		, to:'date'
		, testMode:'boolean'
		, CADFinancialInstitution: "?string"
		, RoyalBankProcessingCentre: "?string"
		, clientName: "?string"
		, clientNumber: "?string"
		, transactionCode: "?string"
		, callback:true
	}
	, async function(from, to, testMode, CADFinancialInstitution, RoyalBankProcessingCentre, clientName,clientNumber,transactionCode, callback) {
		try {
			var setting=await db.snappay_toll_settings.findOne({_id:'setting'});
			setting=setting||{};
			var upd=Object.assign(this.req.query, this.req.body);
			upd.from=upd.to=upd.testMode=undefined;
			var warning=[];
			if (from>setting.lastExportTime) return callback('输出起点大于上次终点，这可能丢失订单，请关闭当前界面重新输出');
			if (from<setting.lastExportTime) warning.push(`输出起点小于上次终点，可能导致数据重复，建议设置起点为${localtimestring(setting.lastExportTime)}`);
			if (!testMode) {
				upd.lastExportTime=new Date(Math.floor(to.getTime()/(3600*1000))*3600*1000);
			}
			var dbBills=db.db.collection('bills', {readPreference:'secondaryPreferred'});
			var [rec, stat]=await Promise.all([
				dbBills.find(
					{time:{$gte:from, $lt:to}, provider:'snappay-toll', status:{$in:['complete', '已支付']}}, 
					{projection:{merchantOrderId:1, mer_userid:1, share:1, money:1, paidmoney:1, currency:1, status:1, time:1, lasttime:1}}
				).toArray(),
				dbBills.aggregate([
					{$match:{time:{$gte:from, $lt:to}, provider:'snappay-toll', status:{$in:['complete', '已支付']}}},
					{$addFields:{holding:{$multiply:['$money', '$share', 100]}}},
					{$group:{
						_id:{currency:'$currency', mchId:'$userid'}
						, amount:{$sum:{$floor:'$holding'}}
					}},
					{$lookup:{
						localField:'_id.mchId',
						from:'users',
						foreignField:'_id',
						as:'userData'
					}}
				]).toArray()
			]);
			if (rec.length==0) return callback('没有记录');
			db.snappay_toll_settings.updateOne({_id:'setting'}, {$set:upd}, {upsert:true});
			dedecimal(rec);dedecimal(stat);
			rec.forEach((item)=>{
				item.outOrderId=item.merchantOrderId;
				item.orderId=item._id.toHexString();
				item.received=item.paidmoney;
				item.earning=Math.floor(item.paidmoney*item.share*100)/100;
				delete item.merchantOrderId;
				delete item._id;
				delete item.paidmoney;
			});
			var BTFs=new Map();
			stat.forEach((item)=>{
				var arr=BTFs.get(item._id.currency);
				if (!arr) {
					arr=[];
					BTFs.set(item._id.currency, arr);
				}
				arr.push(Object.assign({
					amount:item.amount,
					currency:item._id.currency,
					mchId:item._id.mchId,
					mchName: item.userData[0].name
				}, item.userData[0].providers['snappay-toll']));
			});

			var zip=new JSZip();
			BTFs.forEach((arr, currency)=>{
				zip.file(`${currency}.txt`, makeBTF(currency, arr, testMode, setting));
			})
			if (warning.length) zip.file('warning.txt', warning.join('\r\n'));
			zip.file('orders.csv', stringify(rec, 
				{
					header:true
					, cast:{
						date:(v)=>{
							var t=Math.floor(v.getTime()/1000);
							return ((t+8*3600)/86400+70*365+19).toFixed(5);
						}
					}
					, columns:['orderId', 'outOrderId', 'mer_userid', 'money', 'received', 'earning', 'share', 'currency', 'time', 'lasttime', 'status']
				}));
			var v =await zip.generateAsync({type : "nodebuffer"});
			callback(null, {src:v.toString('base64')});
		}catch(e) {callback(e)}
	}))
	router.all('/settings', verifyAuth, verifyManager, httpf({settings:'?object', callback:true}, function(settings, callback) {
		if (!settings) return db.snappay_toll_settings.findOne({_id:'setting'}, (err, r)=>{
			if (err) return callback(err);
			callback(null, r||{});
		});
		db.snappay_toll_settings.updateOne({_id:'settings'}, {$set:settings}, {w:1, upsert:true}, (err, r)=>{
			if (err) return callback(err);
			Object.assign(snappayGlobalSetting, setting);
			if (settings.fee) snappayFee=normalizeFee(settings.fee);
			callback();
		});
	}))
	router.all('/statement', verifyAuth, verifyManager, httpf({from:'?date', to:'?date', timezone:'?string', sort:'?string', order:'?string', limit:'?number', offset:'?number', callback:true},
	async function(from, to, timezone, sort, order, limit, offset, callback) {
	try {
		var cond={};
		if (from) cond.time={$gte:from}
		if (to) {
			cond.time=cond.time||{};
			cond.time.$lt=to;
		}
		cond.provider='snappay-toll';cond.status={$in:['complete', '已支付']};
		var groupby={currency:'$currency', mchId:'$userid'}, af={holding:{$multiply:['$money', '$share', 100]}};
		if(!cond.time) {
			//不指定时间按照天统计
			af.dot={$dateToString:{date:'$time', format:'%Y%m%d'}};
			if (timezone) af.timezone=timezone;
			groupby.dot='$dot'
		}
		var dbBills=db.db.collection('bills', {readPreference:'secondaryPreferred'});
		var cursor =dbBills.aggregate([
			{$match:cond},
			{$addFields:af},
			{$group:{_id:groupby, amount:{$sum:{$floor:'$holding'}}, net:{$sum: '$net'}, count:{$sum:1}, profit:{$sum:'$profit'}}},
			{$lookup:{
				localField:'_id.mchId',
				from:'users',
				foreignField:'_id',
				as:'userData'
			}},
			{$addFields:{
				dot:'$_id.dot'
				,mchId:'$_id.mchId'
				,currency:'$_id.currency'
			}},
			{$project:{
				doc:{
					dot:'$dot',
					mchId:'$mchId',
					currency:'$currency',
					merchantName:'$userData.name',
					share:'$userData.share',
					amount:{$divide:['$amount', 100]},
					profit:{$subtract:['$net', {$divide:['$amount', 100]}]},
					count:'$count',
					time:'$time',
					succOrder:'$userData.succOrder', 
					orderCount: '$userData.orderCount'
				}
			}},
			{$group:{_id:null, total:{$sum:1}, total_count:{$sum:'$doc.count'}, total_amount:{$sum:'$doc.amount'}, total_profit:{$sum:'$doc.profit'}, rows:{$push:'$doc'}}},
		]);
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cursor=cursor.sort(so);
		}
		if (offset) {
			cursor=cursor.skip(offset);
		}
		if (limit) cursor=cursor.limit(limit);
		var ret =await cursor.toArray();
		callback(null, ret[0]);
	} catch(e) {callback(e)}
	}))
	router.all('/return', (req, res)=>{
		var orderid=req.query.out_trade_no;
		(function tryUseMerchantReturnUrl(cb) {
			if (!orderid) return cb('orderid not defined');
			getOrderDetail(orderid, (err, merchantid, money, mer_userid, cb_url, return_url)=>{
				if (err) return cb(err);
				if (!return_url) return cb('use default page');
				res.redirect(return_url);
				cb();
			})	
		})(function ifFailed(err) {
			if (!err) return;
			//show default page
			res.send('充值完成');
		})
	})
	router.all('/done', function(req, res) {
		var r=req.body, sign=r.sign;
		if (makeSign(r).sign!=sign) return res.send({err:'sign error'});
		if (r.code!='0') return res.send({err:r.msg});
		makeItDone(r.out_order_no, r, (err)=>{
			if (err) return res.send({err:err});
			res.send({code:'0'});
		});
	});
	function makeItDone(orderid, data, callback) {
		callback=callback||function(){};
		db.bills.findOne({_id:ObjectID(orderid)},function(err, orderData) {
			if (err) callback('no such order');
			var acc=orderData.snappay_account, net, succrate, total_amount=Number(data.trans_amount), fee=Number(data.c_trans_fee);
			if (acc) {
				if (!acc.log) acc.log={};
				if (acc.log.success) acc.log.success++;
				else acc.log.success=1;
				if (!acc.used) acc.used=1;
				fee=fee||Math.ceil(orderData.money*(acc.fee||snappayFee)*100)/100;
				net=Number(Number(orderData.money-fee).toFixed(2));
				succrate=acc.log.success/acc.used;
			}
			db.users.updateOne({_id:orderData.userid}, {$inc:{succOrder:1}});
			confirmOrder(orderid, orderData.money, net, (err)=>{
				if (!err) {
					var upd={daily:net, total:net, 'gross.daily':total_amount, 'gross.total':total_amount}
					db.snappay_toll_accounts.updateOne({_id:acc._id}, {
						$set:{'log.success':acc.log.success, 'succrate':succrate},
						$inc:decimalfy(upd)
					});
				}
				if (err && err!='used order') return callback(err);
				callback(null);
			})
		});
	}

	async function bestAccount(money, merchantData, userid, currency) {
		if (process.env.NODE_ENV=='debugmode') {
			if (currency!='CAD') return null;
			return {_id:'testAccount', merchant_no:'901800000116', app_id:'9f00cd9a873c511e', key:'7e2083699dd510575faa1c72f9e35d43', supportedCurrency:'CAD'}
		}
		var [acc]= await db.snappay_toll_accounts.find({disable:{$ne:true}, supportedCurrency:currency}).sort({daily:1}).limit(1).toArray();
		return acc;
	}
	forwardOrder=async function(params, callback) {
		if (params.providerSpec) {
			var spec=params.providerSpec;
			params.providerSpec=undefined
			params=Object.assign(spec, params);
		}
		var account =await bestAccount(params.money, params.merchantdata, params.userId, params.currency);
		if (!account) return callback('没有可用的收款账户');
		var warnings=[];
		var payType=supportedType[params.type];
		if (!payType) {
			params.type='WECHATPAYH5';
			payType=supportedType.WECHATPAYH5;
			warnings.push(`type只能是${Object.keys(supportedType).join(' ')}，使用默认WECHATH5`);
		}
		// if (supportedCurrency.indexOf(params.currency)<0) {
		//     params.currency=supportedCurrency[0];
		//     warnings.push(`currency只能是${supportedCurrency.join(' ')}，使用默认${supportedCurrency[0]}`);
		// }
		var data = {
			method:payType.method,
			merchant_no:account.merchant_no,
			payment_method:payType.type,
			'out_order_no' : params.orderId,
			trans_currency:params.currency,
			trans_amount:params.money,
			description:params.desc||'Goods',
			'notify_url' : url.resolve(params._host, '../pvd/snappay-toll/done'),
			'return_url' : url.resolve(params._host, '../pvd/snappay-toll/return'),
		};            
		var [, body] =await request_post({url:request_url, json:makeSign(data, account)});
		var ret=body;
		if (ret.code!='0') return callback(ret.msg);
		var data=ret.data[0];
		updateOrder(params.orderId, {status:'待支付', providerOrderId:data.out_order_no, snappay_account:account, lasttime:new Date(), snappay_data:ret});
		sysevents.emit('snappayOrderCreated', {snappay_account:account, orderId:params.orderId, money:params.money, merchant:params.merchant, mchUserId:params.userId});
		// if (!account.used) account.used=1;
		// else account.used++;
		db.snappay_toll_accounts.updateOne({_id:account._id}, {$inc:{used:1}});
		db.users.updateOne({_id:params.merchant._id}, {$inc:{orderCount:1}});
		var ret={url:data.h5pay_url};
		ret.pay_type=params.type;
		if (warnings.length) ret.warnings=warnings;
		callback(null, ret);
	}
	
	var today=new Date();
	setInterval(()=>{
		var now=new Date();
		if (now.getDate()!=today.getDate()) {
			today=now;
			// log all [in] in the accounts
			db.snappay_toll_accounts.find().toArray().then((r)=>{
				var logs=r.map((ele)=>{return {net:ele.daily||0, gross:objPath.get(ele, ['gross', 'daily'])||0, t:today, accId:ele._id, accName:ele.name}});
				db.snappay_toll_accounts.updateMany({}, {$set:{daily:0, 'gross.daily':0}});
				db.snappay_toll_accounts.updateMany({daily:{$lt:500}}, {$set:{occupied:null}});
				db.snappay_logs.insertMany(logs);
			}).catch((e)=>{
				console.error(e);
			});
		}
	}, 5*1000);
}

if (module==require.main) {
	// const appid='mch21377';
	// //test code
	// var data = {
	//     'appid' : appid,
	//     'nonce_str' : randomstring(16),
	//     'mch_order_no' : randomstring(16),
	//     'channel' : 'wechat',
	//     'total_fee' : 43400,
	//     'fee_type' : 'THB',
	//     // 'img_type' : 'png',
	//     'notify_url' : 'http://api.mch.snappay.net/Dspay/NativepayApp/pay_notify'
	// };
	
	// var privatekey_content = fs.readFileSync("./mch_privkey.pem");
	
	// var request_url = 'http://api.mch.snappay.net/snappayPay/native_pay';

	// request.post({url:request_url, form:makeSign(data, privatekey_content)}, (err, header, body)=>{
	//     console.log(body);
	// })
	
	// request.post('http://127.0.0.1:7008/pvd/snappay/done', {})

	return;
}
