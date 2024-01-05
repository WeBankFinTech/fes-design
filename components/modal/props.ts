import {
    type PropType,
    type VNode,
    type VNodeChild,
    type ComponentObjectPropsOptions,
    type DefineComponent,
} from 'vue';
import { iconComponentMap } from '../_util/noticeManager';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const modalIconMap = {
    ...iconComponentMap,
    confirm: iconComponentMap.warning,
} as const;

export type ModalType = keyof typeof modalIconMap;

// 全局方法的特有属性
export const globalModalProps = {
    content: String as PropType<string | VNode | (() => VNodeChild)>,
    forGlobal: Boolean, // 标记是否API调用
    cancelLoading: Boolean,
} as const satisfies ComponentObjectPropsOptions;

// 通用的属性
export const modalProps = {
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
    type: {
        type: String as PropType<ModalType>,
    },
    title: String as PropType<string | VNode | (() => VNodeChild)>,
    okText: String,
    okLoading: Boolean,
    cancelText: String,
    showCancel: {
        type: Boolean,
        default: true,
    },
    width: {
        type: [String, Number] as PropType<string | number>,
        default: 520,
    },
    // 内容区域的高度，不是modal整体的高
    height: {
        type: [String, Number] as PropType<string | number>,
        default: 'auto',
    },
    // 类型保持和scrollbar maxHeight一致
    maxHeight: {
        type: [String, Number] as PropType<string | number>,
    },
    top: {
        type: [String, Number] as PropType<string | number>,
        default: 50,
    },
    bottom: {
        type: [String, Number] as PropType<string | number>,
        default: 50,
    },
    verticalCenter: Boolean,
    center: Boolean,
    footer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function as PropType<() => HTMLElement>,
    },
    fullScreen: {
        type: Boolean,
        default: false,
    },
    contentClass: String,
} as const satisfies ComponentObjectPropsOptions;

export type ModalProps = ExtractPublicPropTypes<typeof modalProps>;

export type ModalInnerProps = Parameters<
    DefineComponent<typeof modalProps>['setup']
>[0];
