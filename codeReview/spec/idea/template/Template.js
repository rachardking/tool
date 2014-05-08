/**
 * @file 创意模版基类
 * @author zhujialu
 */
 define(function (require) {

    require('er/tpl!./template.html');

    var ideaUtil = require('common/biz/ideaUtil');
    var util = require('common/util');
    var tplUtil = require('common/util/tpl');

    /**
     * 空构造方法
     * 
     * 主要逻辑在原型中
     */
    function Template() {
        this.data = { };
    }

    Template.prototype = {

        constructor: Template,

        /**
         * 初始化
         * 
         * 创意包括输入和预览
         * 所以需要绑定实时预览
         *
         * @param {Object} options
         * @param {string} options.title
         * @param {TextBox=} options.titleTextBox
         * @param {string} options.desc
         * @param {TextBox=} optonis.descTextBox
         * @param {string} options.url
         * @param {TextBox=} options.urlTextBox
         * @param {jQuery} options.element
         */
        init: function (options) {
            $.extend(this, options);
            this.render();
        },

        /**
         * 渲染模版
         *
         * 如果此实现不满足需求，可覆盖 render
         */
        render: function () {
            var element = this.element;

            var html = tplUtil.renderByName(this.template, this.data);
            element.html(html);

            var titleElement = element.find('.idea-title');
            var descElement = element.find('.idea-desc');
            var urlElement = element.find('[data-role="url"]');

            setTitle(titleElement, this.title);
            setDesc(descElement, this.desc);
            setUrl(urlElement, this.url);

            this.bindPreview(
                this.titleTextBox, 
                titleElement,
                setTitle
            );
            this.bindPreview(
                this.descTextBox,
                descElement,
                setDesc
            );
            this.bindPreview(
                this.urlTextBox,
                urlElement,
                setUrl
            );
        },

        /**
         * 绑定实时预览
         * 
         * @param {TextBox} textBox
         * @param {jQuery} element
         * @param {Function} previewHandler
         */
        bindPreview: function (textBox, element, previewHandler) {
            if (!textBox) {
                return;
            }

            var handler = function (e) {
                var value = $.trim(textBox.getValue());
                previewHandler(element, value);
            };

            textBox.on('focus', handler);
            textBox.on('input', handler);
        },

        /**
         * 销毁模版
         */
        dispose: function () {
            var item;
            for (var key in this) {
                item = this[key];
                
                if (!item) {
                    continue;
                }

                if (typeof item.dispose === 'function') {
                    item.dispose();
                }
                delete this[key];
            }
        }
    };

    /**
     * 设置创意标题
     * 
     * @param {jQuery} element
     * @param {string} value
     */
    function setTitle(element, value) {
        value = value || element.data('placeholder');

        var cut = element.data('cut');
        if (cut > 0) {
            value = util.truncate(value, cut);
        }

        element.html(ideaUtil.highLight(value));
    }

    /**
     * 设置创意描述
     * 
     * @param {jQuery} element
     * @param {string} value
     */
    function setDesc(element, value) {
        value = value || element.data('placeholder');

        var cut = element.data('cut');
        if (cut > 0) {
            value = util.truncate(value, cut);
        }

        element.html(ideaUtil.highLight(value));
    }

    /**
     * 设置创意 url
     * 
     * @param {jQuery} element
     * @param {string} value
     */
    function setUrl(element, value) {
        element.prop('href', value);
    }

    return Template;

 });