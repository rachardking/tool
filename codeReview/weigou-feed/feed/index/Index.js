/**
 * @file 首页
 * @author jinzhiwei
 */
define(function (require) {
    var ERAction = require('er/Action');

    function Action() {
        ERAction.apply(this, arguments);
    }

    var util = require('er/util');

    util.mix(Action.prototype, {
        modelType: require('./IndexModel'),
        viewType: require('./IndexView')
    });

    var locator = require('er/locator');
    var Dialog = require('esui/Dialog');
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);
        
        var model = action.model;
        var view = action.view;
        
        
      
    }

    util.inherits(Action, ERAction);

    return Action;
});