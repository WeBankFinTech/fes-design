import type { ComponentInternalInstance, Ref, VNodeChild } from 'vue';

export interface MenuOption {
    value: string | number;
    label: string | (() => VNodeChild);
    icon: () => VNodeChild;
    children: MenuOption[];
    isGroup: boolean;
    disabled: boolean;
}

export interface MenuItemType {
    uid: ComponentInternalInstance['uid'];
    value: string | number;
    type: string;
    children: MenuItemType[];
    isOpened: Ref<boolean>;
    isActive: Ref<boolean>;
    isDisabled: Ref<boolean>;
}
