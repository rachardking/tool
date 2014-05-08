/**
 * @file 新闻列表 model
 * @author jinzhiwei
 */
define(function (require) {
    var ListFormModel = require('common/list/ListFormModel');
    var datasource = require('common/datasource');
    var getQuery = require('biz/getQuery');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var _ = require('underscore');
    
    
    function Model(context) {
        var model = this;
       
        ListFormModel.apply(model, arguments);
        model.listArguments.page.pageSize = 5;
		model.requestList = url.GET_ANNOUNCE
		model.datasource = {
            'list': datasource.remote(model.requestList, {data: model.listArguments})
        }
    }

    var util = require('er/util');


    util.mix(Model.prototype, {
        prepare: function () {
            var model = this;
            
            ListFormModel.prototype.prepare.apply(model, arguments);
            
        },
          
        deleteContent: function (req) {
            var model = this;
            ajax.post(url.POST_ANNOUNCE_DEL, req, 'json').then(function(res){
               // model.fire('deleteContent', res);
               model.updateModel();
            });
        }
        
      

    });

    util.inherits(Model, ListFormModel);

    return Model;
});