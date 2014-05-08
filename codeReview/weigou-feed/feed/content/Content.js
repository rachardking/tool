/**
 * @file 新闻详情 action
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
        modelType: require('./ContentModel'),
        viewType: require('./ContentView')
    });
    
    /**
     * @override
     */
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

    };

    util.inherits(Action, ERAction);

    return Action;
});