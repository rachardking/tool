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
        this.actionCallback = context.actionCallback;
        var model = this;
        UIModel.apply(model, arguments);

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