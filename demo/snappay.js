const url = require('url')
, request = require('request')
, md5 =require('md5')
, randomstring =require('random-string')
, objPath=require('object-path')

//辅助函数
const _noop=function() {};

Number.prototype.pad = function(size) {
	var s = String(this);
	while (s.length < (size || 2)) {s = "0" + s;}
	return s;
}

const timestring =(t)=>{
    return `${t.getUTCFullYear().pad(4)}-${(t.getUTCMonth()+1).pad()}-${t.getUTCDate().pad()} ${t.getUTCHours().pad()}:${t.getUTCMinutes().pad()}:${t.getUTCSeconds().pad()}`;
}

const makeSign=function(data, account, options) {
    delete data.sign;
    var message ='', o=Object.assign({app_id:account.app_id, version:'1.0', format:'JSON', sign_type:'MD5', charset:'UTF-8', timestamp:timestring(new Date())}, data);
    Object.keys(o).sort().map((key)=>{
        if (key=='sign') return;
        if (key=='sign_type' && ((!options) || (!options.includeSignType))) return;
        message+=''+key+'='+o[key]+'&';
    })
    var encoded_sign=md5(message.substr(0, message.length-1)+account.privateKey);
    o['sign'] = encoded_sign.toLowerCase();
    return o;
}
////////////////////


var account={partner:'901800000116', app_id:'9f00cd9a873c511e', privateKey:'7e2083699dd510575faa1c72f9e35d43'};

function test() {

    var data = {
        method:'pay.h5pay',
        merchant_no:account.partner,
        payment_method:'WECHATPAY',
        'out_order_no' : randomstring(),
        trans_currency:'CAD',
        trans_amount:0.01,
        description:'ceshi',
        'notify_url' : 'http://www.baidu.com',
        'return_url' : 'http://www.baidu.com',
    };            
    var request_url = 'https://open.snappay.ca/api/gateway';
    request.post({url:request_url, json:makeSign(data, account)}, async (err, header, body)=>{
        var ret=body;
        if (ret.code!='0') return console.error(ret.msg);
        var data=ret.data[0];
        console.log(ret);
    })    
}

test();