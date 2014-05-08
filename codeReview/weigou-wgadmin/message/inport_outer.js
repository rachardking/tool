/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/inport_outer.js ~ 2014/01/17 10:12:59
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * inport_outer相关的实现逻辑
 **/

goog.require('er.FormAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/inport_outer.less');
goog.include('wgadmin/message/inport_outer.html');

goog.provide('wgadmin.message.InportOuter');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
wgadmin.message.InportOuter = function() {
    er.FormAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_inport_outer';
};
baidu.inherits(wgadmin.message.InportOuter, er.FormAction);

/** @inheritDoc */
wgadmin.message.InportOuter.prototype.initModel = function(argMap, callback) {
    var me = this;
	//2短信 3邮件
	switch(me.model.messageType){
		case '2':
		me.model.notice = '添加手机，一行一个';
		break
		case '3':
		me.model.notice = '添加邮箱,一行一个';
		break
		default :
		me.model.notice = '类型既不是手机也不是邮箱，请确认';
	}
	
    callback();
};

/** @inheritDoc */
wgadmin.message.InportOuter.prototype.afterInit = function(page) {
    var me = this;
	me.form = me.page.c('form');
	me.requester = wgadmin.message.data.recipient_add
};


wgadmin.message.InportOuter.prototype.initBehaviorInternal = function() {
	var me = this;
	me.form.c('receiver').getValue = function(){
		var value = baidu.trim(this.main.value);
		return value && value.split('\n').join(',') 
	}
}

wgadmin.message.InportOuter.prototype.onSubmitSucceed = function(data){
    var me = this;
    if (data.success == 'true') {
        me.argMap.callback();
	}
		
}



















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
