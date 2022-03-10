import type { Ref, VNodeChild } from 'vue';

export interface MenuOption {
    value: string | number;
    label: string | (() => VNodeChild);
    icon: () => VNodeChild;
    children: MenuOption[];
    isGroup: boolean;
}

export interface MenuItemType {
    uid: string;
    value: string | number;
    type: string;
    children: MenuItemType[];
    isOpened: Ref<boolean>;
    isActive: Ref<boolean>;
}
