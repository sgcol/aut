<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/12/21
 * Time: 17:57
 */

namespace Api\Controller;

class UserController extends IndexController {

    public function balance($id){
        $user_coin = M('user_coin')->where(array('userid'=>$id))->find();
        if($user_coin) {
            $err = null;
            $data['err'] = $err;
            $data['data'] =array('usdt'=>$user_coin['usdt'], 'usdtd'=>$user_coin['usdtd']);
            $this->ajaxReturn($data);
            exit();
        } else {
            $err = ['errno'=>100001,'message'=>'id不存在'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }
    }

    public function allorders($id){
        $user = M('user')->where(array('id'=>$id))->find();
        if(!$user) {
            $err = ['errno'=>100001,'message'=>'id不存在'];
            $data['err'] = $err;
            $this->ajaxReturn($data);
            exit();
        }

        $where['buyid|sellid'] = $id;
        $order = M('order')->where($where)->where(array('coin'=>'usdt'))->select();
        $arr = array();
        foreach ($order as $k=>$v) {
            $arr[$k]['orderid'] = $v['id'];
            $arr[$k]['coin'] = $v['coin'];
            $arr[$k]['price'] = $v['price'];
            $arr[$k]['num'] = $v['num'];
            $arr[$k]['amount'] = $v['amount'];
            $arr[$k]['type'] = $v['buyid'] == $id ? 'buy' : 'sell';
            $arr[$k]['starttime'] = $v['addtime'];
            $arr[$k]['endtime'] = $v['endtime'];
            $arr[$k]['status'] = $v['status'];
        }

        $err = null;
        $data['err'] = $err;
        $data['data'] = $arr;
        $this->ajaxReturn($data);
        exit();
    }

}