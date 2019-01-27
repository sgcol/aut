<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>担保比特币-自由买卖安全可信赖的比特币交易平台 - 一个自由买卖安全可信赖的比特币交易平台</title>
    <meta charset=utf-8"utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="renderer" content="webkit">
    <link rel="shortcut icon" href="/static/imgs/favicon.ico" type="image/x-icon" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="renderer" content="webkit">
    <link rel="shortcut icon" href="/static/imgs/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/Public/static/css/common_2aed4bc732.css" >
    <link rel="stylesheet" href="/Public/static/css/index_9b484c78b0.css" >
    <link rel="stylesheet" href="/Public/static/css/main.css" >
    <link rel="stylesheet" href="/Public/static/css/oneself.css" >
    <link rel="stylesheet" type="text/css" href="/Public/static/iconfont/iconfont.css">
    <link rel="stylesheet" type="text/css" href="/Public/static/iconfont2/iconfont.css">
    <script src="/Public/jquery/jquery.min.js"></script>
    <script src="/Public/layui/layer.js"></script>
    <script src="http://cdn.ronghub.com/RongIMLib-2.3.5.min.js"></script>
</head>
<body class="zh-CN">
<div class="header zh-CN">
    <div class="header-box container clear-float">
        <div class="logo-wrap">
            <img src="/Public/static/imgs/logo.png">
        </div>
        <div class="nav clear-float fl">
            <a class="nav-item " href="<?php echo U('Index/index');?>" ><?php echo (L("shouy")); ?></a>
            <a class="nav-item " href="/Buy"><?php echo (L("gm")); ?></a>
            <a class="nav-item " href="/Sell"><?php echo (L("chushou")); ?></a>
            <a class="nav-item " href="/Newad" ><?php echo (L("fbgong")); ?></a>
            <a class="nav-item " href="/activities" >推广专区</a>
        </div>
       <!-- <div class="fl lang-box">
                <span class="currL">简体中文 <i class="iconfont">&#xe600;</i></span>
                <ul>
                    <li><a href="?l=zh-cn" id="zh-cn">简体中文</a></li>
                    <li><a href="?l=en-us" id="en-us">English</a></li>
                    <li><a href="?l=zh-hk" id="zh-hk">繁體中文</a></li>
                </ul>
        </div>-->
        <div class="clear-float fr login-panel" <?php if(!empty($sessioninfo["userid"])): ?>style="display:none"<?php endif; ?>>
        <a class="user-action" href="/Signup/phone"><span class="sp iconfont">&#xe6c9;</span><span class="va-middle"><?php echo (L("zhuce")); ?></span></a>
        <a class="user-action btn-login" href="/login/phone" ><span class="sp iconfont">&#xe6c9;</span><span class="va-middle"><?php echo (L("denglu")); ?></span></a>
    </div>
    <div class="clear-float fr my-panel" <?php if(empty($sessioninfo["userid"])): ?>style="display:none"<?php endif; ?>>
    <div  class="item">
        <a href="<?php echo U('Order/lists');?>"  class="item-label"><span class="iconfont">&#xe613;</span> <span><?php echo (L("dingdan")); ?></span> <span class="message-count" style="display: none"></span> <!-- <span class="iconfont arrow">&#xe601;</span> --></a>
        <div class="item-more item-message"></div>
    </div>
    <div class="item" >
        <a href="<?php echo U('Wallet/deposit',array('type'=>btc));?>" class="item-label">
            <span class="iconfont">&#xe672;</span>
            <span class="va-mid"><?php echo (L("qianbao")); ?></span>
            <span class="iconfont arrow">&#xe601;</span>
        </a>
        <div class="item-more item-wallet" style="
    width: 500px;
    left: -380px;
">
            <div class="wallet-item" style="
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,.05);
    text-align: center;
">
                <div class="text-total" style="
    font-size: 12px;
    color: #677686;
"><?php echo (L("zongzichan")); ?></div>
                <div class="wallet-cont" style="
    border-bottom: 1px solid #e5eaef;
    min-height: 34px;
    line-height: 35px;
    font-size: 14px;
    color: #25495e;
    position: relative;
">
                    USDT: <span class="" style="width:90px;display:inline-block;margin-right: 30px;"><?php echo (round($moneyinfo['usdt']+$moneyinfo['usdtd'],2)); ?></span>
                </div>
                <div class="wallet-cont clear-float" style="
    padding: 10px 0;
    border-bottom: 1px solid #e5eaef;
    min-height: 34px;
    line-height: 35px;
    font-size: 14px;
    color: #25495e;
    position: relative;
">
                    <div class="col-33 ta-l" style="
    float: left;
    font-size: 12px;
    color: #25495e;
">
                        <div class="text"><?php echo (L("bizhong")); ?></div>
                        <div class="text">USDT</div>
                    </div>
                    <div class="col-33 ta-l" style="
    float: left;
    font-size: 12px;
    color: #25495e;
">
                        <div class="text"><?php echo (L("kyzc")); ?></div>
                        <div class="text BTC_available"><?php echo ($moneyinfo["usdt"]); ?></div>
                    </div>
                    <div class="col-33 ta-r" style="
    float: left;
    font-size: 12px;
    color: #25495e;
">
                        <div class="text"><?php echo (L("djzc")); ?></div>
                        <div class="text BTC_lock"><?php echo ($moneyinfo["usdtd"]); ?></div>
                    </div>
                </div>

                <div class="clear-float">
                    <a class=" btn " href="<?php echo U('Wallet/bill');?>"><?php echo (L("zdmx")); ?></a>
                    <a class="refresh-wallet btn ml-20" onclick="location.reload()"><?php echo (L("shuaxin")); ?></a>
                </div>

            </div>
        </div>

    </div>
    <div class="item" >
        <a href="<?php echo U('Setting/userinfo');?>" class="item-label  width-110"><span class="iconfont">&#xe6c9;</span> <span class="username"><?php echo ($sessioninfo["username"]); ?></span> <span class="iconfont arrow">&#xe601;</span></a>
        <div class="item-more item-my width-110">
            <a class="link" href="<?php echo U('Setting/userinfo');?>" ><?php echo (L("yhzx")); ?></a>
            <!-- <a class="link" href="/manage/order-sell">我的交易</a> -->
            <a class="link" href="<?php echo U('Manage/adsell');?>"><?php echo (L("mygg")); ?></a>
            <a class="link" id="logout" href="<?php echo U('Login/loginout');?>"><?php echo (L("tuichu")); ?></a>
        </div>
    </div>
</div>
<div class="opt">
    <div class="opt-line"></div>
    <div class="opt-line"></div>
    <div class="opt-line"></div>
</div>
</div>
</div>
<script>
      // 中英文切换

  $('.lang-box .currL').click(function(){
    $(this).next().slideToggle();

});
</script>
<script>
  
    $(document).ready(function(){
        $("a.menu-item").each(function(){
            if(this.href==String(window.location)){
                $(this).addClass("active");
            }
        });
        if ('addEventListener' in document) {  
            document.addEventListener('DOMContentLoaded', function() {  
                FastClick.attach(document.body);  
            }, false);  
        }
        $(function() {  
            FastClick.attach(document.body);  
        }); 
        $('.my-panel .item').on('click',function() {

            $(this).find('.item-more').toggle()
        })
        $('.opt').on('click',function(){

            $(this).siblings('.nav').slideToggle()
        })
        
    });
</script>

<script>
    RongIMClient.init("<?php echo ($_SESSION['token']['rong_key']); ?>");
    var token = "<?php echo ($_SESSION['token']['rong_token']); ?>";
    RongIMClient.setConnectionStatusListener({
        onChanged: function (status) {
            switch (status) {
                case RongIMLib.ConnectionStatus.CONNECTED:
                    console.log('链接成功');
                    break;
                case RongIMLib.ConnectionStatus.CONNECTING:
                    console.log('正在链接');
                    break;
                case RongIMLib.ConnectionStatus.DISCONNECTED:
                    console.log('断开连接');
                    break;
                case RongIMLib.ConnectionStatus.KICKED_OFFLINE_BY_OTHER_CLIENT:
                    console.log('其他设备登录');
                    break;
                case RongIMLib.ConnectionStatus.DOMAIN_INCORRECT:
                    console.log('域名不正确');
                    break;
                case RongIMLib.ConnectionStatus.NETWORK_UNAVAILABLE:
                    console.log('网络不可用');
                    break;
            }
        }});
    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    break;

                case RongIMClient.MessageType.ImageMessage:
                    // message.content.content => 图片缩略图 base64。
                    // message.content.imageUri => 原图 URL。
                    break;
                default:
                // do something...
            }
        }
    });
    RongIMClient.connect(token, {
        onSuccess: function(userId) {
            console.log("Connect successfully." + userId);
        },
        onTokenIncorrect: function() {
            console.log('token无效');
        },
        onError:function(errorCode){
            var info = '';
            switch (errorCode) {
                case RongIMLib.ErrorCode.TIMEOUT:
                    info = '超时';
                    break;
                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                    info = '未知错误';
                    break;
                case RongIMLib.ErrorCode.UNACCEPTABLE_PaROTOCOL_VERSION:
                    info = '不可接受的协议版本';
                    break;
                case RongIMLib.ErrorCode.IDENTIFIER_REJECTED:
                    info = 'appkey不正确';
                    break;
                case RongIMLib.ErrorCode.SERVER_UNAVAILABLE:
                    info = '服务器不可用';
                    break;
            }
            console.log(errorCode);
        }
    });

</script>


<link rel="stylesheet" href="/Public/static/css/order.css">
<link rel="stylesheet" href="/Public/static/css/oneself.css">
<script type="text/javascript" src="/Public/skxx/js/jquery.qrcode.min.js"></script> 
<div class="container order clear-float">
    <br/>
    <br/>
    <br/>

    <div class="status-text-b">

                <?php if($_SESSION['userid']== $orderinfo['buyid']): ?><span class="stage-text"><?php echo ($buy_stage_text); ?></span>
                    <span class="v-line"></span>
                    <span class="status-decs"><?php echo ($buy_status_decs); ?></span>
                    <?php elseif($_SESSION['userid']== $orderinfo['sellid']): ?>
                    <span class="stage-text"><?php echo ($sell_stage_text); ?></span>
                    <span class="v-line"></span>
                    <span class="status-decs"><?php echo ($sell_status_decs); ?></span><?php endif; ?>

    </div>

    <div class="order-info">
        <strong><?php echo (L("ddinfo")); ?></strong>
        <span class="item-name"><?php echo (L("jyjg")); ?>: <?php echo (round($orderinfo["price"],2)); ?> CNY</span>
        <span class="item-name"> <?php echo (L("jysl")); ?>: <?php echo ($orderinfo["num"]); ?> <?php echo (strtoupper($orderinfo['coin'])); ?></span>
        <span class="item-name"><?php echo (L("jyje")); ?>: <?php echo ($orderinfo["amount"]); ?> CNY</span>
        <?php switch($ordertype): case "0": if($_SESSION['userid']== $orderinfo['sellid']): ?><span class="item-name"><?php echo (L("sxf")); ?>: <?php echo ($orderinfo["fee"]); ?> <?php echo (strtoupper($orderinfo['coin'])); ?></span><?php endif; break;?>
            <?php case "1": if($_SESSION['userid']== $orderinfo['buyid']): ?><span class="item-name"><?php echo (L("sxf")); ?>: <?php echo ($orderinfo["fee"]); ?> <?php echo (strtoupper($orderinfo['coin'])); ?></span><?php endif; break; endswitch;?>
    </div>

    <div class="detail-left">
        <div class="chat-cont">
            <div class="chat-tab-cont clear-float">
                <a class="tab col-50 active" id="chat"><?php echo (L("lt")); ?></a>
                <a class="tab col-50" id="info"><?php echo (L("dfinfo")); ?></a>
            </div>
            <div class="tab-chat" id="chating">
                <div class="chating">
                    <?php if(is_array($chatlog)): foreach($chatlog as $key=>$v): if($v['from'] == $_SESSION['mobile']): if($v["type"] == text): ?><div class="chat ta-r">
                                       <span class="chat-message"><?php echo ($v["content"]); ?>
                                           <span class="time"><?php echo (date('H:i',$v["time"])); ?></span>
                                       </span>
                                    <img class="user-logo" src="<?php echo (getpic(session('userid'))); ?>" alt="">
                                </div>
                                <?php elseif($v['type'] == pic): ?>
                                <div class="chat ta-r">
                                       <span class="chat-message">
                                        <img src="<?php echo ($v["content"]); ?>" alt="">
                                        <span class="time"><?php echo (date('H:i',$v["time"])); ?></span>
                                       </span>
                                    <img class="user-logo" src="<?php echo (getpic(session('userid'))); ?>" alt="">
                                </div><?php endif; ?>
                            <?php elseif($v['from'] == $name['mobile']): ?>
                            <?php if($v["type"] == text): ?><div class="chat ta-l">
                                    <img class="user-logo" src="<?php echo (getpic($name['id'])); ?>" alt="">
                                    <span class="chat-message"><?php echo ($v["content"]); ?><span class="time"><?php echo (date('H:i',$v["time"])); ?></span></span>
                                </div>
                                <?php elseif($v['type'] == pic): ?>
                                <div class="chat ta-l">
                                    <img class="user-logo" src="<?php echo (getpic($name['id'])); ?>" alt="">
                                    <span class="chat-message">
                                     <img src="<?php echo ($v["content"]); ?>" alt="">
                                   <span class="time"><?php echo (date('H:i',$v["time"])); ?></span></span>
                                </div><?php endif; endif; endforeach; endif; ?>
                </div>
                <div class="btn-cont">
                    <div class="add-pic">
                        <form action="###" id="form" method="post" enctype="multipart/form-data">
                         <input type="file" accept="image/jpg,image/jpeg,image/png" class="img-input" name="file" id="image">
                        </form>
                    </div>
                    <input class="message-input" type="text" name="" value="" placeholder="<?php echo (L("sdsm")); ?>..." id="content">
                    <a type="SELL" stage="PLACED_ORDER" class="icon-send send" id="Sell"></a>
                </div>
            </div>
            <div class="tab-fellow-info hidden" id="user-info" >
                <div>
                    <img class="user-head" src="<?php echo ($name["ue_img"]); ?>">
                    <a href="<?php echo U('User/view',array('id'=>$sellinfo['id']));?>" class="user-name"><?php echo ($name["username"]); ?></a>
                </div>
                <div class="user-info ml-100">
                    <div class="info-item"><?php echo (L("jyl")); ?>: <?php echo (getcjsl($name['id'],$orderinfo['coin'])); ?> <?php echo (strtoupper($orderinfo['coin'])); ?> </div>
                    <div class="info-item"><?php echo (L("jycs")); ?>:<?php echo (getjycs($name['id'])); ?> <?php echo (L("ci")); ?></div>

                    <div class="info-item"><?php echo (L("hpd")); ?>: <?php echo (gethpl($name['id'])); ?> %</div>
                    <div class="info-item"><?php echo (L("yhcjsj")); ?>: <?php echo (date('Y-m-d H:i:s',$name["addtime"])); ?></div>
                </div>
                <div class="user-info">
                    <div class="info-item"> <?php echo (L("dhhm")); ?>: <?php echo ($name['mobile']?'已验证':'未验证'); ?></div>
                    <div class="info-item"> <?php echo (L("smrz")); ?>: <?php echo ($name['truename']?'已验证':'未验证'); ?></div>
                    <div class="info-item"> <?php echo (L("xr")); ?>: <?php echo (getxrrs($name['id'])); ?></div>
                </div>
            </div>
        </div>
    </div>

    <div class="detail-right">
        <div class="form-title">
            <span class="form-name"><?php echo (L("jycz")); ?></span>
        </div>
        <div class="line mt-20 mb-10"></div>
        <div class="font-16"><?php echo (L("ddbh")); ?></div>
        <p class="p mb-10"><?php echo ($orderinfo["id"]); ?></p>
        <div class="font-16"><?php echo (L("fkfs")); ?></div>
        <p class="p mb-10">

            <?php switch($orderinfo["fkfs"]): case "1": ?><td><?php echo (L("yhzz")); ?></td><?php break;?>
                <?php case "2": ?><td><?php echo (L("zfb")); ?></td><?php break;?>
                <?php case "3": ?><td><?php echo (L("wxzf")); ?></td><?php break;?>
                <?php case "4": ?><td><?php echo (L("qita")); ?></td><?php break; endswitch;?>

        </p>

        <div class="font-16">付款信息</div>
        <p class="p mb-10 has-height"><?php echo ($fkinfo["bank"]); ?>-<?php echo ($fkinfo["bankaddr"]); ?>-<?php echo ($fkinfo["bankcard"]); ?></p>

        <?php if(!empty($fkinfo["erweima"])): ?><div class="font-16">付款二维码</div>
			<?php if($fkinfo['is_img']): ?><img src="/Upload/<?php echo ($fkinfo["erweima"]); ?>" width="300px" height="300px" alt="">
			<?php else: ?>
              <span id="erweima"><?php echo ($fkinfo["erweima"]); ?></span><?php endif; endif; ?>


        <div class="font-16"><?php echo (L("gglyan")); ?></div>
        <p class="p mb-10 has-height"><?php echo ($intro); ?></p>

        <div class="font-16" ><?php echo (L("jyts")); ?></div>
        <p class="p tips-buyer-1" >
            1.<?php echo (L("jyts2")); echo (strtoupper($orderinfo['coin'])); echo (L("jyts3")); ?><br>2.<?php echo (L("jyts4")); ?>
        </p>
        <p class="p tips-buyer-2" style="display: none">
            <?php echo (L("jyts5")); echo (strtoupper($orderinfo['coin'])); echo (L("jyts6")); ?>
        </p>

        <div class="btn-cont" id="btn-cont">
                    <?php if($_SESSION['userid']== $orderinfo['buyid']): echo ($buy_button); ?>
                        <?php elseif($_SESSION['userid']== $orderinfo['sellid']): ?>
                        <?php echo ($sell_button); endif; ?>
        </div>

    </div>

</div>

<br/>
<br/>
<br/>
<br/>
<br/>

<div class="footer">
    <div class="container">
        <ul class="link-box clear-float">
            <li><a href="<?php echo U('user/protocol');?>">使用协议</a></li>
            <li><a href="<?php echo U('user/question');?>">常见问题</a></li>
            <li><a href="<?php echo U('user/rate');?>">费率说明</a></li>
            <li><a href="<?php echo U('user/fxq');?>">反洗钱条目</a></li>
        </ul>
    </div>
    <p class="copyright">Copyright © 2013-2017 - CHBTC.COM All Rights Reserved 京ICP备12021837号-11</p>
</div>
<script src="https://cdn.bootcss.com/fastclick/1.0.6/fastclick.min.js"></script>
<script type="text/javascript" src="/Public/static/js/main.js"></script>
</body>
</html>


<script>

     $("#erweima").qrcode({ 
		render: "table", //table方式 
		width: 300, //宽度 
		height:300, //高度 
		text: '<?php echo ($fkinfo["erweima"]); ?>' //任意内容 
    }); 

    $('#chat').click(function () {
        $('#info').removeClass('active');
        $('#user-info').addClass('hidden');
        $('#chat').addClass('active');
        $('#chating').removeClass('hidden');
    })

    $('#info').click(function () {
        $('#chat').removeClass('active');
        $('#chating').addClass('hidden');
        $('#info').addClass('active');
        $('#user-info').removeClass('hidden');
    })

    //取消
    $('#khCancel').click(function () {
        layer.confirm('您确定要取消并关闭该交易吗？如果已经向卖家付款，请不要取消交易。', {
            btn: ['确定取消','关闭窗口'] //按钮
        }, function(){
            var orderid=<?php echo ($orderinfo['id']); ?>;
            $.post('<?php echo U("Order/ordercenter");?>',{orderid:orderid},function (data) {
                if(data.status){
                    location.reload();
                } else {
                    layer.msg(data.info, {
                        icon: 2
                    });
                }
            })
        });
    });

    //付款
    $('#btnPay').click(function () {
        layer.confirm('您是否确定已付款给对方？', {
            btn: ['确定','关闭窗口'] //按钮
        }, function(){
            var orderid=<?php echo ($orderinfo['id']); ?>;
            $.post('<?php echo U("Order/bjfk");?>',{orderid:orderid},function (data) {
                if(data.status){
                    location.reload();
                } else {
                    layer.msg(data.info, {
                        icon: 2
                    });
                }
            })
        });
    });

    //释放
    $('#release').click(function () {
        layer.confirm('您是否确定已收到对方的付款？', {
            btn: ['确定','关闭窗口'] //按钮
        }, function(){
            var orderid=<?php echo ($orderinfo['id']); ?>;
            $.post('<?php echo U("Order/shifang");?>',{orderid:orderid},function (data) {
                if(data.status){
                    location.reload();
                } else {
                    layer.msg(data.info, {
                        icon: 2
                    });
                }
            })
        });
    });


    /*评论*/
    $(document).on('click','#btnComment',function () {
        var orderid=<?php echo ($orderinfo['id']); ?>;
        var feedback=$("input[name='feedback']:checked").val();
        $.post('<?php echo U("Order/pinglun");?>',{orderid:orderid,feedback:feedback},function (data) {
            if(data.status){
                location.reload();
            } else {
                layer.msg(data.info, {
                    icon: 2
                });
            }
        })
    });

    /*申诉*/
    $('#btnshensu').click(function () {
        layer.confirm('您是否确定申诉？', {
            btn: ['确定','关闭窗口'] //按钮
        }, function(){
            var orderid=<?php echo ($orderinfo['id']); ?>;
            $.post('<?php echo U("Order/shensu");?>',{orderid:orderid},function (data) {
                if(data.status){
                    location.reload();
                } else {
                    layer.msg(data.info, {
                        icon: 2
                    });
                }
            });
        });
    });

    /*ajax轮询*/
    window.onload = function() {
        oTimer = setInterval("change()",5000);
    }
    function change(){
        var orderid=<?php echo ($orderinfo['id']); ?>;
        $.post("<?php echo U('Order/orderstatus');?>",{orderid:orderid},function (data) {
            if(data.status){
                if(data.info==1){
                    $('.stage-text').text('已付款');
                    $('.status-decs').text('等待卖家确认收款后释放BTC');
                }
                if(data.info==2){
                       <?php if($_SESSION['userid']== $orderinfo['buyid']): ?>if($('.stage-text').text()=='已付款'){
                            $('.stage-text').text('已收货');
                            $('.status-decs').text('请对交易做出评价。');
                            $('#btn-cont').html('<div class="comment" style="color: #0a0a0a">对用户<strong><?php echo ($name["username"]); ?></strong>留下评论?</div>'+
                            '<div class="radio-cont">'+
                            '<div class="fl"><input type="radio" checked name="feedback" value="POSITIVE" id="POSITIVE"><label for="POSITIVE">好评</label></div>'+
                             ' <div class="fm"><input type="radio" name="feedback" value="NEUTRAL" id="NEUTRAL"><label for="NEUTRAL">中评</label></div>'+
                             '<div class="fr"><input type="radio" name="feedback" value="NEGATIVE" id="NEGATIVE"><label for="NEGATIVE">差评</label></div>'+
                             '</div><a class="btn" id="btnComment">提交评论</a>');
                            }<?php endif; ?>

                }
                if(data.info==3){
                    $('.stage-text').text('已结束');
                    $('.status-decs').text('交易成功，双方已评价。');
                    $('#btn-cont').html('');
                }

                if(data.info==4){
                    $('.stage-text').text('已取消');
                    $('.status-decs').text('交易已经取消。');
                    $('#btn-cont').html('');
                }

                if(data.info==5){
                    $('.stage-text').text('已申诉');
                    $('.status-decs').text('交易正在申诉');
                    $('#btn-cont').html('<a  class="btn" style="background: #31b0d5">申诉中</a>');
                }

                if(data.info==6){
                    $('.stage-text').text('已关闭');
                    $('.status-decs').text('此交易已超时关闭');
                    $('#btn-cont').html('');
                }
            }
        })
    }
</script>

<script>
    // 消息监听器
    RongIMClient.setOnReceiveMessageListener({
        // 接收到的消息
        onReceived: function (message) {
            // 判断消息类型
            switch(message.messageType){
                case RongIMClient.MessageType.TextMessage:
                    if(message.senderUserId == <?php echo ($name["id"]); ?>){
                    if(message.content.extra>Math.round(new Date().getTime()/1000)-3) {
                        var mydate2 = new Date();
                        var time2 = mydate2.getHours();
                        time2 += ':' + mydate2.getMinutes();
                        $('.chating').append('<div class="chat ta-l"> <img class="user-logo" src="<?php echo (getpic($name["id"])); ?>" alt="" /> <span class="chat-message">' + message.content.content + '<span class="time">' + time2 + '</span></span></div>');
                        $('.chating')[0].scrollTop = $('.chating')[0].scrollHeight;
                    }
                }
                    break;

                case RongIMClient.MessageType.ImageMessage:
                    // message.content.imageUri => 原图 URL。
                    if(message.senderUserId == <?php echo ($name["id"]); ?>)
                        {
                            if(message.content.extra>Math.round(new Date().getTime()/1000)-3) {
                                var mydate4 = new Date();
                                var time4 = mydate4.getHours();
                                time4 += ':' + mydate4.getMinutes();
                                $('.chating').append('<div class="chat ta-l"> <img class="user-logo" src="<?php echo (getpic($name["id"])); ?>" alt="" /> <span class="chat-message"><img src="' + message.content.imageUri + '" alt=""><span class="time">' + time4 + '</span></span></div>');
                                $('.chating')[0].scrollTop = $('.chating')[0].scrollHeight;
                            }
                        }
                    break;
                default:
                // do something...
            }
        }
    });
    function getMessage(content){
        // 定义消息类型,文字消息使用 RongIMLib.TextMessage

        var msg = new RongIMLib.TextMessage({content:content,extra:Math.round(new Date().getTime()/1000)});
        var conversationtype = RongIMLib.ConversationType.PRIVATE; // 私聊
        var targetId = "<?php echo ($name['id']); ?>"; // 目标 Id
        RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                onSuccess: function (message) {
                    $.post('<?php echo U("Order/chatlog");?>',{
                        from: '<?php echo (session('mobile')); ?>',
                        to: '<?php echo ($name["mobile"]); ?>',
                        content : content,
                        type : 'text',
                        order_id : '<?php echo ($orderinfo["id"]); ?>',
                    },function (data) {
                        if(data.status){
                            var mydate = new Date();
                            var time1=mydate.getHours();
                            time1+=':'+mydate.getMinutes();
                            $('.chating').append('<div class="chat ta-r"><span class="chat-message">'+content+'<span class="time">'+time1+'</span></span> <img class="user-logo" src="<?php echo (getpic(session('userid'))); ?>" alt=""></div>');
                            $("#content").val("").focus();
                            $('.chating')[0].scrollTop=$('.chating')[0].scrollHeight;
                        } else {
                            layer.msg(data.info, {
                                icon: 2
                            });
                        }
                    });
                },
                onError: function (errorCode, message) {
                    var info = '';
                    switch (errorCode) {
                        case RongIMLib.ErrorCode.TIMEOUT:
                            info = '超时';
                            break;
                        case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                            info = '未知错误';
                            break;
                        case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                            info = '在黑名单中，无法向对方发送消息';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                            info = '不在讨论组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_GROUP:
                            info = '不在群组中';
                            break;
                        case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                            info = '不在聊天室中';
                            break;
                        default :
                            info = "x";
                            break;
                    }
                }
            }
        );
    }


    $('#Sell').click(function () {
        var content = $('#content').val();
        if(content == ''){
            layer.msg('发送消息不能为空', {
                icon: 2
            });
            return false;
        } else {
            getMessage(content);
        }

    });

    /*回车发送消息*/
    $("#content").keydown(function(event){
        if(event.keyCode==13){
            $("#Sell").click();
        }
    })

    $("#image").change(function  () {
        var formData = new FormData($("#form")[0]);
        formData.append('from',<?php echo (session('mobile')); ?>);
        formData.append('to',<?php echo ($name["mobile"]); ?>);
        formData.append('order_id',<?php echo ($orderinfo["id"]); ?>);
        formData.append('type','pic');
        $.ajax({
            url: "<?php echo U('Order/chatlog');?>",
            type: 'POST',
            data: formData,
            async: false,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                var imageUri = data.info; // 上传到自己服务器的 URL。
                var msg = new RongIMLib.ImageMessage({imageUri:imageUri,extra:Math.round(new Date().getTime()/1000)});
                var conversationtype = RongIMLib.ConversationType.PRIVATE; // 单聊,其他会话选择相应的消息类型即可。
                var targetId = "<?php echo ($name["id"]); ?>"; // 目标 Id
                RongIMClient.getInstance().sendMessage(conversationtype, targetId, msg, {
                        onSuccess: function (message) {
                            //message 为发送的消息对象并且包含服务器返回的消息唯一Id和发送消息时间戳
                            if(data.status){
                                var mydate3 = new Date();
                                var time3=mydate3.getHours();
                                time3+=':'+mydate3.getMinutes();
                                $('.chating').append('<div class="chat ta-r"><span class="chat-message"><img src="'+imageUri+'" alt=""><span class="time">'+time3+'</span></span> <img class="user-logo" src="<?php echo (getpic(session('userid'))); ?>" alt=""></div>');
                                $('.chating')[0].scrollTop=$('.chating')[0].scrollHeight;
                            } else {
                                layer.msg(data.info, {
                                    icon: 2
                                });
                            }
                            console.log("Send successfully");
                        },
                        onError: function (errorCode,message) {
                            var info = '';
                            switch (errorCode) {
                                case RongIMLib.ErrorCode.TIMEOUT:
                                    info = '超时';
                                    break;
                                case RongIMLib.ErrorCode.UNKNOWN_ERROR:
                                    info = '未知错误';
                                    break;
                                case RongIMLib.ErrorCode.REJECTED_BY_BLACKLIST:
                                    info = '在黑名单中，无法向对方发送消息';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_DISCUSSION:
                                    info = '不在讨论组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_GROUP:
                                    info = '不在群组中';
                                    break;
                                case RongIMLib.ErrorCode.NOT_IN_CHATROOM:
                                    info = '不在聊天室中';
                                    break;
                                default :
                                    info = x;
                                    break;
                            }
                            console.log('发送失败:' + info);
                        }
                    }
                );
            },
            error: function (data) {

            }
        });

    });
</script>