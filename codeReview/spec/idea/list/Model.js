/**
 * @file   创意列表 Model
 * @author zhujialu
 */
define(function (require) {

    var datasource = require('er/datasource');
    var strings = require('common/locales/strings');
    var ideaService = require('common/service').idea;
    var dataTableModel = require('common/biz/dataTable/Model');
    var ideaEvent = require('../event');

    return dataTableModel.derive({

        // 设置数据源
        datasource: {

            materialType: function () {
                return 'idea';
            },

            materialNameKey: function () {
                return 'ideaName';
            },

            primaryKey: datasource.constant('ideaId'),

            ajaxPath: datasource.constant({
                GET_LIST: {
                    requester: ideaService.searchIdea,

                    /**
                     * 附加参数，需要根据不同层级添加不同参数
                     * @param  {Object} model 传入当前的model对象
                     * @return {Object} object
                     *         账户层级 object 为 { }
                     *         计划层级 bject 为 {
                     *             plan_id: id
                     *         }
                     *         单元层级 object 为 {
                     *             unit_id: id
                     *         }
                     */
                    params: function (model) {

                        var level = model.get('level');
                        var levelId = model.get('levelId');
                        var params = { };

                        if (level !== 'account') {
                            params[level + 'Id'] = levelId;
                        }

                        return params;
                    }
                }
            })

        },

        /**
         * 修改当前选择的创意状态
         *
         * @param {Array.<number>} ideaIds 要修改的创意Id
         * @param {number} 要修改的创意
         * @return {Promise}
         */
        modIdeaStatus: function (ideaIds, status) {
//            var model = this;

            return ideaService.editIdeaStatus({
                idea_ids: ideaIds,
                status: status
            }).done(
                function (response) {
                    var editInfo = { ideaIds: ideaIds, isPause: status };
                    if (!response.isSuccess) {
                        editInfo.errorDesc
                            = response.statusInfo.errorDesc || '修改创意状态失败';
                    }
                    return editInfo;
                }
            ).fail(
                function () {
                    return { errorDesc: strings.NETWORK_EXCEPTION };
                }
            );
//                .done(function (response) {
//                    if (response.status === 0) {
//                        model.fire(ideaEvent.IDEA_LIST_REFRESH);
//                    }
//                });
        },

        /**
         * 删除当前选择的创意列表
         */
        delSelIdeas: function () {
            var model = this;
            ideaService.delIdea({
                idea_ids: model.get('selectedId') && model.get('selectedId').join(',')
            }).done(function (response) {
                    if (response.status === 0) {
                        model.fire(ideaEvent.IDEA_LIST_REFRESH);
                    }
                });
        }
    });
});
