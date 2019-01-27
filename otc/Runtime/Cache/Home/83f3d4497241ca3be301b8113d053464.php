<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>
<html>
<head>
    <title>注册</title>
    <meta charset=utf-8"utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta name="keywords" content="coincola, bitcoin, Bitcoin, OTC, CoinCola, 比特币,  场外交易, 比特币买卖, p2p, 区块链, blockchain, localbitcoins">
    <meta name="description" content="一个自由买卖安全可信赖的比特币交易平台">
    <link rel="shortcut icon" href="/static/imgs/favicon.ico" type="image/x-icon" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="renderer" content="webkit">
    <meta name="keywords" content="coincola, bitcoin, Bitcoin, OTC, CoinCola, 比特币,  场外交易, 比特币买卖, p2p, 区块链, blockchain, localbitcoins">
    <meta name="description" content="一个自由买卖安全可信赖的比特币交易平台">
    <link rel="shortcut icon" href="/static/imgs/favicon.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/Public/static/css/common_2aed4bc732.css" >
    <link rel="stylesheet" href="/Public/static/css/signup_300e4ac5b5.css" >
    <link rel="stylesheet" href="/Public/static/css/oneself.css" >
    <link rel="stylesheet" type="text/css" href="/Public/static/iconfont/iconfont.css">
    <link rel="stylesheet" type="text/css" href="/Public/static/iconfont2/iconfont.css">
    <script src="/Public/jquery/jquery.min.js"></script>
    <script src="/Public/layui/layer.js"></script>
    <style>
    .lang-box .currL {
    padding: 21px 14px;
}
        .lang-box ul {
  
     position: relative; 

   top: -16px;
    
}


    </style>
</head>
<body class="">
<div class="header header-xl">
    <div class="container clear-float">
        <div class="logo-wrap">
            <img src="/Public/static/imgs/logo.png">
        </div>
        <div class="nav clear-float fl">
            <a class="nav-item" href="/" ><?php echo (L("shouy")); ?></a>
            <a class="nav-item" href="/Buy"><?php echo (L("gm")); ?></a>
            <a class="nav-item" href="/Sell" ><?php echo (L("chushou")); ?></a>
        </div>
       <!-- <div class="fl lang-box">
                <span class="currL"><span class="jianti">简体中文</span> <i class="iconfont">&#xe600;</i></span>
                <ul>
                    <li><a href="?l=zh-cn" id="zh-cn">简体中文</a></li>
                    <li><a href="?l=en-us" id="en-us">English</a></li>
                    <li><a href="?l=zh-hk" id="zh-hk">繁體中文</a></li>
                </ul>
        </div> -->
        <div class="clear-float fr login-box login-panel">
            <a class="user-action" href="/Login/phone"><span class="sp iconfont">&#xe6c9;</span><span class="va-middle"><?php echo (L("denglu")); ?></span></a>
        </div>
        <div class="opt">
            <div class="opt-line"></div>
            <div class="opt-line"></div>
            <div class="opt-line"></div>
        </div>
    </div>
</div>
<div class="pt-20 login-form clear container">
    <div class="form-cont">
        <div class="form-title mb-20">
            <span class="form-name"><?php echo (L("shoujizc")); ?> </span>
        </div>

        <div class="input-cont new-username">
            <!-- <span class="icon form-username"></span> -->
            <input class="input" validate check-type="username" type="text" name="name" placeholder="<?php echo (L("yyxm")); ?>" onblur="regusername()">
            <div class="form-tips"></div>
            <div class="error-msg"><?php echo (L("eryyxm")); ?></div>
        </div>
        <div class="input-cont new-phone">
            <!-- <span class="icon form-phone"></span> -->
            <input class="input" validate type="phone" check-type="phone" name="mobile" placeholder="<?php echo (L("sjh")); ?>" onblur="regusermobile()">
            <div class="form-tips"></div>
            <div class="error-msg"><?php echo (L("geshi")); ?></div>
        </div>
      <!--  <div class="input-cont new-token">
            &lt;!&ndash; <span class="icon form-token"></span> &ndash;&gt;
            <input class="input" validate check-type="one_time_code" type="number" name="one_time_code" placeholder="<?php echo (L("yzm")); ?>" onblur="regusecoder()">
            <div class="form-tips"></div>
            <div class="error-msg"><?php echo (L("cd")); ?></div>
            <button class=" link get-token" id="sendcode" onclick="SendCode()" ><?php echo (L("fsyzm")); ?></button>
        </div>-->
        <div class="input-cont">
            <!-- <span class="icon form-password"></span> -->
            <input class="input" validate onfocus="this.type='password'" check-type="password" name="password" autocomplete="off" placeholder="<?php echo (L("dlgs")); ?>" onblur="regusepassword()">
            <div class="form-tips"></div>
            <div class="error-msg"><?php echo (L("cwts")); ?></div>
        </div>
        <div class="input-cont">
            <!-- <span class="icon form-password"></span> -->
            <input class="input" validate onfocus="this.type='password'"  name="quepassword" autocomplete="off" placeholder="<?php echo (L("qrdlmm")); ?>" onblur="regusepassword1()">
            <div class="form-tips"></div>
            <div class="error-msg"><?php echo (L("lcmmbyz")); ?></div>
        </div>
        <div class="input-cont">
            <input class="input" type="text" validate  name="ref" autocomplete="off" placeholder="邀请码" value="<?php echo ($ref); ?>">
        </div>
        <div class="input-cont mb-30">
            <input type="checkbox" class="checkbox" name="confirm">
            <label class="label"><?php echo (L("wyjs")); ?><a href="<?php echo U('User/protocol');?>" class=link><?php echo (L("btdb")); ?></a></label>
        </div>
        <a href="javascript:;" class="btn submit "><?php echo (L("zhuce")); ?></a>
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
    <p class="copyright">Copyright © 2013-2017 - CHBTC.COM All Rights Reserved 京ICP备12021837号-11</p>
</div>
<script src="https://cdn.bootcss.com/fastclick/1.0.6/fastclick.min.js"></script>
<script type="text/javascript" src="/Public/static/js/main.js"></script>
</body>
</html>



</body>
</html>
<script>
     // 中英文切换

  $('.lang-box .currL').click(function(){
    $(this).next().slideToggle();

});

    $('.lang-box ul li a').click(function(){
    var la =$(this).attr('id');
    console.log(la)
    if(la=="zh-cn"){
        sessionStorage.setItem('zy','简体中文')
    }else if(la=="en-us") {
        sessionStorage.setItem('zy','English')
    }else if(la=="zh-hk") {
       sessionStorage.setItem('zy','繁體中文')
    }
    $('.currL').text($(this).children().text())
})
$(function () {
       var txt='简体中文';

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
    function regusername() {
        var mbtest_name = /^[a-zA-z]{4,16}$/;
        if (mbtest_name.test($("input[name=name]").val())) {
            $("input[name=name]").next().next().css('display','none');
            return true;
        } else {
            $("input[name=name]").next().next().css('display','block');
           return false;
        }
    }
    function regusermobile() {
        var mbtest_mobile = /^\w+@\w+\.\w+(\.\w+)*$/;
        if (mbtest_mobile.test($("input[name=mobile]").val())) {
            $("input[name=mobile]").next().next().css('display','none');
            return true;
        } else {
            $("input[name=mobile]").next().next().html('邮箱格式错误');
            $("input[name=mobile]").next().next().css('display','block');
            return false;
        }
    }

    function regusepassword() {
        var mbtest_password = /^[a-zA-Z0-9]{6,21}$/;
        if (mbtest_password.test($("input[name=password]").val())) {
            $("input[name=password]").next().next().css('display','none');
            return true;
        } else {
            $("input[name=password]").next().next().css('display','block');
            return false;
        }
    }

    function regusepassword1() {
        var psd = $("input[name=password]").val();
        var psd2 = $("input[name=quepassword]").val();
        if (psd == psd2) {
            $("input[name=quepassword]").next().next().css('display','none');
            return true;
        } else {
            $("input[name=quepassword]").next().next().css('display','block');
            return false;
        }
    }


    $(".submit").click(function(){
       var name=$("input[name=name]").val();
       var mobile=$("input[name=mobile]").val();
       var password=$("input[name=password]").val();
       var password1=$("input[name=quepassword]").val();
       var ref=$("input[name=ref]").val();

        if(!regusername()){
            return false;
        }
        if(!regusermobile()){
            return false;
        }

        if(!regusepassword()){
            return false;
        }

        if(!regusepassword1()){
            return false;
        }

        if(!$('[name=confirm]').is(':checked')) {
            layer.alert('请勾选服务条款');
            return false;
        }

        $.post("<?php echo U('Signup/register');?>",{name:name,mobile:mobile,password:password,password1:password1,ref:ref},function(data){
              if(data.status){
                  layer.msg(data.info);
                  setTimeout("location.href='/Login/phone'",1000);
              }else{
                  layer.msg(data.info);
              }
        },'json')

    });

      $('.opt').on('click',function(){
        $(this).siblings('.nav').slideToggle()
    })

</script>