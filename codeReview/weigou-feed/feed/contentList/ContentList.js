/**
 * @file 新闻列表 action
 * @author jinzhiwei
 */
define(function (require) {
    var listFormAction = require('common/list/ListForm');
    function Action() {
        listFormAction.apply(this, arguments);
    }

    var util = require('er/util');
    var ajax = require('common/ejson');
    var url = require('biz/url');
    
    util.mix(Action.prototype, {
        modelType: require('./ContentListModel'),
        viewType: require('./ContentListView')
    });
    
    Action.prototype.initBehavior = function () {
        var action = this;
        listFormAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;
        
        view.on('showContent', function (e) {
            model.showContent({id: e.id});
        });
        
        view.on('deleteContent', function (e) {
            model.deleteContent({id: e.id});
        });
        
        model.on('showContent', function (e) {
            view.showContent(e);
        }); 
        
    };

    util.inherits(Action, listFormAction);

    return Action;
});