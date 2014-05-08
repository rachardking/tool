/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/list.js ~ 2014/01/15 10:32:11
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * list相关的实现逻辑
 **/

goog.require('er.ListAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/list.less');
goog.include('wgadmin/message/list.html');

goog.provide('wgadmin.message.List');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
wgadmin.message.List = function() {
    er.ListAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_list';
};
baidu.inherits(wgadmin.message.List, er.ListAction);

/** @inheritDoc */
wgadmin.message.List.prototype.initModel = function(argMap, callback) {
	
    var me = this;
	var model = me.model;
	var date1 = new Date();
	var date2 = new Date(date1.getFullYear() - 1, date1.getMonth(), date1.getDate());
	
	model.Fields = [
		wgadmin.message.Fields.id,
		wgadmin.message.Fields.messangeName,
		wgadmin.message.Fields.publishType,
		wgadmin.message.Fields.statusType,
		
		wgadmin.message.Fields.createdDate,
		wgadmin.message.Fields.operate
	]
	
	model.dsPublishType = wgadmin.util.transferMapToList(wgadmin.message.enumerate.publishType);
	model.dsStatusType = wgadmin.util.transferMapToList(wgadmin.message.enumerate.statusType);
	
	model.publishType = me.model.publishType || '0';
	model.statusType = me.model.statusType || '0';
	
	model.dateValue = {
        begin: me.model.createTimeBegin? baidu.date.parse(me.model.createTimeBegin):date2,
        end: me.model.createTimeEnd? baidu.date.parse(me.model.createTimeEnd):date1
    };
	
	callback();
	
};

/** @inheritDoc */
wgadmin.message.List.prototype.afterInit = function(page) {
    var me = this;
	me.requesterList = wgadmin.message.data.list;
	me.list = me.page.getChild('list');
	me.form = me.page.c('formSearch'); 
};

wgadmin.message.List.prototype.initBehaviorInternal = function() {
	var me  = this;
	var table = me.list.getTable();
	me.page.c('publishBtn').onclick = operate('publish');
	me.page.c('deleteBtn').onclick = operate('delete');
	me.page.c('createBtn').onclick = function(){
		//showDetail('create')
		er.locator.redirect('/wgadmin/message/edit')
	};
	
	me.page.c('downloadBtn').onclick = function(){
		wgadmin.util.loadPopup(me.page, 
			'wgadmin.message.TaskListForm',
			{
				width: 950, 
				title:'下载列表'
			}, 
			{
				paramMap: {
					
				},
				callback: baidu.fn.bind(me.onDialogClose, me),
				parentAction: me
			}
		);
	};
	
	
	
	me.list.addListener(ui.events.AFTER_RENDER,showPublishBtn)
	
	function showPublishBtn(value){
		var value = me.form.c('statusType').getValue();
		if(value == '0' || value == '1'){
			me.page.c('publishBtn').show();
		}else{
			me.page.c('publishBtn').hide();
		}
	}
	
	function operate(type){
		var ds = arguments[1]||{}
		return function(){
			var ids = [];
			if(typeof type === 'string'){
				if(!table.selection.length){
					ui.Dialog.alert({
						title: '请选择要进行批量操作的消息',
						content: '请选择要进行批量操作的消息后再进行操作。',
						skin: 'flat'
					});
					return
				}
				
				baidu.each(table.selection, function(item, index){
					ids.push(item.id);
				})
			}else{
				type = type.getAttribute('title');
				ids.push(ds.id);;
			}
			//wgadmin.message.data.operate
			wgadmin.message.data.operate(
				baidu.format('id={0}&type={1}',
                    ids.join(','),
					type
				),
				function(){
					me.list.getData()
				}
			)
			return false
		}
	}
	
	function showDetail(type,id){
		var title 
		switch(type){
			case 'create':
			title = '新建消息';
			break
			case 'edit':
			title = '编辑消息';
			break
			case 'view':
			title = '查看消息';
			break
		}
		
		wgadmin.util.loadPopup(me.page, 
			'wgadmin.message.Edit',
			{
				width: 950, 
				title:title
			}, 
			{
				paramMap: {
					id: id 
				},
				callback: function(){
					 wgadmin.util.unloadPopup(me.page);
				},
				parentAction: me
			}
		);
	}
	
	me.list.delegateEvent('click');
	me.list.addListener('CMD:click:VIEW', function(target, item) {
		wgadmin.util.loadPopup(me.page, 
			'wgadmin.message.Detail',
			{
				width: 1050, 
				title:'消息详情'
			}, 
			{
				paramMap: {
					id: item.id
				},
				callback: function(){
					 wgadmin.util.unloadPopup(me.page);
				},
				parentAction: me
			}
		);
		return false
    });
	me.list.addListener('CMD:click:EDIT', function(target, item) {
		//showDetail('edit', item.id);
		er.locator.redirect('/wgadmin/message/edit~id=' + item.id)
		return false
    });
	me.list.addListener('CMD:click:PUBLISH', function(target, item){
		operate(target, item)();
		return false
	});
	me.list.addListener('CMD:click:DELETE', function(target, item){
		operate(target, item)();
		return false
	});
}

wgadmin.message.List.prototype.getExtraParam = function() {
	var me = this;
	me.dateRange = me.form.c('dateRange');
	var DATE_FORMAT = 'yyyy-MM-dd';
	var createTimeBegin = baidu.date.format(me.dateRange.value.begin, DATE_FORMAT);
	var createTimeEnd = baidu.date.format(me.dateRange.value.end, DATE_FORMAT);
	return baidu.format('createTimeBegin={0}&createTimeEnd={1}',createTimeBegin ,createTimeEnd)
}


wgadmin.message.List.prototype.onDialogClose = function(){
    var me = this;
    wgadmin.util.unloadPopup(me.page);
    me.list.getData();
}















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
