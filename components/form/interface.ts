import { ExtractPropTypes, PropType, ToRefs, Ref } from 'vue';
import { FORM_LAYOUT, LABEL_POSITION } from './const';
import type { RuleItem, Rules } from 'async-validator';
import type { ExtractPublicPropTypes } from '../_util/interface';

export interface FFormRuleItem extends RuleItem {
    trigger?: string | string[];
}

export const formProps = {
    model: Object,
    rules: {
        type: Object as PropType<Rules>,
        default: () => ({} as Rules),
    },
    layout: {
        type: String as PropType<
            (typeof FORM_LAYOUT)[keyof typeof FORM_LAYOUT]
        >,
        default: FORM_LAYOUT.HORIZONTAL,
    },
    span: {
        type: Number,
        default: 6,
    },
    inlineItemGap: {
        type: [String, Number] as PropType<string | number>,
        default: 11,
    },
    inlineItemWidth: [String, Number] as PropType<string | number>,
    labelPosition: {
        type: String as PropType<
            (typeof LABEL_POSITION)[keyof typeof LABEL_POSITION]
        >,
        default: LABEL_POSITION.LEFT,
    },
    showMessage: {
        type: Boolean,
        default: true,
    },
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
    disabled: {
        type: Boolean,
        default: false,
    },
} as const;

export type FormProps = ExtractPublicPropTypes<typeof formProps>;

export const formItemProps = {
    prop: String,
    value: {
        type: [String, Number, Boolean, Array, Object] as PropType<unknown>,
        // eslint-disable-next-line no-undefined
        default: undefined as boolean,
    },
    label: String,
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
    span: {
        type: Number,
        default: null as number,
    },
    showMessage: {
        type: Boolean as PropType<boolean | null>,
        default: null as boolean,
    },
    rules: {
        type: Array as PropType<FFormRuleItem[]>,
        default: () => {
            return [] as FFormRuleItem[];
        },
    },
} as const;

export type FormItemProps = ExtractPublicPropTypes<typeof formItemProps>;

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
    isFormDisabled?: Ref<boolean>;
}

export interface Field {
    prop: string;
    value: any;
    rules: FFormRuleItem[];
    validateRules: (trigger?: string | string[]) => Promise<any>;
    clearValidate: () => void;
    resetField: () => void;
}

export type ValidateResult = {
    name: string;
    errors: [];
};
