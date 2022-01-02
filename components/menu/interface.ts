import type { Ref, VNodeChild } from 'vue';

export interface MenuOption {
    value: string;
    label: string | (() => VNodeChild);
    icon: () => VNodeChild;
    children: MenuOption[];
    isGroup: boolean;
}

export interface MenuItemType {
    uid: string;
    value: string;
    type: string;
    children: MenuItemType[];
    isOpened: Ref<boolean>;
    isActive: Ref<boolean>;
}
