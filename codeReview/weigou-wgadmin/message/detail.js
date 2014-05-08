/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/detail.js ~ 2014/01/17 09:37:09
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * detail相关的实现逻辑
 **/

goog.require('er.ListAction');
goog.require('ui.Label');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/detail.less');
goog.include('wgadmin/message/detail.html');

goog.provide('wgadmin.message.Detail');

/**
 * @constructor
 * @extends {er.ListAction}
 * @export
 */
wgadmin.message.Detail = function() {
    er.ListAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_detail';
};
baidu.inherits(wgadmin.message.Detail, er.ListAction);

/** @inheritDoc */
wgadmin.message.Detail.prototype.initModel = function(argMap, callback) {
	var me = this;
	var outerid = me.model.id;
	var pwm = new base.ParallelWorkerManager();
	var model = me.model;
	
	model.Fields = [
		wgadmin.message.Fields.receiver,
		wgadmin.message.Fields.remark,
		me.model.messageType == '1' ? wgadmin.message.Fields.result2 : wgadmin.message.Fields.result1
		
	]
	
	pwm.addWorker(new base.FuncWorker(
		wgadmin.message.data.detail,
		'id=' + encodeURIComponent(outerid),
		function(data){
			baidu.extend(model, data.result);
			model.publishType = wgadmin.message.enumerate.publishType[model.publishType];
			model.isTop = model.isTop && (model.isTop == 'true' ? '是' : '否')
		}
    ));
    pwm.addDoneListener(callback);
    pwm.start();
};

/** @inheritDoc */
wgadmin.message.Detail.prototype.afterInit = function(page) {
   var me = this;
   me.form = me.page.c('form');
   me.list = me.page.c('list');
   me.list.select = '';
   me.list.breakLine = true;
   me.requesterList = wgadmin.message.data.recipient_list;
   
   me.model.isTop || (baidu.g('isTop').style.display = 'none');
};

wgadmin.message.Detail.prototype.initBehaviorInternal = function() {
	var me = this;
	me.page.c('downloadBtn').onclick = function(){
            
            //wgadmin.message.data.operate
			wgadmin.product.data.createTask(
				baidu.format('input={0}&type=mes',
                    baidu.json.stringify({ucid:er.context.get('visitor').id, messageId:me.model.id, type:'download'})
				),
				function(){
					ui.Dialog.alert({
						title: '成功',
						content: '已成功创建下载任务',
						skin: 'flat'
					});
					//me.list.getData()
				}
			)
		}

};


	

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
