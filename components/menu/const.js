export const MODE = ['horizontal', 'vertical'];

export const COMPONENT_NAME = {
    MENU: 'FMenu',
    SUB_MENU: 'FSubMenu',
    MENU_ITEM: 'FMenuItem',
    MENU_GROUP: 'FMenuGroup',
};

export const MENU_KEY = Symbol('FMenu');


export const MENU_PROPS = {
    // 当前选中的值
    modelValue: {
        type: String,
        default: null,
    },
    // 垂直或者水平
    mode: {
        type: String,
        default: MODE[0],
        validator(value) {
            return MODE.includes(value);
        },
    },
    // 是否收起
    collapsed: {
        type: Boolean,
        default: false,
    },
    // 使用反转样式
    inverted: {
        type: Boolean,
        default: false,
    },
    // 是否默认展开全部subMenu
    defaultExpandAll: {
        type: Boolean,
        default: false,
    },
    // 当前展开的subMenu的key数组
    expandedKeys: {
        type: Array,
        default() {
            return [];
        },
    },
    // 是否只保持一个子菜单展开
    accordion: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array,
        default() {
            return [];
        },
    },
};
