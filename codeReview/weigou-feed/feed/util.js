/**
 * @file feed层级的路径配置文件
 * @author jinzhiwei
 */
define(function () {
   var _ = require('underscore');
   var constants = require('common/constants').getContants();
   
   function mapFeed(data, clone) {
        var feedList;
        var feedItem;
        var newData = [];
        if (!_.isArray(data)) {
            data = [data];
        }
        
        
        for (var i = 0, l = data.length; i < l; i++) {
            if (clone) {
                feedList = _.extend({}, data[i]);
                newData.push(feedList);
            } else {
                feedList = data[i];
            }
            
            for (var j in feedList) {
                if (!feedList[j] && parseInt(feedList[j]) !== 0) {
                    feedList[j] = constants.DEFAULT_FILL;
                } else {
                    feedItem = feedList[j]
                    switch (j) {
                        case 'indexType' :
                            feedList[j] = constants.INDEX_TYPE[feedItem];
                            break;
                        case 'feedStatus' :
                            feedList[j] = constants.FEED_STATUS[feedItem];
                            break;
                        case 'updateFreq' :
                            feedList[j] = constants.UPDATE_FREQ[feedItem];
                            break;
                        case 'feedException' :
                            feedList[j] = feedItem + '条异常';
                            break;
                        case 'time':
                            feedList[j] = feedItem ? feedItem + ':00' : ''
                    }
                }
            }
        }
        
        return newData
    }
    
    return mapFeed
});
