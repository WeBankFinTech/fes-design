import { Ref } from 'vue';
export interface FormInjectKey {
    model: Ref<object>;
    rules: Ref<object>;
    layout: Ref<string>;
    inlineItemWidth: Ref<string | number>;
    labelPosition: Ref<string>;
    showMessage: Ref<boolean>;
    labelWidth: Ref<string | number>;
    labelClass: Ref<string>;
    addField: (formItemProp: string, formItemContext: Field) => void;
    removeField: (formItemProp: string) => void;
}
export interface FormItemInject {
    validate: (eventName: string) => void;
    setRuleDefaultType?: (ruleType: string) => void;
    isError?: Ref<boolean>;
}

export interface Field {
    prop: string;
    value: any;
    rules: any[];
    validateRules: (trigger?: string | string[]) => Promise<any>;
    clearValidate: () => void;
    resetField: () => void;
}

export type ValidateResult = {
    name: string;
    errors: [];
};
