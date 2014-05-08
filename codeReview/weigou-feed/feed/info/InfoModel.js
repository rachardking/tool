/**
 * @file 查看feed状态 model
 * @author jinzhiwei
 */
define(function (require) {
    var UIModel = require('ef/UIModel');
    var datasource = require('common/datasource');
    var getQuery = require('biz/getQuery');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var _ = require('underscore');
    var constants = require('common/constants').getContants();
    var mapFeed = require('biz/feed/util');
    var pageMap = {
        pageNo: 'page',
        totalCount: 'count'        
    }
    
    function mapPage(data){
        for (var i in data) {
            if (pageMap[i]) {
                data[pageMap[i]] = data[i];
                delete data[i]
            }
        }
        return data;
    }
    
    
    
    function Model() {
        var model = this;
        UIModel.apply(model, arguments);
        model.pageArguments = {
            pageNo: 1,
            pageSize: 20,
            order: '',
            orderBy: ''
        };
        model.listArguments = {
            indexType: 1,
            page: model.pageArguments
        };
        
        model.datasource = {
            'list': datasource.remote(url.GET_FEEDLIST),
            'exception': datasource.remote(url.GET_FEED_EXCEPTION, {data:model.listArguments})
        }
       
    }

    var util = require('er/util');


    util.mix(Model.prototype, {
        prepare: function () {
            var model = this;
            model.set('feeds', model.get('list').feedList);
            model.set('constants', constants);
            
            var mapfeeds = mapFeed(model.get('feeds'), true)
            model.set('mapfeeds', mapfeeds);
            UIModel.prototype.prepare.apply(model, arguments);
        },
        
        updateModel: function(data, callback){
            var model = this;
            callback = callback || function () {};
            //FIX 合并参数功能太弱
            util.mix(model.listArguments.page, data.page)
            delete data.page;
            util.mix(model.listArguments, data);
            ajax.post(url.GET_FEED_EXCEPTION,model.listArguments, 'json').then(function(data){
                model.set('exception', mapPage(data));
                callback()
            });
        }
        

    });

    util.inherits(Model, UIModel);

    return Model;
});