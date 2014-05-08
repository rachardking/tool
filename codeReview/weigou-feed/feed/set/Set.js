/**
 * @file 提交数据源
 * @author jinzhiwei
 */
define(function (require) {
    var ERAction = require('er/Action');

    function Action() {
        ERAction.apply(this, arguments);
    }

    var util = require('er/util');

    util.mix(Action.prototype, {
        modelType: require('./SetModel'),
        viewType: require('./SetView')
    });

    var locator = require('er/locator');
    var Dialog = require('esui/Dialog');
   
    
    Action.prototype.initBehavior = function () {
        var action = this;
        ERAction.prototype.initBehavior.apply(action, arguments);

        var model = action.model;
        var view = action.view;
       
        view.on('setIndex', function (e) {
      
            view.popActionDialog(
                {
                    url: '/feed/submitFeed', 
                    title:'设置FEED文件地址', 
                    actionOptions: 
                        {
                            indexType: e.indexType, 
                            indexTypeMap: e.indexTypeMap,
                            actionCallback: function(data){
                               
                                if (data.indexType == '1') {
                                    view.get('fullAddressLabel').setText(data.value);
                                    view.get('fullTimeLabel').setText(data.lastUpdate);
                                } else {
                                    view.get('increaseAddressLabel').setText(data.value);
                                    view.get('increaseTimeLabel').setText(data.lastUpdate);
                                }
                                
                            }
                        }
                }
            )
        })
    
    };

    util.inherits(Action, ERAction);

    return Action;
});