/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/recipient_list.js ~ 2014/01/15 14:19:01
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * recipient_list相关的实现逻辑
 **/

goog.require('er.ListAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/recipient_list.less');
goog.include('wgadmin/message/recipient_list.html');

goog.provide('wgadmin.message.RecipientList');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
wgadmin.message.RecipientList = function() {
    er.ListAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_recipient_list';
};
baidu.inherits(wgadmin.message.RecipientList, er.ListAction);

/** @inheritDoc */
wgadmin.message.RecipientList.prototype.initModel = function(argMap, callback) {
    
	var me = this;
	var model = me.model;

	model.Fields = [
		wgadmin.message.Fields.receiver,
		wgadmin.message.Fields.remark,
		me.model.messageType == '1' ? wgadmin.message.Fields.result2 : wgadmin.message.Fields.result1
		
	]
    callback();
};

/** @inheritDoc */
wgadmin.message.RecipientList.prototype.afterInit = function(page) {
   var me = this;
   me.form = me.page.c('form');
   me.list = me.page.c('list');
   me.requesterList = wgadmin.message.data.recipient_list;
};


wgadmin.message.RecipientList.prototype.initBehaviorInternal = function() {
	var me = this;
	var ucid = er.context.get('visitor').id;
	var table = me.list.getTable();
	var step1 =  me.page.c('btnProgress1');
	var step2 = me.page.c('btnProgress2');
	
	if(me.model.messageType != '2' && me.model.messageType != '3'){
		me.page.c('inportOut').getMain().style.display = 'none';
	}
	
	me.page.c('inportSys').onclick = function(){
		wgadmin.util.loadPopup(me.page, 
			'wgadmin.message.MerchantList',
			{
				width: 1050, 
				title:'从系统导入'
			}, 
			{
				paramMap: {
					messageId: me.model.messageId,
					messageType: me.model.messageType
				},
				callback: baidu.fn.bind(me.onDialogClose, me),
				parentAction: me
			}
		);
	}
	
	me.page.c('inportOut').onclick = function(){
		wgadmin.util.loadPopup(me.page, 
			'wgadmin.message.InportOuter',
			{
				width: 250, 
				title:'从外部导入'
			}, 
			{
				paramMap: {
					messageId: me.model.messageId ,
					messageType: me.model.messageType
				},
				callback: baidu.fn.bind(me.onDialogClose, me),
				parentAction: me
			}
		);
	}
	
	me.page.c('deleteBtn').onclick = function(){
		if(!table.selection.length){
			ui.Dialog.alert({
				title: '请选择要操作的项目',
				content: '请选择要操作的项目',
				skin: 'flat'
			});
			return
		}
		var ids = [];
		baidu.each(table.selection, function(item, index){
			ids.push(item.receiverId);
		})
		wgadmin.message.data.recipient_operate_delete(
			baidu.format('receiverId={0}',
				ids.join(',')
			),
			function(){
				me.list.getData()
			}
		)
	}
	
	
	me.page.c('returnBtn').onclick = function(){
		er.locator.redirect('/wgadmin/message/list');
		return false
	}
	step1.onclick = function(){
		er.locator.redirect('/wgadmin/message/edit~id=' + me.model.messageId)
		return false
	}
	
	
}


wgadmin.message.RecipientList.prototype.onDialogClose = function(){
    var me = this;
    wgadmin.util.unloadPopup(me.page);
    me.list.getData();
}
















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
