<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/12/22
 * Time: 14:02
 */
namespace Api\Controller;

class MerchantController extends IndexController {

    public function confirmorder(){
        $id = I('post.userid');
        $orderid=I('post.transactionid');
        $time = I('post.time');

        if(!$orderid || !$id ) {
            $err = ['errno'=>100001,'message'=>'缺少参数'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }
		
        if(!$time) {
            $time = time();
        }
        $orderinfo=M('order')->where(array('id'=>$orderid))->find();
		
		if ($orderinfo['status'] != 1 && $orderinfo['status'] != 0) {
			$err = ['errno'=>100001,'message'=>'订单状态错误'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
		}
		
        if ($id==$orderinfo['sellid'] || $id == $orderinfo['buyid']) {

            $config=M('config')->where(array('id'=>1))->find();

            if ($orderinfo['type']) {
                /*订单为出售*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']);

                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['buyid']))->setInc($orderinfo['coin'], $orderinfo['num']-$orderinfo['fee']);

                $re[]=M('order')->where(array('id'=>$orderid))->setField('status', '3');

                /*向上线打钱*/
                $sellpid=M('user')->where(array('id'=>$orderinfo['sellid']))->getField('pid');
                if ($sellpid) {
                    $re[]=M('user_coin')->where(array('userid'=>$sellpid))->setInc($orderinfo['coin'], $orderinfo['num']*$config['yqr_fee']/100);
                    $re[]=M('orderlog')->add(array('userid'=>$sellpid,'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'price'=>$orderinfo['price'],'num'=>$orderinfo['num']*$config['yqr_fee']/100,'amount'=>$orderinfo['price']*$orderinfo['num']*$config['yqr_fee']/100,'order_type'=>3,'addtime'=>$time));
                }

                /*添加记录*/
                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['buyid'],'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'order_type'=>0,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'fee'=>$orderinfo['fee'],'addtime'=>$time));

                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['sellid'],'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'order_type'=>1,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'addtime'=>$time));

                if (check_arr($re)) {
                    M()->commit();
                    $err = null;
                    $data['err'] = $err;
                    $data['data'] = ['message' => '订单完成成功'];
                    $this->ajaxReturn($data);
                    exit();
                } else {
                    M()->rollback();
                    $err = ['errno'=>100001,'message'=>'订单完成失败'];
                    $data['err'] = $err;
                    $this->ajaxReturn($data);
                    exit();
                }
            } else {
                /*订单为购买*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']+$orderinfo['fee']);

                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['buyid']))->setInc($orderinfo['coin'], $orderinfo['num']);

                /*向上线打钱*/
                $buypid=M('user')->where(array('id'=>$orderinfo['buyid']))->getField('pid');
                if ($buypid) {
                    $re[]=M('user_coin')->where(array('userid'=>$buypid))->setInc($orderinfo['coin'], $orderinfo['num']*$config['yqr_fee']/100);
                    $re[]=M('orderlog')->add(array('userid'=>$buypid,'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'price'=>$orderinfo['price'],'num'=>$orderinfo['num']*$config['yqr_fee']/100,'amount'=>$orderinfo['price']*$orderinfo['num']*$config['yqr_fee']/100,'order_type'=>3,'addtime'=>$time));
                }

                /*添加记录*/
                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['buyid'],'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'order_type'=>0,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'addtime'=>$time));

                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['sellid'],'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'order_type'=>1,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'fee'=>$orderinfo['fee'],'addtime'=>$time));

                $re[]=M('order')->where(array('id'=>$orderid))->setField('status', '3');
                if (check_arr($re)) {
                    M()->commit();
                    $err = null;
                    $data['err'] = $err;
                    $data['data'] = ['message' => '订单完成成功'];
                    $this->ajaxReturn($data);
                    exit();
                } else {
                    M()->rollback();
                    $err = ['errno'=>100001,'message'=>'订单完成失败'];
                    $data['err'] = $err;
                    $this->ajaxReturn($data);
                    exit();
                }
            }
        } else {
            $err = ['errno'=>100001,'message'=>'这不是你的订单'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }
    }


    public function cancelOrder(){
        $id = I('post.userid');
        $orderid=I('post.transactionid');
        $time = I('post.time');

        if(!$orderid || !$id ) {
            $err = ['errno'=>100001,'message'=>'缺少参数'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        if(!$time) {
            $time = time();
        }

        $orderinfo=M('order')->where(array('id'=>$orderid))->find();
        if ($id==$orderinfo['buyid'] || $id == $orderinfo['buyid']) {
            if ($orderinfo['status'] == 2) {
                $err = ['errno'=>100001,'message'=>'订单已完成,不能取消!'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            } elseif ($orderinfo['status'] == 3) {
                $err = ['errno'=>100001,'message'=>'订单已完成,不能取消'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }  elseif ($orderinfo['status'] == 6) {
                $err = ['errno'=>100001,'message'=>'订单超时,已自动取消'];
                $data['err'] = $err;
                $this->ajaxReturn($data);
                exit();
            }
            if ($orderinfo['type']) {
                /*订单为出售*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']);

                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setInc($orderinfo['coin'], $orderinfo['num']);

                $data['status']=4;
                $data['endtime']=$time;

                $re[]=M('order')->where(array('id'=>$orderid))->save($data);

                if (check_arr($re)) {
                    M()->commit();
                    $err = null;
                    $data1['err'] = $err;
                    $data1['data'] = ['message' => '取消订单成功'];
                    $this->ajaxReturn($data1);
                    exit();
                } else {
                    M()->rollback();
                    $err = ['errno'=>100001,'message'=>'取消订单失败'];
                    $data1['err'] = $err;
                    $this->ajaxReturn($data1);
                    exit();
                }
            } else {
                /*订单为购买*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']+$orderinfo['fee']);


                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setInc($orderinfo['coin'], $orderinfo['num']+$orderinfo['fee']);

                $data['status']=4;

                $data['endtime']=$time;

                $re[]=M('order')->where(array('id'=>$orderid))->save($data);

                if (check_arr($re)) {
                    M()->commit();
                    $err = null;
                    $data1['err'] = $err;
                    $data1['data'] = ['message' => '取消订单成功'];
                    $this->ajaxReturn($data1);
                    exit();
                } else {
                    M()->rollback();
                    $err = ['errno'=>100001,'message'=>'取消订单失败'];
                    $data1['err'] = $err;
                    $this->ajaxReturn($data1);
                    exit();
                }
            }
        } else {
            $err = ['errno'=>100001,'message'=>'这不是你的订单'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }
    }


}