/**
 * @file 提交Feed
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
        modelType: require('./SubmitFeedModel'),
        viewType: require('./SubmitFeedView')
    });

  
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;
      
        view.on('formSubmit', function (formData) {
            formData = formData.data;
            
            ajax.post(url.POST_FEED_SET, formData, 'json').then(function (data) {
                
                util.mix(data, formData);
                model.get('actionCallback')(data);
                action.fire('handlefinish');
            })
        })
        
        view.on('cancel', function () {
            action.fire('handlefinish')
        })
        
        action.on('actionloadabort', function(a){})
        

    };

    util.inherits(Action, ERAction);

    return Action;
});