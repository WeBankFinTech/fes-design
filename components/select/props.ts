import type { PropType, ExtractPropTypes } from 'vue';

import { extractPropsDefaultValue } from '../_util/utils';

import type { SelectOption, SelectValue } from './interface';
import type { GetContainer } from '../_util/interface';

export const selectProps = {
    modelValue: {
        type: [String, Number, Array, Boolean, Object] as PropType<
            SelectValue | SelectValue[]
        >,
    },
    placeholder: {
        type: String,
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
    remote: {
        type: Boolean,
        default: false,
    },
    valueField: {
        type: String,
        default: 'value',
    },
    labelField: {
        type: String,
        default: 'label',
    },
    optionLabelField: {
        type: String,
        default: 'label',
    },
} as const;

export const selectPropsDefaultValue = extractPropsDefaultValue(selectProps);

export type SelectProps = Partial<ExtractPropTypes<typeof selectProps>>;
