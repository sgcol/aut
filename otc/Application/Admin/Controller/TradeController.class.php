<?php

namespace Admin\Controller;

class TradeController extends AdminController
{

    public function sell()
    {

        $where['ad_type']=0;
        $count = M('newad a')->where($where)->count();

        $Page = new \Think\Page($count, 10);

        $Page->setConfig('theme', '%first% %upPage% %linkPage% %downPage% %end%');

        $show = $Page->show();

        $adinfo=M('newad a')
            ->field(array('*','a.id'=>'adid','a.status'=>'adstatus'))
            ->where($where)
            ->join('cy_user c on c.id=a.userid')
            ->order('a.addtime Desc')
            ->limit($Page->firstRow . ',' . $Page->listRows)
            ->select();

        $this->assign('page', $show);
        $this->assign('list', $adinfo);
        $this->display();
    }

    public function buy()
    {
        $where['ad_type']=1;
        $count = M('newad a')->where($where)->count();

        $Page = new \Think\Page($count, 10);

        $Page->setConfig('theme', '%first% %upPage% %linkPage% %downPage% %end%');

        $show = $Page->show();

        $adinfo=M('newad a')
            ->field(array('*','a.id'=>'adid','a.status'=>'adstatus'))
            ->where($where)
            ->join('cy_user c on c.id=a.userid')
            ->order('a.addtime Desc')
            ->limit($Page->firstRow . ',' . $Page->listRows)
            ->select();

        $this->assign('page', $show);
        $this->assign('list', $adinfo);
        $this->display();
    }

    /*改变订单状态*/
    public function status()
    {
         $adid=I('get.id');
        if ($adid) {
            $adinfo = M('newad')->where(array('id'=>$adid))->find();
            if ($adinfo) {
                if ($adinfo['status']) {
                    $re=M('newad')->where(array('id'=>$adid))->setField('status', 0);
                } else {
                    $re=M('newad')->where(array('id'=>$adid))->setField('status', 1);
                }
                if ($re) {
                    $this->success('修改成功');
                } else {
                    $this->error('修改失败');
                }
            } else {
                $this->error('找不到此广告');
            }
        } else {
            $this->error('参数错误');
        }
    }

    public function order(){

        $count = M('order')->count();

        $Page = new \Think\Page($count, 12);

        $Page->setConfig('theme', '%first% %upPage% %linkPage% %downPage% %end%');

        $show = $Page->show();

        $orderinfo=M('order')
            ->order('addtime Desc')
            ->limit($Page->firstRow . ',' . $Page->listRows)
            ->select();


        foreach ($orderinfo as $k=>$v){
             $buyname=M('user')->where(array('id'=>$v['buyid']))->getField('username');
             $sellname=M('user')->where(array('id'=>$v['sellid']))->getField('username');
            $orderinfo[$k]['buyname']=$buyname;
            $orderinfo[$k]['sellname']=$sellname;
        }


        $this->assign('page', $show);
        $this->assign('list', $orderinfo);
        $this->display();
    }

    public function chatlog(){
          $id=I('get.id');
          $sellid=M('order')->where(array('id'=>$id))->getField('sellid');
          $info=M('user')->where('id='.$sellid)->find();
           session('userid', $info['id']);
           session('mobile', $info['mobile']);
           session('username', $info['username']);
          $this->redirect('Home/Order/detail',array('id'=>$id));
    }


    public function quit(){
           $id=I('get.id');
           $info=M('order')->where(array('id'=>$id))->find();
           if($info['status']==5){
               if ($info['type']==0) {
                   M()->startTrans();
                   $re[]=M('user_coin')->where(array('userid'=>$info['sellid']))->setDec($info['coin'].'d', $info['num']+$info['fee']);

                   $re[]=M('user_coin')->where(array('userid'=>$info['sellid']))->setInc($info['coin'], $info['num']+$info['fee']);

                   $data['status']=4;
                   $data['endtime']=time();

                   $re[]=M('order')->where(array('id'=>$info['id']))->save($data);

                   if (check_arr($re)) {
                       M()->commit();
                       $this->success('取消交易成功');
                   } else {
                       M()->rollback();
                       $this->error('取消交易失败');
                   }
               } else {
                   M()->startTrans();
                   $re[]=M('user_coin')->where(array('userid'=>$info['sellid']))->setDec($info['coin'].'d', $info['num']);

                   $re[]=M('user_coin')->where(array('userid'=>$info['sellid']))->setInc($info['coin'], $info['num']);

                   $data['status']=4;
                   $data['endtime']=time();

                   $re[]=M('order')->where(array('id'=>$info['id']))->save($data);

                   if (check_arr($re)) {
                       M()->commit();
                       $this->success('取消交易成功');
                   } else {
                       M()->rollback();
                       $this->error('取消交易失败');
                   }

               }
            }
    }

    public function reset(){
         $id=I('get.id');
         $info=M('order')->where(array('id'=>$id))->find();
         $data['status']=$info['ssqzt'];
         $data['addtime']=time();
         $re=M('order')->where(array('id'=>$id))->save($data);
         if($re){
             $this->success('重启交易成功');
         } else {
             $this->error('重启交易失败');
         }
    }

    public function end(){
        $id=I('get.id');
        $orderinfo=M('order')->where(array('id'=>$id))->find();
        $config=M('config')->where(array('id'=>1))->find();
        if($orderinfo){
            if ($orderinfo['type']) {
                /*订单为出售*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']);

                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['buyid']))->setInc($orderinfo['coin'], $orderinfo['num']-$orderinfo['fee']);

                //向主号打手续费
                $zc_user=M('coin')->where(array('name'=>$orderinfo['coin']))->getField('zc_user');
                if ($zc_user) {
                    if (M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->find()) {
                        $re[]=M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->setInc($orderinfo['coin'], $orderinfo['fee']);
                    } else {
                        $re[]=M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->add(array($orderinfo['coin'].'b'=>$zc_user,$orderinfo['coin']=>$orderinfo['fee']));
                    }
                }

                $re[]=M('order')->where(array('id'=>$id))->setField('status', '3');

                /*向上线打钱*/
                $sellpid=M('user')->where(array('id'=>$orderinfo['sellid']))->getField('pid');
                if($sellpid){
                    $re[]=M('user_coin')->where(array('userid'=>$sellpid))->setInc($orderinfo['coin'],$orderinfo['num']*$config['yqr_fee']/100);
                    $re[]=M('orderlog')->add(array('userid'=>$sellpid,'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'price'=>$orderinfo['price'],'num'=>$orderinfo['num']*$config['yqr_fee']/100,'amount'=>$orderinfo['price']*$orderinfo['num']*$config['yqr_fee']/100,'order_type'=>3,'addtime'=>time()));
                }

                /*添加记录*/
                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['buyid'],'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'order_type'=>0,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'fee'=>$orderinfo['fee'],'addtime'=>time()));

                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['sellid'],'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'order_type'=>1,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'addtime'=>time()));

                if (check_arr($re)) {
                    M()->commit();
                    $this->success('完成交易成功');
                } else {
                    M()->rollback();
                    $this->error('完成交易失败');
                }
            } else {
                /*订单为购买*/
                M()->startTrans();
                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['sellid']))->setDec($orderinfo['coin'].'d', $orderinfo['num']+$orderinfo['fee']);

                $re[]=M('user_coin')->where(array('userid'=>$orderinfo['buyid']))->setInc($orderinfo['coin'], $orderinfo['num']);

                //TODO:向主号打手续费
                $zc_user=M('coin')->where(array('name'=>$orderinfo['coin']))->getField('zc_user');
                if ($zc_user) {
                    if (M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->find()) {
                        $re[]=M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->setInc($orderinfo['coin'], $orderinfo['fee']);
                    } else {
                        $re[]=M('user_coin')->where(array($orderinfo['coin'].'b'=>$zc_user))->add(array($orderinfo['coin'].'b'=>$zc_user,$orderinfo['coin']=>$orderinfo['fee']));
                    }
                }

                /*向上线打钱*/
                $buypid=M('user')->where(array('id'=>$orderinfo['buyid']))->getField('pid');
                if($buypid){
                    $re[]=M('user_coin')->where(array('userid'=>$buypid))->setInc($orderinfo['coin'],$orderinfo['num']*$config['yqr_fee']/100);
                    $re[]=M('orderlog')->add(array('userid'=>$buypid,'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'price'=>$orderinfo['price'],'num'=>$orderinfo['num']*$config['yqr_fee']/100,'amount'=>$orderinfo['price']*$orderinfo['num']*$config['yqr_fee']/100,'order_type'=>3,'addtime'=>time()));
                }

                /*添加记录*/
                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['buyid'],'traders'=>$orderinfo['sellid'],'coin_type'=>$orderinfo['coin'],'order_type'=>0,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'addtime'=>time()));

                $re[]=M('orderlog')->add(array('userid'=>$orderinfo['sellid'],'traders'=>$orderinfo['buyid'],'coin_type'=>$orderinfo['coin'],'order_type'=>1,'price'=>$orderinfo['price'],'num'=>$orderinfo['num'],'amount'=>$orderinfo['amount'],'fee'=>$orderinfo['fee'],'addtime'=>time()));

                $re[]=M('order')->where(array('id'=>$id))->setField('status', '3');
                if (check_arr($re)) {
                    M()->commit();
                    $this->success('完成交易成功');
                } else {
                    M()->rollback();
                    $this->error('完成交易失败');
                }
            }
        } else {
            $this->error('完成交易失败');
        }
    }
}
