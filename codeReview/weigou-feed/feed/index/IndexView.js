/**
 * @file 首页 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    require('esui/Select');
    require('er/tpl!./Index.tpl.html');
    var account = require('common/account').getAccount();
    var constants = require('common/constants').getContants()
    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_index';

    var tableFields = [
        {
            title: '索引方式',
            field: 'indextype',
            content: function (item) {
                return  constants.INDEX_TYPE[item.indexType] || constants.DEFAULT_FILL;
            }
        },
        {
            title: '状态',
            field: 'feedStatus',
            content: function (item) {
                return  constants.FEED_STATUS[item.feedStatus] || constants.DEFAULT_FILL;
            }
        },
        {
            title: '异常信息',
            field: 'feedException',
            content: function (item) {
                return  item.feedException || constants.DEFAULT_FILL;
            }
        },
        {
            title: '商家最后更新时间（FEED文件时间戳）',
            field: 'merchantLastUpdate',
            content: function (item) {
                return  item.merchantLastUpdate || constants.DEFAULT_FILL;
            }
        },
        {
            title: '系统最后更新时间',
            field: 'systemLastUpdate',
            content: function (item) {
                return  item.systemLastUpdate || constants.DEFAULT_FILL;
            }
        }
        
    ]
    View.prototype.uiProperties = {
        ListTable: {
            datasource: '@list.feedList',
            fields: tableFields
        }
    };

    View.prototype.uiEvents = {
        
    };
    
    var announceBox ;
    var clickHandler;

    View.prototype.enterDocument = function () {
        var view = this;
        UIView.prototype.enterDocument.apply(view, arguments);
        
        announceBox = T.q('announce-box')[0];
        
        clickHandler = function (e) {
            var target = T.event.getTarget(e);
            var content;
            var id;
            if (target.nodeType === 1) {
                if (target.className === 'announce') {
                    if (id = target.getAttribute('data-id')) {
                        view.popActionDialog(
                            {
                                url: '/feed/content',
                                title: '系统公告', 
                                actionOptions: {
                                    id: id,
                                    actionCallback: function (data) {
                                        
                                    }
                                }
                            }   
                        )
                    }
                    
                    
                } else if (target.className === 'more') {
                     view.popActionDialog(
                        {
                            url: '/feed/contentList',
                            title: '系统公告', 
                            actionOptions: {
                                actionCallback: function (data) {
                                    
                                }
                            }
                        }   
                    )
                }
            } 
            
            
        }

        T.g('feed-info-1').innerHTML = account.userName;
        T.g('feed-info-2').innerHTML = account.merchantName;
        T.g('feed-info-3').innerHTML = constants.MERCHANT_STATUS[account.merchantStatus];
        
        T.on(announceBox, 'click', clickHandler);
        
    }
    
    View.prototype.dispose = function () {
        var view = this;
        
        T.un(announceBox, 'click', clickHandler);
         
        UIView.prototype.dispose.apply(view, arguments);
    }

    util.inherits(View, UIView);

    return View;
});