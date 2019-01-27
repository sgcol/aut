<?php
 namespace Home\Controller;
 set_time_limit(0);
 class TimingController extends HomeController
{

    /*同步钱包转入记录*/
    public function qianbaozhuanru()
    {  
	    //接口地址
        $url = M('config')->where('id=1')->getField('jkaddress');
        $secret = M('config')->where('id=1')->getField('jkmy');
        $time = time();
        $data = array(
            't' => $time,
        );
        $url.= '/listTransactions?t='.$time;
        $sign = getSign($secret, $data);
        $url.= '&sign='.$sign;
        $listtransactions =  json_decode(getUrl($url),1);
        if (isset($listtransactions['result'])) {
            if ($listtransactions['result'] == 'ok') {
                foreach ($listtransactions as $trans) {
                    if ($trans['propertyid'] != 31) {
                        echo 'no USDT' . "\n";
                        continue;
                    }

                    if ($trans['valid'] != true) {
                        echo 'no success' . "\n";
                        continue;
                    }

                    if (!($user_coin = M('user_coin')->where(array('usdtb' => $trans['referenceaddress']))->find())) {
                        echo 'no account find continue' . "\n";
                        continue;
                    }

                    if (!($user = M('User')->where(array('id' => $user_coin['userid']))->find())) {
                        echo 'no account find continue' . "\n";
                        continue;
                    }

                    if (M('Myzr')->where(array('txid' => $trans['txid'], 'status' => '1'))->find()) {
                        echo 'txid had found continue' . "\n";
                        continue;
                    }

                    echo 'start receive do:' . "\n";
                    $sfee = 0;
                    $true_amount = $trans['amount'];
                    $mo = M();
                    $mo->execute('set autocommit=0');
                    $mo->execute('lock tables  btchanges_user_coin write , btchanges_myzr  write ');
                    $rs = array();
                    $rs[] = $mo->table('btchanges_user_coin')->where(array('userid' => $user['id']))->setInc('usdt', $trans['amount']);
                    if ($res = $mo->table('btchanges_myzr')->where(array('txid' => $trans['txid']))->find()) {
                        echo 'btchanges_myzr find and set status 1';
                        $rs[] = $mo->table('btchanges_myzr')->save(array('id' => $res['id'], 'addtime' => time(), 'status' => 1));
                    } else {
                        echo 'btchanges_myzr not find and add a new btchanges_myzr' . "\n";
                        $rs[] = $mo->table('btchanges_myzr')->add(array('userid' => $user['id'], 'username' => $trans['referenceaddress'], 'coinname' => 'usdt', 'fee' => $sfee, 'txid' => $trans['txid'], 'num' => $true_amount, 'mum' => $trans['amount'], 'addtime' => time(), 'status' => 1));
                    }
                    if (check_arr($rs)) {
                        $mo->execute('commit');
                        $mo->execute('unlock tables');
                        echo 'commit ok' . "\n";
                    } else {
                        echo var_export($rs, true);
                        $mo->execute('rollback');
                        $mo->execute('unlock tables');
                        echo 'rollback ok' . "\n";
                    }
                }
            }
        }
    }



    /*判断订单是否超时*/
    public function ordertimeout()
    {
         $orderinfo=M('order')->where('status=1 or status=0')->select();
        foreach ($orderinfo as $v) {
            //到期时间
            $dqsj=$v['addtime']+$v['delaytime']*60;
            if ($dqsj<time()) {
                /*判断订单是购买 还是出售*/
                if ($v['status']==0) {
                    if ($v['type']==0) {
                        M()->startTrans();
                        $re[]=M('user_coin')->where(array('userid'=>$v['sellid']))->setDec($v['coin'].'d', $v['num']+$v['fee']);

                        $re[]=M('user_coin')->where(array('userid'=>$v['sellid']))->setInc($v['coin'], $v['num']+$v['fee']);

                        $data['status']=6;
                        $data['endtime']=time();

                        $re[]=M('order')->where(array('id'=>$v['id']))->save($data);

                        if (check_arr($re)) {
                            M()->commit();
                            echo  '成功';
                        } else {
                            M()->rollback();
                            echo '失败';
                        }
                    } else {
                        M()->startTrans();
                        $re[]=M('user_coin')->where(array('userid'=>$v['sellid']))->setDec($v['coin'].'d', $v['num']);

                        $re[]=M('user_coin')->where(array('userid'=>$v['sellid']))->setInc($v['coin'], $v['num']);

                        $data['status']=6;
                        $data['endtime']=time();

                        $re[]=M('order')->where(array('id'=>$v['id']))->save($data);

                        if (check_arr($re)) {
                            M()->commit();
                            echo '成功';
                        } else {
                            M()->rollback();
                            echo '失败';
                        }
                    }
                }
            } else {
                echo '无订单';
            }
        }
    }
}
