<?php
return array(
    //'配置项'=>'配置值
    'URL_ROUTER_ON'   => true,
    'URL_ROUTE_RULES'=>array(
        'market/list' => 'market/lists',
        'user/balance/:id' => 'user/balance',
        'user/allorders/:id' => 'user/allorders',
    ),

);
