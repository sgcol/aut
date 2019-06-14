(function ($) {
    "use strict";
    window.getAjax=function getAjax(_url, data, callback) {
        if (typeof data ==='function') {
            callback =data;
            data=null;
        }
        if (!callback) callback=function(){};
        var addr=_url;
        $.ajax({
            type: "POST",
            url: addr,
            dataType: "JSON",
            data: data?JSON.stringify(data):undefined,
            contentType:'application/json; charset=utf-8',
            timeout:30000,
            success: function (chunk) {
                if (chunk.err) return callback(chunk.err, chunk);
                return callback(null, chunk);
            },
            error: function (e) {
                callback(e);
            }
        })
    }

    window.accIntf=function(_url, data, callback) {
        if (typeof data=='function') {
            callback=data;
            data=null;
        }
        getAjax(_url ,data, function(err, r) {
            if (err && err=='no auth') {
                location.href='/login.html';
                return;
            }
            return callback && callback(err, r);
        })
    }
    function delete_cookie( name ) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    window.logout=function() {
        delete_cookie('a');
        location.href='/';
    }
    window.errstr=function(e) {
        if (typeof e=='string') return e;
        if (typeof e=='object') {
            var err=e.message||e.msg||e.statusText;
            if (err) return err;
            return e.toString();
        }
        return e;
    }
    window.showerr=function(e) {
        alert(errstr(e));
    }

    function bell(frequency,type){
        var context=new AudioContext()
        var o=null
        var g=null
        o=context.createOscillator()
        g=context.createGain()
        o.type=type
        o.connect(g)
        o.frequency.value=frequency
        g.connect(context.destination)
        o.start(0)
        g.gain.exponentialRampToValueAtTime(0.00001,context.currentTime+1)
    }
    window.bell=bell;
    
    $(function() {
        accIntf('/account/me', function(err, me) {
          if (err) return;
          window.me=me;
          $('.username').text(me.name||'');
          $('.acl').text(me.acl||'访客');
          typeof window.initpage=='function' && window.initpage();
        });
        var oldNotifications={};
        function receiveNotifications() {
            accIntf('/sysnotification', function(err, notifications) {
                if (err) return;
                var container=$('.notifications');
                container.empty();
                if (notifications.length==0) return $('#hasNewNotification').hide();
                $('#hasNewNotification').show();
                var notificationschanged=false;
                for (var i=0; i<notifications.length; i++) {
                    if (!oldNotifications[notifications[i]._id]) notificationschanged=true;
                    var item=$(`
                        <a class="dropdown-item preview-item">
                        <div class="preview-thumbnail">
                        <div class="preview-icon bg-success">
                            <i class="mdi mdi-currency-btc"></i>
                        </div>
                        </div>
                        <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                        <h6 class="preview-subject font-weight-normal mb-1">${notifications[i].title}</h6>
                        <p class="text-gray ellipsis mb-0">
                            ${notifications[i].desc}
                        </p>
                        </div>
                    </a>
                    <div class="dropdown-divider"></div>
                    `);
                    container.append(item);  
                }
                oldNotifications={}
                for (var i=0; i<notifications.length; i++) {
                    oldNotifications[notifications[i]._id]=true;
                }
                if (notificationschanged) {
                    //beep
                    example4(830.6, 'sine');
                }
            })
        }
        receiveNotifications();
        setInterval(receiveNotifications, 1*30*1000);
    });

    window.timestring =(t)=>{
      return new Date(t).toLocaleDateString()+' '+ new Date(t).toTimeString().replace(/.*(\d{2}:\d{2}:\d{2}).*/, "$1");;
    }
    window.formatBigNumber=(s)=>{
      return (''+s).replace(/(?=(?!^)(?:\d{3})+(?:\.|$))(\d{3}(\.\d+$)?)/g,',$1');
    }
    window.addAllFields=(o)=>{
        var ret=0;
        for (var k in o) {
            var v=Number(o[k]);
            if (isNaN(v)) continue;
            ret+=v;
        }
        return ret;
    }

})(jQuery)