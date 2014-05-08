/**
 * @file 创意输入标题及描述长度验证规则，由于其包含通配符，其计算长度是不应该包括通配符的，
 *       所以这里重新定义一个验证规则。
 *
 * @author wuhuiyao@baidu.com
 */
define(function (require) {

    var Rule = require('esui/validator/Rule');
    var ValidityState = require('esui/validator/ValidityState');
    var util = require('common/util');

    function MaxIdeaInputLengthRule() {
        Rule.apply(this, arguments);
    }

    MaxIdeaInputLengthRule.prototype.type = 'maxIdeaInputLength';

    MaxIdeaInputLengthRule.prototype.errorMessage =
        '${title}不能超过${maxCNLength}个字符';

    MaxIdeaInputLengthRule.prototype.check = function (value, control) {

        // 移除通配符
        value = value.replace(/{([^}]*)}/g, '$1');

        return new ValidityState(
            util.getStringLength(value) <= this.getLimitCondition(control),
            this.getErrorMessage(control)
        );
    };

    require('esui/lib').inherits(MaxIdeaInputLengthRule, Rule);
    require('esui/main').registerRule(MaxIdeaInputLengthRule, 100);

    return MaxIdeaInputLengthRule;
});