import type {
    ComponentObjectPropsOptions,
    ComputedRef,
    InjectionKey,
    PropType,
    Ref,
} from 'vue';

import { pick } from 'lodash-es';
import type { ComponentInnerProps, ExtractPublicPropTypes } from '../_util/interface';
import { popperProps } from '../popper/props';
import type { MenuItemType, MenuOption } from './interface';

export type MODE = 'vertical' | 'horizontal';

export type TRIGGER = 'click' | 'hover';

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
    // popper 透传的 props
    ...pick(popperProps, ['getContainer', 'appendToContainer']),
    // 当前选中的值
    modelValue: {
        type: [String, Number] as PropType<string | number>,
    },
    // 垂直或者水平
    mode: {
        type: String as PropType<MODE>,
        default: 'horizontal' satisfies MODE,
        validator: (value: MODE) => {
            return (['horizontal', 'vertical'] satisfies MODE[]).includes(value);
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
    expandTrigger: {
        type: String as PropType<TRIGGER>,
        validator: (value: TRIGGER) => {
            return (['click', 'hover'] satisfies TRIGGER[]).includes(value);
        },
    },

} as const satisfies ComponentObjectPropsOptions;

export type MenuProps = ExtractPublicPropTypes<typeof menuProps>;

export type RootMenuInjection = {
    props: ComponentInnerProps<typeof menuProps>;
    currentValue: Ref<string | number>;
    clickMenuItem: (value: string | number) => void;
    renderWithPopper: ComputedRef<boolean>;
    currentExpandedKeys: Ref<(string | number)[]>;
    accordion: ComputedRef<boolean>;
    expandTrigger: ComputedRef<TRIGGER>;
    updateExpandedKeys: (val: string | number | (string | number)[]) => void;
    handleSubMenuExpand: (subMenu: MenuItemType, indexPath: Ref<MenuNode[]>) => void;
};

export const ROOT_MENU_KEY: InjectionKey<RootMenuInjection> = Symbol('ROOT_MENU_KEY');
