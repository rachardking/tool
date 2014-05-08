/**
 * @file 设置时间 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    
    require('esui/Select');
    require('er/tpl!./SetTime.tpl.html');
    

    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_setTime';
    var constants = require('common/constants').getContants();;
    
    View.prototype.uiProperties = {
        time: {
            value: '',
            required: 1,
            requiredErrorMessage: '时间不能为空'
        },
        
        subTime: {
            value: '00',
            disabled: 1
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