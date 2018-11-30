var easym=require('gy-easy-mongo')
, async=require('async')
, argv =require('yargs')
  .demand('mongo')
  .describe('mongo', '--mongo=[mongodb://][usr:pwd@]ip[:port][,[usr:pwd@]ip[:port]]/db, 参考https://docs.mongodb.com/manual/reference/connection-string/')
  .argv;

var __stored_db=null;
var q=async.queue(function (extern_callback, queue_callback) {
  (function(cb) {
    if (__stored_db) return cb(null, __stored_db, easym);
    else new easym.DbProvider().init(argv.mongo, {exists:[
        {bills:{index:['status', 'time', 'type' ]}},
        'knownCard',
        {users:{index:['acl', 'merchantid']}},
        'merchants',
        {monster:{index:['exOrderId'], capped:true, size:100*1024, max:100000}},
        'stat',
        'balance'
        ]}, function(err, db) {
        if (err) return cb(err);
        __stored_db=db;
        cb(null, db, easym);
    });  
  })(function() {
    extern_callback.apply(null, arguments);
    queue_callback();
  })
});
module.exports=function(callback) {
  q.push(callback);
}

