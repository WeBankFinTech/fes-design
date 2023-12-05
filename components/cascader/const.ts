export const COMPONENT_NAME = {
    CASCADER: 'FCascader',
    CASCADER_MENU: 'FCascaderMenu',
    CASCADER_NODE: 'FCascaderNode',
};

export const CHECK_STRATEGY = {
    ALL: 'all',
    PARENT: 'parent',
    CHILD: 'child',
} as const;

export type CheckStrictly =
    (typeof CHECK_STRATEGY)[keyof typeof CHECK_STRATEGY];

export const ROOT_MENU_KEY = 'root';

export const EXPAND_TRIGGER = {
    CLICK: 'click',
    HOVER: 'hover',
};
