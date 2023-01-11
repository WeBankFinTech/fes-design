import { ExtractPropTypes, PropType, ToRefs, Ref } from 'vue';
import { FORM_LAYOUT, LABEL_POSITION } from './const';
import type { RuleItem } from 'async-validator';

export const formProps = {
    model: Object,
    rules: {
        type: Object as PropType<Record<string, RuleItem[] | RuleItem>>,
        default: () => ({}),
    },
    layout: {
        type: String as PropType<typeof FORM_LAYOUT[keyof typeof FORM_LAYOUT]>,
        default: FORM_LAYOUT.HORIZONTAL,
    },
    inlineItemWidth: [String, Number] as PropType<string | number>,
    labelPosition: {
        type: String as PropType<
            typeof LABEL_POSITION[keyof typeof LABEL_POSITION]
        >,
        default: LABEL_POSITION.LEFT,
    },
    showMessage: {
        type: Boolean,
        default: true,
    },
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
} as const;

export const formItemProps = {
    prop: String,
    value: {
        type: [String, Number, Boolean, Array, Object] as PropType<unknown>,
        default: undefined as boolean,
    },
    label: String,
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
    span: {
        type: Number,
        default: 6,
    },
    showMessage: {
        type: Boolean as PropType<boolean | null>,
        default: null as boolean,
    },
    rules: {
        type: Array as PropType<RuleItem[]>,
        default: () => {
            return [] as RuleItem[];
        },
    },
} as const;

export type AddFieldType = (
    formItemProp: string,
    formItemContext: Field,
) => void;
export type removeField = (formItemProp: string) => void;

export type PropsType = Partial<ExtractPropTypes<typeof formProps>>;
export type FormInjectKey = ToRefs<PropsType> & {
    addField: AddFieldType;
    removeField: removeField;
};
export interface FormItemInject {
    validate: (eventName: string) => void;
    setRuleDefaultType?: (ruleType: string) => void;
    isError?: Ref<boolean>;
}

export interface Field {
    prop: string;
    value: any;
    rules: RuleItem[];
    validateRules: (trigger?: string | string[]) => Promise<any>;
    clearValidate: () => void;
    resetField: () => void;
}

export type ValidateResult = {
    name: string;
    errors: [];
};
