/**
 * 参数
 * {
 *    planId: '',
 *    planName: '',
 *    unitId: '',
 *    unitName: '',
 *    ideaId: '',
 *    ideaTitle: '',
 *    ideaDesc: '',
 *    ideaUrl: '',
 * }
 * 
 * @file 编辑创意 action
 * @author zhujialu
 */
define(function (require) {

    var Action = require('er/Action');
    var Event = require('common/config/event');
    var util = require('common/util');

    return Action.derive({

        modelType: require('./EditIdeaModel'),
        
        viewType: require('./EditIdeaView'),

        initBehavior: function () {
            
            var action = this;
            var view = this.view;

            view.on(Event.OPERATION_COMPLETE, util.fireEvent(action));
            view.on(Event.CLOSE, util.fireEvent(action));
        }
    });
});