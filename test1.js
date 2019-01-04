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
, getDB=require('./db.js')
// , subdirs = require('subdirs')
// , del = require('delete')
, randomstring =require('random-string')
, async =require('async')
, pm2 =require('pm2')
, httpf = require('httpf')
, util=require('util')
, argv = require('yargs')
	.default('port', 80)
	.boolean('debugout')
	.boolean('dev')
	.default('authtimeout', 3*60*1000)
	.argv
, debugout=require('debugout')(argv.debugout);

require('colors');

app.listen(argv.port, function() {
    console.log(('server is running @ '+argv.port).green);
});

var router=require('express').Router();

router.all('/', function(req, res) {
    res.send({result:'ok'});
});
router.all('/err', function(req, res, next) {
    // setTimeout(next.bind(null, 'test err'), 1000);
    try {
        var a=1;
        res.send(a/0);    
        // throw new Error('a error');
    } catch(e) {
        next('can`t do this');
    }
});

function sendableErr(err) {
    if (err instanceof Error) {
        var o={message:err.message};
        if (argv.debugout) o.stack=err.stack;
        return o;
    }   
    return err;
}
app.use('/r', function(req, res, next) {
    router.call(null, req, res, function(err) {
        if (err) return res.send({err:sendableErr(err)});
        res.send('no such function');
    })
})

getDB((err, db) =>{
    var money=100, userid='m112';
    var shares=[];
    // shares.push((money*(r[0].share||0.985)).toFixed(2));
    function getParent(user, cb) {
        db.users.find({_id:user.parent}).toArray((err, r) =>{
            if (err) return cb(err);
            if (r.length==0) return cb('no such user');
            cb(null, r[0]);
        })
    }
    var findkey={_id:userid};
    // if (r[0].userid) findkey.id=r[0].userid;
    // else if (r[0].merchantid) findkey.merchantid=r[0].merchantid;
    db.users.find(findkey).toArray()
    .then((merchants)=>{
        return new Promise((resolve, reject)=>{
            (function getShare(user, cb) {
                shares.push({m:Number((money*(user.share||0)).toFixed(2)), id:user._id});
                if (!user.parent) return cb();
                getParent(user, function(err, parent) {
                    if (err || !parent) return cb();
                    getShare(parent, cb);
                })
            })(merchants[0], resolve);
        });
    })
    .then(()=>{
        db.users.update({_id:shares[0].id}, {$inc:{total:shares[0].m}});
        for (var i=1; i<shares.length; i++) {
            db.users.update({_id:shares[i].id}, {$inc:{total:(shares[i].m-shares[i-1].m)}})
        }
        db.users.update({_id:'system'}, {$inc:{total:money-shares[shares.length-1].m}}, {upsert:true});                
    })
    .catch((e)=>{

    });

})