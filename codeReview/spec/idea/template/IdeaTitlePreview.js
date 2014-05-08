/**
 * @file 推广位标题样式预览
 * @author wuhuiyao
 */
define(function (require, exports) {

    var Template = require('./Template');
    var orgInfo = require('common/datasource/orgInfo');

    /**
     * 创建推广位标题样式预览
     *
     * @return {Template}
     */
    exports.create = function () {
        var instance = new Template();
        instance.data.orgName = orgInfo.data.short_name || '';
        instance.template = 'idea_template_title';
        return instance;
    };
});