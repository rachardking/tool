/**
 * @file 首页 model
 * @author jinzhiwei
 */
define(function (require) {
    var UIModel = require('ef/UIModel');
    var datasource = require('common/datasource');
    var getQuery = require('biz/getQuery');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    
    function Model() {
        var model = this;
        UIModel.apply(model, arguments);
        model.datasource = {
            'list': datasource.remote(url.GET_FEEDLIST),
            'contentList': datasource.remote(url.GET_ANNOUNCE, {data: { 
                page: {
                    pageNo: 1,
                    pageSize: 5,
                    order: '',
                    orderBy: ''
                }    
            }})
        }
           
    }
    
    
    Model.prototype.prepare = function () {
        var model = this;
        UIModel.prototype.prepare.apply(model, arguments);
        model.set('anList', model.get('contentList').result);
      
        
    }

    var util = require('er/util');

    util.inherits(Model, UIModel);

    return Model;
});