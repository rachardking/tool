/**
 * @file 状态 model
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
        var contentId = model.get('id');
        if (contentId) {
            model.datasource = {
                'content': datasource.remote(url.GET_ANNOUNCE_DETAIL, {
                    data:{
                        id: contentId
                    }
                })
            }
        } else {
            model.set('content', {})
        }
		
    }

    var util = require('er/util');


    util.mix(Model.prototype, {
        prepare: function () {
            var model = this;
            
            UIModel.prototype.prepare.apply(model, arguments);
            
        }
        
      

    });

    util.inherits(Model, UIModel);

    return Model;
});