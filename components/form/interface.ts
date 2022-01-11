export interface FormItemInject {
    validate: (eventName: string) => void;
    setRuleDefaultType?: (ruleType: string) => void;
}

export interface Field {
    prop: string;
    value: any;
    rules: [];
    validateRules: (trigger?: string | string[]) => Promise<any>;
    clearValidate: () => void;
    resetField: () => void;
}

export type ValidateResult = {
    name: string;
    errors: [];
};
