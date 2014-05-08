/**
 * @file 提交Feed view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var constants = require('common/constants').getContants();;
    require('esui/Select');
    require('er/tpl!./SubmitFeed.tpl.html');
    

    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_SubmitFeed';
   
    
    View.prototype.uiProperties = {
        value: {
            required: 1,
            requiredErrorMessage: '地址不能为空'
        },
        
        indexType: {
            value: '@indexType',
        },
        
        indexTypeLabel: {
            text: '@indexTypeMap',
        },
        
        form: {
            autoValidate: true,
            submitButton: 'SubmitBtn'
        }
        
      
    };

    View.prototype.uiEvents = {
        'form:submit': function (data) {
           this.fire('formSubmit',  {data: data.target.getData()});
           
        },
        
        'CancelBtn:click': function () {
            this.fire('cancel');
        }

    };
    


    util.inherits(View, UIView);

    return View;
});