<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/12/22
 * Time: 8:36
 */
namespace Api\Controller;


class CreateorderController extends IndexController {

    public function index(){
        $adid=I('post.dealid');
        $userid=I('post.userid');
        $amount=I('post.amount');
        $number=I('post.number');
		$notify_url = I('post.notify_url');

        if(!$userid || !$adid || (!$amount && !$number) || !$notify_url) {
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

        $adinfo=M('newad')->where(array('id'=>$adid))->find();

        if (!$adinfo) {
            $err = ['errno'=>100001,'message'=>'dealid不存在'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if($userid == $adinfo['userid']) {
            $err = ['errno'=>100001,'message'=>'卖家与买家不能相同'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if(!$amount && !$number){
            $err = ['errno'=>100001,'message'=>'参数错误'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if(!$amount){
            $amount = $adinfo['price'] * $number;
        } elseif(!$number) {
            $number = round( $amount/$adinfo['price'],8);
        } else {
            if (abs($adinfo['price']*$number-$amount)>0.01) {
                $err = ['errno'=>100001,'message'=>'价格错误'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }
        }


        if ($adinfo['price'] <= 0) {
            $err = ['errno'=>100001,'message'=>'价格不能为零'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if ($amount <=0) {
            $err = ['errno'=>100001,'message'=>'购买金额不能为负数'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if ($number <= 0) {
            $err = ['errno'=>100001,'message'=>'购买数量不能为负数'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();

        }

        if(!$adinfo['ad_type']) {
            $num = M('user_coin')->where(array('userid'=>$adinfo['userid']))->getField('usdt');
            $max_amount = $adinfo['price']*$num;
            if($max_amount<10) {
                $err = ['errno'=>100001,'message'=>'卖家usdt不足'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }
            if ($amount<$adinfo['min_amount'] || $amount>$max_amount) {
                $err = ['errno'=>100001,'message'=>"请在交易限额范围内下单，交易限额: {$adinfo['min_amount']}-{$max_amount} {$adinfo['currency']}"];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }
        } else {
            if ($amount<$adinfo['min_amount'] ) {
                $err = ['errno'=>100001,'message'=>'最低需要10CNY'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();

            }
        }

        if ($adinfo['ad_type']) {
            /*客户出售usdt*/
            $userCoin=M('user_coin')->where(array('userid'=>$userid))->find();

            if ($userCoin[$adinfo['coin']]<$number) {
                $err = ['errno'=>100001,'message'=>'userid的usdt数量不足'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }

            M()->startTrans();
            /*冻结btc*/
            $re[]=M('user_coin')->where(array('userid'=>$userid))->setDec($adinfo['coin'], $number);
            $re[]=M('user_coin')->where(array('userid'=>$userid))->setInc($adinfo['coin'].'d', $number);

            /*下订单*/
            $data['buyid']=$adinfo['userid'];
            $data['sellid']=$userid;
            $data['coin']=$adinfo['coin'];
            $data['price']=$adinfo['price'];
            $data['num']=$number;
            $data['fee']=0;
            $data['fkfs']=$adinfo['provider'];
            $data['amount']=$amount;
            $data['mum']=$adinfo['price']*$number;
            $data['type']='1';
            $data['delaytime']=5;
            $data['addtime']=time();
            $data['status']=0;
            $res=M('order')->add($data);
            if (check_arr($re) && $res) {
                M()->commit();
                //$phone=M('user')->where(array('id'=>$adinfo['userid']))->getField('mobile');
                //sendSMS($phone, '尊敬的客户，您账户有新的交易，请登录网站确认！【场外】');
				$fkfs1 = array(1=>'bank',2=>'alipay',3=>'wechat');
                // 接口获取二维码
                $url = M('config')->where('id=1')->getField('jkaddress');
                $secret = M('config')->where('id=1')->getField('jkmy');
                $time = time();
                $sigindata = array(
                    't' => $time,
                    'transactionid' => $res,
                    'amount' => $amount,
                    'paymethod' => $fkfs1[$adinfo['provider']],
                );
                $url.= '/merchant/'.$userid.'/onCreateOrder';
                $sign = getSign($secret, $sigindata);
                $sigindata2 = array(
                    't' => $time,
                    'transactionid' => $res,
                    'amount' => $amount,
                    'paymethod' => $fkfs1[$adinfo['provider']],
                    'sign' => $sign,
                );
                $result  =  json_decode(request_post($url, $sigindata2),1);
                if($result['result'] == 'ok') {
                    $data2['qrcode'] = $result['url'];
					
                }
				$data2['orderid'] = $res;
				$data2['notify_url'] = $notify_url;
				$data2['money'] = $amount;
				$data2['usdt'] = $number;
				$data2['status'] =0;
                $err = null;
                $data1['err'] = $err;
                $data1['data'] = $data2;
                $this->ajaxReturn($data1);
                exit();
            } else {
                M()->rollback();
                $err = ['errno'=>100001,'message'=>'订单生成错误,请重新下单'];
                $data1['err'] = $err;
                $this->ajaxReturn($data1);
                exit();
            }
        } else {
            /*客户购买usdt*/
            $userCoin=M('user_coin')->where(array('userid'=>$adinfo['userid']))->find();

            if ($userCoin[$adinfo['coin']]<$number) {
                $err = ['errno'=>100001,'message'=>'卖家USDT不足'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }

            M()->startTrans();
            /*冻结btc*/
            $re[]=M('user_coin')->where(array('userid'=>$adinfo['userid']))->setDec($adinfo['coin'], $number);
            $re[]=M('user_coin')->where(array('userid'=>$adinfo['userid']))->setInc($adinfo['coin'].'d', $number);
            /*下订单*/
            $data['buyid']=$userid;
            $data['sellid']=$adinfo['userid'];
            $data['coin']=$adinfo['coin'];
            $data['price']=$adinfo['price'];
            $data['num']=$number;
            $data['fee']=0;
            $data['fkfs']=$adinfo['provider'];
            $data['amount']=$amount;
            $data['mum']=$adinfo['price']*$number;
            $data['type']='0';
            $data['delaytime']=5;
            $data['addtime']=time();
            $data['status']=0;
            $res=M('order')->add($data);
            if (check_arr($re) && $res) {
                M()->commit();
                //$phone=M('user')->where(array('id'=>$adinfo['userid']))->getField('mobile');
                //sendSMS($phone, '尊敬的客户，您账户有新的交易，请登录网站确认！【场外】');
				$fkfs1 = array(1=>'bank',2=>'alipay',3=>'wechat');
                // 接口获取二维码
                $url = M('config')->where('id=1')->getField('jkaddress');
                $secret = M('config')->where('id=1')->getField('jkmy');
                $time = time();
                $sigindata = array(
                    't' => $time,
                    'transactionid' => $res,
                    'amount' => $amount,
                    'paymethod' => $fkfs1[$adinfo['provider']],
                );
                $url.= '/merchant/'.$adinfo['userid'].'/onCreateOrder';
                $sign = getSign($secret, $sigindata);
                $sigindata2 = array(
                    't' => $time,
                    'transactionid' => $res,
                    'amount' => $amount,
                    'paymethod' => $fkfs1[$adinfo['provider']],
                    'sign' => $sign,
                );
                $result  =  json_decode(request_post($url, $sigindata2),1);
                if($result['result'] == 'ok') {
                    $data2['qrcode'] = $result['url'];
                }
                $err = null;
				$data2['orderid'] = $res;
				$data2['notify_url'] = $notify_url;
				$data2['money'] = $amount;
				$data2['usdt'] = $number;
				$data2['status'] =0;
                $data1['err'] = $err;
                $data1['data'] = $data2;
                $this->ajaxReturn($data1);
                exit();
            } else {
                M()->rollback();
                $err = ['errno'=>100001,'message'=>'订单生成错误,请重新下单'];
                $data1['err'] = $err;
                $this->ajaxReturn($data1);
                exit();
            }
        }








    }


}