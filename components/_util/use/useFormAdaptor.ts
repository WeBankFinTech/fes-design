import { inject, isRef, watch, ref, Ref } from 'vue';
import { isString, isFunction } from 'lodash-es';
import { noop } from '../utils';
import { FORM_ITEM_INJECTION_KEY } from '../constants';

export default (valueType?: string | Ref<string> | (() => string)) => {
    const { validate, isError, setRuleDefaultType, isDisabled } = inject(
        FORM_ITEM_INJECTION_KEY,
        {
            validate: noop,
            isError: ref(false),
            isDisabled: ref(false),
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

    return {
        validate,
        isError,
        isDisabled,
    };
};
