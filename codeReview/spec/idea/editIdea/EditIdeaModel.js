/**
 * @file 编辑创意 View
 * @author zhujialu
 */
define(function (require) {
    
    var Model = require('er/Model');
    var ideaService = require('common/service').idea;

    return Model.derive({

        /**
         * 新建创意
         * 
         * @param {Object} params
         * @param {string} params.unitId
         * @param {string} params.title
         * @param {string} params.desc
         * @param {string} params.url
         * @return {Promise}
         */
        addIdea: function (params) {
            params.type = 2; // 2 表示服务模版
            return ideaService.addIdea(params);
        },

        /**
         * 修改创意
         * 
         * @param {Object} params
         * @param {string} params.ideaId
         * @param {string} params.title
         * @param {string} params.desc
         * @param {string} params.url
         * @return {Promise}
         */
        editIdea: function (params) {
            return ideaService.editIdea(params);
        }
    });
});