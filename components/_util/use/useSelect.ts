import { type InjectionKey, computed, inject, ref } from 'vue';
import { CHANGE_EVENT } from '../constants';
import type { ChangeEvent, VModelEvent } from '../interface';
import { useNormalModel } from './useModel';
import useFormAdaptor from './useFormAdaptor';

export type ParentGroupInjection<
    Value,
    ParentGroupProps extends {
        disabled?: boolean;
    },
> = {
    name: string;
    props: ParentGroupProps;
    isSelect: (value: Value) => void;
    onSelect: (value: Value, afterSelect: () => void) => void;
};

export default function useSelect<
    Value,
    ParentGroupProps extends {
        disabled?: boolean;
    },
>({
    props,
    emit,
    parent,
}: {
    props: any;
    emit: {
        (e: VModelEvent, ...args: any[]): void;
        (e: ChangeEvent, ...args: any[]): void;
    };
    parent: {
        groupKey: InjectionKey<ParentGroupInjection<Value, ParentGroupProps>>;
        name: string;
    };
}) {
    const { validate, isFormDisabled } = useFormAdaptor({
        valueType: 'boolean',
    });
    const group = inject(parent.groupKey, null);
    const focus = ref(false);
    const hover = ref(false);
    const isGroup = group !== null;
    const [currentValue, updateCurrentValue] = useNormalModel(props, emit);
    const checked = computed(() => {
        if (!isGroup) {
            return currentValue.value;
        }
        return group.isSelect(props.value);
    });
    const innerDisabled = computed(
        () =>
            props.disabled ||
            (isGroup && group?.props?.disabled) ||
            isFormDisabled.value,
    );
    const handleClick = () => {
        if (innerDisabled.value) {
            return;
        }
        if (isGroup) {
            group.onSelect(props.value, () => {
                const newVal = group.isSelect(props.value);
                emit(CHANGE_EVENT, newVal);
            });
        } else {
            const newVal = !currentValue.value;
            updateCurrentValue(newVal);
            emit(CHANGE_EVENT, newVal);
            validate(CHANGE_EVENT);
        }
    };
    const handleMouseOver = () => {
        hover.value = true;
    };
    const handleMouseOut = () => {
        hover.value = false;
    };
    return {
        currentValue,
        updateCurrentValue,
        checked,
        innerDisabled,
        isGroup,
        group,
        focus,
        hover,
        handleClick,
        handleMouseOver,
        handleMouseOut,
    };
}
