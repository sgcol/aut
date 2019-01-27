<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2017/9/21
 * Time: 10:23
 */
return array(
//app_begin这个行为标签，其实就是tp的内置标签，作用是在tp初始化的时候，触发某个行为，在这里设置当然是触发多语言的功能了
    'app_begin' => array('Behavior\CheckLangBehavior'),//开启语言功能
);