/**
 * @file 查看feed状态 view
 * @author jinzhiwei
 */
define(function (require) {
    var UIView = require('ef/UIView');
    var util = require('er/util');
    var lib = require('esui/lib');
    
    require('esui/Select');
    require('er/tpl!./Info.tpl.html');
    

    function View() {
        UIView.apply(this, arguments);
    }

    View.prototype.template = 'page_weigou_feed_info';
    var constants = require('common/constants').getContants();;
    var tableFields = [
        {
            title: '索引文件地址',
            field: 'feedAddress',
            resizable: true,
            subEntry: 1,
            editable: 1,
            content: function (item) {
                return item.feedAddress.length > 100 ? item.feedAddress.substr(0, 100) + '...' : item.feedAddress
                
                    
            }
        },
        {
            title: 'FEED异常信息',
            field: 'feedException',
            content: function (item) {
                if (item.feedExceptionUrl) {
                    return lib.format('<a href="${feedExceptionUrl}" target="_blank" >下载错误文件</a>', {feedExceptionUrl: item.feedExceptionUrl})
                } else if (item.feedException) {
                    return item.feedException
                } else {
                    return '无'
                }
               
                
            }
        }
        
    ]
    View.prototype.uiProperties = {
        ListTable: {
            datasource: '@exception.result',
            fields: tableFields,
            subrow:true
        },
        
        ListPager: {
            count: '@exception.totalCount',
            page: '@exception.pageNo',
            pageSize: '@exception.pageSize',
            pageSizes: [20, 50, 100],
            layout: 'distributedReverse',
            pageType: 'plain'
        },

        ListTab: {
            tabs: [
                {
                    title: constants.INDEX_TYPE[1],
                    value:'1'
                },
                {
                    title: constants.INDEX_TYPE[2],
                    value:'2'
                }
            ],
            activeIndex: 0
        }
        
      
    };

    View.prototype.uiEvents = {
      
        ListPager: {
            changepagesize: function (e) {
                this.fire('changepagesize', {
                    evt: e
                });
            },
            changepage: function (e) {
                this.fire('changepage', {
                    evt: e
                });
            }
        },

        ListTab: {
            activate: function (e) {
                this.fire('changeTab', {
                    evt: e
                });
            }
        },
        
        'StartBtn:click': function () {
            this.fire('startIndex');
        },
        
        'CancelBtn:click': function () {
            this.fire('cancelIndex');
        },
        
        'setTimeBtn:click': function () {
            this.fire('setTime');
        }
    };
    
    View.prototype.enterDocument = function () {
        var view = this;
        UIView.prototype.enterDocument.apply(view, arguments);
        
        var status = view.model.get('list').feedIndexStatus;

        if (status == 1) {
            view.get('StartBtn').hide();
        } else {
            view.get('CancelBtn').hide();
        }
        
        var myTable = view.get('ListTable');
        
       /*  table.addHandlers('mouseover',  
                    {
                        handler: function(e){
                            if (e.className == 'feedAddress') {
                                console.log(e.innerHTML)
                            }
                            
                        }
                    }
        ) */
        
        myTable.onsubrowopen = function ( arg ) {
                
                    this.getSubrow( arg.index ).innerHTML = '<span style="word-wrap: break-word; word-break: normal; ">' + arg.item.feedAddress + '</span>';
                };

        myTable.onsubrowclose = function ( arg ) {
            this.getSubrow( arg.index ).innerHTML = '';
        };

    }
    
    View.prototype.dispose = function () {
        var view = this;
        UIView.prototype.dispose.apply(view, arguments);
    }
    
    View.prototype.updateView = function (event) {
       //console.log(event);
       //console.log(event)
       var view = this;
       var ListTable = view.get('ListTable');
       var ListPage = view.get('ListPager');
       ListTable.setDatasource(view.model.get('exception').result);
       ListPage.setProperties(view.model.get('exception'))
    }

    util.inherits(View, UIView);

    return View;
});