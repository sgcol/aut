<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>担保比特币-自由买卖安全可信赖的比特币交易平台 - 一个自由买卖安全可信赖的比特币交易平台</title>
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
<div class="header zh-CN" style="background: none;box-shadow: 0 0 0 #000;margin-bottom: 0;background: #fff;">
    <div class="header-box container clear-float">
        <div class="logo-wrap">
            <img src="/Public/static/imgs/logo.png">
        </div>
        <div class="nav fl">
            <ul>
                <li><a class="nav-item " href="<?php echo U('Index/index');?>" ><?php echo (L("shouy")); ?></a><li>
                <li><a href="/Buy" class="nav-item"><?php echo (L("gm")); ?></a></li>
                <li><a href="/Sell" class="nav-item " ><?php echo (L("chushou")); ?></a></li>
                <li><a class="nav-item " href="/Newad" ><?php echo (L("fbgong")); ?></a></li>
                <li><a class="nav-item" href="<?php echo U('Activities/index');?>">推广专区</a></li>
            </ul>
        </div>
       
        <div class="clear-float fr login-panel" <?php if(!empty($sessioninfo["userid"])): ?>style="display:none"<?php endif; ?>>
        <a class="user-action" href="/Signup/phone"><span class="sp iconfont">&#xe6c9;</span><span class="va-middle"> <?php echo (L("zhuce")); ?></span></a>
        <a class="user-action btn-login" href="/login/phone" ><span class="sp iconfont">&#xe6c9;</span><span class="va-middle"><?php echo (L("denglu")); ?></span></a>
        </div>
		
		
		
    <div class="clear-float fr my-panel" <?php if(empty($sessioninfo["userid"])): ?>style="display:none"<?php endif; ?>>
    <div  class="item">
        <a href="<?php echo U('Order/lists');?>" class="item-label"><span class="iconfont">&#xe613;</span> <span><?php echo (L("dingdan")); ?></span> <span class="message-count" style="display: none"></span> <!-- <span class="iconfont arrow">&#xe601;</span> --></a>
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
	
	
	
    <div class="item last-item" >
        <a href="javascript:void(0)" class="item-label"><span class="iconfont">&#xe6c9;</span> <span class="username"><?php echo ($sessioninfo["username"]); ?></span> <span class="iconfont arrow">&#xe601;</span></a>
        <div class="item-more item-my">
            <a class="link" href="<?php echo U('Setting/userinfo');?>" ><?php echo (L("yhzx")); ?></a>
            <!-- <a class="link" href="/manage/order-sell">我的交易</a> -->
            <a class="link" href="<?php echo U('Manage/adsell');?>"><?php echo (L("mygg")); ?></a>
            <a class="link" id="logout" href="<?php echo U('Login/loginout');?>"><?php echo (L("tuichu")); ?></a>
        </div>
    </div>
	
</div>

      <!--  <div class="fl lang-box">
                <span class="currL"><span class="jianti">简体中文</span> <i class="iconfont">&#xe600;</i></span>
                <ul>
                    <li><a href="?l=zh-cn" id="zh-cn">简体中文</a></li>
                    <li><a href="?l=en-us" id="en-us">English</a></li>
                    <li><a href="?l=zh-hk" id="zh-hk">繁體中文</a></li>
                </ul>
        </div> -->

<div class="opt">
    <div class="opt-line"></div>
    <div class="opt-line"></div>
    <div class="opt-line"></div>
</div>
</div>
</div>
<div class="swiper-container">
    <div class="swiper-wrapper">
        <div class="swiper-slide banner1 ta-c">
            <h1 class="h1"><?php echo (L("kuaijie")); ?></h1>

        </div>
        <div class="swiper-slide banner2 ta-c">
            <div class="h1"><strong><?php echo (L("yqhy")); ?></strong><?php echo (L("zuoxiang")); ?></div>
            <div class="decs"><?php echo (L("haoyou")); ?>：<?php echo (L("fanxian")); ?></div>
            <a href="../login/phone-backto=-activities-invite.htm" ><?php echo (L("liji")); ?></a>
        </div>
    </div>
    <div class="swiper-pagination"></div>
</div>

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
       // 中英文切换

  $('.lang-box .currL').click(function(){
    $(this).next().slideToggle();

});

    $('.lang-box ul li a').click(function(){
    var la =$(this).attr('id');
    console.log(la)
    if(la=="zh-cn"){

        console.log(1)
        // $('.currL').text('简体中文')
       // $.cookies.set('zy','简体中文')
        sessionStorage.setItem('zy','简体中文')
    }else if(la=="en-us") {
         //alert(123);
        // $('.currL').text('English')
        //$.cookies.set('zy','English')
       // $.setItem('zy','English')
        sessionStorage.setItem('zy','English')
    }else if(la=="zh-hk") {
         //alert(456);
        // $('.currL').text('English')
       // $.cookies.set('zy','繁體中文')
       sessionStorage.setItem('zy','繁體中文')
    }
    $('.currL').text($(this).children().text())
})
$(function () {
       var txt='简体中文';
      // var zy=$.cookies.get("zy");
      //var zy=$.cookies.get('zy');
    var zy=sessionStorage.getItem('zy');
       console.log(zy);
       if (zy!="" && zy!=null)
       {
           txt = zy;
       }
       $('.jianti').text(txt);
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
                    // message.content.content => 消息内容
                    break;
                case RongIMClient.MessageType.VoiceMessage:
                    // 对声音进行预加载
                    // message.content.content 格式为 AMR 格式的 base64 码
                    break;
                case RongIMClient.MessageType.ImageMessage:
                    // message.content.content => 图片缩略图 base64。
                    // message.content.imageUri => 原图 URL。
                    break;
                case RongIMClient.MessageType.DiscussionNotificationMessage:
                    // message.content.extension => 讨论组中的人员。
                    break;
                case RongIMClient.MessageType.LocationMessage:
                    // message.content.latiude => 纬度。
                    // message.content.longitude => 经度。
                    // message.content.content => 位置图片 base64。
                    break;
                case RongIMClient.MessageType.RichContentMessage:
                    // message.content.content => 文本消息内容。
                    // message.content.imageUri => 图片 base64。
                    // message.content.url => 原图 URL。
                    break;
                case RongIMClient.MessageType.InformationNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ContactNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.ProfileNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandNotificationMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.CommandMessage:
                    // do something...
                    break;
                case RongIMClient.MessageType.UnknownMessage:
                    // do something...
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



<div class="item-box container">
    <div class="trade-info clearfix">
        <h4 class="fl"><?php echo (L("jyxx")); ?></h4>
        <span class="fl service-time"><?php echo (L("fuwu")); ?></span>
    </div>

    <div class="cols mt-30">
        <div class="clear-float">
            <?php if(is_array($buyad)): foreach($buyad as $key=>$v): ?><div class="item-card fl">
                    <div class="user-info fl user-info1">
                        <div class="user-head-cont">
                            <img src="<?php echo (getpic($v["userid"])); ?>" alt="buy-bitcoin-user-0" class="user-head">
                            <span class="user-status ONLINE"></span>
                        </div>
                        <div class="user-name ta-c"></div>
                        <div class="info-cont ta-c">
                            <div class="item">
                                <div class="text1"><?php echo (getjycs($v["userid"])); ?></div>
                                <div class="text2"><?php echo (L("jiaoyics")); ?></div>
                            </div>
                            <div class="item">
                                <div class="text1"><?php echo (gethpl($v["userid"])); ?>%</div>
                                <div class="text2"><?php echo (L("hpd")); ?></div>
                            </div>
                        </div>
                    </div>
                    <div class="item-info fr ta-c item-info1">
                        <div class="item-text"><?php echo (L("jyjg")); ?>:&nbsp; <span><?php echo ($v["price"]); ?></span>&nbsp;CNY</div>
                        <div class="item-text"><?php echo (L("fkfs")); ?>:&nbsp;
                            <?php switch($v["provider"]): case "1": ?><td><?php echo (L("yhzz")); ?></td><?php break;?>
                                <?php case "2": ?><td><?php echo (L("zfb")); ?></td><?php break;?>
                                <?php case "3": ?><td><?php echo (L("wxzf")); ?></td><?php break;?>
                                <?php case "4": ?><td><?php echo (L("qita")); ?></td><?php break; endswitch;?>
                        </div>
                        <a href="<?php echo U('Addetail/index',array('adid'=>$v['id']));?>"  class="btn"><?php echo (L("gm")); ?></a>
                    </div>
                </div><?php endforeach; endif; ?>
            <?php if(is_array($sellad)): foreach($sellad as $key=>$v): ?><div class="item-card fl">
                    <div class="item-info fl ta-c item-info2">
                        <div class="item-text"><?php echo (L("jyjg")); ?>: <span><?php echo ($v["price"]); ?></span> CNY</div>
                        <div class="item-text"><?php echo (L("fkfs")); ?>:
                            <?php switch($v["provider"]): case "1": ?><td><?php echo (L("yhzz")); ?></td><?php break;?>
                                <?php case "2": ?><td><?php echo (L("zfb")); ?></td><?php break;?>
                                <?php case "3": ?><td><?php echo (L("wxzf")); ?></td><?php break;?>
                                <?php case "4": ?><td><?php echo (L("qita")); ?></td><?php break; endswitch;?>
                        </div>
                        <a href="<?php echo U('Addetail/index',array('adid'=>$v['id']));?>"  class="btn"><?php echo (L("chushou")); ?></a>
                    </div>
                    <div class="user-info fl user-info2">
                        <div class="user-head-cont">
                            <img src="<?php echo (getpic($v["userid"])); ?>" alt="buy-bitcoin-user-0" class="user-head">
                            <span class="user-status ONLINE"></span>
                        </div>
                        <div class="info-cont ta-c">
                            <div class="item">
                                <div class="text1"><?php echo (getjycs($v["userid"])); ?></div>
                                <div class="text2"><?php echo (L("jiaoyics")); ?></div>
                            </div>
                            <div class="item">
                                <div class="text1"><?php echo (gethpl($v["userid"])); ?>%</div>
                                <div class="text2"><?php echo (L("hpd")); ?></div>
                            </div>
                        </div>
                    </div>

                </div><?php endforeach; endif; ?>
        </div>
    </div>
    <div class="more-link"><span><?php echo (L("zydzc")); ?></span>&nbsp;&nbsp;&nbsp;<a href="<?php echo U('Buy/index');?>"><?php echo (L("gdjy")); ?></a></div>
</div>

<div class="site-info">
    <div class="container cols clear-float">
        <div class="site-item">
            <img src="/Public/static/imgs/index/ico1.png">
            <div class="desc"><?php echo (L("ziyoumaim")); ?></div>
        </div>

        <div class="site-item">
            <img src="/Public/static/imgs/index/ico2.png">
            <div class="desc"><?php echo (L("anquan")); ?></div>
        </div>

        <div class="site-item">
            <img src="/Public/static/imgs/index/ico3.png">
            <div class="desc"><?php echo (L("dinfo")); ?></div>
        </div>

    </div>
</div>

<div class="footer">
    <div class="container">
        <ul class="link-box clear-float">
            <li><a href="<?php echo U('user/protocol');?>">使用协议</a></li>
            <li><a href="<?php echo U('user/question');?>">常见问题</a></li>
            <li><a href="<?php echo U('user/rate');?>">费率说明</a></li>
            <li><a href="<?php echo U('user/fxq');?>">反洗钱条目</a></li>
        </ul>
    </div>
    <p class="copyright">Copyright © 2013-2017 - All Rights Reserved</p>
</div>
<script src="https://cdn.bootcss.com/fastclick/1.0.6/fastclick.min.js"></script>
<script type="text/javascript" src="/Public/static/js/main.js"></script>
</body>
</html>