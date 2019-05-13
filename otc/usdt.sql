# Host: localhost  (Version: 5.5.53)
# Date: 2019-05-13 09:51:07
# Generator: MySQL-Front 5.3  (Build 4.234)

create database otc;
use otc;
/*!40101 SET NAMES utf8 */;

#
# Structure for table "cy_address"
#

CREATE TABLE `cy_address` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `coin` varchar(20) NOT NULL COMMENT '币种',
  `address` varchar(50) NOT NULL,
  `userid` int(11) DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_address"
#


#
# Structure for table "cy_admin"
#

CREATE TABLE `cy_admin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(200) NOT NULL,
  `username` char(16) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `moble` varchar(50) NOT NULL,
  `password` char(32) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `last_login_time` int(11) unsigned NOT NULL,
  `last_login_ip` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='管理员表';

#
# Data for table "cy_admin"
#

INSERT INTO `cy_admin` VALUES (1,'','admin','管理员','','e10adc3949ba59abbe56e057f20f883e',0,0,0,0,0,1);

#
# Structure for table "cy_adver"
#

CREATE TABLE `cy_adver` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `url` varchar(255) NOT NULL,
  `img` varchar(250) NOT NULL,
  `type` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='广告图片表';

#
# Data for table "cy_adver"
#

INSERT INTO `cy_adver` VALUES (1,'','114.215.40.96','593c8911d9701.jpeg','',1,1497143113,1497143114,1),(2,'','#','593c89d689544.png','',2,1497143293,1497143295,1),(3,'','114.215.40.96','583d4578e04cb.jpg','',0,1480322388,1480322390,1),(4,'','','593c898b4c4b4.jpg','',0,1497143216,1497143218,1),(5,'','','593c89a1d9701.jpg','',0,1497143254,1497143256,1);

#
# Structure for table "cy_article"
#

CREATE TABLE `cy_article` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8 NOT NULL,
  `content` text CHARACTER SET utf8 NOT NULL,
  `adminid` int(10) unsigned NOT NULL,
  `type` varchar(255) CHARACTER SET utf8 NOT NULL,
  `hits` int(11) unsigned NOT NULL,
  `footer` int(11) unsigned NOT NULL,
  `index` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `type` (`type`),
  KEY `adminid` (`adminid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "cy_article"
#


#
# Structure for table "cy_auth_extend"
#

CREATE TABLE `cy_auth_extend` (
  `group_id` mediumint(10) unsigned NOT NULL COMMENT '用户id',
  `extend_id` mediumint(8) unsigned NOT NULL COMMENT '扩展表中数据的id',
  `type` tinyint(1) unsigned NOT NULL COMMENT '扩展类型标识 1:栏目分类权限;2:模型权限',
  UNIQUE KEY `group_extend_type` (`group_id`,`extend_id`,`type`),
  KEY `uid` (`group_id`),
  KEY `group_id` (`extend_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_auth_extend"
#

INSERT INTO `cy_auth_extend` VALUES (1,1,1),(1,1,2),(1,2,1),(1,2,2),(1,3,1),(1,3,2),(1,4,1),(1,37,1);

#
# Structure for table "cy_auth_group"
#

CREATE TABLE `cy_auth_group` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '用户组id,自增主键',
  `module` varchar(20) NOT NULL COMMENT '用户组所属模块',
  `type` tinyint(4) NOT NULL COMMENT '组类型',
  `title` char(20) NOT NULL DEFAULT '' COMMENT '用户组中文名称',
  `description` varchar(80) NOT NULL DEFAULT '' COMMENT '描述信息',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '用户组状态：为1正常，为0禁用,-1为删除',
  `rules` varchar(500) NOT NULL DEFAULT '' COMMENT '用户组拥有的规则id，多个规则 , 隔开',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_auth_group"
#

INSERT INTO `cy_auth_group` VALUES (2,'admin',1,'财务管理组','拥有网站资金相关的权限',-1,'431'),(3,'admin',1,'超级管理员','超级管理员组,拥有系统所有权限',1,'424,426,431,433,434,435,436,437,438,439,440,441,443,444,445,446,447,448,449,450,451,452,453,454,455,456,458,459,460,461,462,463,465,466,467,469,470,471,473,474,475,476,477,479,480,481,482,484,485,486,487,488,489,490,491,492,493,494,495,496,497,498,499,500,501,502,503,504,505,506,507,508,509,510,511,512,513,514,515,516,517,518,519,520,521,522,523,525,526,527,528,529,530,531,532,533,534,535,536,537,538,539,540,541,542,543,544,545,546,547,548,549'),(4,'admin',1,'资讯管理员','拥有网站文章资讯相关权限11',-1,''),(5,'admin',1,'资讯管理员','拥有网站文章资讯相关权限',1,''),(6,'admin',1,'财务管理组','拥有网站资金相关的权限333',1,'1671,1686,1687,1740,1741,1742,1743,1763,1765,1779,1780,1805,1806,1826,1827,1828,1832,1840,1841'),(10,'admin',1,'财务管理组','拥有网站资金相关的权限333',1,''),(11,'admin',1,'ceshi','',1,'');

#
# Structure for table "cy_auth_group_access"
#

CREATE TABLE `cy_auth_group_access` (
  `uid` int(10) unsigned NOT NULL COMMENT '用户id',
  `group_id` mediumint(8) unsigned NOT NULL COMMENT '用户组id',
  UNIQUE KEY `uid_group_id` (`uid`,`group_id`),
  KEY `uid` (`uid`),
  KEY `group_id` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_auth_group_access"
#

INSERT INTO `cy_auth_group_access` VALUES (3,2),(2,3),(1,11);

#
# Structure for table "cy_auth_rule"
#

CREATE TABLE `cy_auth_rule` (
  `id` mediumint(8) unsigned NOT NULL AUTO_INCREMENT COMMENT '规则id,自增主键',
  `module` varchar(20) NOT NULL COMMENT '规则所属module',
  `type` tinyint(2) NOT NULL DEFAULT '1' COMMENT '1-url;2-主菜单',
  `name` char(80) NOT NULL DEFAULT '' COMMENT '规则唯一英文标识',
  `title` char(20) NOT NULL DEFAULT '' COMMENT '规则中文描述',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否有效(0:无效,1:有效)',
  `condition` varchar(300) NOT NULL DEFAULT '' COMMENT '规则附加条件',
  PRIMARY KEY (`id`),
  KEY `module` (`module`,`status`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=2043 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_auth_rule"
#

INSERT INTO `cy_auth_rule` VALUES (425,'admin',1,'Admin/article/add','新增',-1,''),(427,'admin',1,'Admin/article/setStatus','改变状态',-1,''),(428,'admin',1,'Admin/article/update','保存',-1,''),(429,'admin',1,'Admin/article/autoSave','保存草稿',-1,''),(430,'admin',1,'Admin/article/move','移动',-1,''),(432,'admin',2,'Admin/Article/mydocument','内容',-1,''),(437,'admin',1,'Admin/Trade/config','交易配置',-1,''),(449,'admin',1,'Admin/Index/operate','市场统计',-1,''),(455,'admin',1,'Admin/Issue/config','认购配置',-1,''),(457,'admin',1,'Admin/Index/database/type/export','数据备份',-1,''),(461,'admin',1,'Admin/Article/chat','聊天列表',-1,''),(464,'admin',1,'Admin/Index/database/type/import','数据还原',-1,''),(471,'admin',1,'Admin/Mytx/config','提现配置',-1,''),(472,'admin',2,'Admin/Mytx/index','提现',-1,''),(473,'admin',1,'Admin/Config/market','市场配置',-1,''),(477,'admin',1,'Admin/User/myzr','转入虚拟币',-1,''),(479,'admin',1,'Admin/User/myzc','转出虚拟币',-1,''),(482,'admin',2,'Admin/ExtA/index','扩展',-1,''),(488,'admin',1,'Admin/Auth_manager/createGroup','新增用户组',-1,''),(499,'admin',1,'Admin/ExtA/index','扩展管理',-1,''),(509,'admin',1,'Admin/Article/adver_edit','编辑',-1,''),(510,'admin',1,'Admin/Article/adver_status','修改',-1,''),(513,'admin',1,'Admin/Issue/index_edit','认购编辑',-1,''),(514,'admin',1,'Admin/Issue/index_status','认购修改',-1,''),(515,'admin',1,'Admin/Article/chat_edit','编辑',-1,''),(516,'admin',1,'Admin/Article/chat_status','修改',-1,''),(517,'admin',1,'Admin/User/coin_edit','coin修改',-1,''),(519,'admin',1,'Admin/Mycz/type_status','状态修改',-1,''),(520,'admin',1,'Admin/Issue/log_status','认购状态',-1,''),(521,'admin',1,'Admin/Issue/log_jiedong','认购解冻',-1,''),(522,'admin',1,'Admin/Tools/database/type/export','数据备份',-1,''),(525,'admin',1,'Admin/Config/coin_edit','编辑',-1,''),(526,'admin',1,'Admin/Config/coin_add','编辑币种',-1,''),(527,'admin',1,'Admin/Config/coin_status','状态修改',-1,''),(528,'admin',1,'Admin/Config/market_edit','编辑',-1,''),(530,'admin',1,'Admin/Tools/database/type/import','数据还原',-1,''),(541,'admin',2,'Admin/Trade/config','交易',-1,''),(569,'admin',1,'Admin/ADVERstatus','修改',-1,''),(570,'admin',1,'Admin/Tradelog/index','交易记录',-1,''),(585,'admin',1,'Admin/Config/mycz','充值配置',-1,''),(590,'admin',1,'Admin/Mycztype/index','充值类型',-1,''),(600,'admin',1,'Admin/Usergoods/index','用户联系地址',-1,''),(1379,'admin',1,'Admin/Bazaar/index','集市管理',-1,''),(1405,'admin',1,'Admin/Bazaar/config','集市配置',-1,''),(1425,'admin',1,'Admin/Bazaar/log','集市记录',-1,''),(1451,'admin',1,'Admin/Bazaar/invit','集市推广',-1,''),(1846,'admin',1,'Admin/AuthManager/createGroup','新增用户组',1,''),(1847,'admin',1,'Admin/AuthManager/editgroup','编辑用户组',1,''),(1848,'admin',1,'Admin/AuthManager/writeGroup','更新用户组',1,''),(1849,'admin',1,'Admin/AuthManager/changeStatus','改变状态',1,''),(1850,'admin',1,'Admin/AuthManager/access','访问授权',1,''),(1851,'admin',1,'Admin/AuthManager/category','分类授权',1,''),(1852,'admin',1,'Admin/AuthManager/user','成员授权',1,''),(1853,'admin',1,'Admin/AuthManager/tree','成员列表授权',1,''),(1854,'admin',1,'Admin/AuthManager/group','用户组',1,''),(1855,'admin',1,'Admin/AuthManager/addToGroup','添加到用户组',1,''),(1856,'admin',1,'Admin/AuthManager/removeFromGroup','用户组移除',1,''),(1857,'admin',1,'Admin/AuthManager/addToCategory','分类添加到用户组',1,''),(1858,'admin',1,'Admin/AuthManager/addToModel','模型添加到用户组',1,''),(1859,'admin',1,'Admin/Trade/status','修改状态',1,''),(1860,'admin',1,'Admin/Trade/chexiao','撤销挂单',1,''),(1861,'admin',1,'Admin/Shop/images','图片',1,''),(1862,'admin',1,'Admin/Login/index','用户登录',1,''),(1863,'admin',1,'Admin/Login/loginout','用户退出',1,''),(1864,'admin',1,'Admin/User/setpwd','修改管理员密码',1,''),(1865,'admin',2,'Admin/Index/index','系统',1,''),(1866,'admin',2,'Admin/Article/index','内容',1,''),(1867,'admin',2,'Admin/User/index','用户',1,''),(1868,'admin',2,'Admin/Finance/index','财务',1,''),(1869,'admin',2,'Admin/Trade/index','交易',1,''),(1870,'admin',2,'Admin/Game/index','应用',1,''),(1871,'admin',2,'Admin/Config/index','设置',1,''),(1872,'admin',2,'Admin/Operate/index','运营',1,''),(1873,'admin',2,'Admin/Tools/index','工具',1,''),(1874,'admin',2,'Admin/Cloud/index','扩展',1,''),(1875,'admin',1,'Admin/Index/index','系统概览',1,''),(1876,'admin',1,'Admin/Article/index','文章管理',1,''),(1877,'admin',1,'Admin/Article/edit','编辑添加',1,''),(1878,'admin',1,'Admin/Text/index','提示文字',1,''),(1879,'admin',1,'Admin/Text/edit','编辑',1,''),(1880,'admin',1,'Admin/Text/status','修改',1,''),(1881,'admin',1,'Admin/User/index','用户管理',1,''),(1882,'admin',1,'Admin/User/config','用户配置',1,''),(1883,'admin',1,'Admin/Finance/index','财务明细',1,''),(1884,'admin',1,'Admin/Finance/myczTypeEdit','编辑添加',1,''),(1885,'admin',1,'Admin/Finance/config','配置',1,''),(1886,'admin',1,'Admin/Tools/index','清理缓存',1,''),(1887,'admin',1,'Admin/Finance/type','类型',1,''),(1888,'admin',1,'Admin/Finance/type_status','状态修改',1,''),(1889,'admin',1,'Admin/User/edit','编辑添加',1,''),(1890,'admin',1,'Admin/User/status','修改状态',1,''),(1891,'admin',1,'Admin/User/adminEdit','编辑添加',1,''),(1892,'admin',1,'Admin/User/adminStatus','修改状态',1,''),(1893,'admin',1,'Admin/User/authEdit','编辑添加',1,''),(1894,'admin',1,'Admin/User/authStatus','修改状态',1,''),(1895,'admin',1,'Admin/User/authStart','重新初始化权限',1,''),(1896,'admin',1,'Admin/User/logEdit','编辑添加',1,''),(1897,'admin',1,'Admin/User/logStatus','修改状态',1,''),(1898,'admin',1,'Admin/User/qianbaoEdit','编辑添加',1,''),(1899,'admin',1,'Admin/Trade/index','委托管理',1,''),(1900,'admin',1,'Admin/User/qianbaoStatus','修改状态',1,''),(1901,'admin',1,'Admin/User/bankEdit','编辑添加',1,''),(1902,'admin',1,'Admin/User/bankStatus','修改状态',1,''),(1903,'admin',1,'Admin/User/coinEdit','编辑添加',1,''),(1904,'admin',1,'Admin/User/coinLog','财产统计',1,''),(1905,'admin',1,'Admin/User/goodsEdit','编辑添加',1,''),(1906,'admin',1,'Admin/User/goodsStatus','修改状态',1,''),(1907,'admin',1,'Admin/Article/typeEdit','编辑添加',1,''),(1908,'admin',1,'Admin/Article/linkEdit','编辑添加',1,''),(1909,'admin',1,'Admin/Config/index','基本配置',1,''),(1910,'admin',1,'Admin/Article/adverEdit','编辑添加',1,''),(1911,'admin',1,'Admin/User/authAccess','访问授权',1,''),(1912,'admin',1,'Admin/User/authAccessUp','访问授权修改',1,''),(1913,'admin',1,'Admin/User/authUser','成员授权',1,''),(1914,'admin',1,'Admin/User/authUserAdd','成员授权增加',1,''),(1915,'admin',1,'Admin/User/authUserRemove','成员授权解除',1,''),(1916,'admin',1,'Admin/Operate/index','推广奖励',1,''),(1917,'admin',1,'Admin/App/config','APP配置',1,''),(1918,'admin',1,'AdminUser/detail','后台用户详情',1,''),(1919,'admin',1,'AdminUser/status','后台用户状态',1,''),(1920,'admin',1,'AdminUser/add','后台用户新增',1,''),(1921,'admin',1,'AdminUser/edit','后台用户编辑',1,''),(1922,'admin',1,'Admin/Articletype/edit','编辑',1,''),(1923,'admin',1,'Admin/Shop/index','商品管理',1,''),(1924,'admin',1,'Admin/Huafei/index','充值记录',1,''),(1925,'admin',1,'Admin/Huafei/config','充值配置',1,''),(1926,'admin',1,'Admin/Vote/index','投票记录',1,''),(1927,'admin',1,'Admin/Vote/type','投票类型',1,''),(1928,'admin',1,'Admin/Money/index','理财管理',1,''),(1929,'admin',1,'Admin/Issue/index','认购管理',1,''),(1930,'admin',1,'Admin/Issue/log','认购记录',1,''),(1931,'admin',1,'Admin/Article/images','上传图片',1,''),(1932,'admin',1,'Admin/Adver/edit','编辑',1,''),(1933,'admin',1,'Admin/Adver/status','修改',1,''),(1934,'admin',1,'Admin/Article/type','文章类型',1,''),(1935,'admin',1,'Admin/User/index_edit','编辑',1,''),(1936,'admin',1,'Admin/User/index_status','修改',1,''),(1937,'admin',1,'Admin/Finance/mycz','人民币充值',1,''),(1938,'admin',1,'Admin/Finance/myczTypeStatus','状态修改',1,''),(1939,'admin',1,'Admin/Finance/myczTypeImage','上传图片',1,''),(1940,'admin',1,'Admin/Finance/mytxStatus','修改状态',1,''),(1941,'admin',1,'Admin/Tools/dataExport','备份数据库',1,''),(1942,'admin',1,'Admin/Tools/dataImport','还原数据库',1,''),(1943,'admin',1,'Admin/User/admin','管理员管理',1,''),(1944,'admin',1,'Admin/Trade/log','成交记录',1,''),(1945,'admin',1,'Admin/Issue/edit','认购编辑',1,''),(1946,'admin',1,'Admin/Issue/status','认购修改',1,''),(1947,'admin',1,'Admin/Config/moble','短信配置',1,''),(1948,'admin',1,'Admin/Invit/config','推广配置',1,''),(1949,'admin',1,'Admin/App/vip_config_list','APP等级',1,''),(1950,'admin',1,'Admin/Link/edit','编辑',1,''),(1951,'admin',1,'Admin/Link/status','修改',1,''),(1952,'admin',1,'Admin/Index/coin','币种统计',1,''),(1953,'admin',1,'Admin/Shop/config','商城配置',1,''),(1954,'admin',1,'Admin/Money/log','理财日志',1,''),(1955,'admin',1,'Admin/Index/market','市场统计',1,''),(1956,'admin',1,'Admin/Chat/edit','编辑',1,''),(1957,'admin',1,'Admin/Chat/status','修改',1,''),(1958,'admin',1,'Admin/Article/adver','广告管理',1,''),(1959,'admin',1,'Admin/Trade/chat','交易聊天',1,''),(1960,'admin',1,'Admin/Finance/myczType','人民币充值方式',1,''),(1961,'admin',1,'Admin/Usercoin/edit','财产修改',1,''),(1962,'admin',1,'Admin/Finance/mytxExcel','导出选中',1,''),(1963,'admin',1,'Admin/User/auth','权限列表',1,''),(1964,'admin',1,'Admin/Mycz/status','修改',1,''),(1965,'admin',1,'Admin/Mycztype/status','状态修改',1,''),(1966,'admin',1,'Admin/Config/contact','客服配置',1,''),(1967,'admin',1,'Admin/App/adsblock_list','APP广告板块',1,''),(1968,'admin',1,'Admin/Tools/queue','服务器队列',1,''),(1969,'admin',1,'Admin/Tools/qianbao','钱包检查',1,''),(1970,'admin',1,'Admin/Shop/type','商品类型',1,''),(1971,'admin',1,'Admin/Fenhong/index','分红管理',1,''),(1972,'admin',1,'Admin/Huafei/type','充值金额',1,''),(1973,'admin',1,'Admin/Money/fee','理财明细',1,''),(1974,'admin',1,'Admin/Article/link','友情链接',1,''),(1975,'admin',1,'Admin/User/log','登陆日志',1,''),(1976,'admin',1,'Admin/Finance/mytx','人民币提现',1,''),(1977,'admin',1,'Admin/Finance/mytxChuli','正在处理',1,''),(1978,'admin',1,'Admin/Config/bank','银行配置',1,''),(1979,'admin',1,'Admin/Config/bank_edit','编辑',1,''),(1980,'admin',1,'Admin/Coin/edit','编辑',1,''),(1981,'admin',1,'Admin/Coin/status','状态修改',1,''),(1982,'admin',1,'Admin/Market/edit','编辑市场',1,''),(1983,'admin',1,'Admin/Config/market_add','状态修改',1,''),(1984,'admin',1,'Admin/Tools/invoke','其他模块调用',1,''),(1985,'admin',1,'Admin/Tools/optimize','优化表',1,''),(1986,'admin',1,'Admin/Tools/repair','修复表',1,''),(1987,'admin',1,'Admin/Tools/del','删除备份文件',1,''),(1988,'admin',1,'Admin/Tools/export','备份数据库',1,''),(1989,'admin',1,'Admin/Tools/import','还原数据库',1,''),(1990,'admin',1,'Admin/Tools/excel','导出数据库',1,''),(1991,'admin',1,'Admin/Tools/exportExcel','导出Excel',1,''),(1992,'admin',1,'Admin/Tools/importExecl','导入Excel',1,''),(1993,'admin',1,'Admin/Config/coin','币种配置',1,''),(1994,'admin',1,'Admin/User/detail','用户详情',1,''),(1995,'admin',1,'Admin/App/ads_user','APP广告用户',1,''),(1996,'admin',1,'Admin/Cloud/theme','主题模板',1,''),(1997,'admin',1,'Admin/Shop/coin','付款方式',1,''),(1998,'admin',1,'Admin/Huafei/coin','付款方式',1,''),(1999,'admin',1,'Admin/Trade/comment','币种评论',1,''),(2000,'admin',1,'Admin/User/qianbao','用户钱包',1,''),(2001,'admin',1,'Admin/Trade/market','交易市场',1,''),(2002,'admin',1,'Admin/Finance/mytxConfig','人民币提现配置',1,''),(2003,'admin',1,'Admin/Finance/mytxChexiao','撤销提现',1,''),(2004,'admin',1,'Admin/Mytx/status','状态修改',1,''),(2005,'admin',1,'Admin/Mytx/excel','取消',1,''),(2006,'admin',1,'Admin/Mytx/exportExcel','导入excel',1,''),(2007,'admin',1,'Admin/Menu/index','菜单管理',1,''),(2008,'admin',1,'Admin/Menu/sort','排序',1,''),(2009,'admin',1,'Admin/Menu/add','添加',1,''),(2010,'admin',1,'Admin/Menu/edit','编辑',1,''),(2011,'admin',1,'Admin/Cloud/kefu','客服代码',1,''),(2012,'admin',1,'Admin/Menu/del','删除',1,''),(2013,'admin',1,'Admin/Cloud/kefuUp','使用',1,''),(2014,'admin',1,'Admin/Menu/toogleHide','是否隐藏',1,''),(2015,'admin',1,'Admin/Menu/toogleDev','是否开发',1,''),(2016,'admin',1,'Admin/Menu/importFile','导入文件',1,''),(2017,'admin',1,'Admin/Menu/import','导入',1,''),(2018,'admin',1,'Admin/Config/text','提示文字',1,''),(2019,'admin',1,'Admin/Shop/log','购物记录',1,''),(2020,'admin',1,'Admin/Fenhong/log','分红记录',1,''),(2021,'admin',1,'Admin/User/bank','提现地址',1,''),(2022,'admin',1,'Admin/Trade/invit','交易推荐',1,''),(2023,'admin',1,'Admin/Finance/myzr','虚拟币转入',1,''),(2024,'admin',1,'Admin/Finance/mytxQueren','确认提现',1,''),(2025,'admin',1,'Admin/Finance/myzcQueren','确认转出',1,''),(2026,'admin',1,'Admin/Config/qita','其他配置',1,''),(2027,'admin',1,'Admin/Shop/goods','收货地址',1,''),(2028,'admin',1,'Admin/User/coin','用户财产',1,''),(2029,'admin',1,'Admin/Finance/myzc','虚拟币转出',1,''),(2030,'admin',1,'Admin/Verify/code','图形验证码',1,''),(2031,'admin',1,'Admin/Verify/mobile','手机验证码',1,''),(2032,'admin',1,'Admin/Verify/email','邮件验证码',1,''),(2033,'admin',1,'Admin/Config/daohang','导航配置',1,''),(2034,'admin',1,'Admin/User/goods','联系地址',1,''),(2035,'admin',1,'Admin/User/myzc_qr','确认转出',1,''),(2036,'admin',1,'Admin/Article/status','修改状态',1,''),(2037,'admin',1,'Admin/Finance/myczStatus','修改状态',1,''),(2038,'admin',1,'Admin/Finance/myczQueren','确认到账',1,''),(2039,'admin',1,'Admin/Article/typeStatus','修改状态',1,''),(2040,'admin',1,'Admin/Article/linkStatus','修改状态',1,''),(2041,'admin',1,'Admin/Article/adverStatus','修改状态',1,''),(2042,'admin',1,'Admin/Article/adverImage','上传图片',1,'');

#
# Structure for table "cy_bazaar"
#

CREATE TABLE `cy_bazaar` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `coin` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `deal` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='集市交易表';

#
# Data for table "cy_bazaar"
#


#
# Structure for table "cy_bazaar_config"
#

CREATE TABLE `cy_bazaar_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `market` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '市场名称',
  `price_min` decimal(20,8) unsigned NOT NULL COMMENT '最小交易价格',
  `price_max` decimal(20,8) unsigned NOT NULL COMMENT '最大交易价格',
  `num_mix` decimal(20,8) unsigned NOT NULL COMMENT '最小交易数量',
  `num_max` decimal(20,8) unsigned NOT NULL COMMENT '最大交易数量',
  `invit_coin` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '上家赠送币种',
  `invit_1` decimal(20,8) unsigned NOT NULL COMMENT '一代赠送比例',
  `invit_2` decimal(20,8) unsigned NOT NULL COMMENT '二代赠送比例',
  `invit_3` decimal(20,8) unsigned NOT NULL COMMENT '三代赠送比例',
  `fee` varchar(50) CHARACTER SET utf8 NOT NULL COMMENT '手续费',
  `default` tinyint(2) unsigned NOT NULL COMMENT '默认',
  `sort` int(11) unsigned NOT NULL COMMENT '排序',
  `addtime` int(11) unsigned NOT NULL COMMENT '添加时间',
  `endtime` int(11) unsigned NOT NULL COMMENT '编辑时间',
  `status` tinyint(2) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `coinname` (`market`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "cy_bazaar_config"
#


#
# Structure for table "cy_bazaar_invit"
#

CREATE TABLE `cy_bazaar_invit` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `invit` int(11) unsigned NOT NULL,
  `name` varchar(50) CHARACTER SET utf8 NOT NULL,
  `type` varchar(50) CHARACTER SET utf8 NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "cy_bazaar_invit"
#


#
# Structure for table "cy_bazaar_log"
#

CREATE TABLE `cy_bazaar_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `peerid` int(11) unsigned NOT NULL,
  `coin` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`),
  KEY `peerid` (`peerid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='集市交易记录表';

#
# Data for table "cy_bazaar_log"
#


#
# Structure for table "cy_category"
#

CREATE TABLE `cy_category` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(30) NOT NULL COMMENT '标志',
  `title` varchar(50) NOT NULL COMMENT '标题',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上级分类ID',
  `sort` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序（同级有效）',
  `list_row` tinyint(3) unsigned NOT NULL DEFAULT '10' COMMENT '列表每页行数',
  `meta_title` varchar(50) NOT NULL DEFAULT '' COMMENT 'SEO的网页标题',
  `keywords` varchar(255) NOT NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) NOT NULL DEFAULT '' COMMENT '描述',
  `template_index` varchar(100) NOT NULL COMMENT '频道页模板',
  `template_lists` varchar(100) NOT NULL COMMENT '列表页模板',
  `template_detail` varchar(100) NOT NULL COMMENT '详情页模板',
  `template_edit` varchar(100) NOT NULL COMMENT '编辑页模板',
  `model` varchar(100) NOT NULL DEFAULT '' COMMENT '关联模型',
  `type` varchar(100) NOT NULL DEFAULT '' COMMENT '允许发布的内容类型',
  `link_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '外链',
  `allow_publish` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '是否允许发布内容',
  `display` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '可见性',
  `reply` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '是否允许回复',
  `check` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '发布的文章是否需要审核',
  `reply_model` varchar(100) NOT NULL DEFAULT '',
  `extend` text NOT NULL COMMENT '扩展设置',
  `create_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '创建时间',
  `update_time` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '更新时间',
  `status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '数据状态',
  `icon` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '分类图标',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_name` (`name`),
  KEY `pid` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='分类表';

#
# Data for table "cy_category"
#

INSERT INTO `cy_category` VALUES (1,'blog','博客',0,0,10,'','','','','','','','2','2,1',0,0,1,0,0,'1','',1379474947,1382701539,1,0),(2,'default_blog','默认分类',1,1,10,'','','','','','','','2','2,1,3',0,1,1,0,1,'1','',1379475028,1386839751,1,31);

#
# Structure for table "cy_chatlog"
#

CREATE TABLE `cy_chatlog` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `to` varchar(20) NOT NULL COMMENT '接收人',
  `from` varchar(20) NOT NULL COMMENT '发送人',
  `content` varchar(255) NOT NULL COMMENT '内容',
  `time` varchar(20) NOT NULL,
  `order_id` int(11) NOT NULL,
  `type` char(10) NOT NULL COMMENT '图片还是文字',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_chatlog"
#


#
# Structure for table "cy_coin"
#

CREATE TABLE `cy_coin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `img` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `fee_bili` varchar(50) NOT NULL,
  `endtime` int(11) unsigned NOT NULL COMMENT '',
  `addtime` int(11) unsigned NOT NULL,
  `status` int(4) unsigned NOT NULL,
  `fee_meitian` varchar(200) NOT NULL COMMENT '每天限制',
  `dj_zj` varchar(200) NOT NULL,
  `dj_dk` varchar(200) NOT NULL,
  `dj_yh` varchar(200) NOT NULL,
  `dj_mm` varchar(200) NOT NULL,
  `zr_zs` varchar(50) NOT NULL,
  `zr_jz` varchar(50) NOT NULL,
  `zr_dz` varchar(50) NOT NULL,
  `zr_sm` varchar(50) NOT NULL,
  `zc_sm` varchar(50) NOT NULL,
  `zc_fee` varchar(50) NOT NULL,
  `zc_user` varchar(50) NOT NULL,
  `zc_min` varchar(50) NOT NULL,
  `zc_max` varchar(50) NOT NULL,
  `zc_jz` varchar(50) NOT NULL,
  `zc_zd` varchar(50) NOT NULL,
  `js_yw` varchar(50) NOT NULL,
  `js_sm` text NOT NULL,
  `js_qb` varchar(50) NOT NULL,
  `js_ym` varchar(50) NOT NULL,
  `js_gw` varchar(50) NOT NULL,
  `js_lt` varchar(50) NOT NULL,
  `js_wk` varchar(50) NOT NULL,
  `cs_yf` varchar(50) NOT NULL,
  `cs_sf` varchar(50) NOT NULL,
  `cs_fb` varchar(50) NOT NULL,
  `cs_qk` varchar(50) NOT NULL,
  `cs_zl` varchar(50) NOT NULL,
  `cs_cl` varchar(50) NOT NULL,
  `cs_zm` varchar(50) NOT NULL,
  `cs_nd` varchar(50) NOT NULL,
  `cs_jl` varchar(50) NOT NULL,
  `cs_ts` varchar(50) NOT NULL,
  `cs_bz` varchar(50) NOT NULL,
  `tp_zs` varchar(50) NOT NULL,
  `tp_js` varchar(50) NOT NULL,
  `tp_yy` varchar(50) NOT NULL,
  `tp_qj` varchar(50) NOT NULL DEFAULT '',
  `min_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最低价格',
  `max_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '最高价格',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='币种配置表';

#
# Data for table "cy_coin"
#

INSERT INTO `cy_coin` VALUES (12,'btc','qbb','比特币','',0,'0',0,0,0,'','127.0.0.1','29990','admin','123456','0','1','1','','','0.01','','0','10000','1','10','bitcoin','','','','','','','','','','','','','','','','','','','','','',0.00,0.00),(13,'ltc','qbb','莱特币','',0,'0',0,0,0,'','127.0.0.1','29990','root','root','0','1','1','','','0.01','19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','0','10000','1','10','litecoin','','','','','','','','','','','','','','','','','','','','','',0.00,0.00),(14,'eth','qbb','以太坊','',0,'0',0,0,0,'','127.0.0.1','29990','root','root','0','1','1','','','0.01','19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','0','10000','1','10','ethereum','','','','','','','','','','','','','','','','','','','','','',0.00,0.00),(15,'usdt','qbb','USDT','',0,'0',0,0,1,'','','','','','0','1','1','','','0','0','0','10000','1','10','USDT','','','','','','','','','','','','','','','','','','','','','',10.00,20.00);

#
# Structure for table "cy_coin_json"
#

CREATE TABLE `cy_coin_json` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `data` varchar(500) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(100) COLLATE utf8_unicode_ci NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "cy_coin_json"
#


#
# Structure for table "cy_config"
#

CREATE TABLE `cy_config` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `footer_logo` varchar(200) NOT NULL COMMENT ' ',
  `huafei_zidong` varchar(200) NOT NULL COMMENT '名称',
  `kefu` varchar(200) NOT NULL,
  `huafei_openid` varchar(200) NOT NULL COMMENT '名称',
  `huafei_appkey` varchar(200) NOT NULL COMMENT '名称',
  `index_lejimum` varchar(200) NOT NULL COMMENT '设置',
  `login_verify` varchar(200) NOT NULL COMMENT '设置',
  `fee_meitian` varchar(200) NOT NULL COMMENT '设置',
  `top_name` varchar(200) NOT NULL COMMENT '设置',
  `web_name` varchar(200) NOT NULL,
  `web_title` varchar(200) NOT NULL,
  `web_logo` varchar(200) NOT NULL,
  `web_llogo_small` varchar(200) NOT NULL,
  `web_keywords` text NOT NULL,
  `web_description` text NOT NULL,
  `web_close` text NOT NULL,
  `web_close_cause` text NOT NULL,
  `web_icp` text NOT NULL,
  `web_cnzz` text NOT NULL,
  `web_ren` text NOT NULL,
  `web_reg` text NOT NULL,
  `market_mr` text NOT NULL,
  `xnb_mr` text NOT NULL,
  `rmb_mr` text NOT NULL,
  `web_waring` text NOT NULL,
  `moble_type` text NOT NULL,
  `moble_url` text NOT NULL,
  `moble_user` text NOT NULL,
  `moble_pwd` text NOT NULL,
  `contact_moble` text NOT NULL,
  `contact_weibo` text NOT NULL,
  `contact_tqq` text NOT NULL,
  `contact_qq` text NOT NULL,
  `contact_qqun` text NOT NULL,
  `contact_weixin` text NOT NULL,
  `contact_weixin_img` text NOT NULL,
  `contact_email` text NOT NULL,
  `contact_alipay` text NOT NULL,
  `contact_alipay_img` text NOT NULL,
  `contact_bank` text NOT NULL,
  `user_truename` text NOT NULL,
  `user_moble` text NOT NULL,
  `user_alipay` text NOT NULL,
  `user_bank` text NOT NULL,
  `user_text_truename` text NOT NULL,
  `user_text_moble` text NOT NULL,
  `user_text_alipay` text NOT NULL,
  `user_text_bank` text NOT NULL,
  `user_text_log` text NOT NULL,
  `user_text_password` text NOT NULL,
  `user_text_paypassword` text NOT NULL,
  `mytx_min` text NOT NULL,
  `mytx_max` text NOT NULL,
  `mytx_bei` text NOT NULL,
  `mytx_coin` text NOT NULL,
  `mytx_fee` text NOT NULL,
  `trade_min` text NOT NULL,
  `trade_max` text NOT NULL,
  `trade_limit` text NOT NULL,
  `trade_text_log` text NOT NULL,
  `issue_ci` text NOT NULL,
  `issue_jian` text NOT NULL,
  `issue_min` text NOT NULL,
  `issue_max` text NOT NULL,
  `money_min` text NOT NULL,
  `money_max` text NOT NULL,
  `money_bei` text NOT NULL,
  `money_text_index` text NOT NULL,
  `money_text_log` text NOT NULL,
  `money_text_type` text NOT NULL,
  `invit_type` text NOT NULL,
  `invit_fee1` text NOT NULL,
  `invit_fee2` text NOT NULL,
  `invit_fee3` text NOT NULL,
  `invit_text_txt` text NOT NULL,
  `invit_text_log` text NOT NULL,
  `index_notice_1` text NOT NULL,
  `index_notice_11` text NOT NULL,
  `index_notice_2` text NOT NULL,
  `index_notice_22` text NOT NULL,
  `index_notice_3` text NOT NULL,
  `index_notice_33` text NOT NULL,
  `index_notice_4` text NOT NULL,
  `index_notice_44` text NOT NULL,
  `text_footer` text NOT NULL,
  `shop_text_index` text NOT NULL,
  `shop_text_log` text NOT NULL,
  `shop_text_addr` text NOT NULL,
  `shop_text_view` text NOT NULL,
  `huafei_text_index` text NOT NULL,
  `huafei_text_log` text NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  `shop_coin` varchar(200) NOT NULL COMMENT '计算方式',
  `shop_logo` varchar(200) NOT NULL COMMENT '商城LOGO',
  `shop_login` varchar(200) NOT NULL COMMENT '是否要登陆',
  `index_html` varchar(50) DEFAULT NULL,
  `trade_hangqing` varchar(50) DEFAULT NULL,
  `trade_moshi` varchar(50) DEFAULT NULL,
  `order_fee` varchar(10) DEFAULT NULL COMMENT '每笔交易的手续费',
  `yqr_fee` varchar(10) DEFAULT NULL COMMENT '邀请人得到的奖励',
  `jkaddress` varchar(255) DEFAULT NULL COMMENT '接口地址',
  `jkmy` varchar(255) DEFAULT NULL COMMENT '接口密钥',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='系统配置表';

#
# Data for table "cy_config"
#

INSERT INTO `cy_config` VALUES (1,'593bea637de29.png','1','c','','','0','1','',' ','','','593be948ca2dd.png','593bea1553ec6.png','','','1','升级中...','粤ICP备16111021号-1','','100','<div style=\"text-align:center;\">\r\n\t<div style=\"text-align:left;\">\r\n\t\t<span style=\"color:#337FE5;\">根椐人民银行等有关部委的相关规定，比特币等数字货币系特殊的虚拟商品，作为互联网上的商品买卖行为，普通民众在自担风险的前提下拥有参与的自由。数字货币行业目前存在很多不确定，不可控的风险因素（如预挖、暴涨暴跌、庄家操控、团队解散、技术缺陷等），导致交易具有极高的风险。滑稽之家仅为数字货币等虚拟商品的爱好者提供一个自由的网上交换平台，对在滑稽之家平台交换的数字货币等虚拟商品的来源、价值，网站运营方不承担任何审查、担保、赔偿的法律责任。<br />\r\n<br />\r\n<br />\r\n<br />\r\n请您务必注意以下几点：<br />\r\n<br />\r\n<br />\r\n<br />\r\n1.警惕虚假宣传，不要听信任何币值会永远上涨的宣传，数字货币作为一种虚拟商品，具有极高的风险，很可能出现价值归零的情况。<br />\r\n<br />\r\n2.对于推广和运营方的市场承诺，需要谨慎判别，目前并没有相关法律能保证其兑现承诺，投币网不会对任何数字货币进行背书和承诺。<br />\r\n<br />\r\n3.坚决拒绝多层次传销组织，在我国参与该类组织是违法行为，造成的一切后果自负，平台将配合相关执法部门的要求进行调查、取证。<br />\r\n<br />\r\n4.根据《中华人民共和国反洗钱法》等有关法律规定，严格禁止利用平台进行洗钱等违法犯罪活动，平台将配合相关执法部门的要求进行调查、取证。<br />\r\n<br />\r\n5.数字货币和数字积分等虚拟商品所对应的实物财产和持有者享有的权利存在因发行方等义务相关方破产，关闭或违法犯罪等其他经营风险导致无法兑现的风险。<br />\r\n<br />\r\n6.在滑稽之家注册参与交换的用户，应保证注册身份信息的真实、准确，保证拟交换的数字货币等虚拟商品的来源合法。因信息不真实造成的任何问题，平台概不负责。<br />\r\n<br />\r\n7.因国家法律，法规及政策性文件的制定和修改，导致数字货币等虚拟商品的交易被暂停或者禁止的，由此导致的全部损失由用户自行承担。<br />\r\n<br />\r\n8.请控制风险，不要投入超过您风险承受能力的资金，不要购买您所不了解的数字货币，数字积分等虚拟商品。<br />\r\n                                               2017-2-7</span> \r\n\t</div>\r\n\t<div style=\"text-align:left;\">\r\n\t\t<span style=\"color:#337FE5;\"></span> \r\n\t</div>\r\n</div>\r\n<p>\r\n\t<span style=\"color:#E56600;font-size:10px;\"></span> \r\n</p>','fc_cny','fc','cny','风险警告：根椐人民银行等有关部委的相关规定，比特币等数字货币系特殊的虚拟商品，作为互联网上的商品买卖行为，普通民众在自担风险的前提下拥有参与的自由。数字货币行业目前存在很多不确定，不可控的风险因素（如预挖、暴涨暴跌、庄家操控、团队解散、技术缺陷等），导致交易具有极高的风险。滑稽之家仅为数字货币等虚拟商品的爱好者提供一个自由的网上交换平台，对在滑稽之家平台交换的数字货币等虚拟商品的来源、价值，网站运营方不承担任何审查、担保、赔偿的法律责任，如果您不能接受，请不要进行交易！','1','','','','15611811882','','','1203987654| 413679447','466562997','li83839140','56f98e6d70135.jpg','83839140@qq.com','83839140@qq.com','56f98e6d7245d.jpg','中国银行|动说科技|0000 0000 0000 0000','2','2','2','2','&lt;span&gt;&lt;span&gt;会员您好,务必正确填写好自己的真实姓名和真实身份证号码.&lt;/span&gt;&lt;/span&gt;','&lt;span&gt;会员您好,务必用自己的手机号码进行手机认证,认证以后可以用来接收验证码.&lt;/span&gt;','&lt;span&gt;会员您好,务必正确填写支付宝 &amp;nbsp;真实姓名（与实名认证姓名相同）和支付宝账号,后期提现唯一依据.&lt;/span&gt;','&lt;span&gt;会员您好,&lt;/span&gt;&lt;span&gt;&lt;span&gt;务必正确填写银行卡信息 提现唯一依据.&lt;/span&gt;&lt;span&gt;&lt;/span&gt;&lt;/span&gt;','&lt;span&gt;自己以往操作和登录及登录地点的相关记录.&lt;/span&gt;','&lt;span&gt;会员您好,修改登录密码以后请不要忘记.若不记得旧登录密码,请点击--&lt;/span&gt;&lt;span style=&quot;color:#EE33EE;&quot;&gt;忘记密码&lt;/span&gt;','&lt;span&gt;会员您好,修改交易密码以后请不要忘记.若不记得旧交易密码,请点击--&lt;/span&gt;&lt;span style=&quot;color:#EE33EE;&quot;&gt;忘记密码&lt;/span&gt;','50','50000','100','cny','1.233','1','10000000','10','&lt;span&gt;&lt;span&gt;你委托买入或者卖出成功交易后的记录.&lt;/span&gt;&lt;/span&gt;','5','24','1','100000','100','100000','100','理财首页','理财记录','理财类型','1','5','3','2','一起来滑稽吧！','&lt;span&gt;&lt;span&gt;查看自己推广的好友,请点击&lt;/span&gt;&lt;span style=&quot;color:#EE33EE;&quot;&gt;“+”&lt;/span&gt;&lt;span&gt;,同时正确引导好友实名认证以及买卖,赚取推广收益和交易手续费.&lt;/span&gt;&lt;/span&gt;','系统可靠','银行级用户数据加密、动态身份验证多级风险识别控制，保障交易安全','系统可靠','账户多层加密，分布式服务器离线存储，即时隔离备份数据，确保安全','快捷方便','充值即时、提现迅速，每秒万单的高性能交易引擎，保证一切快捷方便','服务专业','热忱的客服工作人员和24小时的技术团队随时为您的账户安全保驾护航','&lt;p&gt;\r\n\t&lt;a href=&quot;/Article/index/type/aboutus.html&quot; target=&quot;_blank&quot;&gt;/Article/index/type/aboutus.html&lt;/a&gt;\r\n&lt;/p&gt;\r\n&lt;p&gt;\r\n\t&lt;br /&gt;\r\n&lt;/p&gt;\r\n&lt;p&gt;\r\n\t&amp;lt;a href=&quot;&lt;a href=&quot;/Article/index/type/aboutus.html&quot; target=&quot;_blank&quot;&gt;/Article/index/type/aboutus.html&lt;/a&gt;&quot;&amp;gt;关于我们&amp;lt;/a&amp;gt;\r\n&lt;/p&gt;\r\n|&lt;br /&gt;\r\n&amp;lt;a href=&quot;/Article/index/type/aboutus.html&quot;&amp;gt;联系我们&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n|&lt;br /&gt;\r\n&amp;lt;a href=&quot;/Article/index/type/aboutus.html&quot;&amp;gt;资质证明&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n|&lt;br /&gt;\r\n&amp;lt;a href=&quot;/Article/index/type/aboutus.html&quot;&amp;gt;用户协议&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n|&lt;br /&gt;\r\n&amp;lt;a href=&quot;/Article/index/type/aboutus.html&quot;&amp;gt;法律声明&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n&amp;lt;p style=&quot;margin-top: 5px;text-align: center;&quot;&amp;gt;&lt;br /&gt;\r\nCopyright &amp;copy; 2016&lt;br /&gt;\r\n&amp;lt;a href=&quot;/&quot;&amp;gt;{$C[\'web_name\']}交易平台 &amp;lt;/a&amp;gt;&lt;br /&gt;\r\nAll Rights Reserved.&lt;br /&gt;\r\n&amp;lt;a href=&quot;http://www.miibeian.gov.cn/&quot;&amp;gt;{$C[\'web_icp\']}&amp;lt;/a&amp;gt;{$C[\'web_cnzz\']|htmlspecialchars_decode}&lt;br /&gt;\r\n&lt;br /&gt;\r\n&amp;lt;/p&amp;gt;&lt;br /&gt;\r\n&amp;lt;p class=&quot;clear1&quot; id=&quot;ut646&quot; style=&quot;margin-top: 10px;text-align: center;&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;a href=&quot;http://webscan.360.cn/index/checkwebsite/url/www.zuocoin.com&quot; target=&quot;_blank&quot;&amp;gt;&amp;lt;img border=&quot;0&quot; width=&quot;83&quot; height=&quot;31&quot; src=&quot;http://img.webscan.360.cn/status/pai/hash/a272bae5f02b1df25be2c1d9d0b251f7&quot;/&amp;gt;&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n&amp;lt;a href=&quot;http://www.szfw.org/&quot; target=&quot;_blank&quot; id=&quot;ut118&quot; class=&quot;margin10&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;img src=&quot;__UPLOAD__/footer/footer_2.png&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n&amp;lt;a href=&quot;http://www.miibeian.gov.cn/&quot; target=&quot;_blank&quot; id=&quot;ut119&quot; class=&quot;margin10&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;img src=&quot;__UPLOAD__/footer/footer_3.png&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n&amp;lt;a href=&quot;http://www.cyberpolice.cn/&quot; target=&quot;_blank&quot; id=&quot;ut120&quot; class=&quot;margin10&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;img src=&quot;__UPLOAD__/footer/footer_4.png&quot;&amp;gt;&lt;br /&gt;\r\n&amp;lt;/a&amp;gt;&lt;br /&gt;\r\n&amp;lt;/p&amp;gt;&lt;br /&gt;','','','','','','',1467383018,0,'','/Upload/shop/5897ee777f0a8.jpg','0','a','1','0','0','0','27.102.115.163:8118','$mVd!w9R%Wr4NDSJr8');

#
# Structure for table "cy_country"
#

CREATE TABLE `cy_country` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `country_name` varchar(20) NOT NULL,
  `country_code` int(10) unsigned NOT NULL,
  `area` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_country"
#


#
# Structure for table "cy_daohang"
#

CREATE TABLE `cy_daohang` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `name` varchar(255) NOT NULL COMMENT '名称',
  `title` varchar(255) NOT NULL COMMENT '名称',
  `url` varchar(255) NOT NULL COMMENT 'url',
  `sort` int(11) unsigned NOT NULL COMMENT '排序',
  `addtime` int(11) unsigned NOT NULL COMMENT '添加时间',
  `endtime` int(11) unsigned NOT NULL COMMENT '编辑时间',
  `status` tinyint(4) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_daohang"
#

INSERT INTO `cy_daohang` VALUES (1,'finance','财务中心','Finance/index',1,0,0,1),(2,'user','安全中心','User/index',2,0,0,1),(3,'Issue','应用中心','Issue/index',3,0,0,0),(4,'article','帮助中心','Article/index',7,0,0,1),(6,'shop','云购商城','Shop/index',5,0,0,0),(7,'vote','新币投票','Vote/index',6,0,0,0),(8,' Issue','认购中心','Issue/index',4,1474183878,0,1),(9,'推广返佣','推广返佣','promote/index.html',4,1480423054,0,0);

#
# Structure for table "cy_evaluation"
#

CREATE TABLE `cy_evaluation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `orderid` int(11) unsigned NOT NULL,
  `evaluation` varchar(20) NOT NULL COMMENT '评价 ',
  `addtime` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;

#
# Data for table "cy_evaluation"
#

INSERT INTO `cy_evaluation` VALUES (1,2,7,'NEUTRAL','1511359246'),(2,1,7,'NEUTRAL','1511359264'),(3,2,8,'NEUTRAL','1511359424'),(4,1,8,'NEUTRAL','1511359881'),(5,1,9,'NEGATIVE','1511360394'),(6,2,9,'NEGATIVE','1511360404'),(7,1,10,'NEGATIVE','1511360551'),(8,2,10,'NEUTRAL','1511360559'),(9,2,11,'NEUTRAL','1511360681'),(10,1,11,'POSITIVE','1511360915'),(11,2,12,'NEUTRAL','1511399602'),(12,1,12,'NEUTRAL','1511399637'),(13,1,13,'NEUTRAL','1511399865'),(14,2,13,'NEUTRAL','1511399873'),(15,2,14,'NEUTRAL','1511399936'),(16,1,14,'NEGATIVE','1511399941'),(17,2,15,'NEUTRAL','1511400188'),(18,1,15,'NEGATIVE','1511400191'),(19,2,16,'POSITIVE','1511400293'),(20,1,16,'NEUTRAL','1511400300'),(21,1,17,'NEGATIVE','1511400488'),(22,2,17,'NEUTRAL','1511400500'),(23,1,18,'NEGATIVE','1511400689'),(24,2,18,'NEUTRAL','1511400695'),(25,4,25,'POSITIVE','1511424183'),(26,4,25,'POSITIVE','1511424188'),(27,1,26,'NEGATIVE','1511424635'),(28,1,26,'NEGATIVE','1511424642'),(29,4,46,'POSITIVE','1512010049'),(30,4,46,'POSITIVE','1512010058'),(31,4,47,'NEUTRAL','1512011167'),(32,4,47,'POSITIVE','1512011660'),(33,4,49,'POSITIVE','1512011987'),(34,4,49,'NEGATIVE','1512012000'),(38,4,50,'NEUTRAL','1512019070'),(39,2,50,'NEUTRAL','1512019077'),(40,4,51,'NEGATIVE','1512019158'),(41,2,51,'NEGATIVE','1512019162'),(42,4,59,'NEUTRAL','1512378237'),(43,12,59,'NEUTRAL','1512378246'),(44,12,60,'POSITIVE','1512379097'),(45,4,60,'POSITIVE','1512379100'),(46,12,61,'POSITIVE','1512379458'),(47,4,61,'POSITIVE','1512379462'),(48,12,62,'NEUTRAL','1512380244'),(49,4,62,'NEUTRAL','1512380253'),(50,12,63,'NEGATIVE','1512526982'),(51,4,63,'NEGATIVE','1512526987'),(52,1,70,'POSITIVE','1514471948'),(53,13,70,'POSITIVE','1514471954'),(54,17,75,'POSITIVE','1515301294'),(55,18,75,'POSITIVE','1515301297'),(56,1,96,'POSITIVE','1516008113'),(57,4,96,'POSITIVE','1516008116'),(58,18,126,'POSITIVE','1517215350'),(59,1,144,'POSITIVE','1520248611'),(60,1,145,'POSITIVE','1520248751'),(61,13,159,'POSITIVE','1545277267'),(62,12,159,'POSITIVE','1545277276'),(63,12,160,'POSITIVE','1545289006'),(64,13,160,'POSITIVE','1545289072');

#
# Structure for table "cy_fenhong"
#

CREATE TABLE `cy_fenhong` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `coinjian` varchar(50) NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

#
# Data for table "cy_fenhong"
#

INSERT INTO `cy_fenhong` VALUES (1,'月分红','zyc','cny',1000.00000000,1,1476115200,1476115200,0),(2,'股分红','thc','cny',1.00000000,1,1478620800,1478620800,0),(3,'滑稽币众筹分红','fc','fc',1000000.00000000,2,1486355493,1486355493,0),(4,'交易平台股份分红','cny','cny',1.00000000,1,1486355449,1486355449,0),(5,'个','fc','cny',10.00000000,1,1486358485,1486358485,0);

#
# Structure for table "cy_fenhong_log"
#

CREATE TABLE `cy_fenhong_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `coinjian` varchar(50) NOT NULL,
  `fenzong` varchar(50) NOT NULL,
  `fenchi` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  `userid` int(11) unsigned NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

#
# Data for table "cy_fenhong_log"
#

INSERT INTO `cy_fenhong_log` VALUES (1,'交易平台股份分红','cny','fc','1.00000000','',0.00009999,10001.00000000,0.99999999,0,1486355524,0,1,1),(2,'滑稽币众筹分红','fc','fc','1000000.00000000','',1000000.01000000,0.99999999,1000000.00000000,0,1486355589,0,1,1),(3,'个','fc','cny','10.00000000','',0.00001000,1000001.00000000,10.00001000,0,1486358502,0,1,1);

#
# Structure for table "cy_finance"
#

CREATE TABLE `cy_finance` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `userid` int(11) unsigned NOT NULL COMMENT '用户id',
  `coinname` varchar(50) NOT NULL COMMENT '币种',
  `num_a` decimal(20,8) unsigned NOT NULL COMMENT '之前正常',
  `num_b` decimal(20,8) unsigned NOT NULL COMMENT '之前冻结',
  `num` decimal(20,8) unsigned NOT NULL COMMENT '之前总计',
  `fee` decimal(20,8) unsigned NOT NULL COMMENT '操作数量',
  `type` varchar(50) NOT NULL COMMENT '操作类型',
  `name` varchar(50) NOT NULL COMMENT '操作名称',
  `nameid` int(11) NOT NULL COMMENT '操作详细',
  `remark` varchar(50) NOT NULL COMMENT '操作备注',
  `mum_a` decimal(20,8) unsigned NOT NULL COMMENT '剩余正常',
  `mum_b` decimal(20,8) unsigned NOT NULL COMMENT '剩余冻结',
  `mum` decimal(20,8) unsigned NOT NULL COMMENT '剩余总计',
  `move` varchar(50) NOT NULL COMMENT '附加',
  `addtime` int(11) unsigned NOT NULL COMMENT '添加时间',
  `status` tinyint(4) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `coinname` (`coinname`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='财务记录表';

#
# Data for table "cy_finance"
#


#
# Structure for table "cy_footer"
#

CREATE TABLE `cy_footer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `img` varchar(200) NOT NULL,
  `type` varchar(200) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

#
# Data for table "cy_footer"
#

INSERT INTO `cy_footer` VALUES (1,'1','关于我们','/Article/index/type/aboutus.html','','1','',1,111,0,1),(2,'1','联系我们','/Article/index/type/aboutus.html','','1','',1,111,0,1),(3,'1','资质证明','/Article/index/type/aboutus.html','','1','',1,111,0,1),(4,'1','用户协议','/Article/index/type/aboutus.html','','1','',1,111,0,1),(5,'1','法律声明','/Article/index/type/aboutus.html','','1','',1,111,0,1),(6,'1','1','/','footer_1.png','2','',1,111,0,1),(7,'1','1','http://www.szfw.org/','footer_2.png','2','',1,111,0,1),(8,'1','1','http://www.miibeian.gov.cn/','footer_3.png','2','',1,111,0,1),(9,'1','1','http://www.cyberpolice.cn/','footer_4.png','2','',1,111,0,1);

#
# Structure for table "cy_huafei"
#

CREATE TABLE `cy_huafei` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `userid` int(11) unsigned NOT NULL,
  `moble` varchar(255) NOT NULL,
  `num` int(11) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `mum` decimal(20,8) NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

#
# Data for table "cy_huafei"
#

INSERT INTO `cy_huafei` VALUES (1,2,'13958844896',50,'dog',5.00000000,1476016339,0,0),(2,12,'15979197685',30,'fc',42857142.85714300,1486997620,0,0),(3,8,'18157316153',20,'fc',28571428.57142900,1486998754,0,0),(4,12,'15979197685',30,'fc',42857142.85714300,1487133105,0,0),(5,12,'15979197685',10,'fc',14285714.28571400,1487248208,0,0);

#
# Structure for table "cy_huafei_coin"
#

CREATE TABLE `cy_huafei_coin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `coinname` varchar(50) NOT NULL,
  `price` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_huafei_coin"
#

INSERT INTO `cy_huafei_coin` VALUES (1,'fc','0.0000007',1);

#
# Structure for table "cy_huafei_type"
#

CREATE TABLE `cy_huafei_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_huafei_type"
#

INSERT INTO `cy_huafei_type` VALUES (1,'10','10元话费充值',1),(2,'20','20元话费充值',1),(3,'30','30元话费充值',1),(4,'50','50元话费充值',1),(5,'100','100元话费充值',1),(6,'300','300元话费充值',1);

#
# Structure for table "cy_intro"
#

CREATE TABLE `cy_intro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `content` text,
  `time` int(11) DEFAULT NULL COMMENT '添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

#
# Data for table "cy_intro"
#

INSERT INTO `cy_intro` VALUES (2,1,'weqweqwq',1510137714),(3,4,'1',1512090518),(4,18,'hello',1515993574);

#
# Structure for table "cy_issue"
#

CREATE TABLE `cy_issue` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `buycoin` varchar(50) NOT NULL,
  `num` bigint(20) unsigned NOT NULL,
  `deal` int(11) unsigned NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `limit` int(11) unsigned NOT NULL,
  `time` varchar(255) NOT NULL,
  `tian` varchar(255) NOT NULL,
  `ci` varchar(255) NOT NULL,
  `jian` varchar(255) NOT NULL,
  `min` varchar(255) NOT NULL,
  `max` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `invit_coin` varchar(50) NOT NULL,
  `invit_1` varchar(50) NOT NULL,
  `invit_2` varchar(50) NOT NULL,
  `invit_3` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`),
  KEY `coinname` (`coinname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='认购发行表';

#
# Data for table "cy_issue"
#


#
# Structure for table "cy_issue_log"
#

CREATE TABLE `cy_issue_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `buycoin` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` int(20) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `ci` int(11) unsigned NOT NULL,
  `jian` varchar(255) NOT NULL,
  `unlock` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='认购记录表';

#
# Data for table "cy_issue_log"
#


#
# Structure for table "cy_link"
#

CREATE TABLE `cy_link` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `img` varchar(200) NOT NULL,
  `mytx` varchar(200) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COMMENT='常用银行地址';

#
# Data for table "cy_link"
#

INSERT INTO `cy_link` VALUES (1,'boc','中国银行','http://www.boc.cn/','img_56937003683ce.jpg','','',0,1452503043,0,1),(2,'abc','农业银行','http://www.abchina.com/cn/','img_569370458b18d.jpg','','',0,1452503109,0,1),(3,'bccb','北京银行','http://www.bankofbeijing.com.cn/','img_569370588dcdc.jpg','','',0,1452503128,0,1),(4,'ccb','建设银行','http://www.ccb.com/','img_5693709bbd20f.jpg','','',0,1452503195,0,1),(5,'ceb','光大银行','http://www.bankofbeijing.com.cn/','img_569370b207cc8.jpg','','',0,1452503218,0,1),(6,'cib','兴业银行','http://www.cib.com.cn/cn/index.html','img_569370d29bf59.jpg','','',0,1452503250,0,1),(7,'citic','中信银行','http://www.ecitic.com/','img_569370fb7a1b3.jpg','','',0,1452503291,0,1),(8,'cmb','招商银行','http://www.cmbchina.com/','img_5693710a9ac9c.jpg','','',0,1452503306,0,1),(9,'cmbc','民生银行','http://www.cmbchina.com/','img_5693711f97a9d.jpg','','',0,1452503327,0,1),(10,'虚拟币信息中文网','虚拟币信息中文网','http://www.chinabtcltc.com/','img_5693713076351.jpg','','',0,1452503344,1480225439,1),(11,'巴比特论坛','巴比特论坛','http://www.8btc.com/','img_56937154bebc5.jpg','','',0,1452503380,1480225390,1),(12,'F2Pool 挖矿鱼池','F2Pool 挖矿鱼池','https://www.f2pool.com/','img_56937162db7f5.jpg','','',0,1480225304,1480225306,1),(13,'币行','币行','https://www.okcoin.cn','img_5693717eefaa3.jpg','','',0,1452503422,1480225269,1),(14,'比特时代','比特时代','http://www.btc38.com/','img_5693718f1d70e.jpg','','',0,1452503439,1480225238,1),(15,'BTC123','BTC123','https://www.btc123.com','56c2e4c9aff85.jpg','','',0,1455613129,1480225206,1);

#
# Structure for table "cy_log"
#

CREATE TABLE `cy_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` int(20) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `unlock` int(11) unsigned NOT NULL,
  `ci` int(11) unsigned NOT NULL,
  `recycle` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`),
  KEY `coinname` (`coinname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_log"
#


#
# Structure for table "cy_market"
#

CREATE TABLE `cy_market` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `round` varchar(255) NOT NULL,
  `fee_buy` varchar(255) NOT NULL,
  `fee_sell` varchar(255) NOT NULL,
  `buy_min` varchar(255) NOT NULL,
  `buy_max` varchar(255) NOT NULL,
  `sell_min` varchar(255) NOT NULL,
  `sell_max` varchar(255) NOT NULL,
  `trade_min` varchar(255) NOT NULL,
  `trade_max` varchar(255) NOT NULL,
  `invit_buy` varchar(50) NOT NULL,
  `invit_sell` varchar(50) NOT NULL,
  `invit_1` varchar(50) NOT NULL,
  `invit_2` varchar(50) NOT NULL,
  `invit_3` varchar(50) NOT NULL,
  `zhang` varchar(255) NOT NULL,
  `die` varchar(255) NOT NULL,
  `hou_price` varchar(255) NOT NULL,
  `tendency` varchar(1000) NOT NULL,
  `trade` int(11) unsigned NOT NULL,
  `new_price` decimal(20,8) unsigned NOT NULL,
  `buy_price` decimal(20,8) unsigned NOT NULL,
  `sell_price` decimal(20,8) unsigned NOT NULL,
  `min_price` decimal(20,8) unsigned NOT NULL,
  `max_price` decimal(20,8) unsigned NOT NULL,
  `volume` decimal(20,8) unsigned NOT NULL,
  `change` decimal(20,8) NOT NULL,
  `api_min` decimal(20,8) unsigned NOT NULL,
  `api_max` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='行情配置表';

#
# Data for table "cy_market"
#


#
# Structure for table "cy_menu"
#

CREATE TABLE `cy_menu` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '文档ID',
  `title` varchar(50) NOT NULL DEFAULT '' COMMENT '标题',
  `pid` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上级分类ID',
  `sort` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序（同级有效）',
  `url` char(255) NOT NULL DEFAULT '' COMMENT '链接地址',
  `hide` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否隐藏',
  `tip` varchar(255) NOT NULL DEFAULT '' COMMENT '提示',
  `group` varchar(50) DEFAULT '' COMMENT '分组',
  `is_dev` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '是否仅开发者模式可见',
  `ico_name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `pid` (`pid`)
) ENGINE=InnoDB AUTO_INCREMENT=482 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_menu"
#

INSERT INTO `cy_menu` VALUES (1,'系统',0,1,'Index/index',0,'','',0,'home'),(3,'用户',0,1,'User/index',0,'','',0,'user'),(4,'财务',0,1,'Finance/myzr',0,'','',0,'th-list'),(5,'交易',0,1,'Trade/sell',0,'','',0,'stats'),(7,'设置',0,1,'Config/index',0,'','',0,'cog'),(9,'工具',0,1,'Tools/index',0,'','',0,'wrench'),(11,'系统概览',1,1,'Index/index',0,'','系统',0,'home'),(26,'用户管理',3,1,'User/index',0,'','用户',0,'user'),(79,'基本配置',7,1,'Config/index',0,'','设置',0,'cog'),(82,'银行配置',79,4,'Config/bank',0,'','网站配置',0,'credit-card'),(85,'编辑',84,4,'Coin/edit',0,'','网站配置',0,'0'),(89,'编辑市场',88,4,'Market/edit',0,'','',0,'0'),(115,'图片',111,0,'Shop/images',0,'','云购商城',0,'0'),(117,'排序',116,5,'Menu/sort',0,'','开发组',0,'0'),(118,'添加',116,5,'Menu/add',0,'','开发组',0,'0'),(119,'编辑',116,5,'Menu/edit',0,'','开发组',0,'0'),(120,'删除',116,5,'Menu/del',0,'','开发组',0,'0'),(121,'是否隐藏',116,5,'Menu/toogleHide',0,'','开发组',0,'0'),(122,'是否开发',116,5,'Menu/toogleDev',0,'','开发组',0,'0'),(282,'登陆日志',3,4,'User/log',0,'','用户',0,'user'),(285,'用户财产',3,7,'User/coin',0,'','用户',0,'user'),(295,'虚拟币转入',4,6,'Finance/myzr',0,'','财务',0,'th-list'),(296,'虚拟币转出',4,7,'Finance/myzc',0,'','财务',0,'th-list'),(309,'清理缓存',9,1,'Tools/index',0,'','工具',0,'wrench'),(312,'管理员管理',3,2,'User/admin',0,'','用户',0,'user'),(376,'使用',375,5,'Cloud/kefuUp',0,'','扩展',0,'tasks'),(382,'币种配置',7,4,'Config/coin',0,'','设置',0,'cog'),(450,'在线出售广告管理',5,1,'Trade/sell',0,'','交易',0,'stats'),(451,'在线购买广告管理',5,2,'Trade/buy',0,'','交易',0,'stats'),(452,'订单管理',5,3,'Trade/order',0,'','交易',0,'stats'),(453,'添加地址',7,8,'Config/address',1,'','设置',0,'cog'),(454,'查看地址',7,9,'Config/select',1,'','设置',0,'cog'),(455,'权限列表',3,3,'User/auth',1,'','用户',0,'user'),(456,'用户钱包',3,5,'User/qianbao',1,'','用户',0,'user'),(457,'提现地址',3,6,'User/bank',1,'','用户',0,'user'),(458,'联系地址',3,8,'User/goods',1,'','用户',0,'user'),(459,'编辑添加',26,1,'User/edit',1,'','用户',0,'home'),(460,'修改状态',26,1,'User/status',1,'','用户',0,'home'),(461,'编辑添加',312,1,'User/adminEdit',1,'','用户',0,'home'),(462,'修改状态',312,1,'User/adminStatus',1,'','用户',0,'home'),(463,'编辑添加',455,1,'User/authEdit',1,'','用户',0,'home'),(464,'修改状态',455,1,'User/authStatus',1,'','用户',0,'home'),(465,'重新初始化权限',455,1,'User/authStart',1,'','用户',0,'home'),(466,'访问授权',455,1,'User/authAccess',1,'','用户',0,'home'),(467,'访问授权修改',455,1,'User/authAccessUp',1,'','用户',0,'home'),(468,'成员授权',455,1,'User/authUser',1,'','用户',0,'home'),(469,'成员授权增加',455,1,'User/authUserAdd',1,'','用户',0,'home'),(470,'成员授权解除',455,1,'User/authUserRemove',1,'','用户',0,'home'),(471,'编辑添加',282,1,'User/logEdit',1,'','用户',0,'home'),(472,'修改状态',282,1,'User/logStatus',1,'','用户',0,'home'),(473,'编辑添加',456,1,'User/qianbaoEdit',1,'','用户',0,'home'),(474,'修改状态',456,1,'User/qianbaoStatus',1,'','用户',0,'home'),(475,'编辑添加',457,1,'User/bankEdit',1,'','用户',0,'home'),(476,'修改状态',457,1,'User/bankStatus',1,'','用户',0,'home'),(477,'编辑添加',285,1,'User/coinEdit',1,'','用户',0,'home'),(478,'财产统计',285,1,'User/coinLog',1,'','用户',0,'home'),(479,'编辑添加',458,1,'User/goodsEdit',1,'','用户',0,'home'),(480,'修改状态',458,1,'User/goodsStatus',1,'','用户',0,'home'),(481,'修改管理员密码',3,0,'User/setpwd',1,'','用户',0,'home');

#
# Structure for table "cy_message"
#

CREATE TABLE `cy_message` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `addip` varchar(200) NOT NULL,
  `addr` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(10) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_message"
#


#
# Structure for table "cy_message_log"
#

CREATE TABLE `cy_message_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `addip` varchar(200) NOT NULL,
  `addr` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(10) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_message_log"
#


#
# Structure for table "cy_money"
#

CREATE TABLE `cy_money` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `num` bigint(20) unsigned NOT NULL DEFAULT '0',
  `deal` int(11) unsigned NOT NULL DEFAULT '0',
  `tian` int(11) unsigned NOT NULL,
  `fee` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='投资理财表';

#
# Data for table "cy_money"
#


#
# Structure for table "cy_money_fee"
#

CREATE TABLE `cy_money_fee` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `money_id` int(11) NOT NULL,
  `type` tinyint(4) NOT NULL,
  `num` int(6) NOT NULL,
  `content` varchar(255) NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_money_fee"
#


#
# Structure for table "cy_money_log"
#

CREATE TABLE `cy_money_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `name` varchar(50) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `num` int(11) unsigned NOT NULL,
  `fee` decimal(20,8) unsigned NOT NULL,
  `feea` decimal(20,8) unsigned NOT NULL,
  `tian` int(11) unsigned NOT NULL,
  `tiana` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  `money_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='理财记录表';

#
# Data for table "cy_money_log"
#


#
# Structure for table "cy_mycz"
#

CREATE TABLE `cy_mycz` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `num` int(11) unsigned NOT NULL,
  `mum` int(11) unsigned NOT NULL,
  `type` varchar(50) NOT NULL,
  `tradeno` varchar(50) NOT NULL,
  `remark` varchar(250) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='充值记录表';

#
# Data for table "cy_mycz"
#


#
# Structure for table "cy_mycz_invit"
#

CREATE TABLE `cy_mycz_invit` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `userid` int(11) unsigned NOT NULL COMMENT '用户id',
  `invitid` int(11) unsigned NOT NULL COMMENT '推荐人id',
  `num` decimal(20,2) unsigned NOT NULL COMMENT '操作金额',
  `fee` decimal(20,8) unsigned NOT NULL COMMENT '赠送金额',
  `coinname` varchar(50) NOT NULL COMMENT '赠送币种',
  `mum` decimal(20,8) unsigned NOT NULL COMMENT '到账金额',
  `remark` varchar(250) NOT NULL COMMENT '备注',
  `sort` int(11) unsigned NOT NULL COMMENT '排序',
  `addtime` int(11) unsigned NOT NULL COMMENT '添加时间',
  `endtime` int(11) unsigned NOT NULL COMMENT '编辑时间',
  `status` tinyint(4) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='充值赠送';

#
# Data for table "cy_mycz_invit"
#


#
# Structure for table "cy_mycz_type"
#

CREATE TABLE `cy_mycz_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `max` varchar(200) NOT NULL COMMENT '名称',
  `min` varchar(200) NOT NULL COMMENT '名称',
  `kaihu` varchar(200) NOT NULL COMMENT '名称',
  `truename` varchar(200) NOT NULL COMMENT '名称',
  `name` varchar(50) NOT NULL,
  `title` varchar(50) NOT NULL,
  `url` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `img` varchar(50) NOT NULL,
  `extra` varchar(50) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='充值类型';

#
# Data for table "cy_mycz_type"
#

INSERT INTO `cy_mycz_type` VALUES (1,'100000','1','','','alipay','支付宝转账支付','','','','5897f35795371.jpg','','需要在联系方式里面设置支付宝账号',0,0,0,1),(2,'10000','1','','','weixin','微信转账支付','','','','5897f2d5b1fe0.jpg','','需要在联系方式里面设置微信账号',0,0,0,1),(3,'10000','100','','','bank','网银转账支付','','','','57de3a186ea05.jpg','','需要在联系方式里面按照格式天数收款银行账号',0,0,0,0);

#
# Structure for table "cy_mytx"
#

CREATE TABLE `cy_mytx` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `num` int(11) unsigned NOT NULL,
  `fee` decimal(20,2) unsigned NOT NULL,
  `mum` decimal(20,2) unsigned NOT NULL,
  `truename` varchar(32) NOT NULL,
  `name` varchar(32) NOT NULL,
  `bank` varchar(250) NOT NULL,
  `bankprov` varchar(50) NOT NULL,
  `bankcity` varchar(50) NOT NULL,
  `bankaddr` varchar(50) NOT NULL,
  `bankcard` varchar(200) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='提现记录表';

#
# Data for table "cy_mytx"
#

INSERT INTO `cy_mytx` VALUES (1,1,100,2.33,97.67,'谷嘉伟','test','农业银行','测试','测试','test','13736491494',0,1486358183,0,1);

#
# Structure for table "cy_myzc"
#

CREATE TABLE `cy_myzc` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `username` varchar(200) NOT NULL,
  `coinname` varchar(200) NOT NULL,
  `txid` varchar(200) NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `fee` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  `message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`),
  KEY `coinname` (`coinname`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8;

#
# Data for table "cy_myzc"
#

INSERT INTO `cy_myzc` VALUES (26,12,'1Fkjh6Fp2zPzvwACLaAKBCAtRvS7kugXJ4','usdt','',10.00000000,0.00000000,10.00000000,0,1546672017,0,0,'');

#
# Structure for table "cy_myzc_fee"
#

CREATE TABLE `cy_myzc_fee` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `username` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `coinname` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `txid` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `type` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `fee` decimal(20,8) NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

#
# Data for table "cy_myzc_fee"
#

INSERT INTO `cy_myzc_fee` VALUES (1,102,'','fc','d86a16e040aab3f381891b747060ac58','1',12330.00000000,1000000.00000000,987670.00000000,0,1486816088,0,1),(2,0,'19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','btc','','2',0.00001000,0.10000000,0.09999000,0,1513166217,0,1),(3,0,'19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','btc','','2',0.00001000,0.10000000,0.09999000,0,1513167231,0,1),(4,0,'19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','btc','','2',0.00001903,0.19033300,0.19031397,0,1513167959,0,1),(5,0,'19thxBCjmXCMLEmiNnD8zSLCjWPDxeQWse','btc','','2',0.00010000,1.00000000,0.99990000,0,1513230003,0,1);

#
# Structure for table "cy_myzr"
#

CREATE TABLE `cy_myzr` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `username` varchar(200) NOT NULL,
  `coinname` varchar(200) NOT NULL,
  `txid` varchar(200) NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee` decimal(20,8) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`),
  KEY `coinname` (`coinname`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_myzr"
#


#
# Structure for table "cy_newad"
#

CREATE TABLE `cy_newad` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `ad_type` tinyint(1) NOT NULL COMMENT '广告类型 0为出售 1为购买',
  `coin` varchar(10) NOT NULL COMMENT '币种',
  `country` varchar(20) NOT NULL COMMENT '国家',
  `currency` varchar(20) NOT NULL COMMENT '货币',
  `price` decimal(20,2) NOT NULL,
  `min_amount` varchar(10) NOT NULL COMMENT '最小限额',
  `max_amount` varchar(10) NOT NULL COMMENT '最大限额',
  `paytime` varchar(3) DEFAULT NULL COMMENT '付款期限',
  `provider` varchar(50) NOT NULL COMMENT '收款方式  1bank  2alipay 3weixin',
  `message` varchar(255) NOT NULL COMMENT '广告留言',
  `status` tinyint(1) unsigned NOT NULL COMMENT '是否上架 0为下架 1为上架',
  `addtime` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8;

#
# Data for table "cy_newad"
#

INSERT INTO `cy_newad` VALUES (42,12,0,'usdt','','cny',15.00,'10','',NULL,'1','',1,'1545184673'),(43,12,1,'usdt','','cny',11.00,'10','','10','1','',1,'1545185081'),(44,12,0,'usdt','','cny',20.00,'10','','5','1','',1,'1545382703'),(45,12,0,'usdt','','cny',20.00,'10','','5','1','',1,'1545382837'),(47,14,0,'usdt','','cny',11.00,'10','',NULL,'2','',1,'1545475987');

#
# Structure for table "cy_oauth_user"
#

CREATE TABLE `cy_oauth_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `access_token` varchar(255) DEFAULT NULL,
  `create_time` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8;

#
# Data for table "cy_oauth_user"
#

INSERT INTO `cy_oauth_user` VALUES (1,1,'Nf4S5l4QgCqE6tv2Vy+aLcjbuPJ/ANNnpTK+dogBKo3i2Jycun2YMkFxfuKNmgOK6oURE6/XXFACNXZ5hoUyMg==',1513260212),(2,4,'IXdQj4xF4xVAE+RTl8bkTsjbuPJ/ANNnpTK+dogBKo3i2Jycun2YMp+kRtE7U9VO4KocMxjofvACNXZ5hoUyMg==',1513260271),(3,13,'XWMjQT1UIj9i7FnwcWS2YcjbuPJ/ANNnpTK+dogBKo27KaXYYfj2XgvCdHr+lwkWGvDjq8CvlLECNXZ5hoUyMg==',1514010868),(4,18,'Ucwvg3Sdd+LqAPTsypyVQ5fgt32JHJZEab9vzn9K+inL1wYAL9kb0sGfkZyjdPvpGOYf81PNZag=',1515136655),(5,17,'D/e8i1Uu/fPQyuDS8oVPPVJMtd48pFWtoIiUNii6g9opdgE23PJvbP0oiKKITH34BbUH35XqXf4zLzO3NYD5rQ==',1515300872),(6,21,'XmEgYPYpYJQmhVsWm7BndFJMtd48pFWtoIiUNii6g9opdgE23PJvbBTW0Zql6wMCT02kmEoCFmozLzO3NYD5rQ==',1515557269),(7,22,'uEMB3a+IkHPxzaJhLNo3OFJMtd48pFWtoIiUNii6g9opdgE23PJvbC0HKpGDqK2/qIgoLGaitJYzLzO3NYD5rQ==',1515738679),(8,19,'2cuVCksUEiFEvhQ49/rrusjbuPJ/ANNnpTK+dogBKo3SXFlGwLZwC5Csoxgftzgkox3j4MFBUaMCNXZ5hoUyMg==',1515744622),(9,23,'7vmd1b5qsindZQVj1JDoHsjbuPJ/ANNnpTK+dogBKo3SXFlGwLZwCwnNzjN0vePdfQtYAga1g8oCNXZ5hoUyMg==',1515850159),(10,24,'tQUmrdFL0gQc15QyYuuIlMjbuPJ/ANNnpTK+dogBKo3SXFlGwLZwC9SpmT2h2XVtD+IpHYTXc5ICNXZ5hoUyMg==',1515991337),(11,26,'sGY3LkBTnv2U9/vUPzWFW8jbuPJ/ANNnpTK+dogBKo3J4rJkAiPFbetCZ03m08FW3I4jOgssMyACNXZ5hoUyMg==',1516092174),(12,27,'bZBaNATOdY5QnoIOOUICP8jbuPJ/ANNnpTK+dogBKo3J4rJkAiPFbbLkmkPfMaO95d9GNMLLGw8CNXZ5hoUyMg==',1516119354),(13,28,'8OmMQaKALrTqAPTsypyVQ5fgt32JHJZEab9vzn9K+in3ntK9i8moQyj5LPBvIak20cRUXrofUog=',1516198474),(14,29,'+0jUc0uwQE/LqacNuHcMt1JMtd48pFWtoIiUNii6g9opdgE23PJvbA1Z883PaNPx2GHMho4oc7QzLzO3NYD5rQ==',1516416019),(15,30,'w2X4oWJXMft44KRISWl1YFJMtd48pFWtoIiUNii6g9opdgE23PJvbE364mXscq44iXWwxqOjxZ4zLzO3NYD5rQ==',1516454242),(16,31,'9e8b/9ZKj9YyW1Dm0gtt51JMtd48pFWtoIiUNii6g9opdgE23PJvbJSbFVEkQh0RjSQyF/OUGDUzLzO3NYD5rQ==',1516455403),(17,32,'Rt7fUUa98PrSP9LGw6hy3VJMtd48pFWtoIiUNii6g9opdgE23PJvbKtZBNNU7sgtONGmrIKr7rozLzO3NYD5rQ==',1516603138),(18,33,'ccNsldbt4KnaBdjJZcSAGcjbuPJ/ANNnpTK+dogBKo3J4rJkAiPFbUPqhKEdLFtMdrF7ngEC5MkCNXZ5hoUyMg==',1516663931),(19,34,'4zs5Yj0LO2AGoabygFj1ccjbuPJ/ANNnpTK+dogBKo3J4rJkAiPFbcNWpuJ1c9Mymrl0NiyBXQ4CNXZ5hoUyMg==',1516687809),(20,35,'uXTTrP+2WfZn17mkVQTxnVJMtd48pFWtoIiUNii6g9opdgE23PJvbMtyHKRzt5f9KkuPYAhYO84zLzO3NYD5rQ==',1516771945),(21,36,'dBgluyH8W9lEXaOrK4MQG1JMtd48pFWtoIiUNii6g9opdgE23PJvbACT4ViIJkVPieI+0lWJHBgzLzO3NYD5rQ==',1516902343),(22,37,'0tfEaktmbndxYIQqOuNnVMjbuPJ/ANNnpTK+dogBKo0lYL5FeEKqeLGAat8R576ZDgntgPjG2lsCNXZ5hoUyMg==',1517212210),(23,38,'VyW6HGykdgY4zq721czmD8jbuPJ/ANNnpTK+dogBKo0lYL5FeEKqeESMyQZ+R9XBrV3N81aFhSICNXZ5hoUyMg==',1517216286),(24,39,'BiQWhv/LMmgO9AB8P5RjCpfgt32JHJZEab9vzn9K+ilp+fFb+VKMKpXKENUQvptabK/ySEe79lc=',1517747643),(25,40,'1Vk4O6dIoys66A/CvXgFzcjbuPJ/ANNnpTK+dogBKo0d0FyUZ3v1B+6igh/CKQuUnWWrPR+7w00CNXZ5hoUyMg==',1524450765),(26,41,'96pwCeF3zboEWrgn0n3LusjbuPJ/ANNnpTK+dogBKo0d0FyUZ3v1B/btCi+JrrxGHCIlUKOaijoCNXZ5hoUyMg==',1524455711),(27,42,'zhe46w+jVgJKvgHuLCxzDcjbuPJ/ANNnpTK+dogBKo0d0FyUZ3v1B72aqcmJSgvkX8mPTSGdQfgCNXZ5hoUyMg==',1524455711),(28,43,'VlwuEGk7ZkFWBcN86trWVJfgt32JHJZEab9vzn9K+ilQsp+IGOoBjgN8pgWXXRHg5TOfpHKTL48=',1524455723),(29,44,'iaduh/T/GYnkgtxiN9IH1lJMtd48pFWtoIiUNii6g9oLzgnb+ZdUFuzfwwtOyfBpx3AZFg+3qxwzLzO3NYD5rQ==',1524554218),(30,45,'Ai0sMVHXAe5ErkBZIVU4X8jbuPJ/ANNnpTK+dogBKo0d0FyUZ3v1ByBSYJdUfnsMVXKUJrf4ZJMCNXZ5hoUyMg==',1524804055),(31,46,'7o+aE5nTrVpzCgv2aXkZ/1JMtd48pFWtoIiUNii6g9oLzgnb+ZdUFsefQBW26FBRmxtpm0js5PMzLzO3NYD5rQ==',1524812064),(32,47,'gwx7J41apHYO9AB8P5RjCpfgt32JHJZEab9vzn9K+inHPs6P91B2vuJC2n/mauE2EywtWramBWc=',1524894573),(33,48,'2xIFQkai6LfegnRraXoRJZfgt32JHJZEab9vzn9K+inpEsMU7fLafLhdCmAzdHxF7b2B1ApKuEs=',1525487338),(34,49,'5PbIW9V5160Dcf49ls/KDMjbuPJ/ANNnpTK+dogBKo3FYM48T5xREcnRaPJQIoyqOss/0vF4CaACNXZ5hoUyMg==',1525960173),(35,50,'2V/vHccdGw/gkXR9nxbREcjbuPJ/ANNnpTK+dogBKo32bvT/iqS0rGwnI7/5ScQbk1Ij1r83qpACNXZ5hoUyMg==',1526460217),(36,6,'j+s+BFoO66cBZOI/d+qXOpfgt32JHJZEab9vzn9K+ik9jrC/urjWLhz7oZ8zXkDZD1DN05EorYA=',1526465716),(37,7,'a1SSR2lUJC0GoabygFj1ccjbuPJ/ANNnpTK+dogBKo03faibUrhvy+g+bk1CdZsCkm2VHuaWDHYCNXZ5hoUyMg==',1528456208),(38,8,'kz7lWuGZ7+pJ5wCgJOxS21JMtd48pFWtoIiUNii6g9oPU/tn3RktbRCZUMdCvyUQ1l7ct8aun4EzLzO3NYD5rQ==',1535696119),(39,12,'CYXIYRvMYFv0D85JgkkWEJfgt32JHJZEab9vzn9K+imfeAcI32eLdKpfrzRy3/urHuIrrBY50iw=',1545099796),(40,14,'JT/UfdNr7AndRMvb7U1gVMjbuPJ/ANNnpTK+dogBKo0IZE81Ajz6vT/VgSKGsBYtHVWvROa94bkCNXZ5hoUyMg==',1545475772),(41,15,'rCaIzRhenXz0D85JgkkWEJfgt32JHJZEab9vzn9K+imkQC7hq/CrIudp1vfjJhVhsxJwoGd6lJs=',1545742376),(42,16,'/HZsWG88Q2Ejp9eEbWkqc1JMtd48pFWtoIiUNii6g9rUr9u0b3+Uy/wmq8O5vehxQB8OwOx4o3MzLzO3NYD5rQ==',1547442963);

#
# Structure for table "cy_order"
#

CREATE TABLE `cy_order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `buyid` int(11) unsigned NOT NULL,
  `sellid` int(11) NOT NULL,
  `coin` varchar(20) NOT NULL,
  `price` decimal(20,8) NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `fee` decimal(20,8) NOT NULL,
  `amount` decimal(20,8) NOT NULL,
  `mum` varchar(20) NOT NULL,
  `delaytime` varchar(3) NOT NULL COMMENT '付款期限',
  `type` tinyint(2) NOT NULL COMMENT '0为购买   1为出售',
  `fkfs` tinyint(2) unsigned NOT NULL COMMENT '付款方式',
  `addtime` int(11) NOT NULL,
  `endtime` int(11) NOT NULL,
  `status` tinyint(2) NOT NULL,
  `ssqzt` tinyint(2) DEFAULT NULL COMMENT '申诉前状态',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8;

#
# Data for table "cy_order"
#

INSERT INTO `cy_order` VALUES (159,13,12,'usdt',15.00000000,0.66666667,0.00000000,10.00000000,'10.00000005','5',0,1,1545276390,1545277276,3,NULL),(160,13,12,'usdt',15.00000000,10.00000000,0.00000000,150.00000000,'150','5',0,1,1545288971,1545289072,3,NULL),(161,13,12,'usdt',20.00000000,8.00000000,0.00000000,160.00000000,'160','5',0,1,1545439597,1546669881,6,NULL),(162,13,12,'usdt',20.00000000,1.30000000,0.00000000,26.00000000,'26','5',0,1,1545445122,1546669881,6,NULL),(163,13,12,'usdt',20.00000000,1.30000000,0.00000000,26.00000000,'26','5',0,1,1545445502,1546669881,6,NULL),(164,13,12,'usdt',20.00000000,1.30000000,0.00000000,26.00000000,'26','5',0,1,1545445796,1545463814,4,NULL),(165,13,12,'usdt',20.00000000,1.30000000,0.00000000,26.00000000,'26','5',0,1,1545445798,0,3,NULL),(166,13,12,'usdt',15.00000000,0.66666667,0.00000000,10.00000000,'10.00000005','5',0,1,1546918768,1546919315,6,NULL),(167,12,13,'usdt',11.00000000,0.90909091,0.00000000,10.00000000,'10.00000001','5',1,1,1546919469,1546919915,6,NULL),(168,13,12,'usdt',15.00000000,0.66666667,0.00000000,10.00000000,'10.00000005','5',0,1,1547433371,1547433815,6,NULL),(169,13,12,'usdt',15.00000000,0.66666667,0.00000000,10.00000000,'10.00000005','5',0,1,1547433612,1547434115,6,NULL),(170,12,13,'usdt',11.00000000,0.90909091,0.00000000,10.00000000,'10.00000001','5',1,1,1547434371,1547434715,6,NULL),(171,12,13,'usdt',11.00000000,0.90909091,0.00000000,10.00000000,'10.00000001','5',1,1,1547434427,1547435015,6,NULL),(172,14,12,'usdt',15.00000000,7.40000000,0.00000000,111.00000000,'111','5',0,1,1547438271,1547438615,6,NULL),(173,16,12,'usdt',15.00000000,59.20000000,0.00000000,888.00000000,'888','5',0,1,1547443099,1547443415,6,NULL),(174,16,12,'usdt',15.00000000,0.80000000,0.00000000,12.00000000,'12','5',0,1,1547443523,1547444017,6,NULL),(175,16,12,'usdt',20.00000000,0.60000000,0.00000000,12.00000000,'12','5',0,1,1547443545,1547444017,6,NULL),(176,16,12,'usdt',15.00000000,0.80000000,0.00000000,12.00000000,'12','5',0,1,1547443705,1547444017,6,NULL),(177,16,12,'usdt',15.00000000,0.80000000,0.00000000,12.00000000,'12','5',0,1,1547443768,1547444315,6,NULL),(178,16,12,'usdt',15.00000000,0.80000000,0.00000000,12.00000000,'12','5',0,1,1547444317,1547444915,6,NULL),(179,16,12,'usdt',20.00000000,0.60000000,0.00000000,12.00000000,'12','5',0,1,1547444329,1547444915,6,NULL),(180,16,12,'usdt',20.00000000,0.60000000,0.00000000,12.00000000,'12','5',0,1,1547444366,1547444915,6,NULL),(181,16,14,'usdt',11.00000000,1.09090909,0.00000000,12.00000000,'11.99999999','5',0,2,1547445788,1547446114,6,NULL),(182,16,12,'usdt',20.00000000,0.50000000,0.00000000,10.00000000,'10','5',0,1,1547445920,1547446415,6,NULL),(183,16,12,'usdt',20.00000000,0.50000000,0.00000000,10.00000000,'10','5',0,1,1547450091,0,3,NULL);

#
# Structure for table "cy_orderlog"
#

CREATE TABLE `cy_orderlog` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `traders` int(11) NOT NULL COMMENT '交易伙伴',
  `coin_type` char(20) NOT NULL COMMENT '币种',
  `order_type` tinyint(1) unsigned NOT NULL COMMENT '0买入  1售出',
  `price` decimal(20,8) NOT NULL COMMENT '单价',
  `num` decimal(20,8) NOT NULL COMMENT '数量',
  `amount` decimal(20,8) NOT NULL COMMENT '总价',
  `fee` decimal(20,8) NOT NULL COMMENT '手续费',
  `addtime` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8;

#
# Data for table "cy_orderlog"
#

INSERT INTO `cy_orderlog` VALUES (78,13,12,'usdt',0,15.00000000,10.00000000,150.00000000,0.00000000,'1545288994'),(79,12,13,'usdt',1,15.00000000,10.00000000,150.00000000,0.00000000,'1545288994'),(80,13,12,'usdt',0,20.00000000,1.30000000,26.00000000,0.00000000,'1545463814'),(81,12,13,'usdt',1,20.00000000,1.30000000,26.00000000,0.00000000,'1545463814'),(84,16,12,'usdt',0,20.00000000,0.50000000,10.00000000,0.00000000,'1547450132'),(85,12,16,'usdt',1,20.00000000,0.50000000,10.00000000,0.00000000,'1547450132');

#
# Structure for table "cy_pool"
#

CREATE TABLE `cy_pool` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `ico` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `tian` int(11) unsigned NOT NULL,
  `limit` varchar(50) NOT NULL,
  `power` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='矿机类型表';

#
# Data for table "cy_pool"
#


#
# Structure for table "cy_pool_log"
#

CREATE TABLE `cy_pool_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `name` varchar(50) NOT NULL,
  `ico` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `tian` int(11) unsigned NOT NULL,
  `limit` varchar(50) NOT NULL,
  `power` varchar(50) NOT NULL,
  `num` int(11) unsigned NOT NULL,
  `use` int(11) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='矿机管理';

#
# Data for table "cy_pool_log"
#


#
# Structure for table "cy_prompt"
#

CREATE TABLE `cy_prompt` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `img` varchar(200) NOT NULL,
  `mytx` varchar(200) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_prompt"
#


#
# Structure for table "cy_text"
#

CREATE TABLE `cy_text` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8;

#
# Data for table "cy_text"
#

INSERT INTO `cy_text` VALUES (1,'game_vote','37','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>37请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1469733741,0,1),(2,'finance_index','36','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>您好，有任何错误请立即与客服反应，希望滑稽君为您带来快乐&lt;</span></span>',0,1475325266,0,1),(3,'finance_myzr','34','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>34请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1475325312,0,1),(4,'finance_myzc','33','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>审核较慢请耐心等待，滑稽兽呼噜噜~</span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475325321,0,1),(5,'finance_mywt','32','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>哇，你已经这么滑稽了呢~</span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475325496,0,1),(6,'finance_mycj','30成交查询','<span style=\"color:#9933E5;font-size:14px;\"><span style=\"line-height:21px;color:#9933E5;font-size:14px;background-color:#FFFFFF;\">查询全部买入卖出的成交记录</span></span>',0,1475325508,0,1),(7,'finance_mycz','29人民币充值','<span style=\"color:#9933E5;line-height:21px;\"><span style=\"color:#9933E5;\"><span style=\"color:#9933E5;font-family:\'Microsoft YaHei\';font-size:14px;line-height:34px;\">只允许使用本人的支付宝进行</span></span></span><span style=\"color:#0096E0;line-height:21px;\"><span><span style=\"color:#FF0D00;font-family:\'Microsoft YaHei\';font-size:14px;line-height:34px;\"><span style=\"color:#9933E5;\"></span><span style=\"color:#9933E5;\">转账充值，请确保汇款人姓名与注册一致</span></span></span></span>',0,1475325515,0,1),(8,'user_index','28','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>哼&nbsp;守护滑稽的安全，义不容辞！ </span></span><span style=\"color: rgb(0, 150, 224); line-height: 21px; font-family:;\" sans-serif;background-color:#ffffff;\"=\"\" arial,=\"\" stheiti,=\"\" helvetica,=\"\" \"helvetica,neue\",=\"\" tahoma,=\"\" sun\",=\"\" \"sim=\"\" yahei\",=\"\" microsoft=\"\"><span style=\"color:#EE33EE;\"></span></span>',0,1475325658,0,1),(9,'finance_mytx','27人民币提现','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>\r\n<h3 style=\"font-family:\'Microsoft YaHei\';font-weight:500;font-size:24px;background-color:#FFFFFF;\">\r\n\t<span style=\"color:#9933E5;\">提现须知</span>\r\n</h3>\r\n<p style=\"color:#999999;font-family:\'Microsoft YaHei\';font-size:14px;background-color:#FFFFFF;\">\r\n\t1. 提现手续费率1％，每笔提现最低收费2元 。\r\n</p>\r\n<p style=\"color:#999999;font-family:\'Microsoft YaHei\';font-size:14px;background-color:#FFFFFF;\">\r\n\t2. 单笔提现限额100元——50000元。\r\n</p>\r\n<p style=\"color:#999999;font-family:\'Microsoft YaHei\';font-size:14px;background-color:#FFFFFF;\">\r\n\t3. 银行卡提现24小时内到帐，在已汇出24小时后 仍未收到款项，请联系客服。\r\n</p>\r\n</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475325679,0,1),(10,'user_moble','26手机绑定','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span> \r\n<h1 style=\"font-weight:normal;font-family:tahoma, \'Microsoft YaHei\', Arial, Helvetica, sans-serif;font-size:20px;color:#333333;background-color:#FFFFFF;\">\r\n\t<span style=\"color:#9933E5;\">请绑行定您的手机方便进行充值与提现</span> \r\n</h1>\r\n</span></span>',0,1475351892,0,1),(11,'finance_mytj','25推荐用户','<span style=\"color:#9933E5;line-height:21px;font-size:14px;background-color:#FFFFFF;\"><span style=\"color:#9933E5;font-size:14px;\"><span style=\"color:#9933E5;font-family:tahoma, \'Microsoft YaHei\', Arial, Helvetica, sans-serif;line-height:30.8px;font-size:14px;background-color:#FFFFFF;\">这是您的专用邀请码：<span style=\"color:#666666;font-family:tahoma, \'Microsoft YaHei\', Arial, Helvetica, sans-serif;font-size:14px;line-height:normal;background-color:#FFFFFF;\">奖励下线金额三级分红:一代0.3% 二代0.2% 三代0.1</span></span></span></span>',0,1475352280,0,1),(12,'finance_mywd','24','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>把滑稽传向世界吧！滑稽兽会亲亲你呢 </span></span>',0,1475352284,0,1),(13,'finance_myjp','23','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>呐呐，收取滑稽兽的福利吧 </span></span><span style=\"color: rgb(0, 150, 224); line-height: 21px; font-family:;\" sans-serif;background-color:#ffffff;\"=\"\" arial,=\"\" stheiti,=\"\" helvetica,=\"\" \"helvetica,neue\",=\"\" tahoma,=\"\" sun\",=\"\" \"sim=\"\" yahei\",=\"\" microsoft=\"\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352285,0,1),(14,'game_issue','22','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>欢迎认购！上市前较低价格</span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352288,0,1),(15,'game_issue_log','21','<p>\r\n\t<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>滑稽币，传播快乐！</span></span>\r\n</p>',0,1475352293,0,1),(16,'game_fenhong','20','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>分红周期短，持币数大分红多</span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352294,0,1),(17,'game_fenhong_log','19','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>。。</span></span><span style=\"color: rgb(0, 150, 224); line-height: 21px; font-family:;\" helvetica,=\"\" arial,=\"\" yahei\",=\"\" microsoft=\"\" sans-serif;background-color:#ffffff;\"=\"\" stheiti,=\"\" \"helvetica,neue\",=\"\" tahoma,=\"\" sun\",=\"\" \"sim=\"\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352296,0,1),(18,'game_money','18','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>滑稽滑稽欢迎您~<img alt=\"\" src=\"http://114.215.40.96/Public/kindeditor/plugins/emoticons/images/44.gif\" border=\"0\" /></span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352297,0,1),(19,'game_money_log','17','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>听说足够滑稽的人，能获得一个滑稽抱枕哦~ </span></span><span style=\"color: rgb(0, 150, 224); line-height: 21px; font-family:;\" sans-serif;background-color:#ffffff;\"=\"\" arial,=\"\" stheiti,=\"\" helvetica,=\"\" \"helvetica,neue\",=\"\" tahoma,=\"\" sun\",=\"\" \"sim=\"\" yahei\",=\"\" microsoft=\"\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352298,0,1),(20,'user_paypassword','16修改交易密码','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span> \r\n<h1 style=\"font-weight:normal;font-family:tahoma, \'Microsoft YaHei\', Arial, Helvetica, sans-serif;font-size:20px;color:#333333;background-color:#FFFFFF;\">\r\n\t<span style=\"color:#9933E5;\">请在下面修改您的交易密码</span> \r\n</h1>\r\n</span></span>',0,1475352694,0,1),(21,'user_password','','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>请在下面修改您的登录密码 </span></span><span style=\"color: rgb(0, 150, 224); line-height: 21px; font-family:;\" sans-serif;background-color:#ffffff;\"=\"\" arial,=\"\" stheiti,=\"\" helvetica,=\"\" \"helvetica,neue\",=\"\" tahoma,=\"\" sun\",=\"\" \"sim=\"\" yahei\",=\"\" microsoft=\"\"><span style=\"color:#EE33EE;\"></span></span>',0,1475352695,0,1),(22,'user_nameauth','15实名认证','<span style=\"color:#9933E5;\"><span style=\"line-height:21px;color:#9933E5;background-color:#FFFFFF;\">请您实名注册如有错误请联系客服进行修改</span></span>',0,1475352696,0,1),(23,'user_tpwdset','14','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>这是你的交易密码，不要被别人偷看了噢</span></span>',0,1475352698,0,1),(24,'game_shop','13','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>13请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1475352702,0,1),(25,'game_issue_buy','12','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>12请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1475352722,0,1),(26,'game_huafei','11','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>话费充值未即时到账请等待，可能是被滑稽怪吃了哦~</span></span>',0,1475359119,0,1),(27,'user_bank','10','<p>\r\n\t<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span></span></span><span style=\"color:#0096E0;line-height:21px;font-family:\"Microsoft Yahei\", \"Sim sun\", tahoma, \"Helvetica,Neue\", Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\">感觉支付宝被掏空。。。</span></span>\r\n</p>',0,1475359192,0,1),(28,'user_qianbao','9','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>请添加真实钱包地址，错误钱包地址导致的充值出金异常平台概不负责 </span></span>',0,1475359195,0,1),(29,'user_log','8','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>登陆地址异常请及时联系客服</span></span><span style=\"color:#0096E0;line-height:21px;font-family:&quot;Microsoft Yahei&quot;, &quot;Sim sun&quot;, tahoma, &quot;Helvetica,Neue&quot;, Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\"><span style=\"color:#EE33EE;\"></span></span>',0,1475359241,0,1),(30,'user_ga','7','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>7请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1475395398,0,1),(31,'user_alipay','6','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>6请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1475395410,0,1),(32,'user_goods','5','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>地址可以用于奖品的邮寄哦！</span></span>',0,1475395413,0,1),(33,'game_shop_view','3','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>3请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1476000366,0,1),(34,'game_shop_log','2','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>2请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1476002906,0,1),(35,'game_shop_goods','1','<span style=\"color:#0096E0;line-height:21px;background-color:#FFFFFF;\"><span>1请在后台修改此处内容</span></span><span style=\"color:#0096E0;line-height:21px;font-family:\'Microsoft Yahei\', \'Sim sun\', tahoma, \'Helvetica,Neue\', Helvetica, STHeiTi, Arial, sans-serif;background-color:#FFFFFF;\">,<span style=\"color:#EE33EE;\">详细信息</span></span>',0,1476002907,0,1);

#
# Structure for table "cy_trade"
#

CREATE TABLE `cy_trade` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `market` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `deal` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee` decimal(20,8) unsigned NOT NULL,
  `type` tinyint(2) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` tinyint(2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `market` (`market`,`type`,`status`),
  KEY `num` (`num`,`deal`),
  KEY `status` (`status`),
  KEY `market_2` (`market`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='交易下单表';

#
# Data for table "cy_trade"
#


#
# Structure for table "cy_trade_json"
#

CREATE TABLE `cy_trade_json` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `market` varchar(100) NOT NULL,
  `data` varchar(500) NOT NULL,
  `type` varchar(100) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `market` (`market`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='交易图表表';

#
# Data for table "cy_trade_json"
#


#
# Structure for table "cy_trade_log"
#

CREATE TABLE `cy_trade_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `peerid` int(11) unsigned NOT NULL,
  `market` varchar(50) NOT NULL,
  `price` decimal(20,8) unsigned NOT NULL,
  `num` decimal(20,8) unsigned NOT NULL,
  `mum` decimal(20,8) unsigned NOT NULL,
  `fee_buy` decimal(20,8) unsigned NOT NULL,
  `fee_sell` decimal(20,8) unsigned NOT NULL,
  `type` tinyint(2) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`),
  KEY `peerid` (`peerid`),
  KEY `main` (`market`,`status`,`addtime`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=gbk;

#
# Data for table "cy_trade_log"
#


#
# Structure for table "cy_ucenter_member"
#

CREATE TABLE `cy_ucenter_member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `last_login_time` datetime DEFAULT NULL,
  `last_login_ip` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=gbk;

#
# Data for table "cy_ucenter_member"
#


#
# Structure for table "cy_user"
#

CREATE TABLE `cy_user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `pid` int(11) DEFAULT NULL COMMENT '父级',
  `username` varchar(50) NOT NULL,
  `country_code` int(10) unsigned NOT NULL COMMENT '国家编号',
  `mobile` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(32) NOT NULL,
  `moneypwd` varchar(32) NOT NULL COMMENT '资金密码',
  `salt` varchar(10) NOT NULL COMMENT '盐',
  `truename` varchar(32) NOT NULL,
  `idcard` varchar(32) NOT NULL,
  `addip` varchar(50) NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  `ue_img` varchar(255) DEFAULT '' COMMENT '头像',
  `trusted` varchar(255) DEFAULT NULL COMMENT '信任您的人',
  `trusting` varchar(255) DEFAULT NULL COMMENT '您信任的人',
  `blocking` varchar(255) DEFAULT NULL COMMENT '您屏蔽的人',
  `ga` varchar(50) CHARACTER SET utf8 COLLATE utf8_sinhala_ci DEFAULT NULL COMMENT '谷歌',
  `yqm` varchar(50) NOT NULL COMMENT '邀请码',
  `xinyong` varchar(10) NOT NULL DEFAULT '100' COMMENT '信用额',
  PRIMARY KEY (`id`),
  KEY `username` (`username`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 COMMENT='用户信息表';

#
# Data for table "cy_user"
#

INSERT INTO `cy_user` VALUES (12,NULL,'ceshi',86,'15538733333','19958e30c7702dec2394d2481adb2875','19958e30c7702dec2394d2481adb2875','698','','','127.0.0.1',1545099753,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'C5H2UIGT','100'),(13,NULL,'nihaonihao',86,'15538733324','7bbf8db18e097b29172985a5c545146a','','bfe','','','127.0.0.1',1545209097,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'KFL8978R','100'),(14,NULL,'shenqian',86,'13585667938','09ddb36d41e067278b89bdf956ddafbe','','f46','沈潜','310101198007221617','222.71.63.78',1545475755,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'BUOT9IOD','100'),(15,NULL,'threeAt',86,'13244551122','0502e9655bdab7a7ed970f38eac8ec8c','','6c3','刘祖全','512501197203035172','23.106.146.51',1545742327,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'292UKLBG','100'),(16,NULL,'sggkki',86,'13917366084','35c11fe99c6f0b31b4beac1173b58d48','','dc5','','','144.34.141.176',1547442940,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'2DK5LCF9','100'),(17,NULL,'abcd',0,'6014@qq.com','b5583e58c84cabb9d6d1acb10dcad656','','fc7','','','42.232.45.177',1547453238,1,'/Uploads/head_portrait60.png',NULL,NULL,NULL,NULL,'PLKIV0K6','100');

#
# Structure for table "cy_user_bank"
#

CREATE TABLE `cy_user_bank` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `name` varchar(200) NOT NULL,
  `type` varchar(255) DEFAULT NULL COMMENT '类型',
  `bank` varchar(200) NOT NULL,
  `bankprov` varchar(200) NOT NULL,
  `bankcity` varchar(200) NOT NULL,
  `bankaddr` varchar(200) NOT NULL,
  `bankcard` varchar(200) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  `erweima` varchar(255) DEFAULT NULL COMMENT '收款二维码',
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

#
# Data for table "cy_user_bank"
#

INSERT INTO `cy_user_bank` VALUES (3,12,'银行卡','bank','邮政银行','','','邮政支行','11213132123',0,1545122453,0,1,'./qrcode/2018-12-18/5c18b295c7795.png'),(4,14,'微信','weixin','0','','','','13585667938',0,1545475929,0,1,'./qrcode/2018-12-22/5c1e17591c8b5.jpg'),(5,14,'支付宝','alipay','0','','','','shenqian1980',0,1545475949,0,1,'./qrcode/2018-12-22/5c1e176d557c9.jpg');

#
# Structure for table "cy_user_bank_type"
#

CREATE TABLE `cy_user_bank_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(200) NOT NULL,
  `title` varchar(200) NOT NULL,
  `url` varchar(200) NOT NULL,
  `img` varchar(200) NOT NULL,
  `mytx` varchar(200) NOT NULL,
  `remark` varchar(50) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COMMENT='常用银行地址';

#
# Data for table "cy_user_bank_type"
#

INSERT INTO `cy_user_bank_type` VALUES (1,'boc','中国银行','http://www.boc.cn/','img_56937003683ce.jpg','','',0,1452503043,0,1),(2,'abc','农业银行','http://www.abchina.com/cn/','img_569370458b18d.jpg','','',0,1452503109,0,1),(3,'bccb','北京银行','http://www.bankofbeijing.com.cn/','img_569370588dcdc.jpg','','',0,1452503128,0,1),(4,'ccb','建设银行','http://www.ccb.com/','img_5693709bbd20f.jpg','','',0,1452503195,0,1),(5,'ceb','光大银行','http://www.bankofbeijing.com.cn/','img_569370b207cc8.jpg','','',0,1452503218,0,1),(6,'cib','兴业银行','http://www.cib.com.cn/cn/index.html','img_569370d29bf59.jpg','','',0,1452503250,0,1),(7,'citic','中信银行','http://www.ecitic.com/','img_569370fb7a1b3.jpg','','',0,1452503291,0,1),(8,'cmb','招商银行','http://www.cmbchina.com/','img_5693710a9ac9c.jpg','','',0,1452503306,0,1),(9,'cmbc','民生银行','http://www.cmbchina.com/','img_5693711f97a9d.jpg','','',0,1452503327,0,1),(10,'comm','交通银行','http://www.bankcomm.com/BankCommSite/default.shtml','img_5693713076351.jpg','','',0,1452503344,0,1),(11,'gdb','广发银行','http://www.cgbchina.com.cn/','img_56937154bebc5.jpg','','',0,1452503380,0,1),(12,'icbc','工商银行','http://www.icbc.com.cn/icbc/','img_56937162db7f5.jpg','','',0,1452503394,0,1),(13,'psbc','邮政银行','http://www.psbc.com/portal/zh_CN/index.html','img_5693717eefaa3.jpg','','',0,1452503422,0,1),(14,'spdb','浦发银行','http://www.spdb.com.cn/chpage/c1/','img_5693718f1d70e.jpg','','',0,1452503439,0,1),(15,'szpab','平安银行','http://bank.pingan.com/','56c2e4c9aff85.jpg','','',0,1455613129,0,1);

#
# Structure for table "cy_user_coin"
#

CREATE TABLE `cy_user_coin` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `btc` decimal(20,8) unsigned NOT NULL,
  `btcd` decimal(20,8) unsigned NOT NULL,
  `btcb` varchar(200) NOT NULL,
  `ltc` decimal(20,8) unsigned NOT NULL,
  `ltcd` decimal(20,8) NOT NULL,
  `ltcb` varchar(200) NOT NULL,
  `eth` decimal(20,8) unsigned NOT NULL,
  `ethd` decimal(20,8) unsigned NOT NULL,
  `ethb` varchar(200) NOT NULL,
  `usdt` decimal(20,8) unsigned NOT NULL,
  `usdtd` decimal(20,8) unsigned NOT NULL,
  `usdtb` varchar(200) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='用户币种表';

#
# Data for table "cy_user_coin"
#

INSERT INTO `cy_user_coin` VALUES (1,12,0.00000000,0.00000000,'19VZ5CeBnZLZ3SRtb64aoJURvPnfEMZNjK',0.00000000,0.00000000,'',0.00000000,0.00000000,'',97.53333333,0.00000000,'n2jwEjg8Rt1xh7d9DhiwRAx4sdbqJHREP5'),(2,13,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',11.96666667,0.00000000,''),(3,14,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',100.00000000,0.00000000,'mhYtn8NvvAttcqDmFfFYxBdRwDUvPbUS2B'),(4,15,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,''),(5,0,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,''),(6,16,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.50000000,0.00000000,''),(7,17,0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'',0.00000000,0.00000000,'myKa4dV96MxqSyUhJ2Sv3JLT58K1b2gktt');

#
# Structure for table "cy_user_log"
#

CREATE TABLE `cy_user_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(10) unsigned NOT NULL,
  `addip` varchar(200) NOT NULL,
  `addtime` int(10) unsigned NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `userid` (`userid`),
  KEY `status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COMMENT='用户记录表';

#
# Data for table "cy_user_log"
#

INSERT INTO `cy_user_log` VALUES (1,14,'222.71.63.78',1545475772,1),(2,14,'222.71.63.78',1545475772,1),(3,15,'23.106.146.51',1545742376,1),(4,12,'222.136.59.22',1545744063,1),(5,12,'222.136.59.22',1545744064,1),(6,15,'23.106.146.51',1545794420,1),(7,12,'42.238.203.85',1546485319,1),(8,12,'42.238.203.85',1546580993,1),(9,14,'222.71.63.78',1546745890,1),(10,12,'42.238.203.85',1546850186,1),(11,12,'42.238.203.85',1546920091,1),(12,16,'144.34.141.176',1547442963,1),(13,16,'144.34.141.176',1547450191,1),(14,12,'42.232.45.177',1547453474,1),(15,17,'42.232.45.177',1547453500,1),(16,16,'144.34.141.176',1547533409,1);

#
# Structure for table "cy_user_shopaddr"
#

CREATE TABLE `cy_user_shopaddr` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL DEFAULT '0',
  `truename` varchar(200) NOT NULL DEFAULT '0',
  `moble` varchar(500) NOT NULL,
  `name` varchar(500) NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status` (`status`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

#
# Data for table "cy_user_shopaddr"
#


#
# Structure for table "cy_version"
#

CREATE TABLE `cy_version` (
  `name` varchar(50) NOT NULL COMMENT '版本号',
  `number` int(11) NOT NULL COMMENT '序列号，一般用日期数字标示',
  `title` varchar(50) NOT NULL COMMENT '版本名',
  `create_time` int(11) NOT NULL COMMENT '发布时间',
  `update_time` int(11) NOT NULL COMMENT '更新的时间',
  `log` text NOT NULL COMMENT '更新日志',
  `url` varchar(150) NOT NULL COMMENT '链接到的远程文章',
  `is_current` tinyint(4) NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `id` (`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='自动更新表';

#
# Data for table "cy_version"
#


#
# Structure for table "cy_version_game"
#

CREATE TABLE `cy_version_game` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `gongsi` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `shuoming` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `class` varchar(200) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `status` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `number` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci ROW_FORMAT=DYNAMIC COMMENT='应用管理表';

#
# Data for table "cy_version_game"
#


#
# Structure for table "cy_vote"
#

CREATE TABLE `cy_vote` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `coinname` varchar(50) NOT NULL,
  `type` int(20) unsigned NOT NULL,
  `sort` int(11) unsigned NOT NULL,
  `addtime` int(11) unsigned NOT NULL,
  `endtime` int(11) unsigned NOT NULL,
  `status` int(4) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `type` (`type`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_vote"
#


#
# Structure for table "cy_vote_type"
#

CREATE TABLE `cy_vote_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `coinname` varchar(255) NOT NULL DEFAULT '',
  `title` varchar(255) NOT NULL,
  `status` tinyint(4) NOT NULL COMMENT '状态',
  `img` varchar(255) CHARACTER SET utf8 DEFAULT NULL,
  `zhichi` bigint(20) unsigned DEFAULT '0',
  `fandui` bigint(20) unsigned DEFAULT '0',
  `zongji` bigint(20) unsigned DEFAULT '0',
  `bili` float DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=gbk ROW_FORMAT=DYNAMIC;

#
# Data for table "cy_vote_type"
#

INSERT INTO `cy_vote_type` VALUES (1,'bcg','bcg',1,'',0,0,0,0);
