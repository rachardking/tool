/**
 * @file   创意列表 action
 * @author zhujialu
 */
define(function (require) {

    var dataTableAction = require('common/biz/dataTable/Action');
    var ideaEvent = require('idea/event');

    return dataTableAction.derive({

        modelType: require('./Model'),

        viewType: require('./View'),

        /**
         * @override
         */
        initBehavior: function() {
            var model = this.model;
            var view = this.view;

            model.on(ideaEvent.IDEA_LIST_REFRESH, function () {

                // 不回到首页，不使用缓存，重新reload
                view.refreshList(false, false);
            });
        }
    });
});
