/**
 * @file 状态 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    
    require('esui/Select');
    require('er/tpl!./EditContent.tpl.html');
    

    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_edit_content';
    var constants = require('common/constants').getContants();;
    
    View.prototype.uiProperties = {
        ContentTitle: {
            required: 1,
            requiredErrorMessage: '标题不能为空',
            value:'@content.title',
            exMaxLength: 255
            
        },
        
        ContentDetail: {
            required: 1,
            requiredErrorMessage: '正文不能为空',
            value: '@content.detail',
            exMaxLength: 2048
        },
        
        form: {
            autoValidate: true,
            submitButton: 'SubmitBtn'
        }
        
      
    };

    View.prototype.uiEvents = {
       'CancelBtn:click': function () {
            this.fire('cancel');
        },

        'form:submit': function (data) {
           this.fire('formSubmit',  {data: data.target.getData()});
           
        }

    };
    


    util.inherits(View, UIView);

    return View;
});