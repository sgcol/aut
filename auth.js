const argv = require('yargs')
	.default('authtimeout', 3*60*1000)
    .argv;
    
const auth_timeout=argv.authtimeout;
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
function getAuth(req, res, next) {
    if (!req.cookies || !req.cookies.a) return res.send({err:'no auth'});
    var auth=authedClients[req.cookies.a];
    if (!auth) return res.send({err:'no auth'});
    var now=new Date();
    if (auth.validUntil<now) {
        delete authedClients[req.cookies.a]
        return res.send({err:'no auth'});
    }
    req.auth=auth;
    next();		
}
const noAuthToLogin=verifyAuth;
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

module.exports={
    aclgt:aclgt,
    verifyManager:verifyManager,
    verifyAdmin:verifyAdmin,
    getAuth:getAuth,
    verifyAuth:verifyAuth,
    authedClients:authedClients
}