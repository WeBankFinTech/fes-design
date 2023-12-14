import { type PropType, type ComponentObjectPropsOptions } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

export type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left';

// 通用的属性
export const drawerProps = {
    show: Boolean,
    displayDirective: {
        type: String as PropType<'show' | 'if'>,
        default: 'show',
    },
    closable: {
        type: Boolean,
        default: true,
    },
    mask: {
        type: Boolean,
        default: true,
    },
    maskClosable: {
        type: Boolean,
        default: true,
    },
    title: String,
    okText: {
        type: String,
        default: '确定',
    },
    okLoading: Boolean,
    cancelText: {
        type: String,
        default: '取消',
    },
    showCancel: {
        type: Boolean,
        default: true,
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    height: {
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    footer: {
        type: Boolean,
        default: false,
    },
    footerBorder: {
        type: Boolean,
        default: false,
    },
    getContainer: {
        type: Function,
    },
    placement: {
        type: String as PropType<DrawerPlacement>,
        default: 'right' satisfies DrawerPlacement,
    },
    contentClass: String,
    resizable: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type DrawerProps = ExtractPublicPropTypes<typeof drawerProps>;

export const UPDATE_SHOW_EVENT = 'update:show';
export const OK_EVENT = 'ok';
export const CANCEL_EVENT = 'cancel';
export const AFTER_LEAVE_EVENT = 'after-leave';
