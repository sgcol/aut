<?php    header("Content-Type: text/html;charset=utf-8");    define('APP_PATH', './Application/');    define('RUNTIME_PATH', './Runtime/');    define('DATABASE_PATH', './Database/');    define('COIN_PATH', './Coin/');    define('UPLOAD_PATH', './Upload/');    define('DB_TYPE', 'mysql');    define('DB_PORT', '3306');    define('APP_DEMO',0);	    define('M_DEBUG',1);	    define('ADMIN_KEY', 'linsion');    define('DIR_SECURE_CONTENT', 'deny Access!');    require './ThinkPHP/thbtc.php';                