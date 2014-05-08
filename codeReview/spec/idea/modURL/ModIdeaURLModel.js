/**
 * @file  修改创意URL Model
 * @author wuhuiyao
 */
define(function (require) {

    var Model = require('er/Model');

    var util = require('common/util');
    var Event = require('common/config/event');
    var ideaService = require('common/service').idea;

    var tipConf = require('idea/text').HINT;
    var ideaEvent = require('idea/event');

    return Model.derive({

        /**
         * 修改创意URL
         *
         * @param {string} url 修改后的创意URL
         */
        modURL: function (url) {
            var model = this;
            var ideaIds = model.get('ideaIds');

            var params = {
                idea_ids: ideaIds,
                url: url
            };

            return ideaService.editIdeaURL(params).done(
                function (response) {

                    if (response.status === 0) {
                        model.fire(Event.OPERATION_COMPLETE);
                    }
                    else {

                        // 判断是不是存在部分修改不成功的情况
                        var hint = util.checkResponsePortion(
                            response,
                            tipConf.IDEA_URL_SOME_MOD_FAIL
                        );
                        var error = response.statusInfo.errorDesc;

                        model.fire({
                            type: ideaEvent.IDEA_MOD_URL_FAIL,
                            error: hint || error || tipConf.IDEA_URL_MOD_FAIL
                        });
                    }
                }
            );
        }
    });

});