var notifymsg=[], count=0;
const getDB=require('./db.js');

getDB((err, db)=>{
    db.notify.find().toArray((err, r)=>{
        if (err) return;
        notifymsg=r;
    })
})
function add(title, desc, priority, auth) {
    count++;
    console.error(title, desc||'', priority||'', auth||'admin');
    getDB((err, db)=>{
        if (err) return;
        db.notify.insert({title:title, desc:desc, priority:priority, acl:auth||'admin', _id:count});
    })
    return notifymsg.push({title:title, desc:desc, priority:priority, acl:auth||'admin', _id:count})-1;
}

function remove(idx) {
    if (idx>=0) {
        notifymsg.splice(idx, 1);
        getDB((err, db)=>{
            db.notify.deleteOne({_id:idx});
        })
    }
}

function all() {
    return notifymsg;
}

module.exports={all, add, remove};