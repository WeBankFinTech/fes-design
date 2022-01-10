import type { PropType, ExtractPropTypes } from 'vue';

import { extractPropsDefaultValue } from '../_util/utils';

import type { SelectOption, SelectValue } from './interface';
import type { GetContainer } from '../_util/interface';

export const selectProps = {
    modelValue: {
        type: [String, Number, Array, Boolean, Object] as PropType<
            SelectValue | SelectValue[]
        >,
        default() {
            return '';
        },
    },
    placeholder: {
        type: String,
        default() {
            return '请选择';
        },
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    clearable: {
        type: Boolean,
        default: false,
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    multipleLimit: {
        type: Number,
        default: 0,
    },
    emptyText: {
        type: String,
        default: '无数据',
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function as PropType<GetContainer>,
    },
    filterable: {
        type: Boolean,
        default: false,
    },
    collapseTags: {
        type: Boolean,
        default: false,
    },
    collapseTagsLimit: {
        type: Number,
        default: 1,
    },
    options: {
        type: Array as PropType<SelectOption[]>,
        default(): SelectOption[] {
            return [];
        },
    },
    fetchData: {
        type: Function as PropType<
            (inputText: string) => SelectOption[] | Promise<SelectOption[]>
        >,
    },
    isFetchInInitial: Boolean,
} as const;

export const selectPropsDefaultValue = extractPropsDefaultValue(selectProps);

export type SelectProps = Partial<ExtractPropTypes<typeof selectProps>>;
