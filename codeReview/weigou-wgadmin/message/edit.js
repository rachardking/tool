/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id: action.js 150523 2012-10-30 10:06:05Z  $
 *
 **************************************************************************/



/**
 * src/wgadmin/message/edit.js ~ 2014/01/15 14:18:23
 * @author jinzhiwei@baidu.com (jinzhiwei)
 * @version $Revision: 150523 $
 * @description
 * edit相关的实现逻辑
 **/

goog.require('er.FormAction');
goog.require('wgadmin.message.config');
goog.require('wgadmin.message.data');

goog.include('wgadmin/message/module.less');
goog.include('wgadmin/message/edit.less');
goog.include('wgadmin/message/edit.html');

goog.provide('wgadmin.message.Edit');

/**
 * @constructor
 * @extends {er.FormAction}
 * @export
 */
wgadmin.message.Edit = function() {
    er.FormAction.call(this);

    /**
     * 当前Action的View模板名称.
     * @type {string}
     */
    this.view = 'MAIN_PAGE_wgadmin_message_edit';
};
baidu.inherits(wgadmin.message.Edit, er.FormAction);

/** @inheritDoc */
wgadmin.message.Edit.prototype.initModel = function(argMap, callback) {
    var me = this;
	var outerid = me.model.id;
    var detailApiCallback = baidu.fn.bind(me.detailApiCallback,me);
	var pwm = new base.ParallelWorkerManager();
	var model = me.model;
	var dsPt = wgadmin.util.transferMapToList(wgadmin.message.enumerate.publishType);
	dsPt.shift();
	model.dsPublishType = dsPt;
	model.isTopDS = [
		{value:'true',text:'是'},
		{value:'false',text:'否'}
	]
	
	
    if (outerid) {
        pwm.addWorker(new base.FuncWorker(
            wgadmin.message.data.detail,
            'id=' + encodeURIComponent(outerid),
            function(data){
				baidu.extend(model, data.result);
				
			}
        ));
    }
	
    pwm.addDoneListener(callback);
    pwm.start();
};

/** @inheritDoc */
wgadmin.message.Edit.prototype.afterInit = function(page) {
   var me = this;
   me.form = me.page.c('form');
   me.requester = wgadmin.message.data.edit;
   me.btnSubmit = me.form.c('btnSubmit');
   me.btnCancel = me.form.c('btnCancel');
   me.initRichText();
};

wgadmin.message.Edit.prototype.initBehaviorInternal = function(){
	var me = this;
	var isTop = baidu.g('isTop',me.page.getMain());
	var isTopControl = me.form.c('isTop');
	var richText = me.form.c('detail');
	var areaText = me.form.c('detail2');
	var notice =  baidu.q('notice',me.page.getMain())[0];
	var step1 =  me.page.c('btnProgress1');
	var step2 = me.page.c('btnProgress2');
	
	me.form.c('publishType').onchange = changeIsTop;
	
	if(me.model.id){
		me.form.c('publishType').setReadOnly(true);
	}else{
		me.form.c('id').disable();
	}
	
	function changeIsTop(value){
		
		if(value == '1'){
			isTop.style.display = '';
			isTopControl.enable();
			
		}else{
			isTop.style.display = 'none';
			isTopControl.disable();

		}
		
		if(value == '2'){
			notice.style.display = '';
		}else{
			notice.style.display = 'none';
		}
		
		changeRichText(value)
	}

	function changeRichText(value){
		
		if(value === '2'){
			richText.getValue = function(){
				return this.editor.getContentTxt();
			}
		}else{
			richText.getValue = function(){
				return this.editor.getContent();
			}
			
		}
	}
	
	changeIsTop(me.form.c('publishType').getValue());
	
	//step1.disable();
	if(me.model.id){
		step2.onclick = function(){
			er.locator.redirect('/wgadmin/message/recipient_list~messageId=' + me.model.id + '&messageType=' + me.form.c('publishType').getValue())
		}
	}else{
		step2.disable();
	}
}


wgadmin.message.Edit.prototype.initRichText = function(){
    var me = this;
    
    me.model.richTextConfig = {
        'tools': [
            ['fullscreen', 'source',  'undo', 'redo', 
                'bold', 'italic', 'underline',  'formatmatch',  'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'cleardoc', 
                'fontfamily', 'fontsize', 
                'justifyleft', 'justifycenter', 'justifyright', 
                'insertimage',    'spechars',  'link', 'template', 
                'inserttable', 'title',
                'preview']
        ],
        'filter': function(value) {
            return value ? value.replace(/<\/p>\s*$/i, '')
                .replace(/<p>|<p\s[^>]*>/ig, '')
                .replace(/<p\/>|<\/p>/ig, '<br />') : '';
        },
        'style': [
            'html {',
                '-webkit-box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.5) inset;',
                '-moz-box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.5) inset;',
                'box-shadow: 0 1px 3px -1px rgba(0, 0, 0, 0.5) inset;',
            '}',
            'body {',
                'font-size: 14px;',
                'color: #333',
            '}',
            'img {',
                'margin: 3px;',
            '}'
        ].join('')
    };
}
wgadmin.message.Edit.prototype.onValidateForm = function(){
	var me = this;
	var reg = /<(.*)>.*|<(.*) \/>/;
	
	
}



wgadmin.message.Edit.prototype.onSubmitSucceed = function(data){
    var me = this;
    if (data.success == 'true') {
		er.locator.redirect('/wgadmin/message/recipient_list~messageId=' + data.result.messageId + '&messageType=' + me.form.c('publishType').getValue())
	}
		
}

















/* vim: set ts=4 sw=4 sts=4 tw=100 noet: */
