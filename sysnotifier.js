var notifymsg=[], count=0;

function add(title, desc, priority, auth) {
    count++;
    return notifymsg.push({title:title, desc:desc, priority:priority, acl:auth, _id:count})-1;
}

function remove(idx) {
    if (idx>=0) notifymsg.splice(idx, 1);
}

function all() {
    return notifymsg;
}

module.exports={all, add, remove};