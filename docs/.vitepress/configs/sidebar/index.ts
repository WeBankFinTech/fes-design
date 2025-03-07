import type { DefaultTheme } from 'vitepress';

const sidebarConfig: Record<string, DefaultTheme.Config['sidebar']> = {
    zh: {
        '/zh/components/': [
            {
                text: '通用组件',
                items: [
                    {
                        text: 'Ellipsis 文本省略',
                        link: '/zh/components/ellipsis',
                    },
                    {
                        text: 'Icon 图标',
                        link: '/zh/components/icon',
                    },
                    {
                        text: 'Button 按钮',
                        link: '/zh/components/button',
                    },
                    {
                        text: 'Scrollbar 滚动条',
                        link: '/zh/components/scrollbar',
                    },
                ],
            },
            {
                text: '布局组件',
                items: [
                    {
                        text: 'Divider 分割线',
                        link: '/zh/components/divider',
                    },
                    {
                        text: 'Layout 布局',
                        link: '/zh/components/layout',
                    },
                    {
                        text: 'Grid 栅格',
                        link: '/zh/components/grid',
                    },
                    {
                        text: 'Space 间隔',
                        link: '/zh/components/space',
                    },
                ],
            },
            {
                text: '导航组件',
                items: [
                    {
                        text: 'Menu 导航菜单',
                        link: '/zh/components/menu',
                    },
                    {
                        text: 'Tabs 标签页',
                        link: '/zh/components/tabs',
                    },
                    {
                        text: 'Steps 步骤条',
                        link: '/zh/components/steps',
                    },
                    {
                        text: 'Pagination 分页',
                        link: '/zh/components/pagination',
                    },
                    {
                        text: 'Breadcrumb 面包屑',
                        link: '/zh/components/breadcrumb',
                    },
                    {
                        text: 'Dropdown 下拉菜单',
                        link: '/zh/components/dropdown',
                    },
                    {
                        text: 'BackTop 回到顶部',
                        link: '/zh/components/backTop',
                    },
                ],
            },
            {
                text: '数据录入组件',
                items: [
                    {
                        text: 'Input 输入框',
                        link: '/zh/components/input',
                    },
                    {
                        text: 'InputNumber 数字输入框',
                        link: '/zh/components/inputNumber',
                    },
                    {
                        text: 'InputFile 文件选择',
                        link: '/zh/components/inputFile',
                    },
                    {
                        text: 'Checkbox 多选框',
                        link: '/zh/components/checkbox',
                    },
                    {
                        text: 'Radio 单选框',
                        link: '/zh/components/radio',
                    },
                    {
                        text: 'Rate 评分',
                        link: '/zh/components/rate',
                    },
                    {
                        text: 'Select 选择器',
                        link: '/zh/components/select',
                    },
                    {
                        text: 'Switch 开关',
                        link: '/zh/components/switch',
                    },
                    {
                        text: 'TimePicker 时间选择',
                        link: '/zh/components/timePicker',
                    },
                    {
                        text: 'DatePicker 日期选择',
                        link: '/zh/components/datePicker',
                    },
                    {
                        text: 'Upload 上传',
                        link: '/zh/components/upload',
                    },
                    {
                        text: 'SelectTree 树形选择器',
                        link: '/zh/components/selectTree',
                    },
                    {
                        text: 'SelectCascader 级联选择器',
                        link: '/zh/components/selectCascader',
                    },
                    {
                        text: 'Transfer 穿梭框',
                        link: '/zh/components/transfer',
                    },
                    {
                        text: 'Form 表单',
                        link: '/zh/components/form',
                    },
                ],
            },
            {
                text: '数据展示组件',
                items: [
                    {
                        text: 'Avatar 头像',
                        link: '/zh/components/avatar',
                    },
                    {
                        text: 'Badge 徽标',
                        link: '/zh/components/badge',
                    },
                    {
                        text: 'Calendar 日历',
                        link: '/zh/components/calendar',
                    },
                    {
                        text: 'Card 卡片',
                        link: '/zh/components/card',
                    },
                    {
                        text: 'Carousel 走马灯',
                        link: '/zh/components/carousel',
                    },
                    {
                        text: 'Collapse 折叠面板',
                        link: '/zh/components/collapse',
                    },
                    {
                        text: 'Descriptions 描述列表',
                        link: '/zh/components/descriptions',
                    },
                    {
                        text: 'Draggable 拖拽',
                        link: '/zh/components/draggable',
                    },
                    {
                        text: 'Empty 空数据',
                        link: '/zh/components/empty',
                    },
                    {
                        text: 'Image 图片',
                        link: '/zh/components/image',
                    },
                    {
                        text: 'Link 链接',
                        link: '/zh/components/link',
                    },
                    {
                        text: 'Table 表格',
                        link: '/zh/components/table',
                    },
                    {
                        text: 'Tag 标签',
                        link: '/zh/components/tag',
                    },
                    {
                        text: 'Text 文本',
                        link: '/zh/components/text',
                    },
                    {
                        text: 'TextHighlight 文本高亮',
                        link: '/zh/components/text-highlight',
                    },
                    {
                        text: 'Tree 树形控件',
                        link: '/zh/components/tree',
                    },
                    {
                        text: 'Timeline 时间轴',
                        link: '/zh/components/timeline',
                    },
                    {
                        text: 'Cascader 级联控件',
                        link: '/zh/components/cascader',
                    },
                    {
                        text: 'VirtualList 虚拟列表',
                        link: '/zh/components/virtualList',
                    },
                ],
            },
            {
                text: '反馈组件',
                items: [
                    {
                        text: 'Modal 对话框',
                        link: '/zh/components/modal',
                    },
                    {
                        text: 'Drawer 抽屉',
                        link: '/zh/components/drawer',
                    },
                    {
                        text: 'Tooltip 文字提示',
                        link: '/zh/components/tooltip',
                    },
                    {
                        text: 'Alert 警告提示',
                        link: '/zh/components/alert',
                    },
                    {
                        text: 'Message 全局提示',
                        link: '/zh/components/message',
                    },
                    {
                        text: 'Progress 进度条',
                        link: '/zh/components/progress',
                    },
                    {
                        text: 'Spin 加载中',
                        link: '/zh/components/spin',
                    },
                    {
                        text: 'Skeleton 骨架屏',
                        link: '/zh/components/skeleton',
                    },
                    {
                        text: 'Popper 弹出信息',
                        link: '/zh/components/popper',
                    },
                    {
                        text: 'FloatPane 浮动面板',
                        link: '/zh/components/float-pane',
                    },
                ],
            },
            {
                text: '其他组件',
                items: [
                    {
                        text: 'ConfigProvider 全局化配置',
                        link: '/zh/components/configProvider',
                    },
                ],
            },
        ].map((sidebarItem) => {
            sidebarItem.items.sort(({ text: text1 }, { text: text2 }) => (text1 < text2 ? -1 : 1));
            return sidebarItem;
        }),
        '/zh/guide/': [
            {
                text: '快速上手',
                items: [
                    {
                        text: '指引',
                        link: '/zh/guide/quick-start',
                    },
                    {
                        text: '主题',
                        link: '/zh/guide/theme',
                    },
                ],
            },
        ],
    },
};

export default sidebarConfig;
