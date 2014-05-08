/**
 * @file 设置时间状态
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
        modelType: require('./SetTimeModel'),
        viewType: require('./SetTimeView')
    });
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;

        view.on('formSubmit', function (formData) {
            formData = formData.data;
            
            ajax.post(url.POST_FEED_SETTIME, formData, 'json').then(function (data) {
                model.actionCallback(formData);
                action.fire('handlefinish');
            })
        });
        
        view.on('cancel', function () {
            action.fire('handlefinish');
        }); 

    };

    util.inherits(Action, ERAction);

    return Action;
});