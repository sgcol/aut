const getDB=require('./db.js');
const EventEmitter = require('events');
const initEE = new EventEmitter();

var users={};
var inited=false, _db=null;
getDB((err, db)=>{
    if (err) {
        console.error(err);
        return process.exit(-1)
    }
    _db=db;
    db.users.find().toArray((err, r)=>{
        if (err) {
            console.error(err);
            return process.exit(-1)
        }
        for (var i=0; i<r.length; i++) {
            users[r[i]._id]=r[i];
        }
        inited=true;
        initEE.emit('inited');
    })
})

function xget(id) {
    if (users[id]) return users[id];
    var u=users[id]={_id:id, total:0};
    _db.users.insert(u);
    return u;
}
function get(id, cb) {
    if (!inited) {
        initEE.on('inited', ()=>{
            cb(null, xget(id));
        })
    }
    cb(null, xget(u));
}
module.exports={
    get:get,
    // add:add
};