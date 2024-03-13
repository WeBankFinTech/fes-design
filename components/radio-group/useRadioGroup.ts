import { provide, unref } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { type UnboxInjection } from '../_util/interface';
import { radioGroupKey, COMPONENT_NAME } from './const';
import type { RadioGroupInnerProps } from './props';
import type { RadioGroupEmits } from './interface';

type GroupInjection = UnboxInjection<typeof radioGroupKey>;

export const useRadioGroup = (
    props: RadioGroupInnerProps,
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

    const isSelect: GroupInjection['isSelect'] = (value) => {
        const radioGroupVal = unref(currentValue);
        const radioVal = unref(value);
        return radioGroupVal === radioVal;
    };

    const onSelect: GroupInjection['onSelect'] = (
        value,
        afterSelectHandler,
    ) => {
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
        afterSelectHandler();
    };

    provide(radioGroupKey, {
        name: COMPONENT_NAME,
        isSelect,
        onSelect,
        props,
    });

    return { isFormDisabled };
};
