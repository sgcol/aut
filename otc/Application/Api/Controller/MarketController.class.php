<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/12/21
 * Time: 9:14
 */

namespace Api\Controller;




class MarketController extends IndexController {

    /**
     * 列出所有交易
     */
     public function lists(){
		
          $sellOrBuy = I('get.sellorbuy');
          $coinType = I('get.cointype');
          $newad = M('newad a');
          if($sellOrBuy) {
              if(strtolower($sellOrBuy) == 'sell') {
                  $newad->where(array('ad_type'=>1));
              } elseif(strtolower($sellOrBuy) == 'buy') {
                  $newad->where(array('ad_type'=>0));
              } else {
                  $err = ['errno'=>100001,'message'=>'参数错误'];
                  $data['err'] = $err;
                  $this->ajaxReturn($data);
                  exit();
              }
          }

          if($coinType){
              $coin = M('coin')->where(array('name'=>$coinType, 'status'=>1))->find();
              if($coin){
                  $newad->where(array('coin'=>$coinType));
              } else {
                  $err = ['errno'=>100001,'message'=>'参数错误'];
                  $data['err'] = $err;
                  $this->ajaxReturn($data);
                  exit();
              }
          }

          $newadlist = $newad->join('cy_user_coin b on a.userid=b.userid')->field('a.id,a.userid,ad_type,coin,min_amount,usdt,price,provider')->select();
          $arr = array();
		  $pay = array('1'=>'bank', '2'=>'alipay', '3'=>'weixin');
          foreach ($newadlist as $k=>$v){
               $arr[$k]['dealid'] = $v['id'];
               $arr[$k]['coinType'] = $v['coin'];
               $arr[$k]['sellOrBuy'] = $v['ad_type'] ? 'sell' : 'buy';
			   $arr[$k]['pay'] = $pay[$v['provider']];
               $arr[$k]['min'] = ceil_dec($v['min_amount']/$v['price'], 2, '.');
               if(!$v['ad_type']){
                  $arr[$k]['max'] = floor_dec($v['usdt'], 2, '.');
               }
               $arr[$k]['price'] = $v['price'];

          }

         $data['err'] = null;
         $data['data'] = $arr;
         $this->ajaxReturn($data);
         exit();
		 
     }

     public function add(){
         $userid=I('post.userid');
         $sellorbuy=I('post.sellorbuy/s');
         $price=I('post.price');
         $provider=I('post.provider');
         $message=I('post.message/s');
         $coin=I('post.coin');

         if(!$userid || !$sellorbuy || !$price || !$provider || !$coin) {
             $err = ['errno'=>100001,'message'=>'缺少参数'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         $user = M('user')->where(array('id'=>$userid))->find();
         if(!$user) {
             $err = ['errno'=>100001,'message'=>'userid不存在'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         if (strtolower($sellorbuy)=='sell') {
             $trade_type=0;
         } elseif (strtolower($sellorbuy)=='buy') {
             $trade_type=1;
         } else {
             $err = ['errno'=>100001,'message'=>'参数错误'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         $usdtcoin = M('Coin')->where(['name'=>'usdt'])->find();
         if ($price=='' || $price<$usdtcoin['min_price'] || $price>$usdtcoin['max_price']) {
             $err = ['errno'=>100001,'message'=>'价格必须在'.$usdtcoin['min_price'].'CNY-'.$usdtcoin['max_price'].'CNY之间'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         if (!preg_match("/^([1-9]\d*|0)(\.\d{1,2})?$/", $price)) {
             $err = ['errno'=>100001,'message'=>'价格填写错误'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }


         if ($provider != 1 && $provider != 2 &&$provider !=3) {
             $err = ['errno'=>100001,'message'=>'收款方式错误'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         switch ($provider){
             case 1:
                  $banktype = 'bank';
                  break;
             case 2:
                  $banktype = 'alipay';
                  break;
             case 3:
                  $banktype = 'weixin';
                  break;
         }


         $userbank = M('User_bank')->where(['userid'=>$userid,'type'=>$banktype])->find();
         if ($provider=='1') {
             if(!$userbank) {
                 $err = ['errno'=>100001,'message'=>'需要先绑定银行卡的收款方式'];
                 $data['err'] = $err;
                 $this->ajaxReturn($data);
                 exit();
             }
         } elseif ($provider=='2') {
             if(!$userbank) {
                 $err = ['errno'=>100001,'message'=>'需要先绑定支付宝的收款方式'];
                 $data['err'] = $err;
                 $this->ajaxReturn($data);
                 exit();
             }
         } elseif ($provider=='3') {
             if(!$userbank) {
                 $err = ['errno'=>100001,'message'=>'需要先绑定微信的收款方式'];
                 $data['err'] = $err;
                 $this->ajaxReturn($data);
                 exit();
             }
         } else {
             $err = ['errno'=>100001,'message'=>'收款方式错误'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         $coininfo=M('coin')->where(array('name'=>$coin))->find();
         if (!$coininfo) {
             $err = ['errno'=>100001,'message'=>'币种错误'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         $data1['userid']=$userid;
         $data1['ad_type']=$trade_type;
         $data1['currency']='cny';
         $data1['price']=$price;
         $data1['min_amount']=10;
         $data1['paytime']=5;
         $data1['provider']=$provider;
         $data1['message']=$message;
         $data1['status']=1;
         $data1['coin']=strtolower($coin);
         $data1['addtime']=time();
         $re=M('newad')->add($data1);
         if ($re) {
             $err = null;
             $data['err'] = $err;
             $data['dara'] = array('dealid'=>$re,'message'=>'添加成功');
             $this->ajaxReturn($data);
             exit();
         } else {
             $err = ['errno'=>100001,'message'=>'添加失败'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }
     }

     public function remove(){
         $dealid = I('post.dealid');
         $newad = M('newad')->where(array('id'=>$dealid))->find();
         if(!$newad) {
             $err = ['errno'=>100001,'message'=>'dealid不存在'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

         $rs = M('newad')->where(array('id'=>$dealid))->delete();
         if($rs) {
             $err = null;
             $data['err'] = $err;
             $data['dara'] = array('message'=>'删除成功');
             $this->ajaxReturn($data);
             exit();
         } else {
             $err = ['errno'=>100001,'message'=>'删除失败'];
             $data['err'] = $err;
             $this->ajaxReturn($data);
             exit();
         }

     }

}