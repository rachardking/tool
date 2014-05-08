/**
 * @file   创意列表 View
 * @author zhujialu
 */
define(function (require) {

    require('er/tpl!./tpl.html');

    var TableEdit = require('common/ui/TableInlineEdit');
    var DialogFactory = require('common/ui/DialogFactory');
    var MaterialSumView = require('index/levelIndex/sum/MaterialSumView');
    var MaterialQueryView = require('index/levelIndex/filter/MaterialQueryView');
    var dataTableView = require('common/biz/dataTable/View');
    var accountTree = require('common/datasource/accountTree');
    var tableConfig = require('common/config/table');
    var fieldBuilder = tableConfig.fieldBuilder;
    var util = require('common/util');
    var tipConf = require('../text').HINT;

    function getTableFields(view, isServiceTree) {

        // 表格配置
        var tableFields;
        var model = view.model;

        if (isServiceTree) {
            tableFields = fieldBuilder('idea', [
                'productIdea',
                'coursename',
                'planname',
                'status',
                'shows',
                'clks',
                'acp',
                'paysum'
            ], {
                coursename: {
                    title: '单元名称',
                    content: tableConfig.getUnitNameRenderer(
                        accountTree.getSelTreeData(), model
                    )
                },
                planname: {
                    content: tableConfig.getPlanNameRenderer(
                        accountTree.getSelTreeData(), model
                    )
                },
                serviceIdea: {
                    editable: true,
                    onEdit: function (e) {
                        view.editIdea(e.rowData);
                    }
                }
            });
        }
        else {
            tableFields = fieldBuilder('idea', [
                'idea',
                'coursename',
                'planname',
                'shows',
                'clks',
                'acp',
                'paysum'
            ], {
                coursename: {
                    content: tableConfig.getUnitNameRenderer(
                        accountTree.getSelTreeData(), model
                    )
                },
                planname: {
                    content: tableConfig.getPlanNameRenderer(
                        accountTree.getSelTreeData(), model
                    )
                }
            });
        }

        return tableFields;
    }


    return dataTableView.derive({

        onrender: function () {
            var me = this;
            var model = me.model;
            var treeData = model.get('treeData');
            var isService = treeData.isService;

            var level = 'idea';
            var materialName = util.getLevelName(level, isService);
            model.set('materialName', materialName);


            // 初始化视图渲染用到的模板
            me.template = isService
                ? 'service_idea_list' : 'idea_list';

            me.uiProperties = {

                /**
                 * 创意统计信息信息子视图配置
                 */
                ideaSumView: {
                    viewType: MaterialSumView
                },

                table: dataTableView.getTableConfig({
                    fields: getTableFields(me, isService),
                    noDataHtml: tableConfig.emptyText.idea,
                    breakLine: true,

                    editable: true,
                    extensions: [
                        new TableEdit()
                    ]
                }),

                pager: dataTableView.getPagerConfig(),

                // 初始化启用/暂停按钮配置
                modIdeaStatusCmdMenu: {

                    displayText: '启用 / 暂停创意',
                    datasource: [
                        {
                            text: '启用',
                            handler: function () {
                                me.modIdeaStatus(0);
                            }
                        },
                        {
                            text: '暂停',
                            handler: function () {
                                me.modIdeaStatus(1);
                            }
                        }
                    ]
                }
            };
        },

        uiEvents: {
            addIdeaBtn: {
                click: function () {
                    this.addIdea();
                }
            },
            modIdeaURLBtn: {
                click: function () {
                    this.modIdeaURL();
                }
            },
            delIdeaBtn: {
                click: function () {
                    this.delIdea();
                }
            }
        },

        /**
         * 修改创意URL
         */
        modIdeaURL: function () {
            var view = this;
            var model = view.model;
            var selectedId = model.get('selectedId');
            var len = selectedId.length;
            if (len === 0) {
                view.alert(
                    tipConf.EMPTYIDS,
                    tipConf.ALERT_TITLE
                );
                return;
            }

            var params = {
                ideaIds: selectedId
            };

            if (len === 1) {
                params.ideaURL = model.get('dataMap')[selectedId[0]].idea.url;
            }

            // 打开子action
            DialogFactory.openActionDialog({
                path: '/idea/modURL',
                dialog: {
                    title: '修改创意URL',
                    width: 500,
                    closeOnSave: true
                },
                params: params,
                callback: {
                    onSave: function () {
                        view.refreshList(false);
                    }
                }
            });
        },

        /**
         * 删除当前选择的创意
         */
        delIdea: function () {
            var view = this;
            var selectedId = view.model.get('selectedId');

            if (selectedId.length === 0) {
                view.alert(
                    tipConf.EMPTYIDS,
                    tipConf.ALERT_TITLE
                );
                return;
            }

            // 删除前提示
            var dialog = view.confirm(
                tipConf.DEL_IDEA,
                tipConf.CONFIRM_TITLE
            );

            // 点击确认
            dialog.on('ok', function () {
                view.model.delSelIdeas();
            });
        },

        /**
         * 修改创意状态
         *
         * @param {number} status 修改后的创意状态
         */
        modIdeaStatus: function (status) {
            var view = this;
            var model = view.model;

            var ideaIds = model.get('selectedId');

            if (ideaIds.length === 0) {
                view.alert(
                    tipConf.EMPTYIDS,
                    tipConf.ALERT_TITLE
                );
                return;
            }

            status = Number(status);
            if (status === 0) {
                // 只有“暂停推广”的状态才能被启用
                ideaIds = view.getSelectedIdByStatus(function (status) {
                    return (status & 1) !== 0;
                });
            }
            else if (status == 1) {
                // 除去“暂停推广”之外的状态才能被暂停
                
                ideaIds = view.getSelectedIdByStatus(function (status) {
                    return (status & 1) === 0;
                });
            }

            if (ideaIds.length > 0) {
                model.modIdeaStatus(ideaIds, status).done(
                    view.getMaterialStatusUpdater({
                        status: status,
                        selIds: ideaIds
                    })
                );
            }
            else {
                view.alert(
                    status === 0 ? tipConf.START_STARTED : tipConf.PAUSE_STOPPED,
                    tipConf.ALERT_TITLE
                );
            }
        },

        /**
         * 暂停创意
         */
        pauseIdea: function () {
     
            this.modIdeaStatus(1);
           
        },

        /**
         * 启用创意
         */
        startIdea: function () {
            this.modIdeaStatus(0);
        },

        /**
         * 添加创意
         */
        addIdea: function () {
            var model = this.model;
            var level = model.get('level');
            var levelId = model.get('levelId');
            var treeData = model.get('treeData');

            var levelData = treeData.getLevelPathInfo(
                level, levelId, true);
            var plan = levelData.plan;
            var unit = levelData.unit;

            var params = {};
            if (plan) {
                $.extend(params, { planId: plan.id, planName: plan.text });
            }
            if (unit) {
                $.extend(params, { unitId: unit.id, unitName: unit.text });
            }

            this.editOrAddIdea({
                title: '新建创意',
                params: params
            });
        },

        /**
         * 编辑或添加创意
         *
         * @param {Object} options 打开编辑/新建创意浮出层选项信息
         * @param {string} options.title 浮出层标题
         * @param {Object} options.params 浮出层上下文参数
         */
        editOrAddIdea: function (options) {
            var view = this;
            var params = options.params;
            params.levelData = view.model.get('treeData');

            // 打开子action
            DialogFactory.openActionDialog({
                path: '/idea/edit',
//                noScroll: true,
                dialog: {
                    skin: 'idea-edit',
                    title: options.title,
                    width: 900,
                    closeOnSave: true
                },
                params: options.params,
                callback: {
                    onClose: function () {

                        // 清空选择的创意id避免，打开浮出层，取消关闭，该选择信息还在
                        view.model.set('selectedId', []);
                    },
                    onSave: function () {
                        view.refreshList(false);
                    }
                }
            });

        },

        /**
         * 编辑创意
         *
         * @param {Object} ideaInfo 要编辑的创意对象
         */
        editIdea: function (ideaInfo) {
//            var model = this.model;
//            var ideaInfo = model.get('dataMap')[ideaId];
            var ideaId = ideaInfo.idea_id;
            var ideaDetail = ideaInfo.idea;

            this.editOrAddIdea({
                title: '修改创意',
                params: {
                    planId: ideaInfo.plan_id,
                    planName: ideaInfo.plan_name,
                    unitId: ideaInfo.course_id,
                    unitName: ideaInfo.course_name,
                    ideaId: ideaId,
                    ideaTitle: ideaDetail.title,
                    ideaDesc: ideaDetail.description,
                    ideaUrl: ideaDetail.url
                }
            });
        },

        /**
         * 处理表格行内点击事件
         *
         * @param {function(string)} callback 要执行的回调函数
         * @param {Object} e 行内点击事件对象
         */
        handleInlineClkEvent: function (callback, e) {
            var view = this;
            var target = $(e.target);
            var ideaId = target.attr('data-idea-id');

            view.model.set('selectedId', [ideaId]);

            callback.call(view, ideaId);
        },

        /**
         * @override
         */
        bindEvents: function () {
            var me = this;

            // 监听表格行内操作
            var table = me.get('table');
            var inlineHandler = me.handleInlineClkEvent;
            $(table.main).on(
                    'click', '.bs-icon-pause', $.proxy(inlineHandler, me, me.pauseIdea)
                ).on(
                    'click', '.bs-icon-play', $.proxy(inlineHandler, me, me.startIdea)
                );
//                .on(
//                    'click', '.icon-pencil', $.proxy(inlineHandler, me, me.editIdea)
//                );
        },

        enterDocument: function () {

            // 初始化子视图并加载数据
            this.initSubView({ sumId: 'ideaSumView' });

            // 加载数据
            this.refreshList(true);
        },

        /**
         * @override
         */
        onbeforeleave: function () {
            $(this.get('table').main).off('click');
        }

    });

});
