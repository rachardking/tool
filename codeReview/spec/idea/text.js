/**
 * @file   创意话术配置
 * @author zhujialu
 */
define(function (require) {

    var ideaConf = require('common/config/globalConf').idea;

    return {

        // 提示语
        HINT: {
            EMPTYIDS: '请先选择要操作的创意！',
            CONFIRM_TITLE: '提示',
            ALERT_TITLE: '警告',

            START_STARTED: '操作无效，因已选创意已经生效！',
            PAUSE_STOPPED: '操作无效，因已选创意已经暂停！',

            DEL_IDEA: '确认删除已选中的创意？',

            IDEA_URL_REQUIRED_MSG: '创意URL不能为空',
            IDEA_URL_OVERFLOW_MSG: '创意URL不能超过 ' + ideaConf.VISIT_URL_MAX_LEN + ' 个字符',

            IDEA_URL_ILLEGAL_MSG: '输入的URL非法',
            IDEA_URL_SOME_MOD_FAIL: '部分修改创意的URL失败：',
            IDEA_URL_MOD_FAIL: '修改创意的URL失败',

            IDEA_TITLE_REQUIRED_ERROR: '请输入创意标题',
            IDEA_TITLE_MAX_CN_LENGTH_ERROR: '创意标题请不要超过 ' + ideaConf.TITLE_MAX_LEN / 2 + ' 个汉字',
            IDEA_DESC_REQUIRED_ERROR: '请输入创意描述',
            IDEA_DESC_MAX_CN_LENGTH_ERROR: '创意描述请不要超过 ' + ideaConf.DESC_MAX_LEN / 2 + ' 个汉字',
            IDEA_URL_REQUIRED_ERROR: '请输入创意标题 url',
            IDEA_URL_MAX_LENGTH_ERROR: '创意标题 url 请不要超过 ' + ideaConf.VISIT_URL_MAX_LEN + ' 个字符',
            IDEA_URL_PATTERN_ERROR: '创意标题 url 格式错误，请以 http:// 开头'

        }
    };

});