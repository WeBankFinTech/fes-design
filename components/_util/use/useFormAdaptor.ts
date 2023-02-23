import { inject, isRef, watch, ref, Ref, provide } from 'vue';
import { isString, isFunction } from 'lodash-es';
import { noop } from '../utils';
import { FORM_ITEM_INJECTION_KEY } from '../constants';

type FormAdaptorConfig = {
    valueType?: string | Ref<string> | (() => string);
    forbidChildValidate?: boolean;
};

export default (formAdaptorConfig?: FormAdaptorConfig) => {
    const valueType = formAdaptorConfig?.valueType;
    const forbidChildValidate = formAdaptorConfig?.forbidChildValidate;

    const { validate, isError, setRuleDefaultType, isFormDisabled } = inject(
        FORM_ITEM_INJECTION_KEY,
        {
            validate: noop,
            isError: ref(false),
            isFormDisabled: ref(false),
        },
    );

    // 兼容非 form 模式
    if (setRuleDefaultType && valueType) {
        if (isString(valueType)) {
            setRuleDefaultType(valueType);
        } else if (isRef(valueType)) {
            watch(
                valueType,
                () => {
                    if (valueType.value) setRuleDefaultType(valueType.value);
                },
                {
                    immediate: true,
                },
            );
        } else if (isFunction(valueType)) {
            setRuleDefaultType(valueType());
        }
    }

    if (forbidChildValidate) {
        // 避免子组件重复
        provide(FORM_ITEM_INJECTION_KEY, {
            validate: noop,
            isError,
            isFormDisabled,
        });
    }

    return {
        validate,
        isError,
        isFormDisabled,
    };
};
