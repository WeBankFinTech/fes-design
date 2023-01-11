import { provide, unref } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import useFormGroupResetter from '../_util/use/useFormGroupResetter';
import { FORM_ITEM_INJECTION_KEY } from '../_util/constants';
import { noop } from '../_util/utils';
import { radioGroupKey, name } from './const';
import type { RadioGroupProps, RadioGroupEmits } from './radio-group.vue';

export const useRadioGroup = (
    props: RadioGroupProps,
    emit: RadioGroupEmits,
) => {
    useFormGroupResetter();
    const { validate, isError } = useFormAdaptor();

    // 避免子组件重复
    provide(FORM_ITEM_INJECTION_KEY, { validate: noop, isError });

    const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

    const handleChange = () => {
        emit(CHANGE_EVENT, currentValue.value);
        validate(CHANGE_EVENT);
    };

    const isSelect = (value: string | number | boolean) => {
        const radioGroupVal = unref(currentValue);
        const radioVal = unref(value);
        return radioGroupVal === radioVal;
    };

    const onSelect = (value: string | number | boolean) => {
        const radioGroupVal = unref(currentValue);
        const radioVal = unref(value);
        if (radioGroupVal === radioVal) {
            if (!props.cancelable) {
                return;
            }
            updateCurrentValue(null);
        } else {
            updateCurrentValue(radioVal);
        }
        handleChange();
    };

    provide(radioGroupKey, {
        name,
        isSelect,
        onSelect,
        props,
    });
};
