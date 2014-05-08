/**
 * @file 提交数据源 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    
    require('esui/Select');
    require('er/tpl!./Set.tpl.html');
    

    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_set';
    var constants = require('common/constants').getContants();
  
    View.prototype.uiProperties = {
        fullAddressLabel: {
            text: '@fullIndexInfo.feedAddress'
        },
        fullTimeLabel: {
            text: '@fullIndexInfo.merchantLastUpdate'
        },
        increaseAddressLabel: {
            text: '@increaseIndexInfo.feedAddress'
        },
        increaseTimeLabel: {
            text: '@increaseIndexInfo.merchantLastUpdate'
        }
    };

    View.prototype.uiEvents = {
        'fullIndexBtn:click': function () { 
            this.fire('setIndex', {
                indexType: 1,
                indexTypeMap: '全量'
            });
        },
        
        'increaseIndexBtn:click': function ()  {    
            this.fire('setIndex', {
                indexType: 2,
                indexTypeMap: '增量'
            });
        }

    };
    
    util.inherits(View, UIView);

    return View;
});