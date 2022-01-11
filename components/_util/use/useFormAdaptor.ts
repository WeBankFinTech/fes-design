import { inject, isRef, watch, Ref } from 'vue';
import { isString, isFunction } from 'lodash-es';
import { noop } from '../utils';
import { FORMITEM_INJECTION_KEY } from '../constants';

export default (valueType?: string | Ref<string> | (() => string)) => {
    const { validate, setRuleDefaultType } = inject(FORMITEM_INJECTION_KEY, {
        validate: noop,
    });

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
    };
};
