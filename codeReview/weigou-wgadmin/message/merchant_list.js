/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/merchant_list.js ~ 2014/01/15 14:19:25
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * merchant_list相关的实现逻辑
 **/

goog.require('er.ListAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/merchant_list.less');
goog.include('wgadmin/message/merchant_list.html');

goog.provide('wgadmin.message.MerchantList');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
wgadmin.message.MerchantList = function() {
    er.ListAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_merchant_list';
};
baidu.inherits(wgadmin.message.MerchantList, er.ListAction);

/** @inheritDoc */
wgadmin.message.MerchantList.prototype.initModel = function(argMap, callback) {
    var me = this;
	var model = me.model;
	var pwm = new base.ParallelWorkerManager();
	
	model.Fields = [
		wgadmin.message.Fields.ucId,
		wgadmin.message.Fields.shortName,
		wgadmin.message.Fields.enterType,
		wgadmin.message.Fields.category,
		wgadmin.message.Fields.status,
		wgadmin.message.Fields.chargePhone,
		wgadmin.message.Fields.chargeEmail
	]
	model.filterTypeList = wgadmin.util.transferMapToList(wgadmin.message.enumerate.merchantType);
	model.enterTypeDS = wgadmin.util.transferMapToList(wgadmin.message.enumerate.accressType);
	model.filterStatusList =  wgadmin.util.transferMapToList(wgadmin.message.enumerate.merchantStatus);
	
	model.filterTypeValue = model.filterTypeValue || '1';
	model.enterType = model.enterType || '0';
	model.filterStatusValue = model.filterStatusValue || '0';
	model.categoryIdValue = model.categoryIdValue || '0';
	
	pwm.addWorker(new base.FuncWorker(
		wgadmin.product.data.productTree,
		'id=-1&.ui-loading=0',
		function(data){
			var model=[];
			if (data.result.children.length) {
				var children = data.result.children;
				for (var i = 0; i < children.length; i++) {
					model.push({
						name: children[i].text,
						value: children[i].id
					});
				}
				model.push({
					name:'全部',
					value: '0'
				})
			}
			me.model.categoryIdDS = model;
			
		}
	));
	
	pwm.addDoneListener(callback);
    pwm.start();
	//model.getCats = wgadmin.product.data.productTree;
	
  
};

/** @inheritDoc */
wgadmin.message.MerchantList.prototype.afterInit = function(page) {
    var me = this;
   me.form = me.page.c('form');
   me.list = me.page.c('list');
   me.list.breakLine = true;
   me.requesterList = wgadmin.message.data.merchant_list;
  
};

wgadmin.message.MerchantList.prototype.initBehaviorInternal = function() {
	var me = this;
	var table = me.list.getTable();
	//批量导入
	me.page.c('inportBtn').onclick = function(){
		if(!table.selection.length){
			ui.Dialog.alert({
				title: '请选择要导入的商家',
				content: '请选择要导入的商家',
				skin: 'flat'
			});
			return
		}
		var ids = [];
		baidu.each(table.selection, function(item, index){
			ids.push(item.ucId);
		})
		wgadmin.message.data.merchant_list_operate(
			baidu.format('messageId={0}&ucId={1}&publishType={2}',
				me.model.messageId,
				ids.join(','),
				me.model.messageType
			),
			me.argMap.callback
		)
	}
	
	//导入全部
	me.page.c('inpotAllBtn').onclick = function(){
		wgadmin.message.data.merchant_list_operate(
			baidu.format('messageId={0}&publishType={2}&{1}',
				me.model.messageId,
				me.form.getParams(),
				me.model.messageType

			),
			me.argMap.callback
		)
	}
	
	//回传
	function callback(){
		ui.Dialog.alert({
			title: '导入成功',
			content: '导入成功'
		});
	}
  
};


















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
