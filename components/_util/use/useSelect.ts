import { inject, ref, computed } from 'vue';
import { CHANGE_EVENT } from '../constants';
import { useNormalModel } from './useModel';
import useFormAdaptor from './useFormAdaptor';

import type { VModelEvent, ChangeEvent } from '../interface';

export default function useSelect({
    props,
    emit,
    parent,
}: {
    props: any;
    emit: {
        (e: VModelEvent, value: any): void;
        (e: ChangeEvent, value: any): void;
    };
    parent: {
        groupKey: symbol;
        name: string;
    };
}) {
    const { validate, isFormDisabled } = useFormAdaptor({
        valueType: 'boolean',
    });
    const group = inject(parent.groupKey, null) as any;
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
            group.onSelect(props.value);
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
