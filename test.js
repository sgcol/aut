const pm2 =require('pm2');
const express = require('express')
	, app = express()
	, argv = require('yargs')
	.default('port', 80)
	.boolean('debugout')
	.boolean('dev')
	.argv;
require('colors');
app.listen(argv.port);
console.log(process.env.NODE_APP_INSTANCE);

pm2.connect(function(err) {
	if (err) return console.log(err);
	console.log('pm2 connected', process.env.NODE_APP_INSTANCE);

	function allInstances(cb) {
		var mypid=process.pid;
		console.log('my pid', mypid);
		pm2.list(function(err, p) {
			console.log(p.length, 'process found');
			// locate me
			var myexec=null;
			for (var i=0; i<p.length; i++) {
				if (p[i].pid==mypid) {
					myexec=p[i].pm2_env.pm_exec_path;
					break;
				}
			}
			if (!myexec) return cb('找不到自己');
			var neighbors=[];
			for (var i=0; i<p.length; i++) {
				if (p[i].pm2_env.pm_exec_path==myexec) neighbors.push(p[i]);
			}
			cb(null, neighbors);
		})    
	}
	// check if in pm2 cluster mode
	if (process.env.NODE_APP_INSTANCE===undefined) {
	    console.log('必须使用pm2 start index.js -i max 启动'.yellow);
	    if (!argv.debugout) return process.exit(-1);
	}

	if (process.env.NODE_APP_INSTANCE==='0') {
		console.log('check neigbor');
		allInstances(function(err, list) {
			if (err) {
				console.log(err);
				return process.exit(-1);
			}
			console.log('all neigbors');
			for (var i=0; i<list.length; i++) {
				console.log(list[i].pm_id);
			}
			// console.log(list);
			console.log('====done');
		});
	}
})
