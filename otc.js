const md5=require('md5'), qs=require('querystring'), sortObj=require('sort-object');
const OTCKey='$mVd!w9R%Wr4NDSJr8';
module.exports={
    verifyOTC:(function createVerifyOTC(lastT) {
        return function (req, res, next) {
            var _p=merge(req.query, req.body), sign=_p.sign;
            if (!sign) return res.send({err:'没有签名sign'});
            delete _p.sign;
            if (_p.t==null) return res.send({err:'没有时间戳'});
            var wanted=md5(qs.stringify(sortObj(_p))+OTCKey);
            if (sign!=wanted) {
                var e={err:'签名错误'};
                if (argv.debugout) {
                    e.wanted=wanted;
                    e.str=qs.stringify(sortObj(_p))+OTCKey;
                }
                return res.send(e);
            }
            if (Number(_p.t)<=lastT) return res.send({err:'时间戳异常'});
            lastT=Number(_p.t);
            next();
        }
    })(0),
    makeOTCSign(obj) {
        if (!obj.t) obj.t=new Date().getTime();
        if (obj.sign) delete obj.sign;
        obj.sign=md5(qs.stringify(sortObj(obj))+OTCKey);
        return obj;
    }
}

// otc adapter
/*const sysevents=require('./sysevents.js'), mysql=require('mysql2'), pp=require('php-parser'), path=require('path');
new Promise((resolve, reject) =>{
    resolve(pp.parseCode(fs.readFileSync(path.join(__dirname, './otc/Application/Common/Conf/config.php'))));
}).then((content)=>{
    return new Promise((resolve)=>{
        var phpObj=content.children[0].expr.items;
        var o={};
        phpObj.forEach((item)=>{
            o[item.key.value]=item.value.value;
        })
        resolve(o);
    })
}).then(config=>{
    var connection = mysql.createPool({
        host     : config.DB_HOST,
        user     : config.DB_USER,
        password : config.DB_PWD,
        database : config.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    connection.connect();

    sysevents.on('newAlipayAccount', async function (acc) {
        var time=Math.floor(new Date().getTime()/1000), salt=md5(time).substr(0, 3), pwd=md5(md5(acc.pwd)+salt);
        var r=await connection.query(
            `insert into ${config.DB_NAME}.cy_user (username, country_code, mobile, password, salt, addip, addtime, status, ue_img, yqm) values ('${acc.name}', 0, '${acc.name}', '${pwd}', '${salt}', '0.0.0.0', ${time}, 1, '/Uploads/head_portrait60.png', 'aabb');`
        );
        await connection.query(`insert into ${config.DB_NAME}.cy_user_coin (userid, usdt) values (${r.id}, 99999999999999)`);
        request.post('http://127.0.0.1/api/market/add', this.makeOTCSign({userid:r.id, sellorbuy:'sell', price:6.98, provider:2, coin:'usdt'}));
    }).on('newAccount', acc=>{
        if (acc.acl=='admin' ||acc.acl=='manager') return;
        var time=Math.floor(new Date().getTime()/1000), salt=md5(time).substr(0, 3), pwd=md5(md5(acc.originPwd)+salt);
        connection.query(`insert into ${config.DB_NAME}.cy_user (username, country_code, mobile, password, salt, addip, addtime, status, ue_img, yqm) values ('${acc.name}', 0, '${acc._id}', '${pwd}', '${salt}', '0.0.0.0', ${time}, 1, '/Uploads/head_portrait60.png', 'aabb');`)
    }).on('alipayOrderCreated', order=>{
        connection.query()
    }).on('orderConfirmed', order=>{

    }) 
})
.catch(e=>{
    console.error(e);
})
*/

if (module==require.main) {
    // test mode
    const request=require('request');
    request.post({uri:'http://usdt.cs8.us:89/api/merchant/confirmOrder', form:module.exports.makeOTCSign({transactionid:'183', userid:'16'})}, function(err, header, body) {
        console.log(JSON.parse(body));
    })
}