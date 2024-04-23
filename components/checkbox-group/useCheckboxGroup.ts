import { provide, unref } from 'vue';
import { useArrayModel } from '../_util/use/useModel';
import useFormAdaptor from '../_util/use/useFormAdaptor';
import { CHANGE_EVENT } from '../_util/constants';
import type { UnboxInjection } from '../_util/interface';
import { COMPONENT_NAME, checkboxGroupKey } from './const';
import type { CheckboxGroupInnerProps } from './props';
import type { CheckboxGroupEmits } from './interface';

type GroupInjection = UnboxInjection<typeof checkboxGroupKey>;

export const useCheckboxGroup = (
    props: CheckboxGroupInnerProps,
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

    const isSelect: GroupInjection['isSelect'] = (value) => {
        const groupVal = unref(currentValue);
        const itemVal = unref(value);
        if (groupVal === null || itemVal === null) {
            return false;
        }
        return groupVal.includes(itemVal);
    };

    const onSelect: GroupInjection['onSelect'] = (
        value,
        afterSelectHandler,
    ) => {
        updateItem(unref(value));
        handleChange();
        afterSelectHandler();
    };

    provide(checkboxGroupKey, {
        name: COMPONENT_NAME,
        isSelect,
        onSelect,
        props,
    });

    return {
        isFormDisabled,
    };
};
