import {
    type PropType,
    type ComponentObjectPropsOptions,
    type DefineComponent,
} from 'vue';
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
    escClosable: {
        type: Boolean,
        default: true,
    },
    // 没有遮罩层，页面其他交互是否可操作
    operable: {
        type: Boolean,
        default: false,
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
    dimension: {
        type: [String, Number] as PropType<string | number>,
        // TODO: 废弃 height 和 width 以后，恢复此处默认值
        // default: 520,
    },
    // DEPRECATED: 后续仅支持 dimension
    width: {
        type: [String, Number] as PropType<string | number>,
    },
    // DEPRECATED: 后续仅支持 dimension
    height: {
        type: [String, Number] as PropType<string | number>,
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
    wrapperClass: {
        type: [String, Object, Array] as PropType<string | object | []>,
    },
    resizable: {
        type: Boolean,
        default: false,
    },
    resizeMax: {
        type: [String, Number] as PropType<string | number>,
    },
    resizeMin: {
        type: [String, Number] as PropType<string | number>,
    },
} as const satisfies ComponentObjectPropsOptions;

export type DrawerProps = ExtractPublicPropTypes<typeof drawerProps>;

export type DrawerInnerProps = Parameters<
    DefineComponent<typeof drawerProps>['setup']
>[0];

export const UPDATE_SHOW_EVENT = 'update:show';
export const OK_EVENT = 'ok';
export const CANCEL_EVENT = 'cancel';
export const AFTER_LEAVE_EVENT = 'after-leave';
