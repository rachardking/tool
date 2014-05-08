/**
 * @file 状态 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    
    require('esui/Select');
    require('er/tpl!./Content.tpl.html');
    
    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_content';
    var constants = require('common/constants').getContants();;
    
    util.inherits(View, UIView);

    return View;
});