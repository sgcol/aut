<?php



return array(

	'DB_TYPE'              => 'mysql',

	'DB_HOST'              => '127.0.0.1',

	'DB_NAME'              => 'usdt',

	'DB_USER'              => 'root',

	'DB_PWD'               => '123456qwe',

	'DB_PORT'              => '3306',

	'DB_PREFIX'            => 'cy_',

	'ACTION_SUFFIX'        => '',

	'MULTI_MODULE'         => true,

	'MODULE_DENY_LIST'     => array('Common', 'Runtime'),

	'MODULE_ALLOW_LIST'    => array('Home','admin','Api'),

	'DEFAULT_MODULE'       => 'Home',

	'URL_CASE_INSENSITIVE' => false,

	'URL_MODEL'            => 2,

	'URL_HTML_SUFFIX'      => 'html',

	'UPDATE_PATH'          => './Database/Update/',

	'CLOUD_PATH'           => './Database/Cloud/',

    'RONG_IS_DEV'            => true,//是否是在开发中
    'RONG_DEV_APP_KEY'       => 'p5tvi9dsphor4', //融云开发环境下的key
    'RONG_DEV_APP_SECRET'    => 'diYwzcz5kB6C6', //融云开发环境下的SECRET
    'RONG_PRO_APP_KEY'       => '', //融云生产环境下的key
    'RONG_PRO_APP_SECRET'    => '', //融云生产环境下的SECRET
    'LANG_SWITCH_ON'  => true,    //开启多语言支持开关
    'DEFAULT_LANG'    => 'zh-cn',  // 默认语言
    'LANG_LIST'    => 'en-us,zh-cn,zh-hk', // 允许切换的语言列表 用逗号分隔
    'LANG_AUTO_DETECT'  => true,  // 自动侦测语言
    'VAR_LANGUAGE'     => 'l', // 默认语言切换变量
	
	'EMAIL_FROM_NAME'        => '18USDT',   // 发件人
	'EMAIL_SMTP'             => 'smtp.qq.com',   // smtp
	'EMAIL_USERNAME'         => '1059506929@qq.com',   // 账号
	'EMAIL_PASSWORD'         => 'saqgygxgqnngbeia',   // 密码  注意: 163和QQ邮箱是授权码；不是登录的密码
	'EMAIL_SMTP_SECURE'      => 'ssl',   // 链接方式 如果使用QQ邮箱；需要把此项改为  ssl
	'EMAIL_PORT'             => '465', // 端口 如果使用QQ邮箱；需要把此项改为  465
	);

?>