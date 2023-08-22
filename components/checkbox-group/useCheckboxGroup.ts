import { provide, unref } from 'vue';
import { useArrayModel } from '../_util/use/useModel';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { CHANGE_EVENT } from '../_util/constants';
import { checkboxGroupKey, name } from './const';
import type { CheckboxGroupProps } from './const';

import type { CheckboxGroupEmits } from './interface';

export const useCheckboxGroup = (
    props: CheckboxGroupProps,
    emit: CheckboxGroupEmits,
) => {
    const { validate, isFormDisabled } = useFormAdaptor({
        valueType: 'array',
        forbidChildValidate: true,
    });

    const [currentValue, updateItem] = useArrayModel(props, emit);

    const handleChange = () => {
        emit(CHANGE_EVENT, currentValue.value);
        validate(CHANGE_EVENT);
    };

    const isSelect = (value: string | number | boolean) => {
        const groupVal = unref(currentValue);
        const itemVal = unref(value);
        if (groupVal === null || itemVal === null) {
            return false;
        }
        return groupVal.includes(itemVal);
    };

    const onSelect = (value: string | number | boolean) => {
        updateItem(unref(value));
        handleChange();
    };

    provide(checkboxGroupKey, {
        name,
        isSelect,
        onSelect,
        props,
    });

    return {
        isFormDisabled,
    };
};
