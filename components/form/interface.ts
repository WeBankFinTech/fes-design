import type {
    CSSProperties,
    ComponentObjectPropsOptions,
    ExtractPropTypes,
    PropType,
    Ref,
    ToRefs,
} from 'vue';
import type { RuleItem } from 'async-validator';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { FORM_ITEM_ALIGN, FORM_LAYOUT, LABEL_POSITION } from './const';

export interface FormRuleItem extends RuleItem {
    trigger?: string | string[];
}

export type FormRules = Record<string, FormRuleItem | FormRuleItem[]>;

export const formProps = {
    model: Object,
    rules: {
        type: Object as PropType<FormRules>,
        default: (): FormRules => ({}),
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
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
    showMessage: {
        type: Boolean,
        default: true,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    align: {
        type: String as PropType<(typeof FORM_ITEM_ALIGN)[number]>,
        default: FORM_ITEM_ALIGN[0],
    },
} as const satisfies ComponentObjectPropsOptions;

export type FormProps = ExtractPublicPropTypes<typeof formProps>;

export const formItemProps = {
    prop: String,
    value: {
        type: [String, Number, Boolean, Object] as PropType<
            string | number | boolean | object
        >,
        default: undefined as undefined,
    },
    label: String,
    labelWidth: [String, Number] as PropType<string | number>,
    labelClass: String,
    contentStyle: {
        type: [String, Array, Object] as PropType<
            string | CSSProperties[] | CSSProperties
        >,
        default() {
            return {};
        },
    },
    span: {
        type: Number,
        default: null as number,
    },
    showMessage: {
        type: Boolean as PropType<boolean | null>,
        default: null as boolean,
    },
    rules: {
        type: Array as PropType<FormRuleItem[]>,
        default: () => {
            return [] as FormRuleItem[];
        },
    },
    align: {
        type: String as PropType<(typeof FORM_ITEM_ALIGN)[number]>,
        default: null as string,
    },
} as const satisfies ComponentObjectPropsOptions;

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
    rules: FormRuleItem[];
    validateRules: (trigger?: string | string[]) => Promise<any>;
    clearValidate: () => void;
    resetField: () => void;
}

export interface ValidateResult {
    name: string;
    errors: [];
}
