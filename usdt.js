const BitcoreClient = require('bitcoin-core')
, config = require('./Conf.js')
, md5 = require('md5')
, clone =require('clone')
, path =require('path')
, os =require('os')
, async =require('async')
, argv = require('yargs')

const bitcoincli=(function initBitcoinCli() {
	if (!argv.conf) argv.conf=path.join(os.homedir(), '.bitcoin/bitcoin.conf');
	try {
		config.read(argv.conf);
		var bitcoincfg=config.getAll();
		return new BitcoreClient({
			username:bitcoincfg.rpcuser,
			password:bitcoincfg.rpcpassword,
			port:bitcoincfg.rpcport,
			network:bitcoincfg.testnet?'testnet':'mainnet'
		});
	} catch(e) {
		console.log(e.message.red, 'can not create bitcoincli');
		return null;
	}
})();

function getaddraffordfee(cb) {
    bitcoincli.estimateFee(6).then(fee=>{
        return getaddresswhichbtcgreatthan(fee, cb);
    }).catch(e=>{
        return cb(e);
    })
}
function getaddresswhichbtcgreatthan(amount, cb) {
    bitcoincli.listUnspent().then(res=>{
        for (var i=0; i<res.length; i++) {
            var item=res[i];
            if (item[i].amount>=amount) return cb(null, item.address);
        }
        return cb('no address has enough btc');
    }).catch(e=>{
        cb(e);
    })
}
function getallusdtaddr(propertyid, cb) {
    if (typeof propertyid=='function') {
        cb=propertyid;
        propertyid=31;
    }
    bitcoincli.command('omni_getwalletaddressbalances').then(res=>{
        var addrWithUsdt=[];
        for (var i=0; i<res.length; i++) {
            var item=res[i];
            var usdt=item.balances.find(b=>{
                return b.propertyid==propertyid;
            });
            if (usdt) {
                addrWithUsdt.push({addr:item.address, amount:Number(usdt.balance)});
            }
        }
        return cb(null, addrWithUsdt);
    }).catch(e=>{
        cb(e);
    })
}
function getsystemaddr(cb) {
    bitcoincli.getAddressesByAccount('system').then(addresses=>{
        if (addresses.length) return cb(null, addresses[0]);
        bitcoincli.getNewAddress('system').then(addr=>{
            return cb(null, addr);
        }).catch(e=>{return cb(e)});
    }).catch(e=>{
        return cb(e);
    })
}
function collectallusdt() {
    async.parallel([getsystemaddr, getallusdtaddr], (err, res)=>{
        if (err) return;
        var systemaddr=res[0], usdtaddr=res[1];
        for (var i=0; i<usdtaddr.length; i++) {
            if (usdtaddr.addr==systemaddr) continue;
            sendwithoutretry(usdtaddr.addr, systemaddr, usdtaddr.amount, systemaddr, '归帐');
        }
    })
}
function sendwithoutretry(fromaddr, toaddr, amount, feeaddr, opdesc, cb) {
    bitcoincli.command('omni_funded_send', fromaddress, toaddress, 31, ''+amount, feeaddress)
    .then(txid=>{
        return cb && cb(null, txid);
    })
    .catch(e=>{
        //如果fromaddr里没有BTC，那么转0.00000546给他，这是usdt转账时必须的，
        getsystemaddr((err, sysaddr)=>{
            if (err) return;
            bitcoincli.sendFrom(sysaddr, fromaddress, 0.00000546);
        });
        allfails.push({op:opdesc, err:e, from:fromaddress, to:toaddress, fee:feeaddress, t:new Date()});
        return cb && cb(e);
    })
}
function send(fromaddress, toaddress, amount, feeaddress, opdesc, cb) {
    bitcoincli.command('omni_funded_send', fromaddress, toaddress, 31, ''+amount, feeaddress)
    .then(txid=>{
        return cb && cb(null, txid);
    })
    .catch(e=>{
        allfails.push({op:opdesc, err:e, from:fromaddress, to:toaddress, fee:feeaddress, t:new Date(), f:send.bind(null, fromaddress, toaddress, amount, feeaddress, opdesc)});
        return cb && cb(e);
    });
}
var allfails=[];
function retryallfails() {
    if (allfails.length==0) return;

    var toproc=clone(allfailes);
    allfails=[];
    for (var i=0; i<toproc; i++) {
        toproc[i].f && toproc[i].f.call();
    }
}

setInterval(()=>{
    collectallusdt();
    retryallfails();
}, 10*60*1000);

module.exports={
    bitcoincli:bitcoincli,
    getaddress(account, callback) {
        bitcoincli.getNewAddress(account).then((res)=>{
            callback(null, {address:res});
        }).catch(e=>{
            return callback(e);
        })
    },
    getreceivedbyaddress(address, minconf, callback) {
        bitcoincli.getReceivedByAddress(address, minconf||1).then(res=>{
            return callback(null, {received:res});
        }).catch(e=>{
            return callback(e);
        })
    },
    listtransactions(txid, count, skip, startblock, endblock, callback) {
        bitcoincli.command('omni_listtransactions',txid||'*', count||10, skip||0, startblock||0, endblock||999999999).then(res=>{
            return callback(null, httpf.json(res));
        }).catch(e=>{
            return callback(e);
        });
    },
    sendto(toaddress, amount, callback) {
        getsystemaddr((err, sysaddr)=>{
            if (err) return callback(err);
            send(sysaddr, toaddress, amount, sysaddr, '出账', callback);
        })
    },
    listallfails(callback) {
        return callback(null, allfails);
    },
    getspendable(callback) {
        getsystemaddr((err, sysaddr)=>{
            if (err) return callback(err);
            bitcoincli.command('omni_getallbalancesforaddress', sysaddr).then(balances=>{
                var usdtbalance=balances.find(b=>{return b.propertyid==31});
                callback(null, Number(usdtbalance.balance));
            }).catch(e=>{
                if (e.code==-8) {
                    // this address without any omni-based token, no usdt, no omni, etc
                    return callback(null, 0);
                }
                callback(e);
            })
        })
    }
}    
module.exports.getsysaddrbalance=module.exports.getspendable;

if (module==require.main) {
    // test code
    getsystemaddr((err, sysaddr)=>{
        console.log('systemaddress', sysaddr);
        module.exports.getspendable(console.log.bind(console, 'sysaddrbalance'));
        var propertyid=1;
        getallusdtaddr(propertyid, (err, allusdt)=>{
            console.log('all omni', allusdt);
            console.log(allusdt[0].addr, sysaddr, propertyid, 0.001, sysaddr);
            bitcoincli.command('omni_funded_send', allusdt[0].addr, sysaddr, propertyid, '0.001', sysaddr).then(res=>{
                console.log('no fee btc', res, typeof res);
            }).catch(e=>{
                console.log('no fee btc err', e, typeof e);
            });            
        });
        
    });
}