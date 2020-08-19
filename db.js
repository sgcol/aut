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
        {bills:{index:['status', 'time', 'type', 'checkout',
          {userid:1, used:1, time:-1, lasttime:-1, paidmoney:1, money:1},
          {time:1, provider:1, merchantName:1, status:1, checkout:1},
        ]}},
        'knownCard',
        {users:{index:['acl', 'merchantid']}},
        {monster:{index:'exOrderId', capped:true, size:100*1024, max:100000}},
        'stat',
        {'balance':{index:['user._id', 'orderid']}},
        {'alipay_accounts':{index:['disable', 'occupied', 'in']}},
        {'alipay_logs':{capped:true, size:200*1024*1024, max:3650000}},
        'alipay_settings',
        {'ksher_accounts':{index:['disable', 'occupied', 'in']}},
        {'ksher_logs':{capped:true, size:200*1024*1024, max:3650000}},
        'ksher_settings',
        'ksher_orders',
        {'snappay_accounts':{index:['disable', 'occupied', 'in']}},
        {'snappay_logs':{capped:true, size:200*1024*1024, max:3650000}},
        'snappay_settings',
        'snappay_orders',
        {'snappay_toll_accounts':{index:['disable', {key:{merchant_no:1}, name:'uni_merchant_no', unique:true}]}},
        'snappay_toll_settings',
        {'snappay_base_accounts':{index:['disable', {key:{mch_id:1}, name:'uni_mch_id', unique:true}]}},
        'snappay_base_settings',
        {'withdrawals':{index:['userid', 'done', {_t:-1, userid:1, money:1, name:-1}, 'money', 'name']}},
        {'settlements':{index:['time', 'mchId']}},
        {notify:{capped:true, size:100*1024, max:1000000, index:'read'}},
        'forbidden',
        {risky:{index:[{openid:1, risky:1}]}},
        'settings',
        {'hongtu_accounts':{index:['disable', {key:{mch_id:1}, name:'uni_mch_id', unique:true}]}},
        ]}, 
        function(err, db) {
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