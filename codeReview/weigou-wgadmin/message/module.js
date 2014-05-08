/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: module.js 108952 2012-02-20 07:26:43Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/module.js ~ 2014/01/15 10:32:11
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 108952 $
 * @description
 * wgadmin.message这个模块
 **/

goog.require('er.controller');
goog.require('jn.util');
goog.require('ui.RichTextInput');

goog.provide('wgadmin.message.Fields');
goog.provide('wgadmin.message.config');
goog.provide('wgadmin.message.data');

/**
 * @const
 * @type {Object.<string, *>}
 */
wgadmin.message.Fields = {
	//消息列表
   'id' : {
        'title' : '序号',
        'field' : 'id',
        'content' : function(item){
            return item.id;
        }
    },
	'messangeName' : {
        'title' : '消息名称',
        'field' : 'messangeName',
        'content' : function(item){
            return item.name;
        }
    },
	'publishType' : {
        'title' : '发布渠道',
        'field' : 'publishType',
        'content' : function(item){
            return wgadmin.message.enumerate.publishType[item.publishType + ''] || '';
        }
    },
	'statusType' : {
        'title' : '消息状态',
        'field' : 'statusType',
        'content' : function(item){
            return wgadmin.message.enumerate.statusType[item.statusType + ''] || '';
        }
    },
	'createTimeAt' : {
        'title' : '发布时间',
        'field' : 'createTimeAt ',
        'content' : function(item){
            return item.publishDate ;
        }
    },
	'createdDate' : {
        'title' : '创建时间',
        'field' : 'createdDate ',
        'content' : function(item){
            return item.createdDate ;
        }
    },
	'operate' : {
        'title' : '操作',
        'field' : 'operate',
		'minWidth': 200,
        'content' : function(item){
            var links = [];
            links.push({
				'title' : '查看',
				'location' : '#/void~',
				'cmd' : 'VIEW',
				'tip' : 'view'
            });
			
			if(item.statusType == '1'){
				links.push({
					'title' : '编辑',
					'location' : '#/void~',
					'cmd' : 'EDIT',
					'tip' : 'edit'
				});
				
				links.push({
					'title' : '发布',
					'location' : '#/void~',
					'cmd' : 'PUBLISH',
					'tip':'publish'
				});
				
				links.push({
					'title' : '删除',
					'location' : '#/void~',
					'cmd' : 'DELETE',
					'tip':'delete'
				});
				
				
				
			}
			
			
			
			
            return wgadmin.util.getListOperationHtml(links);
			
        }
    },
	//接受消息列表
	'receiver' : {
        'title' : '接收方',
        'field' : 'receiver',
        'content' : function(item){
            return item.receiver;
        }
    },
	'remark' : {
        'title' : '备注信息',
        'field' : 'remark',
        'content' : function(item){
            return item.remark;
        }
    },
	'result1' : {
        'title' : '是否发送成功',
        'field' : 'result',
        'content' : function(item){
            return item.result;
        }
    },
	'result2' : {
        'title' : '是否已阅读',
        'field' : 'result',
        'content' : function(item){
            return item.result;
        }
    },
	//导入接受对象列表
	'ucId' : {
        'title' : '商家ID',
        'field' : 'ucId',
        'content' : function(item){
            return item.ucId;
        }
    },
	'shortName' : {
        'title' : '商家简称',
        'field' : 'shortName',
        'content' : function(item){
            return item.shortName;
        }
    },
	'enterType' : {
        'title' : '接入方式',
        'field' : 'enterType',
        'content' : function(item){
            return wgadmin.message.enumerate.accressType[item.enterType + ""];
        }
    },
	'category' : {
        'title' : '经营类目',
        'field' : 'category',
        'content' : function(item){
            return wgadmin.util.getCellHtml(item.category);
        }
    },
	'status' : {
        'title' : '状态',
        'field' : 'status',
        'content' : function(item){
            return wgadmin.message.enumerate.merchantStatus[item.status + "" ];
        }
    },
	'chargePhone' : {
        'title' : '负责人手机',
        'field' : 'chargePhone  ',
        'content' : function(item){
            return item.chargePhone  ;
        }
    },
	'chargeEmail' : {
        'title' : '负责人邮箱',
        'field' : 'chargeEmail',
        'content' : function(item){
            return item.chargeEmail;
        }
    }
};
wgadmin.message.enumerate = {
	publishType:{
		'0':'全部',
		'1':'商家公告',
		'2':'短信',
		'3':'邮件'
		
	},
	
	statusType:{
		'0':'全部',
		'1':'待发布',
		'2':'发布中',
		'3':'部分成功',
		'4':'全部成功'
	},
	
	merchantStatus:{
		'0':'全部',
		'1':'待审核',
		'2':'审核拒绝',
		'3':'暂未生效',
		'4':'失效',
		'5':'正常生效'
	},
	
	merchantSubStatus:{
		'-1':'全部',
		'0':'无',
		'1':'未提交',
		'2':'待审核',
		'3':'审核通过',
		'4':'审核拒绝'
	},

	accressType:{
		'0':'全部',
		'1':'自助商家',
		'2':'api商家'
	},
	
	merchantType:{
		'1':'商家名称',
		'2':'商家ID'
	}
	
}
/**
 * @type {Object}
 * @const
 */
wgadmin.message.config = {
    'action' : [
        // CODE HERE.
    ],

    'url' : {
      list : '/data/wgadmin/message/list',
	  detail: '/data/wgadmin/message/detail',
	  operate: '/data/wgadmin/message/operate',
	  edit:'/data/wgadmin/message/edit',
	  recipient_list:'/data/wgadmin/message/recipient_list',
	  recipient_operate_delete:'/data/wgadmin/message/recipient_operate_delete',
	  recipient_list_download:'/data/wgadmin/message/recipient_list_download_create',
	  recipient_add:'/data/wgadmin/message/recipient_add',
	  merchant_list:'/data/wgadmin/merchant/list',
	  merchant_list_operate:'/data/wgadmin/message/merchant_list_operate'
	  
	  
    }
};
// Autogenerated at 2014/01/17 10:12:59
wgadmin.message.config['action'].push({'location':'/wgadmin/message/inport_outer','action':'wgadmin.message.InportOuter','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/17 09:37:09
wgadmin.message.config['action'].push({'location':'/wgadmin/message/detail','action':'wgadmin.message.Detail','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/17 09:36:06
wgadmin.message.config['action'].push({'location':'/wgadmin/message/task_list_form','action':'wgadmin.message.TaskListForm','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/15 14:19:26
wgadmin.message.config['action'].push({'location':'/wgadmin/message/merchant_list','action':'wgadmin.message.MerchantList','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/15 14:19:01
wgadmin.message.config['action'].push({'location':'/wgadmin/message/recipient_list','action':'wgadmin.message.RecipientList','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/15 14:18:23
wgadmin.message.config['action'].push({'location':'/wgadmin/message/edit','action':'wgadmin.message.Edit','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});
// Autogenerated at 2014/01/15 10:32:11
wgadmin.message.config['action'].push({'location':'/wgadmin/message/list','action':'wgadmin.message.List','authority':'ADMIN PRODUCT_MANAGER MERCHANT_MANAGER'});

/**
 * 后端数据访问接口
 * @type {Object.<string, function(string, Function, Function)>}.
 */
wgadmin.message.data = jn.util.da_generator([
    {
        'name' : 'list',
        'url' : wgadmin.message.config.url.list
    },
	 {
        'name' : 'detail',
        'url' : wgadmin.message.config.url.detail
    },
	 {
        'name' : 'operate',
        'url' : wgadmin.message.config.url.operate
    },
	 {
        'name' : 'edit',
        'url' : wgadmin.message.config.url.edit
    },
	 {
        'name' : 'recipient_list',
        'url' : wgadmin.message.config.url.recipient_list
    },
	 {
        'name' : 'recipient_operate_delete',
        'url' : wgadmin.message.config.url.recipient_operate_delete
    },
	 {
        'name' : 'recipient_list_download',
        'url' : wgadmin.message.config.url.recipient_list_download
    },
	 {
        'name' : 'recipient_add',
        'url' : wgadmin.message.config.url.recipient_add
    },
	 {
        'name' : 'merchant_list',
        'url' : wgadmin.message.config.url.merchant_list
    },
	 {
        'name' : 'merchant_list_operate',
        'url' : wgadmin.message.config.url.merchant_list_operate
    }
]);

er.controller.addModule(wgadmin.message);





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
