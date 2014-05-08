/**
 * @file 修改创意URL Action
 * @author wuhuiyao
 */
define(function (require) {

    var Action = require('er/Action');

    var util = require('common/util');
    var Event = require('common/config/event');
    var ideaEvent = require('idea/event');

    return Action.derive({

        modelType: require('./ModIdeaURLModel'),
        viewType: require('./ModIdeaURLView'),

        initBehavior: function () {

            var action = this;
            var model = this.model;
            var view = this.view;

            view.on(
                Event.CLOSE,
                util.fireEvent(action)
            );
            model.on(
                Event.OPERATION_COMPLETE,
                util.fireEvent(action)
            );
            model.on(
                ideaEvent.IDEA_MOD_URL_FAIL,
                function (e) {
                    view.showError(e.error);
                }
            );
        }
    });
});