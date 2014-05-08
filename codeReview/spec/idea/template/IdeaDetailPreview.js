/**
 * @file 推广位详情样式预览
 * @author wuhuiyao
 */
define(function (require, exports) {

    var Template = require('./Template');

    /**
     * 创建推广位详情样式预览
     *
     * @return {Template}
     */
    exports.create = function () {
        var instance = new Template();
        instance.template = 'idea_template_detail';
        return instance;
    };
});