/**
 * @file 编辑新闻
 * @author jinzhiwei
 */
define(function (require) {
    var ERAction = require('er/Action');
    
    function Action() {
        ERAction.apply(this, arguments);
    }

    var util = require('er/util');
    var ajax = require('common/ejson')
    var url = require('biz/url');
    
    util.mix(Action.prototype, {
        modelType: require('./EditContentModel'),
        viewType: require('./EditContentView')
    });
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;
        
        view.on('formSubmit', function (formData) {
            formData = formData.data;
            if (model.get('id')) {
                formData.id = model.get('id');
            }
            
            ajax.post(url.POST_ANNOUNCE_EDIT, formData, 'json').then(function (data) {
                var actionCallback = model.get('actionCallback');
                actionCallback && actionCallback(formData);
                action.fire('handlefinish');
            })
        });
        
        view.on('cancel', function () {
            action.fire('handlefinish');
        }); 
        //util.getElement('feed-dialog-content').innerHTML = model.get('contentHTML');
    };

    util.inherits(Action, ERAction);

    return Action;
});