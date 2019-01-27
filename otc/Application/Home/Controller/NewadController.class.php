<?php

namespace Home\Controller;

class NewadController extends HomeController
{
    public function index()
    {
        if (!session('userid')) {
            redirect(U('Login/phone'));
        }
        $usdtcoin = M('Coin')->where(['name'=>'usdt'])->find();
        if (IS_POST) {
            $userid=session('userid');
            $trade_type=I('post.trade_type/s');
            if ($trade_type=='ONLINE_SELL') {
                $trade_type=0;
            } elseif ($trade_type=='ONLINE_BUY') {
                $trade_type=1;
            } else {
                $this->error('错误');
            }


            $currency=I('post.currency/s');
            if ($currency!='cny') {
                $this->error('错误');
            }

            $price=I('post.price');


            if ($price=='' || $price<$usdtcoin['min_price'] || $price>$usdtcoin['max_price']) {
                $this->error('价格必须在'.$usdtcoin['min_price'].'CNY-'.$usdtcoin['max_price'].'CNY之间');
            }

            if (!preg_match("/^([1-9]\d*|0)(\.\d{1,2})?$/", $price)) {
                $this->error('价格填写错误');
            }

            $min_amount=I('post.min_amount');
            if ($min_amount=='' || $min_amount<10) {
                $this->error('最小限额不能低于10');
            }

            if (!preg_match("/^[1-9][0-9]*$/", $min_amount)) {
                $this->error('最小限额不能为小数');
            }

            $provider=I('post.provider');
            if ($provider=='') {
                $this->error('收款方式错误');
            }

            $userbank = M('User_bank')->where(['userid'=>$userid,'type'=>$provider])->find();
            if ($provider=='bank') {
                if(!$userbank) {
                    $this->error('请先绑定银行卡的收款方式', U('setting/skxx'));
                }
                $provider=1;
            } elseif ($provider=='alipay') {
                if(!$userbank) {
                    $this->error('请先绑定支付宝的收款方式', U('setting/skxx'));
                }
                $provider=2;
            } elseif ($provider=='weixin') {
                if(!$userbank) {
                    $this->error('请先绑定微信的收款方式', U('setting/skxx'));
                }
                $provider=3;
            } else {
                $this->error('收款方式错误');
            }

            $message=I('post.message/s');

            $coin=I('post.coin');
            if (!$coin) {
                $this->error('错误');
            }

            $coininfo=M('coin')->where(array('name'=>$coin))->find();
            if (!$coininfo) {
                $this->error('错误');
            }

            $data['userid']=$userid;
            $data['ad_type']=$trade_type;
            $data['currency']=$currency;
            $data['price']=$price;
            $data['min_amount']=$min_amount;
            if ($trade_type) {
                $data['paytime']=5;
            }
            $data['provider']=$provider;
            $data['message']=$message;
            $data['status']=1;
            $data['coin']=strtolower($coin);
            $data['addtime']=time();
            $re=M('newad')->add($data);
            if ($re) {
                $this->success('广告发布成功');
            } else {
                $this->error('广告发布失败');
            }
        } else {

            $this->assign('usdtcoin', $usdtcoin);
            $this->display();
        }
    }
}
