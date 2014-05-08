/**
 * @file feed层级的路径配置文件
 * @author jinzhiwei
 */
define(function () {
    var actions = [
        {
            path: '/',
            type: 'biz/feed/Index'
        },
        {
            path: '/feed/index',
            type: 'biz/feed/Index'
        },
        {
            path: '/feed/set',
            type: 'biz/feed/Set'
        },
        {
            path: '/feed/info',
            type: 'biz/feed/Info'
        },
        {
            path: '/feed/setTime',
            type: 'biz/feed/SetTime'
        },
        {
            path: '/feed/submitFeed',
            type: 'biz/feed/SubmitFeed'
        },
        {
            path: '/feed/content',
            type: 'biz/feed/Content'
        },
        {
            path: '/feed/contentList',
            type: 'biz/feed/ContentList'
        },
        {
            path: '/feed/editContent',
            type: 'biz/feed/EditContent'
        }
    ];

    return {
        getConfig: function () {
            return actions;
        }
    };
});
