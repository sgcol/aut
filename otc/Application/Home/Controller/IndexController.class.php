<?php
namespace Home\Controller;

class IndexController extends HomeController
{

    public function index()
    {

        /*首页显示*/
        $buyad=M('newad')->where('ad_type=0 and coin="usdt"')->order('price')->limit(2)->select();

        $sellad=M('newad')->where('ad_type=1 and coin="usdt"')->order('price')->limit(2)->select();

        $this->assign('buyad', $buyad);

        $this->assign('sellad', $sellad);

        $this->display();
    }
}
