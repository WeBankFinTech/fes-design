export interface FormItemInject {
    validate: (eventName: string) => void;
    setRuleDefaultType?: (ruleType: string) => void;
}
