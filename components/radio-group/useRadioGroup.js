import { provide, unref, watch } from 'vue';
import { radioGroupKey, name } from './const';
import { useNormalModel } from '../_util/use/useModel';
import { CHANGE_EVENT } from '../_util/constants';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import useFormGroupResetter from '../_util/use/useFormGroupResetter';

export const useRadioGroup = (props, { emit }) => {
    useFormGroupResetter();
    const { validate } = useFormAdaptor();

    const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

    watch(currentValue, () => {
        emit(CHANGE_EVENT, currentValue.value);
        validate(CHANGE_EVENT);
    });

    const isSelect = (value) => {
        const radioGroupVal = unref(currentValue);
        const radioVal = unref(value);
        return radioGroupVal === radioVal;
    };
    const onSelect = (value) => {
        const radioGroupVal = unref(currentValue);
        const radioVal = unref(value);
        if (radioGroupVal === radioVal) {
            updateCurrentValue(null);
        } else {
            updateCurrentValue(radioVal);
        }
    };
    provide(radioGroupKey, {
        name,
        isSelect,
        onSelect,
        props,
    });
};
