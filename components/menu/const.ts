import type {
    ComponentObjectPropsOptions,
    ComputedRef,
    InjectionKey,
    PropType,
} from 'vue';

import type { ExtractPublicPropTypes } from '../_util/interface';
import type { MenuOption } from './interface';

export const MODE = ['horizontal', 'vertical'] as const;

export const COMPONENT_NAME = {
    MENU: 'FMenu',
    SUB_MENU: 'FSubMenu',
    MENU_ITEM: 'FMenuItem',
    MENU_GROUP: 'FMenuGroup',
};

export const CHILDREN_KEY = Symbol('FMenuChildren');

export interface SubMenuInject {
    handleItemClick: () => void;
}

export const SUB_MENU_KEY: InjectionKey<SubMenuInject> = Symbol('SUB_MENU_KEY');

export interface MenuNode {
    name: string;
    uid: number | string;
}

export const MENU_KEY: InjectionKey<{
    parentPath: ComputedRef<MenuNode[]>;
}> = Symbol('FMenu');

export const menuProps = {
    // 当前选中的值
    modelValue: {
        type: [String, Number] as PropType<string | number>,
    },
    // 垂直或者水平
    mode: {
        type: String as PropType<(typeof MODE)[number]>,
        default: MODE[0],
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
        type: Array as PropType<(number | string)[]>,
        default: (): (number | string)[] => [],
    },
    // 是否只保持一个子菜单展开
    accordion: {
        type: Boolean,
        default: false,
    },
    options: {
        type: Array as PropType<MenuOption[]>,
        default(): MenuOption[] {
            return [];
        },
    },
} as const satisfies ComponentObjectPropsOptions;

export type MenuProps = ExtractPublicPropTypes<typeof menuProps>;
