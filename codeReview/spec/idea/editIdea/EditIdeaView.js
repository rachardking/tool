/**
 * @file 编辑创意 View
 * @author zhujialu
 */
define(function (require, exports) {

    require('er/tpl!./editIdea.html');

    require('common/ui/LevelSelector');
    require('common/ui/SaveButton');
    require('./MaxIdeaInputLengthRule');

    var UIView = require('ef/UIView');

    var Event = require('common/config/event');

    var ideaUtil = require('common/biz/ideaUtil');
    var inputUtil = require('common/util/input');
    var regExp = require('common/config/regexp');

    var accountTree = require('common/datasource/accountTree');

    var ideaConf = require('common/config/globalConf').idea;
    var ideaText = require('idea/text').HINT;

    var IdeaTitlePreview = require('idea/template/IdeaTitlePreview');
    var IdeaDetailPreview = require('idea/template/IdeaDetailPreview');

    /**
     * 对于创意输入对于通配符是不算字符长度内，因此这里预处理下
     *
     * @param {string} value 原始输入值
     * @return {string}
     * @inner
     */
    function getInputValue(value) {
        return value.replace(/{([^}]*)}/g, '$1');
    }

    var ideaTitleInputTip = inputUtil.initTip({
        max: ideaConf.TITLE_MAX_LEN,
        focus: true,
        input: true,
        getValue: getInputValue
    });
    var ideaDescInputTip = inputUtil.initTip({
        max: ideaConf.DESC_MAX_LEN,
        focus: true,
        input: true,
        getValue: getInputValue
    });
    var ideaUrlInputTip = inputUtil.initTip({
        max: ideaConf.VISIT_URL_MAX_LEN,
        en: true,
        focus: true,
        input: true
    });

    var validityMap = {
        title: 'ideaTitleValidityLabel',
        desc: 'ideaDescValidityLabel',
        url: 'ideaUrlValidityLabel'
    };

    return UIView.derive({

        onrender: function () {
            var model = this.model;
            var planId = model.get('planId');
            var unitId = model.get('unitId');
            var isEdit = planId && unitId;
            model.set('planUnitLabel', isEdit ? '创意计划单元' : '新增至');

            this.uiProperties = {
                levelSelector: {
                    planWidth: 140,
                    unitWidth: 140,
                    planEmptyText: '请选择计划',
                    unitEmptyText: '请选择单元',
                    levelData: model.get('levelData') || accountTree.getSelTreeData(),
                    planId: planId,
                    planName: model.get('planName'),
                    unitId: unitId,
                    unitName: model.get('unitName')
                },
                ideaTitleTextBox: {
                    width: 330,

                    value: ideaUtil.parseTitleToRaw(model.get('ideaTitle')),
                    validityLabel: validityMap.title,

                    required: true,
                    requiredErrorMessage: ideaText.IDEA_TITLE_REQUIRED_ERROR,

                    maxIdeaInputLength: ideaConf.TITLE_MAX_LEN,
                    maxIdeaInputLengthErrorMessage: ideaText.IDEA_TITLE_MAX_CN_LENGTH_ERROR
                },
                ideaDescTextBox: {
                    width: 330,
                    height: 100,

                    value: ideaUtil.parseDescToRaw(model.get('ideaDesc')),
                    validityLabel: validityMap.desc,

                    required: true,
                    requiredErrorMessage: ideaText.IDEA_DESC_REQUIRED_ERROR,

                    maxIdeaInputLength: ideaConf.DESC_MAX_LEN,
                    maxIdeaInputLengthErrorMessage: ideaText.IDEA_DESC_MAX_CN_LENGTH_ERROR
                },
                ideaUrlTextBox: {
                    width: 330,

                    placeholder: '以 http:// 开头',
                    value: model.get('ideaUrl'),
                    validityLabel: validityMap.url,

                    required: true,
                    requiredErrorMessage: ideaText.IDEA_URL_REQUIRED_ERROR,

                    maxLength: ideaConf.VISIT_URL_MAX_LEN,
                    maxLengthErrorMessage: ideaText.IDEA_DESC_MAX_CN_LENGTH_ERROR,

                    pattern: regExp.URL,
                    patternErrorMessage: ideaText.IDEA_URL_PATTERN_ERROR
                },
                errorLabel: {
                    hidden: true
                }
            };
        },

        uiEvents: {
            ideaTitleTextBox: ideaTitleInputTip,
            ideaDescTextBox: ideaDescInputTip,
            ideaUrlTextBox: ideaUrlInputTip,
            insertTitleWildcardButton: {
                click: function () {
                    var textBox = this.get('ideaTitleTextBox');
                    var input = textBox.main.getElementsByTagName('input')[0];
                    ideaUtil.insertWildcard(input);
                    textBox.fire('input');
                }
            },
            insertDescWildcardButton: {
                click: function () {
                    var textBox = this.get('ideaDescTextBox');
                    var textarea = textBox.main.getElementsByTagName('textarea')[0];
                    ideaUtil.insertWildcard(textarea);
                    textBox.fire('input');
                }
            },
            submitButton: {
                click: function (e) {
                    var view = this;
                    var model = this.model;

                    var errorLabel = this.get('errorLabel');
                    errorLabel.hide();

                    // 先验证是否选中计划单元
                    var levelSelector = this.get('levelSelector');
                    if (!levelSelector.planName || !levelSelector.unitName) {
                        this.showError('请选择创意所属的计划单元');
                        return;
                    }

                    var form = this.get('ideaForm');
                    if (form.validate()) {

                        var promise;
                        var params = {
                            title: this.get('ideaTitleTextBox').getValue(),
                            desc: this.get('ideaDescTextBox').getValue(),
                            url: this.get('ideaUrlTextBox').getValue()
                        };
                        
                        if (model.get('ideaId')) {
                            params.ideaId = model.get('ideaId');
                            promise = model.editIdea(params);
                        }
                        else {
                            params.unitId = levelSelector.unitId;
                            promise = model.addIdea(params);
                        }

                        promise.done(function (response) {
                            if (response.status === 0) {
                                view.fire(Event.OPERATION_COMPLETE);
                            }
                            else {
                                view.showError(response.statusInfo.error_desc);
                                var obj = response.statusInfo.error_field;
                                if (obj) {
                                    for (var key in obj) {
                                        var validity = validityMap[key];
                                        if (validity) {
                                            validity = view.get(validity);
                                            validity.showValidityMessage(obj[key]);
                                        }
                                    }
                                }
                            }
                        });

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
         * @param {string} error
         */
        showError: function (error) {
            var errorLabel = this.get('errorLabel');
            errorLabel.setText(error);
            errorLabel.show();
        },

        enterDocument: function () {
            this.titlePreview = IdeaTitlePreview.create();
            this.detailPreview = IdeaDetailPreview.create();

            var ideaTitleTextBox = this.get('ideaTitleTextBox');
            var ideaDescTextBox = this.get('ideaDescTextBox');
            var ideaUrlTextBox = this.get('ideaUrlTextBox');

            var options = {
                title: ideaTitleTextBox.getValue(),
                titleTextBox: ideaTitleTextBox,
                desc: ideaDescTextBox.getValue(),
                descTextBox: ideaDescTextBox,
                url: ideaUrlTextBox.getValue(),
                urlTextBox: ideaUrlTextBox
            };

            this.titlePreview.init($.extend({}, options, {
                element: this.$('.idea-preview-title')
            }));
            this.detailPreview.init($.extend({}, options, {
                element: this.$('.idea-preview-detail')
            }));
        },

        onbeforeleave: function () {
            this.titlePreview.dispose();
            this.detailPreview.dispose();
        },

        template: 'idea_CreateIdea'
    });
});