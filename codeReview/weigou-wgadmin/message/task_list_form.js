/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/task_list_form.js ~ 2014/01/17 09:36:05
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * task_list_form相关的实现逻辑
 **/

goog.require('er.ListAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/task_list_form.less');
goog.include('wgadmin/message/task_list_form.html');

goog.provide('wgadmin.message.TaskListForm');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
wgadmin.message.TaskListForm = function() {
    er.ListAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_task_list_form';
};
baidu.inherits(wgadmin.message.TaskListForm, er.ListAction);

/** @inheritDoc */
wgadmin.message.TaskListForm.prototype.initModel = function(argMap, callback) {
    var fields = wgadmin.fields;
    this.model.taskListFields = [fields.TASK_CREATE_TIME,
        fields.TASK_STATUS,
        fields.TASK_DOWNLOAD];
    callback();
};

/** @inheritDoc */
wgadmin.message.TaskListForm.prototype.afterInit = function(page) {
     this.list = page.c('taskList');
    this.form = page.c('form');
    this.requesterList = wgadmin.util.data.taskList;
};


wgadmin.message.TaskListForm.prototype.initBehaviorInternal = function() {
    var me = this;
    this.list.delegateEvent('click');
    this.list.addListener('CMD:click:DOWNLOAD', function(a) {
        jn.util.download(baidu.string.format('{0}?taskId={1}&ucId={2}',
            wgadmin.config.url.taskDownload,
            baidu.dom.getAttr(a, 'data-id'),
            er.context.get('visitor').id));
    });
    this.page.c('refreshBtn').onclick = function() {
        me.list.getData();
    };
    this.page.c('closeBtn').onclick = function() {
        me.argMap.callback();
    };
};

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
