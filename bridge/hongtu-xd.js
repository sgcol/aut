const orders=new Map()
, url =require('url')
, router=require('express').Router()
, httpf=require('httpf')
, ejs=require('ejs')
, _noop=function() {};

router.all('/order', httpf({orderid:'string', callback:true}, function (orderid, callback) {
    if (orders.has(orderid)) return callback('重复的orderid');
    var req=this.req;
    var params={_t:new Date(), params:{...req.query, ...req.body}};
    orders.set(orderid, params);
    var basepath={protocol:req.protocol, host:req.headers.host, pathname:url.resolve(url.parse(req.originalUrl).pathname, 'launch'), query:{orderid:orderid}};
    callback(null, {url:url.format(basepath)})
}));

const template=ejs.compile(`
<!DOCTYPE html>
<body>
	<Form id="cc" style="display:none" method=post action="http://www.hongtupay.com/Pay_Gateway">
        <% Object.keys(order).forEach((key) => { %>
            <input type="hidden" name="<%=key%>" value="<%=order[key]%>">
        <% }) %>
	</Form>
    <script>
        window.onload=()=>{
            document.getElementById('cc').submit();
        }
    </script>
</body>
`);

router.get('/launch', httpf({orderid:'string', no_return:true}, function(orderid) {
    var req=this.req, res=this.res;
    var o=orders.get(orderid);
    orders.delete(orderid);
    if (!o) return res.send('没有这个订单');
    res.send(template({order:o.params}));
}))

setInterval(()=>{
    var now=new Date();
    orders.forEach((element, key) => {
        if ((now-element._t)>10*60*1000) orders.delete(key);
    });
}, 10*60*1000);

exports.router=router;