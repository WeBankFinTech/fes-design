import { provide, unref } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { radioGroupKey, name } from './const';
import type { RadioGroupProps } from './const';
import type { RadioGroupEmits } from './interface';

export const useRadioGroup = (
    props: RadioGroupProps,
    emit: RadioGroupEmits,
) => {
    const { validate, isFormDisabled } = useFormAdaptor({
        forbidChildValidate: true,
    });

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

    return { isFormDisabled };
};
