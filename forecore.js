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
, objPath=require('object-path')
, stringify=require('csv-stringify/lib/sync')
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

		if (money==0) return callback('金额异常，能不为0');

		var params =this.req.params;
		
		var merchant =this.req.merchant;
		var provider=await pify(bestProvider)(money, merchant, {forecoreOnly:true, currency:currency});
		
		var req=this.req;
		var basepath=argv.host||url.format({protocol:req.protocol, host:req.headers.host, pathname:path.resolve(req.baseUrl, '..')});
		if (basepath.slice(-1)!='/') basepath=basepath+'/';

		params._host=basepath;
		params._req=req;
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
					, provider:provider.name||provider.internal_name
					, providerOrderId:''
					, share:merchant.share
					, sp_fee:merchant.sp_fee
					, ap_fee:merchant.ap_fee
					, pc_fee:merchant.pc_fee
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
			var order = await db.bills.findOne({merchantOrderId:outOrderId}, {projection:{share:0},readPreference:'secondaryPreferred'});
			if (!order) return callback('无此订单');
			if (order.merchantid!=partnerId) return callback('该订单不属于指定的partner');
			var pvd=getProvider(order.provider);
			if (pvd.queryOrder) {
				try {
					var data=await pvd.queryOrder(order);
					order.received=data && data.paidmoney;
				} catch(e) {
					order.err=e;
				}
			} else order.received=order.paidmoney;
			order.provider=undefined;
			order.snappay_account=undefined;
			order.snappay_data=undefined;
			order.outOrderId=order.merchantOrderId
			order.paidmoney=undefined;
			order.settleDate=order.checkout;
			order.checkout=undefined;
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
			if (!pvd.refund) return callback('提供方不支持退单');
			var merchant=await db.users.findOne({_id:partnerId});
			var result=await pvd.refund(order, money, merchant);
			// await db.bills.updateOne({_id:order._id}, {$set:{status:'refund'}}, {w:1});
			callback(null, result);
		} catch(e) {callback(e)}
	}));
	router.all('/settlements', verifyAuth, httpf({from:'?date', to:'?date', sort:'?string', order:'?string', offset:'?number', limit:'?number', callback:true}, 
	async function(from, to, sort, order, offset, limit, callback) {
		var cond={};
		if (this.req.auth.acl=='mrechant') cond.mchId=this.req.auth._id;
		if (from) cond.time={$gte:from};
		if (to) objPath.set(cond, 'time.$lte', to);
		var cur=db.settlements.find(cond, {readPreference:'secondaryPreferred', projection:{relative:0}});
		var so={time:-1};
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
		}
		cur=cur.sort(so);
		if (offset) cur=cur.skip(offset);
		if (limit) cur=cur.limit(limit);

		var [c, rows]=await Promise.all([cur.count(), cur.toArray()]);
		return callback(null, {total:c, rows:rows});
	}))
	router.all('/downloadOrdersInSettlement', verifyAuth, httpf({id:'string', no_return:true}, async function(id) {
		var res=this.res;
		try {
			var {relative}=await db.settlements.findOne({_id:ObjectId(id)}, {projection:{relative:1}});
			if (!relative) throw '没有数据';
			res.setHeader('Content-Type', 'application/octet-stream');
			res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
			res.setHeader('Cache-Control', 'no-cache');
  			res.setHeader('Pragma', 'no-cache');
			var content=stringify(relative, 
				{
					header:true
					, columns:Object.keys(relative[0])
				}
			)
			res.write(content);
			res.end();
		} catch(e) {
			res.send({err:e})
		}

	}))
	router.all('/settleOrders', verifyMchSign, err_h, httpf({partnerId:'string', from:'date', to:'date', sort:'?string', order:'?string', offset:'?number', limit:'?number', callback:true}, async function(partnerId, from, to, sort, order, offset, limit, callback) {
		try {
			var cond={mchId:partnerId};
			if (from) cond.time={$gte:from};
			if (to) objPath.set(cond, 'time.$lte', to);
			var cur=db.settlements.find(cond, {projection:{amount:1, currency:1, checkout:1, mchId:1, mchName:1}, readPreference:'secondaryPreferred'});
			if (sort) {
				var so={};
				so[sort]=(order=='asc'?1:-1);
				cur=cur.sort(so);
			}
			if (offset) cur=cur.skip(offset);
			if (limit) cur=cur.limit(limit);
			var [c, rows]=await Promise.all([cur.count(), cur.toArray()]);
			var dbBills=db.db.collection('bills', {readPreference:'secondaryPreferred', readConcern:{level:'majority'}});
			var actions=rows.map((item)=>{
				return new Promise((resolve, reject)=>{
					dbBills.find({checkout:item.time, userid:partnerId}, {projection:{_id:1}})
					.toArray()
					.then((ids)=>{
						item.relative=ids.map(obj=>obj._id);
						resolve();
					})
					.catch((e)=>{
						reject(e);
					});
				})
			});
			await Promise.all(actions);
			return callback(null, {total:c, rows:rows});		
		} catch(e) {
			callback(e);
		}
	}));
	router.all('/downloadBills', verifyMchSign, err_h, httpf({from:'?date', to:'?date', no_return:true}, function(from, to) {

	}));
	router.all('/admin/refund', verifyAuth, httpf({orderid:'string', callback:true}, async function(orderid, callback) {
		try {
			var cond={_id:ObjectId(orderid)};
			if (this.req.auth.acl!='admin' && this.req.auth.acl!='mamager') {
				cond.userid=this.req.auth._id;
			}
			var order=await db.bills.findOne(cond);
			if (!order) return callback('无此订单');
			if (order.status=='refund') return callback('已经退单');
			if (!order.used && ['进入收银台'].indexOf(order.status)<0) return callback('订单尚未提交');
			dedecimal(order);
			var pvd=getProvider(order.provider);
			if (!pvd) return callback('订单尚未支付');
			if (!pvd.refund) return callback('提供方不支持退单')
			var result=await pvd.refund(order, order.paidmoney, await db.user.findOne({_id:order.userid}));
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
	router.all('/renderCC', function(req, res) {
		res.render('cashcounter', {init_config:{init_config:1}, payData:{payData:1}, return_url:'dummyAddress'});
	})
}


if (module==require.main) {
	// debug

}