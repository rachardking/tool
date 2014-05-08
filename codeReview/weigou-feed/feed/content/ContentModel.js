/**
 * @file 新闻详情 model
 * @author jinzhiwei
 */
define(function (require) {
    var UIModel = require('ef/UIModel');
    var datasource = require('common/datasource');
    var getQuery = require('biz/getQuery');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var _ = require('underscore');
    
    function Model(context) {
        var model = this;
       
        UIModel.apply(model, arguments);
        
		model.datasource = {
            'list': datasource.remote(url.GET_ANNOUNCE_DETAIL, {
                data: {
                    id: model.get('id');
                }
            })
        }
    }

    var util = require('er/util');

    util.mix(Model.prototype, {
        prepare: function () {
            var model = this;
            var list = model.get('list');
            list.detail = list.detail.replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
            UIModel.prototype.prepare.apply(model, arguments);
        }
    });

    util.inherits(Model, UIModel);

    return Model;
});