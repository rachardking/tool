/*
 * coup-web
 * Copyright 2011 Baidu Inc. All rights reserved.
 *
 * path:    ui/EditableCategory.js
 * desc:    类目前端选择器
 * author:  yuanhongliang
 * date:    $Date: 2011-03-26 21:58:44 +0800 (星期六, 26 三月 2011) $
 */

goog.require('ui.InputControl');
goog.require('ui.Select');

goog.include('css/ui-select-tree.css');
goog.include('css/ui-select.css');
goog.include('css/ui-editable-select.css');

goog.provide('ui.MenuLayer');
goog.provide('ui.MultiSelect');
goog.provide('ui.EditableCategory');

/**
 * @constructor
 * @extends {ui.InputControl}
 * @param {Object} options 控件初始化参数.
 */
ui.EditableCategory = function (options) {
    ui.InputControl.call(this, options);

    this.type = 'selecttree';
    this.level = 0;
    this.parentSelectable = 0;
    this.value = '0';
    this.initValue = '0';
    this.schildren = [];
    this.datasource;
    this.preventHide = false;
    this.requestBack = true;
    this.opList = {};
    this.openIcon = true;
};

ui.EditableCategory.prototype = {
    _tplMain : '<div id="{0}" class="{1}" value="" style="width:{3}px"><nobr>{2}</nobr></div><div class="{4}" arrow="1"></div>',

    // 无选择时主区域显示的内容
    _tplLabel : '<span class="{0}">{1}</span>',

    /**
     * 获取主体部分HTML
     *
     * @return {string}
     */
    _getMainHtml : function () {
        var me = this;
        return baidu.format(me._tplMain,
            me.getId('text'),
            me.getClass('text'),
            '全品类',
            me.width - 20,
            me.getClass('arrow'));
    },

    RequestSend : function (holder, parent_cat, continueValues) {
        var me = this,
        requester = me.datasource;
        var params = 'parent=' + parent_cat + '&.ui-loading=0';
        requester(params,
            baidu.fn.bind(me.onRequestFinish, me, holder, continueValues),
            baidu.fn.blank);
    },
    onRequestFinish : function (holder, continueValues, data) {
        var me = this;
        var model = data.result;
        me.requestBack = true;
        holder.innerHTML = '';
        //me._repaint();
        me.onchange && me.onchange(me.getValue());
        me.trigger('onCategoryChange', me.getValue(), model)      
        if (model.length == 0){
            //如果请求请求不到数据，就说明类目到底了
            me.trigger('onCategoryFull', me.getValue());
            return;
        
        }
         
        if (me.parentSelectable)
            model.unshift({
                value : '0',
                name : '全部'
            });
        var rbMain = document.createElement('div');
        rbMain.name = 'selector-' + me.level;
        holder.appendChild(rbMain);
      
        var rb = ui.util.createControl({
                type : 'MultiSelect',
                id : 'selector-' + me.level,
                level : me.level,
                datasource : model,
                title : 'title',
                skin : 'ic',
                width : '100',
                openIcon : me.openIcon,
                iconClickHandler : function (event, elm) {
                    //me.layer.showLayer(elm);
                    me.layer.activeItem = this.datasource[elm.parentNode.getAttribute('index')];

                    me.layer.toggleLayer(elm);
                    var e = window.event || event;
                    baidu.event.stop(e);
                    return false;
                }
            }, rbMain);
        me.addChild(rb);
        me.schildren.push(rb);
        if (me.parentSelectable)
            rb.setValue(model[0].value);
        rb.onchange = function (value, selected) {
            me.clearSubCatSelector(this.level);
            if (this.getValue() != '0') {
                me.addSelectorInitor(this.getValue());
            }
            me.onselect(value, selected);
            //me.onchange(me.getValue());
            //me._repaint();
        }
        me.level++;
        if (me.value) {
            var values = me.value.split(',');
            if (me.level <= values.length) {
                if (jn.util.getNameByValue(values[me.level - 1], rb.datasource) != values[me.level - 1]) {
                    rb.setValue(values[me.level - 1], true);
                }
                if (me.level == values.length) {
                    me.value = false;
                }
            }
        }
        if (continueValues) {
            var parent = baidu.array.removeAt(continueValues, 0);
            if (continueValues.length) {
                me.addSelectorInitor(parent, continueValues);
            }
        }
        if (me.initValue && Number(me.initValue) > 0) {
            me.setValues(me.initValue);
            me.originalValue = me.initValue;
            me.initValue = '';
        }
    },
    clearSubCatSelector : function (level) {
        var me = this;
        var children = me.schildren;
        if (children.length - 1 > level) {
            for (var i = children.length - 1; i > level; i--) {
                baidu.dom.remove(children[i].main.parentNode);
                me.removeChild(children[i], false);
            };
        }
        me.schildren = me.schildren.splice(0, level + 1);
        me.level = level + 1;
    },
    addSelectorInitor : function (parent_cat, continueValues) {
        var holder = document.createElement('div');
        var loadingPic = document.createElement('img');
        baidu.dom.addClass(holder, this.getClass('selector'));
        loadingPic.src = RES('/assets/img/loading_20x20.gif');
        holder.appendChild(loadingPic);
        //baidu.dom.q('selector-box', this.layer.getMain())[0].appendChild(holder);
        baidu.dom.q('selector-box', this.getMain())[0].appendChild(holder);
        this.currentHolder = holder;
        this.RequestSend(holder, parent_cat, continueValues);
        this.requestBack = false;
    },

    onselect : function (item) {},

    onOkClick : function () {},

    getChildCount : function () {
        if (!this.children) {
            return 0;
        } else {
            return this.children.length;
        }
    },

    render : function (main) {
        var me = this;
        main = main || me.main;
        ui.EditableCategory.superClass.render.call(this, main);
        //main.innerHTML = me._getMainHtml();
        //me.width && (main.style.width = me.width + 'px');
        /*  main.onclick = function(){
        ui.Mask.show(me.getLayer().getId());
        me.showLayer();
        me.originalValue = me.getValue();
        me.preventHide = true;
        } */

        me._renderWrap();
        me._renderMenuLayer();
        //me._renderLayer();
        if (me.value == '0')
            me.value = '0';
        me.addSelectorInitor(0);

    },

    _renderMenuLayer : function () {
        var me = this,
        menuId = 'menuLayer',
        layer = me.c('menuLayer');

        if (!layer) {
            layer = new ui.MenuLayer({
                    id : menuId,
                    name : menuId,
                    datasource : me.opList,
                    //fix
                    main : document.createElement('div')
                });

            me.addChild(layer);

        }
        me.layer = layer;
    },
    _renderWrap : function () {
        var me = this;
        var tpl = ['<div class="{0}" id="{1}"></div>',
            '<div class="{2}">',
            '<div ui="type:Button;id:submitBtn;skin:ic;">确定</div>',
            '<div ui="type:Button;id:closeBtn;skin:ic;">取消</div>', 
            '</div>'].join('');
        me.main.style.cssFloat = 'none';
        me.main.style.height = 'auto';
        me.main.innerHTML = baidu.format(tpl, 'selector-box', me.getId('selector-box'), 'operation-box');
        ui.util.buildControlTree(me.main, me);
        me.c('submitBtn').onclick = function () {
            
            if (me.onOk()) {}
        };
        me.c('closeBtn').onclick = function () {};

    },
    checkValue: function(){
        var me = this;
        var value = me.getValue();
        if (!me.requestBack) {
            ui.Dialog.alert({
                title : '提示',
                content : '请稍等',
                skin : 'dialog-weimai'
            })
            return false;
        };
        if (value == '' || value[value.length - 1] == ',') {
            ui.Dialog.alert({
                title : '提示',
                content : '请选择叶子类目',
                skin : 'dialog-weimai'
            })
            return false;
        }
        return true
    },
    onOk : function () {
        var me = this;
        if(me.checkValue() === false){
            return false;
        }else{
            me.onOkClick();
            return true;
        }
       
    },

    bindEvent : function () {
        var me = this;
        me.layer.addListener('onMenuSelect', function (selectValue) {
            me.trigger('onMenuSelect', selectValue, me.layer.activeItem);
        });

        ui.EditableCategory.superClass.bindEvent.call(this);

    },

    dispose : function () {
        for (var i = 0; i < this.getChildCount(); i++) {
            this.children[i].onclick = null;
        }

        ui.EditableCategory.superClass.dispose.call(this);
    },
    getValueName : function () {
        var me = this;
        var name = [];
        var children = me.schildren;
        if (!children)
            return '全品类';
        for (var i = 0; i < children.length; i++) {
            if (children[i].getValue() != '0') {
                var t = jn.util.getNameByValue(children[i].getValue(), children[i].datasource);
                name.push(t);
            }
        };
        if (name.length == 0)
            name = ['全品类'];
        return name.join(',');
    },
    getValue : function () {
        if (this.value) {
            return this.value;
        }
        var me = this;
        var value = [];
        var children = me.schildren;
        if (!children)
            return '0';
        for (var i = 0; i < children.length; i++) {
            if (children[i].getValue() != '0') {
                value.push(children[i].getValue());
            }
        };
        if (value.length == 0)
            value = ['0'];
        return value.join(',');
    },
    setValue : function (value) {
        var me = this;
        me.clearSubCatSelector(-1);
        me.value = value;
        me.addSelectorInitor(0);
    },
    setValues : function (values) {
        var me = this;
        me.clearSubCatSelector(-1);
        me.value = values;
        if (values.split(',').length != 1) {
            values += ',';
        }
        me.addSelectorInitor(0, values.split(','));
    },
    refreshTree: function(level){
        var me = this;
        me.clearSubCatSelector(level - 1);
        me.addSelectorInitor(this.getValue().split(',').pop());
    }

};
// FIXME 上面不应该直接给prototype来赋值，否则把这句话放到
// 构造函数后面就不对了
baidu.inherits(ui.EditableCategory, ui.InputControl);

ui.MultiSelect = function (options) {
    ui.InputControl.call(this, options);
    this.type = 'select';
    this.__initOption('maxItem', null, 'MAX_ITEM');
    this.__initOption('emptyText', null, 'EMPTY_TEXT');
    this.datasource = this.datasource || [];
    this.index = -1;
    this.openIcon;
}
ui.MultiSelect.MAX_ITEM = 8;
ui.MultiSelect.prototype = {
    // Layer中每个选项的模板
    _tplItem : '<div id="{0}" {10} class="{1}" index="{2}" value="{3}" dis="{4}" onmouseover="{6}" onmouseout="{7}" onclick="{8}">{9}<nobr>{5}</nobr></div>',

    // Item中图标层的模板
    _tplIcon : '<span class="{0}" onclick="{1}"></span>',
    /**
     * 绘制控件
     *
     * @param {?Element} opt_main 外部容器.
     */
    render : function (opt_main) {
        var me = this,
        main = opt_main || me.main,
        value = me.value;

        if (!me._isRender) {
            ui.Select.superClass.render.call(me, main);
            //ui.Base.render.call(me, main, true);

            me.formName = main.getAttribute('name');
            //main.innerHTML = me._getLayerHtml();

            me._isRender = 1;
        }

        if (!main) {
            return;
        }

        me.width && (main.style.width = me.width + 'px');

        me._renderLayer();
        me.setValue(value);

        //me.setReadOnly(!!me.readOnly);
        // me.disableInternal(!!me.disabled);

        ui.Select.superClass.render.call(me, main);
    },
    /**
     * 绘制下拉列表
     *
     * @private
     */
    _renderLayer : function () {
        var me = this,
        layerId = 'layer',
        layer = me,
        layerMain,
        layerMainWidth,
        len = me.datasource.length,
        maxItem = me.maxItem,
        itemHeight;

        layerMain = layer.getMain();
        layerMain.style.width = 'auto';
        layerMain.style.height = 'auto';
        layerMain.style.overflow = 'auto';
        layerMain.innerHTML = me._getLayerHtml();
        layerMainWidth = layerMain.offsetWidth;

        //if (len > maxItem) {
            itemHeight = layerMain.firstChild.offsetHeight;
            layerMain.style.height = maxItem * (itemHeight + 1) + 'px';
            layerMainWidth += 30;
        //}

        if (layerMainWidth < me.width) {
            layer.setWidth(me.width);
        } else {
            layer.setWidth(layerMainWidth);
        }
    },
    setWidth : function (width) {
        this.main.style.width = width + 'px';
        this.width = width;
    },
    setHeight : function (height) {
        this.main.style.height = height + 'px';
        this.height = height;
    },
    _getLayerHtml : function () {
        var me = this,
        datasource = me.datasource,
        i = 0,
        len = datasource.length,
        html = [],
        strRef = me.getStrRef(),
        basicClass = me.getClass('item'),
        itemClass,
        dis,
        item,
        iconClass,
        iconHtml,
        titleTip;

        for (; i < len; i++) {
            itemClass = basicClass;
            dis = 0;
            item = datasource[i];
            typeof me.level === 'number' && (item.__parentLevel = me.level);
            iconHtml = '';
            titleTip = '';

            // 初始化icon的HTML
            if (me.openIcon) {
                iconClass = item.icon ? me.getClass('icon-' + item.icon) : me.getClass('icon-default');
                iconHtml = baidu.format(me._tplIcon, iconClass, strRef + '.iconClickHandler(event, this)');
            }

            // 初始化基础样式
            if (item.style) {
                itemClass += ' ' + basicClass + '-' + item.style;
            }

            // 初始化不可选中的项
            if (item.disabled) {
                dis = 1;
                itemClass += ' ' + basicClass + '-disabled';
            }

            // 初始化选中样式
            if (item.value == me.value) {
                itemClass += ' ' + me.getClass('item-selected');
            }
            if (me.titleTip) {
                titleTip = 'title="' + baidu.string.encodeHTML(item.name || item.text) + '"';
            }

            html.push(
                baidu.format(me._tplItem,
                    me.getId('item') + i,
                    itemClass,
                    i,
                    item.value,
                    dis,
                    item.name || item.text,
                    strRef + '._itemOverHandler(this)',
                    strRef + '._itemOutHandler(this)',
                    strRef + '._itemClickHandler(this)',
                    iconHtml,
                    titleTip));
        }

        return html.join('');
    },
    /**
     * icon点击事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    iconClickHandler : function (item) {
        return false;
    },
    /**
     * 选项点击事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemClickHandler : function (item) {
        var index = item.getAttribute('index');
        var disabled = item.getAttribute('dis');

        if (disabled == 1) {
            return;
        }

        this.selectByIndex(parseInt(index, 10), true);
    },

    /**
     * 选项移上事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemOverHandler : function (item) {
        if (item.getAttribute('dis') == 1) {
            return;
        }

        var index = item.getAttribute('index');
        baidu.addClass(this.getId('item') + index, this.getClass('item-hover'));
    },

    /**
     * 选项移开事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemOutHandler : function (item) {
        var index = item.getAttribute('index');
        baidu.removeClass(this.getId('item') + index, this.getClass('item-hover'));
    },
    /**
     * 根据索引选择选项
     *
     * @public
     * @param {number} index 选项的索引序号.
     * @param {boolean=} opt_isDispatch 是否发送事件.
     */
    selectByIndex : function (index, opt_isDispatch) {
        var selected = this.datasource[index],
        value;

        if (!selected) {
            value = null;
        } else {
            value = selected.value;
        }

        this.index = index;
        this.value = value;

        if (opt_isDispatch === true && this.onchange(value, selected) === false) {
            return;
        }
        if (~index) {
            this.activeId && baidu.removeClass(this.activeId, this.getClass('item-active'));
            this.activeId = this.getId('item') + index;
            baidu.addClass(this.activeId, this.getClass('item-active'));
        }

    },
    /**
     * 获取当前选中的值
     *
     * @param {number} opt_index 获取第n个数据的value.
     * @return {?string}
     */
    getValue : function (opt_index) {
        var value,
        datasource = this.datasource;

        if (typeof opt_index == 'number') {
            opt_index < datasource.length && (value = datasource[opt_index].value);
        } else {
            value = this.value;
        }

        if (baidu.lang.hasValue(value)) {
            return value;
        }

        return null;
    },
    /**
     * 根据值选择选项
     *
     * @public
     * @param {string} value 值.
     */
    setValue : function (value) {
        var me = this,
        layer = me.getMain(),
        items = layer.getElementsByTagName('div'),
        len,
        i,
        item;

        for (i = 0, len = items.length; i < len; i++) {
            item = items[i].getAttribute('value');
            if (item == value) {
                me.selectByIndex(i);
                return;
            }
        }

        me.value = null;
        me.index = -1;
        me.selectByIndex(-1);
    }
}
baidu.inherits(ui.MultiSelect, ui.InputControl);

ui.MenuLayer = function (options) {
    ui.InputControl.call(this, options);
    this.datasource = this.datasource || [];
    this.type = 'select';
}
ui.MenuLayer.prototype = {
    // Layer中每个选项的模板
    _tplItem : '<div id="{0}" {10} class="{1}" index="{2}" value="{3}" dis="{4}" onmouseover="{6}" onmouseout="{7}" onclick="{8}">{9}<nobr>{5}</nobr></div>',

    // Item中图标层的模板
    _tplIcon : '<span class="{0}"></span>',
    /**
     * 绘制控件
     *
     * @param {?Element} opt_main 外部容器.
     */
    render : function (opt_main) {
        var me = this,
        main = opt_main || me.main,
        value = me.value;

        if (!me._isRender) {
            ui.MenuLayer.superClass.render.call(me, main);
            me._isRender = 1;
        }

        if (!main) {
            return;
        }

        me._renderLayer();

    },
    /**
     * 绘制下拉列表
     *
     * @private
     */
    _renderLayer : function () {
        var me = this,
        layerId = 'layer',
        layer = me.getLayer(),
        layerMain,
        layerMainWidth,
        len = me.datasource.length,
        maxItem = me.maxItem,
        itemHeight;

        if (!layer) {
            layer = new ui.Layer({
                    id : layerId,
                    autoHide : 'click',
                    retype : 'select-layer'
                });
            layer.appendTo();
            me.addChild(layer);
            //layer.onhide = me._getLayerHideHandler();
        }

        layerMain = layer.getMain();
        layerMain.style.width = 'auto';
        layerMain.style.height = 'auto';
        layerMain.innerHTML = me._getLayerHtml();
        layerMainWidth = layerMain.offsetWidth;

        if (len > maxItem) {
            itemHeight = layerMain.firstChild.offsetHeight;
            layerMain.style.height = maxItem * (itemHeight + 1) + 'px';
            layerMainWidth += 17;
        }

        if (layerMainWidth < me.width) {
            layer.setWidth(me.width);
        } else {
            layer.setWidth(layerMainWidth);
        }

        if (me.toggleOnHover) {
            layerMain.onmouseover = me._getMouseOverHandler();
            layerMain.onmouseout = me._getMouseOutHandler();
        }
        // TODO:页面resize的时候需要调整浮动层的位置
    },
    /**
     * 获取下拉列表层的HTML
     *
     * @return {string}
     */
    _getLayerHtml : function () {
        var me = this,
        datasource = me.datasource,
        i = 0,
        len = datasource.length,
        html = [],
        strRef = me.getStrRef(),
        basicClass = me.getClass('item'),
        itemClass,
        dis,
        item,
        iconClass,
        iconHtml,
        titleTip;

        for (; i < len; i++) {
            itemClass = basicClass;
            dis = 0;
            item = datasource[i];
            iconHtml = '';
            titleTip = '';

            // 初始化icon的HTML
            if (item.icon) {
                iconClass = me.getClass('icon-' + item.icon);
                iconHtml = baidu.format(me._tplIcon, iconClass);
            }

            // 初始化基础样式
            if (item.style) {
                itemClass += ' ' + basicClass + '-' + item.style;
            }

            // 初始化不可选中的项
            if (item.disabled) {
                dis = 1;
                itemClass += ' ' + basicClass + '-disabled';
            }

            // 初始化选中样式
            if (item.value == me.value) {
                itemClass += ' ' + me.getClass('item-selected');
            }
            if (me.titleTip) {
                titleTip = 'title="' + baidu.string.encodeHTML(item.name || item.text) + '"';
            }

            html.push(
                baidu.format(me._tplItem,
                    me.getId('item') + i,
                    itemClass,
                    i,
                    item.value,
                    dis,
                    item.name || item.text,
                    strRef + '._itemOverHandler(this)',
                    strRef + '._itemOutHandler(this)',
                    strRef + '._itemClickHandler(this)',
                    iconHtml,
                    titleTip));
        }

        return html.join('');
    },
    /**
     * 显示层
     *
     * @public
     */
    showLayer : function (elm) {
        var me = this,
        main = elm,
        mainPos = baidu.dom.getPosition(main),
        layer = me.getLayer(),
        layerMain = layer.getMain(),
        layerOffsetHeight = layerMain.offsetHeight,
        mainOffsetHeight = main.offsetHeight,
        pageVHeight = baidu.page.getViewHeight(),
        layerVHeight = mainPos.top
             + mainOffsetHeight
             + layerOffsetHeight
             - baidu.page.getScrollTop(),
        layerTop;

        if (pageVHeight > layerVHeight) {
            layerTop = mainPos.top + mainOffsetHeight - 1;
        } else {
            layerTop = mainPos.top - layerOffsetHeight + 1;
        }

        layer.show(mainPos.left, layerTop);
        me.setState('active');
    },

    /**
     * 隐藏层
     *
     * @public
     */
    hideLayer : function () {
        this.getLayer().hide();
    },

    /**
     * 显示|隐藏 层
     *
     * @public
     */
    toggleLayer : function (elm) {
        var me = this;

        if (me.getLayer().isShow() && me.elm === elm) {
            me.hideLayer();

        } else {
            me.showLayer(elm);
        }
        me.elm = elm;
    },

    /**
     * 获取layer的控件对象
     *
     * @return {ui.Layer}
     */
    getLayer : function () {
        return /** @type {ui.Layer} */(this.getChild('layer'));
    },

    /**
     * 获取ComboBox当前选项部分的DOM元素
     *
     * @return {HTMLElement}
     */
    _getCur : function () {
        return baidu.g(this.getId('text'));
    },

    /**
     * 设置数据来源
     *
     * @public
     * @param {Array} datasource 列表数据源.
     */
    setDataSource : function (datasource) {
        this.datasource = datasource || this.datasource;
    },
    /**
     * 选项点击事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemClickHandler : function (item) {
        var me = this;
        var index = item.getAttribute('index');
        me.trigger('onMenuSelect', me.datasource[index]);

        this.hideLayer();

    },

    /**
     * 选项移上事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemOverHandler : function (item) {
        if (item.getAttribute('dis') == 1) {
            return;
        }

        var index = item.getAttribute('index');
        baidu.addClass(this.getId('item') + index, this.getClass('item-hover'));
    },

    /**
     * 选项移开事件
     *
     * @private
     * @param {HTMLElement} item 选项.
     */
    _itemOutHandler : function (item) {
        var index = item.getAttribute('index');
        baidu.removeClass(this.getId('item') + index, this.getClass('item-hover'));
    },
    /**
     * 释放控件
     *
     * @public
     */
    dispose : function () {
        var me = this,
        layerMain = me.getLayer().getMain();

        me.onchange = null;
        me.main.onclick = null;
        me.main.onmouseover = null;
        me.main.onmouseout = null;
        layerMain.onmouseover = null;
        layerMain.onmouseout = null;
        ui.Select.superClass.dispose.call(me);
    }
}
baidu.inherits(ui.MenuLayer, ui.InputControl);
