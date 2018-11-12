const url = require('url')
, path = require('path')
, request = require('request')
, qs = require('querystring')
, sortObj=require('sort-object')
, merge = require('gy-merge')
, clone =require('clone')
, fs = require('fs')
, router=require('express').Router()
, httpf =require('httpf')
// , subdirs = require('subdirs')
// , del = require('delete')
, randomstring =require('random-string')
, async =require('async')
, md5 = require('md5')
, getDB=require('../db.js')
, confirmOrder =require('../order.js').confirmOrder
, pify =require('pify')
, argv=require('yargs').argv;

const _baseURL=url.parse('http://testapi.monstermarket.cn');
const ownerId='MHT2018110532254740945085284791', appId='mst236153cd622f3fbb', key='049af9e9d7aa11968ed945d73c4b171f';
const imgbase='http://teststatic.monstermarket.cn';

const monsterrKey='Qztbet4J8uznaBeP';
monsterVerifySign =function(req, res, next) {
    var _p=merge(req.query, req.body), sign=_p.sign;
    if (!sign) return res.send({err:'没有签名sign'});

    delete _p.sign;
    var wanted=md5(monsterrKey+qs.stringify(sortObj(_p)));
    if (sign!=wanted) {
        var e={err:'签名错误'};
        if (argv.debugout) {
            e.wanted=wanted;
            e.str=monsterrKey+qs.stringify(sortObj(_p));
        }
        return res.send(e);
    }
    next();
}

var db;
(function start(cb) {
	async.parallel([getDB], function(err, results) {
		if (err) return cb(err);
		cb(err, results[0][0]);
		// restore all running order
		// db.monster.find({status:'runnning'}).toArray((err, r)=>{
		// 	if (err) return cb(err);
		// 	for (var i=0; i<r.length; i++) {
		// 		var product=r[i].product, plist=byCoins[product.coinId][product.buySell];
		// 		for (var j=0; j<plist.length; j++) {
		// 			if (plist[j].productId==product.productId) {
		// 				occupied.add(plist[j]);
		// 				break;
		// 			}
		// 		}
		// 	}
		// 	cb(err, db);
		// })
	})
})(init);
function init(err, db) {
	if (err) {
		console.error(err);
		process.exit(-1);
	}
	db=db;
    router.all('/afterbuy', monsterVerifySign, httpf({orderid:'string', money:'number', status:'string', time:'string', callback:true}, function(orderid, money, status, time, callback) {
		db.monster.find({exOrderId:orderid}).toArray((err, r)=>{
			if (err) return callback(err);
			if (r.length==0) return callback('no such orderid');
			var p=byCoins.id[r[0].product.productId];
			if (p) occupied.delete(p);
			confirmOrder(r[0].orderid, function(err) {
				callback();
			});
		})
    }))
    router.all('/aftersell', monsterVerifySign, httpf({orderid:'string', money:'number', status:'string', time:'string', callback:true}, function(orderid, money, status, time, callback) {
        callback();
    }))
}

var byCoins={id:{}, updateTime:new Date(0)};
function getAllProducts(cb) {
	var now=new Date();
	if ((now-byCoins.updateTime)<3*60*1000) return cb();
	queryProducts(null, function(err, r) {
		if (err) return cb(err);
		byCoins={id:{}, updateTime:now};
		for (var i=0; i<r.length; i++) {
			var p=r[i];
			byCoins.id[p.productId]=p;
			var t=byCoins[p.coinId];
			if (!t) {
				t=byCoins[p.coinId]={B:[], S:[]};
			}
			if (p.buySell=='B' || p.buySell=='S') t[p.buySell].push(p);
		}
		makeProductsSorted();
		cb&& cb();
	})
}
function makeProductsSorted() {
	for (var coins in byCoins) {
		if (coins=='id' ||coins=='updateTime') continue;
		var t=byCoins[coins];
		t.B.sort((a, b)=>{return b.unitPrice-a.unitPrice});
		t.S.sort((a, b)=>{return a.unitPrice-b.unitPrice});
	}
}
function bestPair(money, callback) {
	callback(null, 0, 'USDT');
}
var occupied=new WeakSet();
function bestBuy(money, coinType, callback) {
	getAllProducts(function(err) {
		var coin=byCoins[coinType];
		if (!coin) return callback('no such coin');
		if (coin.S.length==0) return callback('no data yet');
		for (var i=0; i<coin.S.length; i++) {
			var p=coin.S[i];
			if (occupied.has(p)) continue;
			var coinNum=money/p.unitPrice;
			if (p.minOrderQuantity>coinNum || p.leftQuantity<coinNum || p.maxOrderQuantity<coinNum || p.payMethodList.indexOf('2')<0) continue;
			occupied.add(p);
			return callback(null, p);
		}
		return callback('暂时没有通道');	
	})
}
function queryProducts(isBuy, callback) {
	var desturl=clone(_baseURL);
	desturl.pathname='/market/coin/v1/c2c/products';
	var data={source:'01', version:'1.0'};
	if (isBuy!=null) {
		data.buySell=isBuy?'B':'S';
	}
	request.post(url.format(desturl), {json:data}, function(err, header, body) {
		if (err) return callback(err)
		var ret=body;
		if (ret.resultList) return callback(null, ret.resultList);
		if (!ret.success) return callback(ret.respCode||'unknown error');
	})
}
function makeObj(o) {
	o.source=o.source||'01';
	o.version=o.version||'1.0';
	o.ownerId=o.ownerId||ownerId;
	o.nonceStr=o.nonceStr||randomstring();
	o.timestamp=o.timestamp||new Date().getTime();
	return signObj(o);
}
function signObj(o) {
	o.sign=md5(qs.stringify({appId:o.appId, nonceStr:o.nonceStr, ownerId:o.ownerId, timestamp:o.timestamp, key:key}));
	return o;
}
function putorder(orderid, product, money, ownerId, callback) {
	var desturl=clone(_baseURL);
	desturl.pathname='/market/coin/v1/c2c/submit/order';
	console.log('order with', makeObj({
		ownerId:ownerId, payMethod:'2', buyQuantity:money/product.unitPrice, productId:product.productId, password:'****'
		, returnBackUrl:url.format({protocol:'http', host:argv.host, pathname:'/pvd/monster/afterbuy'})
	}))
	request.post({uri:url.format(desturl), json:makeObj({
		ownerId:ownerId,
		returnBackUrl:url.format({protocol:'http', host:argv.host, pathname:'/pvd/monster/afterbuy'}),
		payMethod:'2', buyQuantity:money/product.unitPrice, productId:product.productId, password:'****'
	})}, function(err, header, body) {
		console.log('order ret', body);
		if (err) return callback(err)
		var ret=body;
		if (!ret.success) return callback(ret.message);
		merge(product, ret.productInfo);
		makeProductsSorted();
		occupied.add(product);
		pify(getDB)().then((db)=>{
			return db.monster.insert({orderid:orderid, exOrderId:ret.orderId, product:product, money:money, time:new Date()});
		}).then(()=>{
			callback(null, body);
		}).catch((e)=>{
			callback(null, body);
		});
	})
}

function afterPutOrder(monsterOrderId, ownerId, callback) {
	var desturl=clone(_baseURL);
	desturl.pathname='/market/coin/v1/c2c/pay/order';
	request.post({uri:url.format(desturl), json:makeObj({ownerId:ownerId, payMethod:'2', orderId:monsterOrderId})}, function(err, header, body) {
		console.log('pay/order ret', body);
		if (err) return callback(err);
		if (body.error) return callback(body.message);
		return callback(null, body);
	})
}

exports.order=function order(orderid, money, merchantdata, coinType, callback) {
	var product, exOrder;
	pify(bestBuy)(money, coinType).then((bestBuy)=> {
		product=bestBuy;
		return pify(putorder)(orderid, product, money, merchantdata.providers['monster'].ownerId);
	}).then((order)=>{
		exOrder=order;
		return pify(afterPutOrder)(order.orderId, merchantdata.providers['monster'].ownerId);
	}).then(()=>{
		var payInfo=exOrder.payInfo.find((ele)=>{return ele.payMethodType=='2'});
		if (!payInfo) return callback('小怪兽没有正确配置数据');
		callback(null, url.resolve(imgbase,payInfo.receiveAddress));
	}).catch((e)=> {
		// if (e=='C2C买币下单时用户还存在未完成的买币订单') {
		// 	occupied.add(product);
		// 	return order(orderid, money, callback);
		// }
		callback(e);
	})
}
exports.bestPair=bestPair;
exports.router=router;

if (module==require.main) {
	// test mode
	console.log('start', new Date().getTime());
	bestBuy(8000, 'USDT', function(err, bestBuy) {
		if (err) return err;
		if (bestBuy) {
			console.log('choose product', bestBuy.productId);
			putorder('111', bestBuy, 8000, ownerId, function(err, order) {
				if (err) return console.log(err);
				afterPutOrder(order.orderId, ownerId, console.log);
			});   
		}
	});
}
