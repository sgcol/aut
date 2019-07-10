const server = require('http').createServer()
, url = require('url')
, path = require('path')
, os =require('os')
, request = require('request')
, express = require('express')
, app=express()
, compression = require('compression')
, bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, qs = require('querystring')
, sortObj=require('sort-object')
, objPath=require('object-path')
, filter = require('filter-object')
, merge = require('gy-merge')
, fs = require('fs')
// , subdirs = require('subdirs')
// , del = require('delete')
, dec2num =require('./etc.js').dec2num
, randomstring =require('random-string')
, async =require('async')
, pm2 =require('pm2')
, getDB=require('./db.js')
, ObjectID = require('mongodb').ObjectID
, Decimal128 =require('mongodb').Decimal128
, httpf = require('httpf')
, pify =require('pify')
, _orderFunc=require('./order.js')
, paysys=require('./providerManager.js')
, createOrder =_orderFunc.createOrder
, confirmOrder =_orderFunc.confirmOrder
, notifyMerchant =_orderFunc.notifyMerchant
, getOrderDetail =_orderFunc.getOrderDetail
, util=require('util')
, USDT =require('./usdt.js')
, md5 = require('md5')
, sysnotifier =require('./sysnotifier.js')
, verifyOTC =require('./otc.js').verifyOTC
, clone =require('clone')
, chokidar =require('chokidar')
, argv = require('yargs')
	.default('port', 80)
	.boolean('debugout')
	.boolean('dev')
	.default('authtimeout', 3*60*1000)
	.describe('host', 'bypass default host for testing alipay notification')
	.argv
, debugout=require('debugout')(argv.debugout)
, events=require('./sysevents.js');

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

var watcher=chokidar.watch(path.join(__dirname, 'pub/views'), {ignored: /[\/\\]\./})
.on('change', (p)=>{
	delete app.cache[path.basename(p, '.ejs')]
})
.on('unlink', p =>{delete app.cache[path.basename(p, '.ejs')]});

function checkAdminAccountExists(cb) {
	getDB((err, db)=>{
		if (err) return cb(err);
		db.users.find({acl:'admin'}).toArray((err, r)=>{
			if (err) return cb(err);
			return cb(null, r.length);
		})
	});
}
function plusall(obj1, obj2) {
	for (var k in obj2) {
		obj1[k]=(dec2num(obj1[k])||0)+(dec2num(obj2[k])||0);
	}
	return obj1;
}
function firstDayInPreviousMonth(yourDate) {
    return new Date(yourDate.getFullYear(), yourDate.getMonth() - 1, 1);
}
function firstDayInThisMonth(yourDate) {
    return new Date(yourDate.getFullYear(), yourDate.getMonth(), 1);
}
function startsys(callback) {
	async.parallel([prepareNeighbors, getDB, checkAdminAccountExists], function(err, results) {
		results.unshift(err);
		if (results[3]) {
			main.apply(null, results);
		} else {
			initmode(results[2][0], ()=>{
				main.apply(null, results);
			})
		}
		callback && callback();
	})	
}
startsys();
var appStarted=false;
function initmode(db, cb) {
	app.use(compression());
	var _appHandlers=app._router.stack.length;
	app.use(express.static(path.join(__dirname, 'pub'), {maxAge:0, index: 'initsys.html' }));
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
	app.use(bodyParser.json());
	app.all('/createAdmin', httpf({u:'string', p:'string', callback:true}, function(username, password, callback) {
		var salt=randomstring();
		db.users.insertOne({_id:username, password:md5(salt+password), salt:salt, acl:'admin', name:'超级管理员', createTime:new Date()}, err=>{
			if (err) return callback(err);
			// delete all handler
			app._router.stack.splice(_appHandlers-1);
			cb();  // to the main
			callback();  //return to browser
		});
	}));
	app.listen(argv.port, function() {
		appStarted=true;
		console.log(('init mode port is '+argv.port).green);
	});
} 
function main(err, broadcastNeighbors, dbp, adminAccountExists) {
	app.use(compression());
	app.use(express.static(path.join(__dirname, 'pub'), { index: 'index.html' }));
	app.use(cookieParser());
	app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
	app.use(bodyParser.json());
	app.set('views', path.join(__dirname, 'pub/views'));
	app.set('view engine', 'ejs');

	var db=dbp[0];

	var getProviders = require('./providerManager.js').getProvider;
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
		if (getProviders(req.provider)) return getProviders(req.provider).router.call(null, req, res, function (err) { 
			if (err) {
				if (err instanceof Error) {
					var o={message:err.message};
					if (argv.debugout) o.stack=err.stack;
					err=o;
				}
				return res.status(500).send({err:err});
			}
			return res.status(404).send({err:'no such function ' + req.url, detail:arguments}); 
		});
		res.end('pf ' + req.provider + ' not defined');
	});

	if (USDT.bitcoincli) {
		app.all('/getAddress', verifyOTC, httpf({account:'string', callback:true}, USDT.getaddress));
		app.all('/getreceivedbyaddress', verifyOTC, httpf({address:'string', minconf:'?number', callback:true}, USDT.getreceivedbyaddress))
		app.all('/listTransactions', verifyOTC, httpf({txid:'?string', count:'?number', skip:'?number', startblock:'?number', endblock:'?number', callback:true}, USDT.listtransactions));
		app.all('/sendToAddress', verifyOTC, httpf({toaddress:'string', amount:'number', callback:true}, USDT.sendto));
	}

	app.param('merchantid', (req, res, next, merchantid)=>{
		req.body.merchantid=merchantid;
		next();
	});
	app.all('/merchant/:merchantid/onCreateOrder', httpf({merchantid:'string', transactionid:'string', paymethod:'?string', money:'?number', amount:'?number', callback:true}, 
	function(merchantid, transactionid, paymethod, money, amount, callback) {
		callback(null, {url:'alipay.com'});
	}));

	const _auth=require('./auth.js'), addAuth=_auth.addAuth, authedClients=_auth.authedClients, aclgt=_auth.aclgt, verifyManager=_auth.verifyManager, verifyAdmin=_auth.verifyAdmin, getAuth=_auth.getAuth, verifyAuth=_auth.verifyAuth, noAuthToLogin=_auth.verifyAuth;

	function verifyDebugMode(req, res, next) {
		if (req.auth.debugMode) return next();
		res.send({err:'该接口已停止使用'});
	}
	const getMerchant=require('./merchants.js').getMerchant, verifySign=require('./merchants.js').verifySign;
	process.on('message', function(pack) {
		switch(pack.type) {
			case 'admin:updateMerchant':
			if (pack.data.del) delete merchants[pack.data.merchantid];
			else getMerchant(pack.data.merchantid, function(err, mer) {
				if (err) return;
				merge(mer, pack.data);
			});
			break;
		}
	});
	app.all('/admin/confirmOrder', verifyAuth, verifyManager, httpf({orderid:'string', callback:true}, function(orderid, callback) {
		confirmOrder(orderid, callback);
	}));
	app.all('/admin/clearBalance', verifyAuth, verifyManager, httpf({merchantid:'?string', callback:true}, function(merchantid, callback) {
		require('./sellOrder.js').checkPlatformBalance(merchantid, callback);
	}));
	app.all('/adapter/balance', verifySign, httpf({merchantid:'string', callback:true}, function(merchantid, callback) {
		db.users.findOne({merchantid:merchantid}, (err, r)=>{
			if (err) return callback(err);
			callback(null, {balance:dec2num(r.profit)});
		});
	}))
	app.all('/adapter/listOrders', verifySign, httpf({merchantid:'string', orderid:'?string', from:'?date', to:'?date', sort:'?string', order:'?string', limit:'?number', offset:'?number', callback:true}, function(merchantid, orderid, from, to, sort, order, count, offset, callback) {
		var query={};
		if (from ||to) {
			var times={};
			if (from) times.$gte=from;
			if (to) times.$lte=to;
			query.time=times;	
		}
		query.merchantid=merchantid;
		if (orderid) {
			query.merchantOrderId=orderid;
		}
		var cursor=db.bills.find(query, {merchantOrderId:1, merchantid:1, providerOrderId:1, status:1, lasterr:1, paidmoney:1});
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cursor=cursor.sort(so);
		}
		if (offset) {
			cursor=cursor.skip(offset);
		}
		if (count) cursor=cursor.limit(count);
		cursor.toArray()
		.then((r)=>{
			r.forEach((ele)=>{
				ele.orderid=ele.merchantOrderId;
				ele.merchantOrderId=undefined;
				ele.money=ele.paidmoney;
				ele.paidmoney=undefined;
			})
			cursor.count(false, (err, c)=>{
				if (err) return callback(err);
				callback(null, {total:c, rows:r});
			});
		})
		.catch((e)=>{
			callback(e);
		})
	}))
	app.all('/admin/listOutgoingOrders', verifyAuth, httpf({name:'?string', from:'?date', to:'?date', sort:'?string', order:'?string', limit:'?number', offset:'?number', callback:true}, function(name, from, to, sort, order, count, offset, callback) {
		var op=[];
		if (this.req.auth.acl=='agent' || this.req.auth.acl=='merchant') {
			name=this.req.auth.name;
		}
		var query={};
		if (from ||to) {
			var times={};
			if (from) times.$gte=from;
			if (to) times.$lte=to;
			query.time=times;	
		}
		if (name) {
			query.name=name;
			var cursor=db.withdrawals.find(query);
			if (sort) {
				var so={};
				so[sort]=(order=='asc'?1:-1);
				cursor=cursor.sort(so);
			}
			if (offset) {
				cursor=cursor.skip(offset);
			}
			if (count) cursor=cursor.limit(count);
			op=[cursor.toArray(), cursor.count()];
		} else {
			var cursor=db.withdrawals.aggregate([{$match:query}, {$group:{_id:'$userid', money:{$sum:'$money'}, name:{$last:'$name'}, _t:{$last:'$_t'}}}]);
			var cur2=cursor.clone();
			if (sort) {
				var so={};
				so[sort]=(order=='asc'?1:-1);
				cursor.sort(so);
			}
			if (offset) {
				cursor.skip(offset);
			}
			if (count) {
				cursor.limit(count);
			}
			op=[cursor.toArray(), cur2.group({_id:null, c:{$sum:1}}).project({_id:0}).toArray()];
		}
		Promise.all([
			db.withdrawals.aggregate([
				{$match:query},
				{$group:{
					_id:0,
					total:{$sum:'$money'}
				}}]
			).toArray()].concat(op)).then((results)=>{
			var r=results[1];
			var c=objPath.get(r, [0, 'c'])||objPath.get(results, [2, 0, 'c'])||0;
			callback(null, {total:c, rows:r, sum:objPath.get(results, [0,0,'total'], 0)});
		})
		.catch((e)=>{
			callback(e);
		})
	}))
	app.all('/admin/listOrders', verifyAuth, httpf({from:'?date', to:'?date', sort:'?string', order:'?string', limit:'?number', offset:'?number', testOrderOnly:'?boolean', callback:true}, function(from, to, sort, order, count, offset, testOrderOnly, callback) {
		var query={};
		if (from ||to) {
			var times={};
			if (from) times.$gte=from;
			if (to) times.$lte=to;
			query.time=times;	
		}
		if (this.req.auth.acl!='admin' && this.req.auth.acl!='manager') {
			query.merchantid=this.req.auth.merchantid;
		}
		if (testOrderOnly) {
			query.merchantOrderId=/TESTORDER/;
		}
		var cursor=db.bills.find(query);
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cursor=cursor.sort(so);
		}
		if (offset) {
			cursor=cursor.skip(offset);
		}
		if (count) cursor=cursor.limit(count);
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
					callback(null, {total:c, rows:r});
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
		var arr=['!password', '!salt'];
		var ret=filter(this.req.auth, arr);
		ret.validUntil=undefined;
		if (!this.req.auth.debugMode) ret.key=undefined;
		
		return ret;
	}));
	app.all('/order', verifySign, httpf({orderid:'string', money:'number', merchantid:'string', userid:'string', cb_url:'string', return_url:'?string', time:'string', no_return:true}, function(orderid, money, merchantid, userid, cb_url, return_url, time) {
		var res=this.res;
		createOrder(merchantid, userid, orderid, money, 'alipay', cb_url, return_url, function(err, sysOrderId) {
			if (err) return res.render('error.ejs', {err:err});
			return res.render('order.ejs', {orderid:sysOrderId, money:money, merchantid:merchantid});
		});
	}));
	app.all('/doOrder', httpf({orderid:'string', callback:true}, function(sysOrderId, callback) {
		var req=this.req;
		var basepath=argv.host||url.format({protocol:req.protocol, host:req.headers.host, pathname:url.parse(req.originalUrl).pathname});
		if (basepath.slice(-1)!='/') basepath=basepath+'/';
		getOrderDetail(sysOrderId, function(err, merchantid, money, mer_userid, cb_url) {
			if (err) return callback(err);
			// find a provider & create a provider order
			pify(getMerchant)(merchantid).then(function(mer) {
				return pify(paysys.order)(sysOrderId, money, mer, mer_userid, basepath);
			}).then((payurl)=>{
				if (!payurl.img) return callback(null, payurl);
				s2a(request({uri:payurl}))
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
	app.all('/admin/listAccount', verifyAuth, verifyManager, httpf({identity:'any', search:'?string', sort:'?string', order:'?string', offset:'?number', limit:'?number', callback:true}, function(identity, search, sort, order, offset, limit, callback) {
		if (!identity) identity=['merchant', 'agent'];
		if (Array.isArray(identity)) identity={$in:identity};
		var cur=db.users.find({acl:identity}, {password:0, salt:0});
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cur.sort(so);
		}
		if (offset) cur.skip(offset);
		if (limit) cur.limit(limit);
		async.waterfall([
			(cb)=>{
				async.parallel([(cb)=>{cur.toArray(cb)}, (cb)=>{cur.count(cb)}], cb);
			}, 
			(rs, cb)=>{
				var r=rs[0];
				var agent_ids=[], agents={};
				r.forEach((ele)=>{
					if (ele.acl=='agent') {
						agent_ids.push(ele._id);
						agents[ele._id]=ele;
					}
				})
				if (!agent_ids.length) return cb(null, rs);
				db.users.find({parent:{$in:agent_ids}}).toArray((err, mers)=>{
					if (err) return cb(err);
					mers.forEach((mer)=>{
						if (!agents[mer.parent].subordinates) agents[mer.parent].subordinates=[mer.name];
						else agents[mer.parent].subordinates.push(mer.name);
					})
					cb(null, rs);
				})
			},
			(rs, cb)=>{
				var r=rs[0];
				var pids=[], pidMap={};
				r.forEach((ele)=>{
					if (ele.parent) {
						pids.push(ele.parent);
						pidMap[ele.parent]=ele;
						ele.parent=null;
					}
				});
				if (!pids.length) return cb(null, rs);
				db.users.find({_id:{$in:pids}}).toArray((err, r)=>{
					if (err) return cb(err);
					r.forEach((ele)=>{
						pidMap[ele._id].parent=ele.name;
					})
					cb(null, rs);
				})
			}
		], (err, rs)=>{
			if (err) return callback(err);
			callback(null, {total:rs[1], rows:rs[0]});
		})
	}));
	app.all('/admin/getSalt', httpf({u:'string', callback:true}, function(username, callback) {
		db.users.find({_id:username}).toArray(function(err, r) {
			if (err) return callback(err);
			if (r.length==0) return callback('用户名密码错');
			callback(null, r[0].salt);
		})
	}))
	app.all('/admin/login', httpf({u:'string', p:'?string', c:'?string', callback:true}, function(username, password, encryptedPassword, callback) {
		var res=this.res;
		db.users.find({_id:username}).limit(1).toArray(function(err, r) {
			if (err) return callback(err);
			if (r.length==0) return callback('用户名密码错');
			if (encryptedPassword) {
				if (r[0].password!=encryptedPassword) return callback('用户名密码错');
			} else if (password) {
				if (r[0].password!==md5(r[0].salt+password)) return callback('用户名密码错');
			} else return callback('用户名密码错');
			var now=new Date();
			var rstr=randomstring()+now.getTime();
			var o=addAuth(rstr, r[0]);//authedClients[rstr]=r[0];
			o.validUntil=new Date(now.getTime()+auth_timeout);
			o.acl=o.acl||o.identity;
			o.name=o.name||o._id;
			o.profit=dec2num(o.profit);
			if (o.in) {
				for (var k in o.in) {
					o.in[k]=dec2num(o.in[k]);
				}
			}
			if (o.out) {
				for (var k in o.out) {
					o.out[k]=dec2num(o.out[k]);
				}
			}
			res.cookie('a',rstr);
			if (o.acl=='admin'||o.acl=='manager') return callback(null, {to:'/dashboard.html', token:rstr});
			else if (o.acl=='merchant') return callback(null, {to:'/merentry.html', token:rstr});
			else return callback(null, {to:'/agententry.html', token:rstr});
		})
	}));
	app.all('/admin/addAccount', verifyAuth, verifyAdmin, httpf({name:'string', account:'string', password:'string', identity:'string', callback:true}, function(name, account, password, identity, callback) {
		db.users.find({_id:account}).toArray((e, r)=> {
			if (e) return callback(e);
			if (r.length!=0) return callback('账号已被占用');
			var o={_id:account, name:name, acl:identity, createTime:new Date()};
			o.salt=randomstring();
			o.password=md5(o.salt+password);
			if (identity=='merchant') {
				o.key=randomstring({length:24});
				o.merchantid=randomstring(16)+account;
				o.providers={};
				var prds=getProviders();
				for (var k in prds) {
					o.providers[k]={};
				}
				o.debugMode=true;
				o.share=0.98;
			}
			db.users.insertOne(o, {w:1}, function(err) {
				callback(err);
				o.originPwd=password;
				if (!err) events.emit('newAccount', o);
			})	
		})
	}))
	app.all('/admin/updateAccount', verifyAuth, httpf({id:'?string', merchantid:'?string', /*key:'?string', debugMode:'?boolean', del:'?boolean', */callback:true}, function(id, merchantid,/*key, debugMode, del,*/callback) {
		var params=merge(this.req.query, this.req.body);
		// delete params.id;
		// delete params.merchantid;

		for (var i in params) {
			if (params[i]==null || params[i]==='') delete params[i];
		}

		var useid={};
		if (id) useid._id=id;
		else if (merchantid) useid.merchantid=merchantid;
		else return callback('id merchantid必须指定一个');
		if (!aclgt(this.req.auth.acl, 'manager')) {
			if ((id && id!=this.req.auth._id) || (merchantid && merchantid!=this.req.auth.merchantid)) return callback('无此权限');
		}
		if (merchantid) {
			broadcastNeighbors({type:'admin:updateMerchant', data:params});
		}
		if (params.del) {
			db.users.remove(useid, function(err) {
				if (err) return callback(err);
				if (merchantid) delete merchants[merchantid];
				callback();
			});
			return;
		}
		if (params.password) {
			params.salt=randomstring();
			params.password=md5(params.salt+params.password);
		}
		if (params.share) {
			params.share=Number(params.share);
			if (isNaN(params.share)) delete params.share;
		}
		((next)=>{
			if (!params.parent) return next();
			db.users.find({$or:[{_id:params.parent}, {name:params.parent}]}).toArray((err, r)=>{
				if (err) return callback(err);
				if (r.length==0) params.parent=undefined;
				for (var i=0; i<r.length; i++) {
					if (r[i]._id==params.parent) break;
					if (r[i].name==params.parent) {
						params.parent=r[i]._id;
						break;
					}
				}
				next();
			})
		})(()=>{
			db.users.updateOne(useid, {$set:params}, {w:1}, function(err) {
				if (err) return callback(err);
				// if (merchantid) {
				// 	return getMerchant(merchantid, function(err, mer) {
				// 		if (err) return callback(err);
				// 		merge(mer, params);
				// 		callback();
				// 	});	
				// }
				callback();
			});	
		})
	}));
	// app.all('/admin/changePassword', verifyAuth, httpf({account:'string', password:'string', callback:true}, function(account, password, callback) {
	// 	var myacl=this.req.auth.acl;
	// 	db.users.find({_id:account}).limit(1).toArray((err, r) => {
	// 		if (err) return callback(err);
	// 		if (r.length==0) return callback('无此用户');
	// 		var u=r[0];
	// 		if (!aclgt(myacl, u.acl)) return callback('权限不足');
	// 		db.update({_id:account}, {$set:{password:password}}, {w:1}, function(err) {
	// 			callback(err);
	// 		});
	// 	})
	// }))
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
	// app.all('/admin/changeMerchantDebugmode', verifyAuth, verifyManager, httpf({account:'string', debugMode:'boolean', callback:true}, function(account, debugMode, callback) {
	// 	db.users.find({_id:account}).limit(1).toArray((err, r) => {
	// 		if (err) return callback(err);
	// 		if (r.length==0) return callback('无此用户');
	// 		db.users.update({_id:account}, {$set:{debugMode:debugMode}}, {w:1}, function(err) {
	// 			callback(err);
	// 		})
	// 	});		
	// }))
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
					cb(null, r[0]?dec2num(r[0].sum):0);
				})
			}
		}, callback);
	}));
	app.all('/getOTCPrice', verifyAuth, httpf({coinType:'?string', market:'?string', callback:true}, function(coinType, market, callback) {
		coinType=coinType||'usdt';
		market=market||null;
		request('https://otc-api.huobi.co/v1/data/trade-market?country=37&currency=1&payMethod=2&currPage=1&coinId=2&tradeType=buy&blockType=general&online=1', function(err, header, body) {
			if (err) return callback(err);
			try {
				var ret=JSON.parse(body);
			}catch(e) {
				return callback(e);
			}
			if (ret.code!=200) return callback(ret.message);
			var t=0;
			ret.data.foeEach(item=>{
				t+=item.price;
			});
			callback(null, {usdt:(t/ret.pageSize).toFixed(2)});
		});
	}));
	app.all('/admin/getMerchantCountByMonth', verifyAuth, verifyManager, httpf({callback:true}, function(callback) {
		var today=new Date();
		async.parallel([
			(cb)=>{db.users.find({acl:'merchant', createTime:{$gte:firstDayInThisMonth(today)}}).count(cb)},
			(cb)=>{db.users.find({acl:'merchant', createTime:{$lt:firstDayInThisMonth(today)}}).count(cb)}
		], (err, rs)=>{
			if (err) return callback(err);
			callback(null, {thisMonth:rs[0], previous:rs[1]});
		});
	}));
	app.all('/admin/getIncomingByMonth', verifyAuth, httpf({callback:true}, function(callback) {
		if (this.req.auth.acl=='admin' || this.req.auth.acl=='manager') {
			var query={used:true};
		}else {
			var query={userid:this.req.auth._id, used:true};
		}
		db.bills.aggregate([{$match:query}, 
			{$group:{
				_id:{
					month:{$dateToString:{format:'%Y-%m', date:'$time'}},
					provider:'$provider'
				},
				money:{$sum:'$money'},
				net:{$sum:'$net'},
				count:{$sum:1}
			}},
			{$sort:{_id:1}}
		]).toArray().then((r)=>{
			r.forEach(item=>{
				item.money=dec2num(item.money);
				item.net=dec2num(item.net);
			})
			callback(null, httpf.json(r));
		}).catch(callback);
	}));
	app.all('/admin/getBalanceOverview', verifyAuth, verifyManager, httpf({callback:true}, function(callback) {
		async.parallel([
			(cb)=>{db.bills.aggregate([{$match:{used:true}}, {$group:{_id:'$provider', money:{$sum:'$money'}, paid:{$sum:'$paidmoney'}, net:{$sum:'$net'}}}]).toArray(cb)},
			(cb)=>{db.users.find({}, {total:1, acl:1, name:1, in:1}).toArray(cb)}
		], function(err, res) {
			if (err) return callback(err);
			var source_incoming=res[0], source_outgoing=res[1];
			var incoming={};
			source_incoming.forEach((ele)=>{
				incoming[ele._id||'unknown']=ele;
				ele.money=dec2num(ele.money);
				ele.paidmoney=dec2num(ele.paidmoney);
				ele.net=dec2num(ele.net);
			});
			var outgoing={system:{}, merchant:{}, agent:{}};
			source_outgoing.forEach((ele)=>{
				plusall(outgoing[ele.acl||'system'], ele.in);
			})
			callback(null, {in:incoming, out:outgoing});
		})		
	}));
	app.all('/merchant/debug/callback', verifyAuth, verifyDebugMode, httpf({cb_url:'string', orderid:'string', money:'number', callback:true}, function(url, orderid, money, callback) {
		var mer=this.req.auth;
		if (mer.acl!='merchant') return callback('无权调用这个接口');
		request({uri:url, form:_orderFunc.merSign(mer, {orderid:orderid, money:money})}, (err, header, body)=>{
			if (err) return callback(err);
			try {
				var ret=JSON.parse(body);
			} catch(e) {
				return callback(e);
			}
			if (body.err) return callback(body.err);
			callback();
		});
	}));
	app.all('/merchant/debug/stopDebug', verifyAuth, verifyDebugMode, httpf({callback:true}, function(callback) {
		var mer=this.req.auth;
		if (mer.acl!='merchant') return callback('无权调用这个接口');
		db.users.updateOne({_id:mer._id}, {$set:{debugMode:false}}, {w:1}, (err)=>{
			if (err) return callback(err);
			mer.debugMode=false;
			callback();
		});
	}));
	// app.all('/merchant/balance', verifyAuth, httpf({userid:'?string', callback:true}, function(userid, callback) {
	// 	if (this.req.auth.acl=='admin' || this.req.auth.acl=='manager') {
	// 		//check merchantid
	// 		if (!userid) return callback('no userid specified');
	// 	}
	// 	if (this.req.auth.acl=='merchant' || this.req.auth.acl=='agent') userid=this.req.auth._id;
	// 	// if agent, more condition
	// 	async.parallel({
	// 		total:(cb) =>{
	// 			db.users.find({_id:userid}).toArray((err, r)=>{
	// 				if (err) return cb(err);
	// 				if (r.length==0) return cb('no such user');
	// 				return cb(null, r[0].total||0, r[0].taken||0);
	// 			})
	// 		},
	// 		arrivaled:(cb)=>{
	// 			cb(null, 0);
	// 		},
	// 		orders:(cb)=>{
	// 			db.bills.find({userid:userid}).count({}, cb);
	// 		}
	// 	}, (err, ret)=>{
	// 		callback(err, {total:ret.total[0], arrivaled:ret.total[1], orders:ret.orders});
	// 	});
	// }));
	app.all('/user/setextradata', verifyAuth, httpf({callback:true}, function(callback){
		var userid=this.req.auth._id;
		db.users.updateOne({_id:userid}, {$set:Object.assign(this.req.body, this.req.query)}, {w:1}, callback);
	}))
	app.all('/user/take', verifyAuth, httpf({userid:'?string', take:'number', callback:true}, function(userid, want, callback) {
		if (aclgt(this.req.auth.acl, 'manager')) {
			if (!userid) return callback('no userid specified');
		}
		else userid=this.req.auth._id;
		var user=this.req.auth;
		db.users.findOneAndUpdate({_id:userid, profit:{$gte:want}}, {$inc:{profit:Decimal128.fromString(''-want)}}, {w:'majority'}, (err, r)=>{
			if (err) return callback(err);
			if (!r.value) {
				// maybe no user or not enough money
				return db.users.findOne({_id:userid}, (err, r)=>{
					if (r) return callback('没有足够的现金');
					return callback('没有这个用户');
				});
			}
			user.profit-=want;
			var usrdata=r.value, total=0, lefts={};
			if (!usrdata.out) usrdata.out={};
			for (var i in usrdata.in) {
				lefts[i]=usrdata.in[i]-(usrdata.out[i]||0);
				if (lefts[i]<0) {
					// write a warning
				}
				total+=lefts[i];
			}
			var errmsg=null;
			if (total<want) {
				errmsg='取现时数据异常，profit小于in-out';
				sysnotifier.add(errmsg+' '+userdata.name||userdata._id);
			}

			var takesop=[], now=new Date(), inc={};
			for (var i in lefts) {
				var d=Math.min(lefts[i],want);
				var chg={};
				chg[i]=d;
				takesop.push({userid:userid, name:r.value.name, _t:now, money:d, change:chg, snap:{in:usrdata.in, out:usrdata.out}, provider:i, done:false});
				inc['out.'+i]=Decimal128.fromString(''+d);
				if (d==want) break;
				want-=d;
			}
			db.users.updateOne({_id:userid}, {$inc:inc});
			db.withdrawals.insertMany(takesop, {w:1}, callback);
		});
	}))
	app.all('/manager/withdrawals', verifyAuth, verifyManager, httpf({all:'?boolean', search:'?string', sort:'?string', order:'?string', offset:'?number', limit:'?number', callback:true}, function(showall, search, sort, order, offset, limit, callback) {
		var key={};
		if (!showall) key={done:false};
		var cur=db.withdrawals.find(key);
		if (sort) {
			var so={};
			so[sort]=(order=='asc'?1:-1);
			cur=cur.sort(so);
		}
		if (offset) cur=cur.skip(offset);
		if (limit) cur=cur.limit(limit);
		// if (queries && queries.search) 
		// if (userid) key.userid=userid;
		cur.toArray()
		.then(r=>{
			cur.count((err, c)=>{
				if (err) return callback(err);
				callback(null, {total:c, rows:r});
			});
		})
		.catch(e=>{
			callback(e);
		})
	}))
	app.all('/manager/approval', verifyAuth, verifyManager, httpf({all:'?boolean', ids:'?array', callback:true}, function(all, ids, callback) {
		if (!all && !ids) all=true;
		var key={done:false};
		if (ids) key._id={$in:ids.map(id=>ObjectID(id))};
		db.withdrawals.find(key).then((err,r)=>{
			
		}).catch(err=>{
			callback(err);
		})
	}))
	app.all('/admin/providers', verifyAuth, httpf(function() {
		var external_provider=getProviders();
		var ret=[];
		for (var i in external_provider) {
			var p=external_provider[i];
			ret.push({id:i, name:p.name, params:p.params});
		}
		return ret;
	}));
	app.all('/sysnotification', getAuth, httpf(function() {
		var req=this.req;
		return httpf.json(sysnotifier.all().filter(n=>{
			if (req.auth.acl==n.acl) return true;
			return aclgt(req.auth.acl, n.acl);
		}));
	}));
	app.all('/dismissnotification', getAuth, httpf({id:'number'}, function(id) {
		sysnotifier.remove(id);
	}))
	app.all('/demo/result', httpf({orderid:'string', money:'number', callback:true}, function(orderid, money, callback) {
		_orderFunc.updateOrder(orderid, {status:'已送达'}, callback);
	}));

	/////////////////some server rendered pages
	function err_h(err, req, res, next) {
		if (err.err=='no auth') return res.redirect('/login.html');
		return next(err);
	}
	app.all('/fromuserlist.html', verifyAuth, err_h, (req, res) =>{
		res.render('fromuserlist', {acl:req.auth.acl});
	})
	app.all('/tomerchantlist.html', verifyAuth, err_h, (req, res)=>{
		res.render('tomerchantlist', {acl:req.auth.acl});
	})
	/////////////////must be last one
	app.use(function(req, res, next){
		res.status(404);
		res.render('404', {});
	});
	app.use(function(err, req, res, next) {
		if (err.err=='no auth') return res.send(err);
		res.render('error', err);
	})
	
	if (appStarted) return console.log('normal server is running'.green);
	app.listen(argv.port, function() {
		console.log(('server is running @ '+argv.port).green);
	})
}
