/**
 * @file 提交数据源 model
 * @author jinzhiwei
 */
define(function (require) {
    var UIModel = require('ef/UIModel');
    var datasource = require('common/datasource');
    var getQuery = require('biz/getQuery');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var _ = require('underscore');
    var mapFeed = require('biz/feed/util');
    var util = require('er/util');
    
    function Model(context) {
        var model = this;
        UIModel.apply(model, arguments);
        
        model.datasource = {
           'list': datasource.remote(url.GET_FEEDLIST)
        }
        
    }

    var util = require('er/util');

    util.mix(Model.prototype, {
        prepare: function () {
            var model = this;
            //mapFeed(model.get('list').feedList)

            var mapfeeds = mapFeed(model.get('list').feedList, true)
            model.set('mapfeeds', mapfeeds);
            
            model.set('fullIndexInfo', model.get('mapfeeds')[0]);
            model.set('increaseIndexInfo', model.get('mapfeeds')[1]);
            
            UIModel.prototype.prepare.apply(model, arguments);
            
        }
    });

    util.inherits(Model, UIModel);

    return Model;
});