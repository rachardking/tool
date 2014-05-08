/**
 * @file 查看feed状态
 * @author jinzhiwei
 */
define(function (require) {
    var ERAction = require('er/Action');

    function Action() {
        ERAction.apply(this, arguments);
    }

    var util = require('er/util');

    util.mix(Action.prototype, {
        modelType: require('./InfoModel'),
        viewType: require('./InfoView')
    });

    var locator = require('er/locator');
    var Dialog = require('esui/Dialog');
   
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;

        function updatModel(action, params, callback) {
            model.updateModel(params);
        }
        function updateView(event) {
            view.updateView(event);
        }
        

        // 切换tab的事件处理
        view.on('changeTab', function (params) {
            updatModel(action, {
                indexType: params.evt.tab.value,
                page:{ pageNo: 1 }
            });
        });
        
         // 分页size发生变更的时候的事件
        view.on('changepagesize', function (params) {
            updatModel(action, {
                page: {
                    pageSize: params.evt.target.pageSize,
                    pageNo: 1
                }
            });
        });

        // 页码发生变更的时候的事件
        view.on('changepage', function (params) {
            updatModel(action, {
                page: {
                    pageNo: parseInt(params.evt.target.page, 10)
                }
            });
        });
        
        view.on('startIndex', function () {
            require('er/locator').redirect('/feed/set');    
        });
        
        view.on('cancelIndex', function () {
            require('common/ejson')
            .post(require('biz/url').POST_FEED_OPERATE, {type: 0})
            .then(function (data) {
                require('er/locator').reload();
            })
        });
        
        view.on('setTime', function () {
            view.popActionDialog(
                {
                    url: '/feed/setTime',
                    title: '修改全量索引更新时间', 
                    actionOptions: {
                        actionCallback: function (data) {
                            T.q('set-time')[0].innerHTML = data.time + ':00';    
                        }
                    }
                }   
            )

        });
        
        model.on('change', function (event) {
            updateView(event);
 
        })
    
    };

    util.inherits(Action, ERAction);

    return Action;
});