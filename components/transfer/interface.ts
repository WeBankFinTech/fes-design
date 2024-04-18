import { type CSSProperties, type Ref, type VNodeChild } from 'vue';
import { type TreeOption } from '../tree/interface';
import { type TreeProps } from '../tree/props';
import { type RequiredByKeys } from '../_util/types';
import type { TransferInnerProps } from './props';

export type TreeFilter = TreeProps['filterMethod'];

export type TransferOption = RequiredByKeys<
    Pick<TreeOption, 'value' | 'disabled' | 'checkable'>,
    'value'
> & {
    label: string;
    children?: TransferOption[];
};

export type TransferOptionValue = NonNullable<TransferOption['value']>;

export type TransferFilter = (
    filterText: string,
    option: TransferOption,
) => ReturnType<TreeFilter>;

export type TransferInjection = {
    rootProps: TransferInnerProps; // 解构组件 props 会失去响应性
    rootStyle: Ref<CSSProperties>;
    modelValue: Ref<TransferOptionValue[]>;
    filter: Ref<TransferFilter>;
    scrollContentHeight: Ref<number | null>;
    renderLabel: (option: TransferOption) => VNodeChild;
    handleChange: (data: { nextValue: TransferOptionValue[] }) => void;
};
