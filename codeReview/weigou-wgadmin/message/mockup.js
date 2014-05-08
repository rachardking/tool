/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: mockup.js 108952 2012-02-20 07:26:43Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/mockup.js ~ 2014/01/15 10:32:11
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 108952 $
 * @description
 * wgadmin.message这个模块的mockup数据
 **/

goog.require('app.mockup.register');

goog.provide('wgadmin.message.mockup');

(function() {

var success_result = {
    'success' : 'true',
    'message' : {},
    'result' : {}
};

var success_edit_result = {
    'success' : 'true',
    'message' : {},
    'result' : {
		messageId:123123
	}
}

var list  = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120, 
    "orderBy":"orderId", 
    "order":"desc", 
    "totalCount":4, 
    "result" : [
        {
            id:123, //序号
            name:"name", //消息名
            publishType:0,
            statusType:1,
            publishDate : "2013-01-01",
			createdDate:"2013-01-01"

        },
		 {
            id:1235, //序号
            name:"name", //消息名
            publishType:0,
            statusType:0,
            publishDate : "2013-01-01",
			createdDate:"2013-01-01"

        }
    ]
  }
};

var detail = {
  "success" : "true",
  "message" : {},
  "result" : {
    id:123123,
    name:'name',
    
    detail:'<b>消息内容</b>',
    publishType:2,
    statusType:2
  }
};

var recipient_list = {
  "success" : "true",
  "message" : {},
  "page" : {
    "pageNo":1, 
    "pageSize":120, 
    "orderBy":"orderId", 
    "order":"desc", 
    "totalCount":4, 
    "result" : [
        {
            receiverId:1231231, //接收者id
			receiver:'接收方',
            remark:'备注信息',
            result:'处理结果'

        },
		 {
			 receiverId:123123, //接收者id
            receiver:'接收方',
            remark:'备注信息',
            result:'处理结果'

        }
    ]
  }
};

var merchant_list = {
	"success" : "true",
	"message" : {},
	"page" : {
	"pageNo":1, 
	"pageSize":120, 
	"orderBy":"orderId", 
	"order":"desc", 
	"totalCount":4, 
	"result" : [
		{
            "ucId" : 203859, // 用户ID
            "shortName" : "中国京东商城国际商务有限公司",
            "merchantId" : 272,
            "status" : 1,
            "enterType" : 1, // 1=自助商家 2=API商家
            "type" : 1, // 1品牌商；2独立电商
            "category" : "某分类1，某分类2等",
            "tip" : 1, // 1=商家名称飘红 0=商家名称不飘红,
            "subStatus" : 0 ,//无（0），未提交（1），待审核（2），审核通过（3），审核拒绝（4）
			"accressType":'接入方式',
			"telephone":'12312323',
			"email":'rachardking@126.com'
        },
		{
            "ucId" : 203859, // 用户ID
            "shortName" : "中国京东商城国际商务有限公司",
            "merchantId" : 272,
            "status" : 1,
            "enterType" : 1, // 1=自助商家 2=API商家
            "type" : 1, // 1品牌商；2独立电商
            "category" : "某分类1，某分类2等",
            "tip" : 1, // 1=商家名称飘红 0=商家名称不飘红,
            "subStatus" : 0 ,//无（0），未提交（1），待审核（2），审核通过（3），审核拒绝（4）
			"accressType":'接入方式',
			"telephone":'12312323',
			"email":'rachardking@126.com'
        }
		
	]
	}
}


app.mockup.register('/data/wgadmin/message/list', list);
app.mockup.register('/data/wgadmin/message/detail', detail);
app.mockup.register('/data/wgadmin/message/operate', success_result);
app.mockup.register('/data/wgadmin/message/edit', success_edit_result);
app.mockup.register('/data/wgadmin/message/recipient_list', recipient_list);
app.mockup.register('/data/wgadmin/message/recipient_operate_delete', success_result);
app.mockup.register('/data/wgadmin/message/recipient_add', success_result);
//app.mockup.register('/data/wgadmin/merchant/list', merchant_list);
app.mockup.register('/data/wgadmin/message/recipient_list_download_create', success_result);	
app.mockup.register('/data/wgadmin/message/merchant_list_operate', success_result);

})();





















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
