/**
 * @file 新闻列表 view
 * @author jinzhiwei
 */
define(function (require) {
    var ListFormView = require('common/list/ListFormView');
    var util = require('er/util');
    var lib = require('esui/lib');
    var url = require('biz/url');
    var ajax = require('common/ejson');
    var commonUtil = require('common/util');
    
    require('esui/Select');
    require('er/tpl!./ContentList.tpl.html');
    

    function View() {
        ListFormView.apply(this, arguments);
        
		util.mix(View.prototype.uiProperties, {
			ListTable: {
				datasource: '@list.result',
				fields: tableFields
			}
		});

		util.mix(View.prototype.uiEvents, {
		    'uploader:change': function (e) {
                var target = e.target;
                target.upload();
            },
            
            'newBtn:click': function (e) {
                view.popActionDialog({
                    url: '/feed/editContent',
                    title: '系统公告', 
                    actionOptions: {
                        contentTitle: e.title,
                        contentDetail: e.detail,
                        contentTime: e.time
                    }
                })
            }
		});
	}

    View.prototype.template = 'page_weigou_feed_content_list';

	var tableFields = [
        {
            title: '公告列表',
            field: 'contentList',
            resizable: true,
            content: function (item) {
                return item.title;      
            }
        },
		{
            title: '创建时间',
            field: 'contentTime',
            resizable: true,
            content: function (item) {
                return item.time;    
            }
        },
        {
            title: '操作',
            field: 'contentTime',
            resizable: true,
            content: function (item) {
                var link = '<a href="javascript:;" data-id="<%=id%>" data-cmd="<%=cmd%>"><%=link%></a>&nbsp;';
                return  commonUtil.format(link, {id: item.id, link: '详情', cmd:'detail'});
            }
        }
    ]
    
    View.prototype.enterDocument = function () {
        var view = this;
        ListFormView.prototype.enterDocument.apply(view, arguments);
        view.get('ListTable').addHandlers('click', [{
            handler: function (e,s,c) {
                if (e.nodeType === 1){
                    var cmd = e.getAttribute('data-cmd');
                    var id = e.getAttribute('data-id');
                    switch (cmd) {
                        case 'detail':
                            view.showDialog({id: id}, '/feed/content');
                            break;
                        case 'delete':
                            view.fire('deleteContent', {id: id});
                            break;
                        case 'edit':
                             view.showDialog({id: id}, '/feed/editContent');
                            break;            
                    }
                }
            }
        }])
        
    }
	/**
     * 弹出浮层
     *
     * @param {Object} data 传递数据包含ID
     * @param {String} url  action地址
     */
    View.prototype.showDialog = function (data, url) {
        this.popActionDialog(
            {
                url: url,
                title: '系统公告', 
                actionOptions: {
                    id: data.id
                }
            }   
        )
    }
   
    util.inherits(View, ListFormView);
    return View;
});