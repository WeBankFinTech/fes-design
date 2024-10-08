import type { CSSProperties, ComponentObjectPropsOptions, PropType } from 'vue';
import { extractPropsDefaultValue } from '../_util/utils';

import type { ExtractPublicPropTypes, GetContainer } from '../_util/interface';
import type { SelectOption, SelectValue } from './interface';

export const selectProps = {
    modelValue: {
        type: [String, Number, Array, Boolean, Object] as PropType<
            SelectValue | SelectValue[]
        >,
        default(): undefined {
            return void 0;
        },
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
    filter: {
        type: Function as PropType<
            (pattern: string, option: object) => boolean
        >,
    },
    filterTextHighlight: {
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
    virtualScroll: {
        type: [Boolean, Number] as PropType<boolean | number>,
        default: true,
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
    tagBordered: {
        type: Boolean,
        default: false,
    },
    tag: {
        type: Boolean,
        default: false,
    },
    popperClass: [String, Array, Object] as PropType<string | [] | object>,
    triggerClass: [String, Array, Object] as PropType<string | [] | object>,
    triggerStyle: [Object, String] as PropType<CSSProperties | string>,
} as const satisfies ComponentObjectPropsOptions;

export const selectPropsDefaultValue = extractPropsDefaultValue(selectProps);

export type SelectProps = ExtractPublicPropTypes<typeof selectProps>;
