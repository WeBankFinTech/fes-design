import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type {
    ComponentInnerProps,
    ExtractPublicPropTypes,
} from '../_util/interface';
import type {
    TransferFilter,
    TransferOption,
    TransferOptionValue,
} from './interface';

export const transferProps = {
    modelValue: {
        type: Array as PropType<TransferOptionValue[]>,
        default: (): TransferOptionValue[] => [],
    },
    options: {
        type: Array as PropType<TransferOption[]>,
        default: (): TransferOption[] => [],
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    filter: {
        type: Function as PropType<TransferFilter>,
    },
    twoWay: {
        type: Boolean,
        default: false,
    },
    height: {
        type: Number,
    },
} as const satisfies ComponentObjectPropsOptions;

// 组件暴露给外部的 props 类型
export type TransferProps = ExtractPublicPropTypes<typeof transferProps>;

// 组件内部 setup 使用的 props 类型
export type TransferInnerProps = ComponentInnerProps<typeof transferProps>;
