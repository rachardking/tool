/**
 * @file   修改创意URL View
 * @author wuhuiyao
 */
define(function (require) {

    require('er/tpl!./modIdeaURL.html');

    require('common/ui/SaveButton');

    var UIView = require('ef/UIView');
    var regExp = require('common/config/regexp');
    var ideaTipConf = require('idea/text');
    var ideaConf = require('common/config/globalConf').idea;
    var util = require('common/util');
    var inputUtil = require('common/util/input');

    return UIView.derive({

        uiEvents: {
            ideaURLTextBox: inputUtil.initTip({
                max: ideaConf.VISIT_URL_MAX_LEN,
                en: true,
                focus: true,
                input: true
            }),
            submitButton: {
                click: function (e) {
                    var view = this;
                    var model = view.model;

                    var errorLabel = view.get('errorLabel');
                    errorLabel.hide();

                    var form = view.get('form');
                    if (form.validate()) {

                        var urlTextbox = view.get('ideaURLTextBox');
                        var promise = model.modURL($.trim(urlTextbox.getValue()));

                        var btn = e.target;
                        btn.fire('save', {
                            promise: promise
                        });
                    }
                }
            },

            cancelButton: {
                click: function () {
//                    this.fire(Event.CLOSE);
                    this.fire('cancel');
                }
            }
        },

        /**
         * 显示错误信息
         *
         * @param {string} text 要显示的错误信息
         */
        showError: function (text) {

            var errorLabel = this.get('errorLabel');
            errorLabel.setText(text);
            errorLabel.show();

        },

        /**
         * @override
         */
        onrender: function () {

            // 初始化ui控件配置
            this.uiProperties = {
                ideaURLTextBox: {
                    mode: 'text',

                    width: 320,
                    placeholder: '请输入创意URL',
                    validityLabel: 'ideaURLValidityLabel',

                    // 不能为空
                    required: true,
                    requiredErrorMessage: ideaTipConf.IDEA_URL_REQUIRED_MSG,

                    // 验证URL合法性
                    pattern: regExp.URL,
                    patternErrorMessage: ideaTipConf.HINT.IDEA_URL_ILLEGAL_MSG,

                    // 验证长度
                    maxCNLength: ideaConf.VISIT_URL_MAX_LEN,
                    maxCNLengthErrorMessage: ideaTipConf.IDEA_URL_OVERFLOW_MSG
                },

                errorLabel: {
                    hidden: true
                }
            };

            var url = this.model.get('ideaURL');
            if (url) {
                this.uiProperties.ideaURLTextBox.value = url;
            }
            else {
                this.uiProperties.ideaURLTextBox.value = '';
            }
        },

        template: 'idea_modURL'

    });
});