<?php


namespace Home\Controller;

class SettingController extends HomeController
{

    public function _initialize()
    {

        parent::_initialize();

        $userid = session('userid');

        if ($userid == null) {
            redirect(U('Login/phone'));
        }
    }

    public function userinfo()
    {
        $userid = session('userid');
        if (IS_AJAX) {
            $content = I('post.intro');

            $intro = M('intro')->where(array('userid' => $userid))->find();

            if ($intro) {
                $data['content'] = $content;

                $data['time'] = time();

                $re = M('intro')->where(array('userid' => $userid))->save($data);
            } else {
                $data['userid'] = $userid;

                $data['content'] = $content;

                $data['time'] = time();

                $re = M('intro')->add($data);
            }

            if ($re) {
                $this->success('保存成功');
            } else {
                $this->error('保存失败');
            }
        }


        $userinfo = M('user')->where(array('id' => $userid))->find();

        $intro = M('intro')->where(array('userid' => $userid))->find();

        $this->assign('userinfo', $userinfo);

        $this->assign('intro', $intro);

        $this->display();
    }

    public function setimg()
    {

        $upload = new \Think\Upload();

        $upload->maxSize = 3145728;

        $upload->exts = array('jpg', 'png', 'jpeg');

        $upload->savePath = '/';

        $upload->saveName = 'time';

        $info = $upload->uploadOne($_FILES['file']);

        if (!$info) {
            $this->error($upload->getError());
        } else {
            $userid = session('userid');

            $filename = $info['savepath'] . $info['savename'];

            $re = M('user')->where(array('id' => $userid))->setField('ue_img', '/Uploads' . $filename);

            if ($re) {
                $data['status'] = 1;

                $data['info'] = '上传成功';

                $data['filename'] = '/Uploads' . $filename;

                $this->ajaxReturn($data);
            } else {
                $this->error('上传失败');
            }
        }
    }

    public function verification()
    {
        $userid = session('userid');

        if (IS_POST) {
            $truename = I('post.real_name');
            $idcard = I('post.number');
            if (mb_strlen($truename) < 2 && mb_strlen($truename) > 5) {
                $this->error('请输入真实姓名');
            }
            if (!validation_filter_id_card($idcard)) {
                $this->error('请输入正确的身份证号码');
            }
            $data['truename'] = $truename;

            $data['idcard'] = $idcard;

            $re = M('user')->where(array('id' => $userid))->save($data);

            if ($re) {
                $this->success('验证成功');
            } else {
                $this->error('验证失败');
            }
        }


        $userinfo = M('user')->where(array('id' => $userid))->find();
        $this->assign('userinfo', $userinfo);
        $this->display();
    }

    /*安全设置界面*/
    public function options()
    {
        $userid = session('userid');
        $userinfo = M('user')->where(array('id' => $userid))->find();
        $this->assign('moneypwd', $userinfo['moneypwd']);
        $this->assign('google',$userinfo['ga']);
        $this->display();
    }

    /*设置资金密码*/
    public function setmoneypwd()
    {
        $userid = session('userid');
        $userinfo = M('user')->where(array('id' => $userid))->find();
        if ($userinfo['moneypwd']) {
            redirect(U('Setting/moneypwd'));
        }
        if (IS_AJAX) {
            if (!$userinfo['moneypwd']) {
                $moneypwd = trim(I('post.moneypwd'));
                $moneypwd2 = trim(I('post.moneypwd2'));
                if ($moneypwd != $moneypwd2) {
                    $this->error('两次密码不一致');
                }
                $pwd = md5(md5($moneypwd) . $userinfo['salt']);

                $re = M('user')->where(array('id' => $userid))->save(array('moneypwd' => $pwd));

                if ($re) {
                    $this->success('保存成功');
                } else {
                    $this->error('保存失败');
                }
            } else {
                $this->error('错误');
            }
        }

        $this->display();
    }

    /*修改资金密码*/
    public function moneypwd()
    {
        if (IS_AJAX) {
            $pwd = trim(I('post.pwd'));
            $newpwd = trim(I('post.newpwd'));
            $newpwd2 = trim(I('post.newpwd2'));
            if ($newpwd != $newpwd2) {
                $this->error('两次密码不一致');
            }
            $userid = session('userid');
            $info = M('user')->where(array('id' => $userid))->find();

            if (md5(md5($pwd) . $info['salt']) == $info['moneypwd']) {
                $pwd2 = md5(md5($newpwd) . $info['salt']);
                $re = M('user')->where(array('id' => $userid))->save(array('moneypwd' => $pwd2));
                if ($re) {
                    $this->success('修改成功');
                } else {
                    $this->error('保存失败');
                }
            } else {
                $this->error('原资金密码不对');
            }
        }
        $this->display();
    }

    /*修改登录密码*/
    public function loginpwd()
    {
        if (IS_AJAX) {
            $loginpwd = I('post.loginpwd');
            $newpwd = I('post.newpwd');
            $newpwd2 = I('post.newpwd2');
            if ($newpwd != $newpwd2) {
                $this->error('两次密码不一致');
            }
            $userid = session('userid');

            $info = M('user')->where(array('id' => $userid))->find();

            if (md5(md5($loginpwd) . $info['salt']) == $info['password']) {
                $pwd2 = md5(md5($newpwd) . $info['salt']);
                $re = M('user')->where(array('id' => $userid))->save(array('password' => $pwd2));
                if ($re) {
                    $this->success('修改成功');
                } else {
                    $this->error('保存失败');
                }
            } else {
                $this->error('原登录密码不对');
            }
        }
        $this->display();
    }

    /*信任您的人*/
    public function trusted()
    {
        $userid = session('userid');
        $trusted = M('user')->where(array('id' => $userid))->getField('trusted');
        if ($trusted) {
            $arr = explode(',', $trusted);
            foreach ($arr as $v) {
                $trustedinfo[] = M('user')->where(array('id' => $v))->find();
            }
            $this->assign('trusted', $trustedinfo);
        } else {
            $this->assign('trusted', null);
        }
        $this->display();
    }

    /*您信任的人*/
    public function trusting()
    {
        $userid = session('userid');
        $trusting = M('user')->where(array('id' => $userid))->getField('trusting');
        if ($trusting) {
            $arr = explode(',', $trusting);
            foreach ($arr as $v) {
                $trustinginfo[] = M('user')->where(array('id' => $v))->find();
            }
            $this->assign('trusting', $trustinginfo);
        } else {
            $this->assign('trusting', null);
        }
        $this->display();
    }

    /*您屏蔽的人*/
    public function blocking()
    {
        $userid = session('userid');
        $blocking = M('user')->where(array('id' => $userid))->getField('blocking');
        if ($blocking) {
            $arr = explode(',', $blocking);
            foreach ($arr as $v) {
                $blockinginfo[] = M('user')->where(array('id' => $v))->find();
            }
            $this->assign('blocking', $blockinginfo);
        } else {
            $this->assign('blocking', null);
        }
        $this->display();
    }

    /*谷歌验证*/
    public function googleauth()
    {
        $ga = new \Common\Ext\GoogleAuthenticator();
        $user=M('user')->where(array('id'=>session('userid')))->find();
        if (IS_AJAX) {
            $code=I('post.code/d');
            if(!$code){
                $this->error('6位验证码输入错误');
            }
            if (!$user['ga']) {
                /*绑定*/
                $checkResult = $ga->verifyCode(session('secret'), $code, 2);
                if($checkResult){
                    $re=M('user')->where(array('id'=>session('userid')))->setField('ga',session('secret'));
                    if($re){
                        $this->success('绑定成功');
                    } else {
                        $this->error('绑定失败');
                    }
                } else {
                     $this->error('6位验证码输入错误');
                }
            }
        } else {
            if (!$user['ga']) {
                /*绑定界面*/
                $secret = $ga->createSecret();
                session('secret', $secret);
                $this->assign('Asecret', $secret);

                $qrCodeUrl = $ga->getQRCodeGoogleUrl($user['username'] . '%20-%20' . $_SERVER['HTTP_HOST'], $secret);

                $this->assign('qrCodeUrl', $qrCodeUrl);

                $this->assign('googlename', $user['username'] . ' - ' . $_SERVER['HTTP_HOST']);
                $this->display();
            }
        }
    }

    /*解除google*/
    public  function  jcgoogle(){
        $ga = new \Common\Ext\GoogleAuthenticator();
        $user=M('user')->where(array('id'=>session('userid')))->find();
         if(IS_AJAX){
              $code=I('post.code/d');
              if(!$code){
                 $this->error('6位验证码输入错误');
              }
               if($user['ga']){
                   $checkResult = $ga->verifyCode($user['ga'], $code, 2);
                   if($checkResult){
                       $re=M('user')->where(array('id'=>session('userid')))->setField('ga','');
                      if($re){
                          $this->success('解绑成功');
                      } else {
                          $this->error('解绑失败');
                      }

                   } else {
                       $this->error('6位验证码输入错误');
                   }
               }
         }else {
             if($user['ga']){
                 $this->display();
             }
         }

    }

    /*收款信息*/
    public function skxx(){
        $userid = session('userid');
        $user = M('User')->where(['id'=>$userid])->find();
        if(!$user['truename']) {
            $this->error('请先实名认证', U('Setting/verification'));
        }
        $UserBankType = M('UserBankType')->where(array('status' => 1))->order('id desc')->select();
        $UserBank = M('UserBank')->where(array('userid' => $userid, 'status' => 1))->order('id desc')->limit(10)->select();
        $this->assign('UserBank', $UserBank);
        $this->assign('UserBankType', $UserBankType);
        $this->assign('user', $user);
        $this->display();
    }

    /*添加收款信息*/
    public function upbank($type,$name, $bank,$bankaddr, $bankcard){
        $userid = session('userid');
        if (!$userid) {
            $this->redirect('login/phone');
        }
        $banknum=M('UserBank')->where(array('userid' => userid(),'type'=>$type))->count();

        if (1 <= $banknum) {
            $this->error('每个用户每种类型最多只能添加1个账户！');
        }
        if (!check($name, 'a')) {
            $this->error('备注名称格式错误！');
        }
        if ($type=='bank')
        {
            if (!check($bank, 'a')) {
                $this->error('开户银行格式错误！');
            }

            if (!check($bankcard, 'd')) {
                $this->error('银行账号格式错误！');
            }
            if (!M('UserBankType')->where(array('title' => $bank))->find()) {
                $this->error('开户银行错误！');
            }
        }

        if($_FILES['qrcode']['error']==0){
            $upload = new \Think\Upload();// 实例化上传类
            $upload->maxSize   =     3145728 ;// 设置附件上传大小
            $upload->exts      =     array('jpg', 'gif', 'png', 'jpeg');// 设置附件上传类型
            $upload->rootPath  =      './Upload';
            $upload->savePath  =      './qrcode/'; // 设置附件上传目录    // 上传单个文件
            $info   =   $upload->uploadOne($_FILES['qrcode']);
            if(!$info) {// 上传错误提示错误信息
                $this->error($upload->getError());
            }
        }
        $userBank = M('UserBank')->where(array('userid' => userid()))->select();
        foreach ($userBank as $k => $v) {
            if ($v['name'] == $name) {
                $this->error('请不要使用相同的备注名称！');
            }
            if ($v['bankcard'] == $bankcard) {
                $this->error('账号已存在！');
            }
        }

        if (M('UserBank')->add(array('userid' =>$userid,'type'=>$type, 'name' => $name, 'bank' => $bank, 'bankcard' => $bankcard,'bankaddr'=>$bankaddr, 'addtime' => time(), 'status'=>'1' ,'erweima'=> $info['savepath'].$info['savename']))) {

            $this->success('收款账户添加成功！');

        }
        else {
            $this->error('收款账户添加失败！');
        }
    }

    /*删除收款信息*/
    public function delbank($id)
    {
        $userid = session('userid');
        if (!$userid) {
            redirect('/#login');
        }
        if (!check($id, 'd')) {
            $this->error('参数错误！');
        }

        if (!M('UserBank')->where(array('userid' =>  $userid, 'id' => $id))->find()) {
            $this->error('非法访问！');
        }
        else if (M('UserBank')->where(array('userid' =>  $userid, 'id' => $id))->delete()) {
            $this->success('删除成功！');
        }
        else {
            $this->error('删除失败！');
        }
    }
}
