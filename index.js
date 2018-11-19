const server = require('http').createServer()
, url = require('url')
, path = require('path')
, request = require('request')
, express = require('express')
, app = express()
, compression = require('compression')
, bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, qs = require('querystring')
, sortObj=require('sort-object')
, filter = require('filter-object')
, merge = require('gy-merge')
, fs = require('fs')
// , subdirs = require('subdirs')
// , del = require('delete')
, randomstring =require('random-string')
, async =require('async')
, pm2 =require('pm2')
, getDB=require('./db.js')
, ObjectID = require('mongodb').ObjectID
, httpf = require('httpf')
, pify =require('pify')
, paysys=require('./providerManager.js')
, _orderFunc=require('./order.js')
, createOrder =_orderFunc.createOrder
, confirmOrder =_orderFunc.confirmOrder
, notifyMerchant =_orderFunc.notifyMerchant
, getOrderDetail =_orderFunc.getOrderDetail
, util=require('util')
, argv = require('yargs')
	.default('port', 80)
	.boolean('debugout')
	.boolean('dev')
	.default('authtimeout', 3*60*1000)
	.argv
, debugout=require('debugout')(argv.debugout);

require('colors');

const auth_timeout=argv.authtimeout;

function _noop() {}
var errStringify=function(e) {
	if (typeof e=='string') return e;
	if (typeof e=='object') {
		var err=e.message||e.msg||e.statusText;
		if (err) return err;
		return e.toString();
	}
	return e;
}
function prepareNeighbors(callback) {
	if (process.env.NODE_APP_INSTANCE===undefined) return callback(null, _noop);
	pm2.connect(function(err) {
		if (err) return callback(err);
		var mypid=process.pid;
		pm2.list(function(err, p) {
			// locate me
			var myexec=null;
			for (var i=0; i<p.length; i++) {
				if (p[i].pid==mypid) {
					myexec=p[i].pm2_env.pm_exec_path;
					break;
				}
			}
			if (!myexec) return callback('找不到自己', _noop);
			var neighbors=[];
			for (var i=0; i<p.length; i++) {
				if (p[i].pm2_env.pm_exec_path==myexec) neighbors.push(p[i]);
			}
			callback(null, function broadcastNeighbors(pack, execeptMe, cb) {
				if (typeof execeptMe=='function' || arguments.length==1) {
					cb=execeptMe;
					execeptMe=true;
				} 
				cb=cb||_noop;
				async.each(neighbors, function(n, _cb) {
					if (execeptMe && n.pid==mypid) return _cb();
					pack.id=n.pm_id;
					pm2.sendDataToProcessId(n.pm_id, pack, _cb);
				}, cb);
			});
		})
	});	
}

async.parallel([prepareNeighbors, getDB], function(err, results) {
	results.unshift(err);
	main.apply(null, results);
})
function main(err, broadcastNeighbors, dbp) {
	app.use(compression());
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
	app.use(express.static(path.join(__dirname, 'pub'), { index: 'index.html' }));
	app.set('views', path.join(__dirname, 'pub/views'));
	app.set('view engine', 'ejs');

	var external_provider = require('./providerManager.js').providers;
	if (argv.debugout) {
		app.use(function (req, res, next) {
			debugout('access', req.url);
			next();
		});
	}
	app.param('provider', function (req, res, next, external_provider) {
		req.provider = external_provider;
		next();
	});
	app.use('/pvd/:provider', function (req, res, next) {
		debugout('provider', req.provider);
		if (external_provider[req.provider]) return external_provider[req.provider].router.call(null, req, res, function () { res.status(404).send({err:'no such function ' + req.url, detail:arguments}); });
		res.end('pf ' + req.provider + ' not defined');
	});
			

	var db=dbp[0];
	var authedClients={};
	function verifyAuth(req, res, next) {
		if (!req.cookies || !req.cookies.a) return res.send({err:'no auth'});
		var auth=authedClients[req.cookies.a];
		if (!auth) return res.send({err:'no auth'});
		var now=new Date();
		if (auth.validUntil<now) {
			delete authedClients[req.cookies.a]
			return res.send({err:'no auth'});
		}
		auth.validUntil=new Date(now.getTime()+auth_timeout);
		req.auth=auth;
		next();
	}
	function verifyAdmin(req, res, next) {
		if (!req.auth) return res.send({err:'no auth'});
		if (req.auth.acl=='admin') return next();
		res.send({err:'无权访问'});
	}
	function verifyManager(req, res, next) {
		if (!req.auth) return res.send({err:'no auth'});
		if (req.auth.acl=='admin' || req.auth.acl=='manager') return next();
		res.send({err:'无权访问'});
	}

	setInterval(function() {
		var now =new Date();
		for (var i in authedClients) {
			if (authedClients[i].validUntil<now) delete authedClients[i];
		}
	}, 5*60*1000);
	function aclgt(acl1, acl2) {
		if(acl1=='admin' && acl2!='admin') return true;
		if (acl1=='manager' && acl2!='admin' && acl2!='manager') return true;
		if (acl1=='agent' && acl2=='merchant') return true;
		return false;
	}
	const getMerchant=require('./merchants.js').getMerchant, verifySign=require('./merchants.js').verifySign;
	process.on('message', function(pack) {
		switch(pack.type) {
			case 'admin:updateMerchant':
			if (pack.data.del) delete merchants[pack.data.merchantid];
			else getMerchant(pack.data.merchantid, function(err, mer) {
				if (err) return;
				if (pack.data.key!==null) mer.key=pack.data.key;
				if (pack.data.debugMode!==null) mer.debugMode=pack.data.debugMode;					
			});
			break;
		}
	});
	app.all('/admin/updateMerchant', verifyAuth, httpf({merchantid:'string', key:'?string', debugMode:'?boolean', del:'?boolean', callback:true}, function(merchantid, key, debugMode, del,callback) {
		broadcastNeighbors({type:'admin:updateMerchant', data:{key:key, debugMode:debugMode, merchantid:merchantid, del:del}});
		if (del) {
			delete merchants[pack.data.merchantid];
			db.merchants.remove({_id:merchantid}, function(err) {
				callback(err);
			});
			return;
		}
		getMerchant(merchantid, function(err, mer) {
			if (err) return callback(err);
			if (key!==null) mer.key=key;
			if (debugMode!==null) mer.debugMode=debugMode;
			db.users.update({merchantid:merchantid}, {$set:{key:mer.key, debugMode:mer.debugMode}}, function(err) {
				callback(err);
			});
		});
	}));
	app.all('/admin/confirmOrder', verifyAuth, verifyManager, httpf({orderid:'string', callback:true}, function(orderid, callback) {
		confirmOrder(orderid, callback);
	}));
	app.all('/admin/listOrders', verifyAuth, httpf({from:'?date', to:'?date', count:'?number', pageno:'?number', callback:true}, function(from, to, count, pageno, callback) {
		var times=[];
		if (from) times.push({$gte:from});
		if (to) times.push({$lte:to});
		var query={};
		if (times.length) query.time={$and:times};
		if (this.req.auth.acl!='admin' && this.req.auth.acl!='manager') {
			query.merchantid=this.req.auth.merchantid;
		}
		var cursor=db.bills.find(query).sort({time:-1});
		if (count) cursor=cursor.limit(count);
		if (pageno) {
			cursor.skip(pageno*count);
		}
		cursor.toArray()
		.then((r)=>{
			var merids=new Set();
			for (var i=0; i<r.length; i++) {
				var o=r[i];
				merids.add(o.merchantid);
			}
			var idarr=[];
			merids.forEach((v)=>{idarr.push(v)});
			db.users.find({merchantid:{$in:idarr}}).toArray().then((idmap)=>{
				var map={};
				for (var i=0; i<idmap.length; i++) {
					map[idmap[i].merchantid]=idmap[i].name;
				}
				for (var i=0; i<r.length; i++) {
					var o=r[i];
					o.mername=map[o.merchantid];
				}
				cursor.count(false, (err, c)=>{
					if (err) return callback(err);
					r.total=c;
					callback(null, r);
				});
			})
			.catch((e)=>{
				callback(e);
			});
		})
		.catch((e)=>{
			callback(e);
		})
	}));
	app.all('/admin/notifyMerchant', verifyAuth, httpf({orderid:'string', callback:true}, function(orderid, callback) {
		db.bills.find({_id:ObjectID(orderid)}).toArray(function(err, r) {
			if (err) return callback(err);
			if (r.length==0) return callback('没有这个订单');
			if (r[0].status!='通知失败') return callback('通知失败之后才可以重发');
			notifyMerchant(r[0]);
			callback();
		});
	}));
	app.all('/account/me', verifyAuth, httpf({}, function() {
		return filter(this.req.auth, ['acl', 'name', 'merchantid', 'debugMode']);
	}));
	app.all('/order', verifySign, httpf({orderid:'string', money:'number', merchantid:'string', cb_url:'string', time:'string', no_return:true}, function(orderid, money, merchantid, cb_url, time) {
		var res=this.res;
		createOrder(merchantid, orderid, money, 'alipay', cb_url, function(err, sysOrderId) {
			if (err) return res.render('error.ejs', {err:err});
			return res.render('order.ejs', {orderid:sysOrderId, money:money, merchantid:merchantid});
		});
	}));
	app.all('/doOrder', httpf({orderid:'string', callback:true}, function(sysOrderId, callback) {
		getOrderDetail(sysOrderId, function(err, merchantid, money, cb_url) {
			if (err) return callback(err);
			// find a provider & create a provider order
			pify(getMerchant)(merchantid).then(function(mer) {
				return pify(paysys.order)(sysOrderId, money, mer);
			}).then((payurl)=>{
				return s2a(request({uri:payurl}));
			})
			.then(function (parts) {
				return new Promise((resolve)=> {
					const buffers = parts.map(part => util.isBuffer(part) ? part : Buffer.from(part));
					return resolve(Buffer.concat(buffers));
				})
			})
			.then(imgbuffer =>{
				return Jimp.read(imgbuffer);
			})
			.then((img)=>{
				var qr = new QrCode();
				qr.callback = function(err, value) {
					if (err) return callback(err);
					if (value.result.toLowerCase().indexOf('https://qr.alipay.com')!=0) return callback('渠道返回的不是支付宝二维码');
					callback(null, value.result);
				};
				qr.decode(img.bitmap);
			}).catch(callback)
		});
	}));
	const Jimp = require('jimp'),QrCode = require('qrcode-reader'), s2a=require('stream-to-array');
	app.all('/opage',verifySign, (req, res)=>{
		createOrder(merchantid, orderid, money, cb_url, function(err, order) {
			if (err) return res.render('error', {err:errStringify(err)});
			// find a provider & create a provider order
			pify(getMerchant)(merchantid).then((err, mer) =>{
				return pify(paysys.order)(orderid, money, mer);
			}).then((payurl)=>{
				return s2a(request(payurl));
			})
			.then(function (parts) {
				return new Promise((resolve)=> {
					const buffers = parts.map(part => util.isBuffer(part) ? part : Buffer.from(part));
					return resolve(Buffer.concat(buffers));
				})
			})
			.then(imgbuffer =>{
				return Jimp.read(imgbuffer);
			})
			.then((img)=>{
				var qr = new QrCode();
				qr.callback = function(err, value) {
					if (err) return res.render('error', {err:errStringify(err)});
					res.render('opage', {data:value.result});
				};
				qr.decode(img.bitmap);
			})
			.catch((e)=> {
				res.render('error', {err:errStringify(err)});
			});
		});		
	})
	app.all('/admin/listAccount', verifyAuth, verifyManager, httpf({identity:'any', callback:true}, function(identity, callback) {
		if (Array.isArray(identity)) identity={$in:identity};
		db.users.find({acl:identity}).toArray(callback);
	}));
	app.all('/admin/login', httpf({u:'string', p:'string', callback:true}, function(username, password, callback) {
		var res=this.res;
		db.users.find({_id:username}).limit(1).toArray(function(err, r) {
			if (err) return callback(err);
			if (r.length==0) return callback('用户名密码错');
			if (r[0].password!==password) return callback('用户名密码错');
			var now=new Date();
			var rstr=randomstring()+now.getTime();
			var o=authedClients[rstr]=r[0];
			o.validUntil=new Date(now.getTime()+auth_timeout);
			o.acl=o.acl||o.identity;
			o.name=o.name||o._id;
			res.cookie('a',rstr, { maxAge: 900000});
			if (o.acl=='admin'||o.acl=='manager') return callback(null, {to:'/dashboard.html', token:rstr});
			else return callback(null, {to:'/merentry.html', token:rstr});
		})
	}));
	app.all('/admin/addAccount', verifyAuth, verifyAdmin, httpf({name:'string', account:'string', password:'string', identity:'string', callback:true}, function(name, account, password, identity, callback) {
		db.users.find({_id:account}).toArray((e, r)=> {
			if (e) return callback(e);
			if (r.length!=0) return callback('账号已被占用');
			var o={_id:account, name:name, password:password, acl:identity, createTime:new Date()};
			if (identity=='merchant') {
				o.key=randomstring({length:24});
				o.merchantid=randomstring(16)+account;
				o.debugMode=true;
				o.share=0.985;
			}
			db.users.insert(o, {w:1}, function(err) {
				callback(err);
			})	
		})
	}))
	app.all('/admin/changePassword', verifyAuth, httpf({account:'string', password:'string', callback:true}, function(account, password, callback) {
		var myacl=this.req.auth.acl;
		db.users.find({_id:account}).limit(1).toArray((err, r) => {
			if (err) return callback(err);
			if (r.length==0) return callback('无此用户');
			var u=r[0];
			if (!aclgt(myacl, u.acl)) return callback('权限不足');
			db.update({_id:account}, {$set:{password:password}}, {w:1}, function(err) {
				callback(err);
			});
		})
	}))
	app.all('/admin/removeAccount', verifyAuth, httpf({account:'string', callback:true}, function(account, callback) {
		var myacl=this.req.auth.acl;
		db.users.find({_id:account}).limit(1).toArray((err, r) => {
			if (err) return callback(err);
			if (r.length==0) return callback('无此用户');
			var u=r[0];
			if (!aclgt(myacl, u.acl)) return callback('权限不足');
			db.users.remove({_id:account}, {w:1}, function(err) {
				callback(err);
			})
		})
	}))
	app.all('/admin/changeMerchantDebugmode', verifyAuth, verifyManager, httpf({account:'string', debugMode:'boolean', callback:true}, function(account, debugMode, callback) {
		db.users.find({_id:account}).limit(1).toArray((err, r) => {
			if (err) return callback(err);
			if (r.length==0) return callback('无此用户');
			db.users.update({_id:account}, {$set:{debugMode:debugMode}}, {w:1}, function(err) {
				callback(err);
			})
		});		
	}))
	// app.all('/admin/createMerchant', verifyAuth, verifyManager, httpf({merchantid:'string', key:'string', debugMode:'boolean', callback:true}, function(merchantid, key, debugMode, callback) {
	// 	var mer=merchants[merchantid];
	// 	if (mer) return callback('id重复');
	// 	broadcastNeighbors({type:'admin:updateMerchant', data:{key:key, debugMode:debugMode, merchantid:merchantid}});
	// 	getMerchant(merchantid, function(err, mer) {
	// 		if (err) return callback(err);
	// 		if (key!==null) mer.key=key;
	// 		if (debugMode!==null) mer.debugMode=debugMode;
	// 		db.merchants.update({_id:merchantid}, {$set:{key:mer.key, debugMode:mer.debugMode}}, {upsert:true}, function(err) {
	// 			callback(err);
	// 		});
	// 	});		
	// }))
	app.all('/admin/statistics', verifyAuth, verifyManager, httpf({callback:true}, function(callback) {
		async.parallel({
			merchants:function statMerchants(cb) {
				db.users.count({acl:'merchant'}, cb)
			},
			bills:function statBills(cb) {
				var t=new Date();
				t.setDate(t.getDate()-t.getDay());
				t.setHours(0, 0, 0, 0);
				db.bills.count({time:{$gte:t}}, cb)
			},
			moneys:function statMoney(cb) {
				var t=new Date();
				t.setDate(t.getDate()-t.getDay());
				t.setHours(0, 0, 0, 0);
				db.bills.aggregate([{$match:{time:{$gte:t}, paidmoney:{$gt:-1}}}, {$group:{_id:null, sum:{$sum:'$money'}}}], function(err, r) {
					if (err) return cb(null, 0);
					cb(null, r[0]?r[0].sum:0);
				})
			}
		}, callback);
	}));
	app.all('/merchant/balance', verifyAuth, httpf({merchantid:'?string', callback:true}, function(merchantid, callback) {
		if (this.req.auth.acl=='admin' || this.req.auth.acl=='manager') {
			//check merchantid
			if (!merchantid) return callback('no merchantid specified');
		}
		if (this.req.auth.acl=='merchant') merchantid=this.req.auth.merchantid;
		// if agent, more condition
		async.parallel({
			total:(cb) =>{
				db.bills.aggregate([{$match:{paidmoney:{$gt:-1}, merchantid:merchantid}}, {$group:{_id:null, sum:{$sum:{$multiply:['$paidmoney', '$share']}}}}], function(err, r) {
					if (err) return cb(err);
					if (r.length==0) return cb(null, 0);
					cb(null, r[0].sum);
				})
			},
			arrivaled:(cb)=>{
				cb(null, 0);
			}
		}, callback);
	}));
	app.all('/admin/providers', verifyAuth, httpf(function() {
		var pnames=new Set();
		for (var i in external_provider) {
			var p=external_provider[i];
			if (p.name) pnames.add(p.name);
		}
		var ret=[];
		pnames.forEach((n)=>{ret.push(n)});
		return ret;
	}));

	/////////////////some server rendered pages
	app.all('/fromuserlist.html', verifyAuth, (req, res) =>{
		res.render('fromuserlist', {acl:req.auth.acl});
	})
	/////////////////must be last one
	app.use(function(req, res, next){
		res.status(404);
		res.render('404', {});
	});
	  
	app.listen(argv.port, function() {
		console.log(('server is running @ '+argv.port).green);
	})
}