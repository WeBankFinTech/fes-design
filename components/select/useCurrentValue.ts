import { useVModel } from '@vueuse/core';
import type { SelectValue } from './interface';
import type { SelectProps } from './props';

export function useCurrentValue(props: SelectProps, emit: (event: 'filter' | 'update:modelValue' | 'focus' | 'blur' | 'change' | 'clear' | 'search' | 'scroll' | 'removeTag' | 'visibleChange', ...args: any[]) => void) {
    const currentValue = useVModel(props, 'modelValue', emit, {
        passive: props.passive,
        deep: true,
        defaultValue: props.multiple ? [] : undefined,
    });

    function updateCurrentValue(value: SelectValue | SelectValue[]): SelectValue | SelectValue[] {
        if (!props.multiple) {
            currentValue.value = value;
            return value;
        } else {
            if (Array.isArray(value)) {
                currentValue.value = value;
                return value;
            }

            // 兼容重复赋值为不符合预期数据类型的场景
            let val: SelectValue[] = [];
            if (!Array.isArray(currentValue.value)) {
                console.warn(
                    '[useArrayModel] 绑定值类型不匹配, 仅支持数组类型, value:',
                    currentValue.value,
                );
                val = [];
            } else {
                val = [...currentValue.value];
            }

            const index = val.indexOf(value);
            if (index !== -1) {
                val.splice(index, 1);
            } else {
                val.push(value);
            }
            currentValue.value = val;
            return val;
        }
    };

    if (props.multiple) {
        if (!Array.isArray(currentValue.value)) {
            console.warn(
                '[useArrayModel] 绑定值类型不匹配, 仅支持数组类型, value:',
                props.modelValue,
            );
            currentValue.value = [];
        }
    }

    return {
        currentValue,
        updateCurrentValue,
    };
}
