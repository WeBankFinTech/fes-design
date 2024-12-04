import type {
    ComponentObjectPropsOptions,
    ExtractPublicPropTypes,
    PropType,
    VNodeTypes,
} from 'vue';
import type { PLACEMENT, TRIGGER } from '../_util/constants';

export type DropdownValue = string | number;

export interface DropdownOption {
    value: DropdownValue;
    label: string | number | ((option: DropdownOption) => VNodeTypes);
    disabled?: boolean;
    icon?: () => VNodeTypes;
    [key: string]:
        | string
        | number
        | boolean
        | ((option: DropdownOption) => VNodeTypes)
        | undefined;
}

export const dropdownProps = {
    modelValue: {
        type: [String, Number] as PropType<DropdownValue>,
    },
    visible: {
        type: Boolean,
        default: false,
    },
    appendToContainer: {
        type: Boolean,
        default: true,
    },
    getContainer: {
        type: Function,
    },
    trigger: {
        type: String as PropType<(typeof TRIGGER)[number]>,
        default: 'hover',
    },
    placement: {
        type: String as PropType<(typeof PLACEMENT)[number]>,
        default: 'bottom',
    },
    offset: {
        type: Number,
        default: 6,
    },
    options: {
        type: Array as PropType<DropdownOption[]>,
        default(): DropdownOption[] {
            return [];
        },
    },
    disabled: {
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
    arrow: {
        type: Boolean,
        default: false,
    },
    showSelectedOption: {
        type: Boolean,
        default: false,
    },
    popperClass: [String, Array, Object] as PropType<string | [] | object>,
} as const satisfies ComponentObjectPropsOptions;

export type DropdownProps = ExtractPublicPropTypes<typeof dropdownProps>;
