import { ref, watch, computed, WritableComputedRef, isProxy } from 'vue';
import { isEqual, isArray } from 'lodash-es';

import type { VModelEvent } from '../interface';

export const useNormalModel = (
    props: Record<string, any>,
    emit: any,
    config: {
        prop?: string;
        isEqual?: boolean;
    } = {
        prop: 'modelValue',
        isEqual: false,
    },
): [WritableComputedRef<any>, (val: any) => void] => {
    const usingProp = config?.prop ?? 'modelValue';
    const currentValue = ref(props[usingProp]);
    const pureUpdateCurrentValue = (value: any) => {
        if (
            value === currentValue.value ||
            (config.isEqual && isEqual(value, currentValue.value))
        ) {
            return;
        }
        // 兼容prop为reactive([])场景，使用currentValue.value = value会导致数据更新后，组件外丢失响应
        if (isArray(value) && isArray(currentValue.value)) {
            currentValue.value.length = 0;
            value.forEach((val) => {
                currentValue.value.push(val);
            });
            return;
        }
        currentValue.value = value;
    };
    const updateCurrentValue = (value: any) => {
        pureUpdateCurrentValue(value);
        // 如果usingProp是数组，传入value则可能丢失响应，而currentValue.value是它自己，就不会丢失响应性
        emit(`update:${usingProp}`, currentValue.value);
    };

    watch(
        () => props[usingProp],
        (val) => {
            pureUpdateCurrentValue(val);
        },
    );

    return [
        computed({
            get() {
                return currentValue.value;
            },
            set(value) {
                updateCurrentValue(value);
            },
        }),
        updateCurrentValue,
    ];
};

export const useArrayModel = (
    props: Record<string, any>,
    emit: {
        (e: VModelEvent, value: any): void;
    },
    config = {
        prop: 'modelValue',
    },
): [WritableComputedRef<any>, (val: any) => void] => {
    const usingProp = config?.prop ?? 'modelValue';
    const currentValue = ref(props[usingProp] || []);

    const updateCurrentValue = (value: any) => {
        currentValue.value = value;
        // TODO 这种用 ts 不知道怎么写
        (emit as any)(`update:${usingProp}`, currentValue.value);
    };

    const updateItem = (value: any) => {
        if (isArray(value)) {
            updateCurrentValue(value);
            return;
        }
        const val = [...currentValue.value];
        const index = val.indexOf(value);
        if (index !== -1) {
            val.splice(index, 1);
        } else {
            val.push(value);
        }
        updateCurrentValue(val);
    };

    watch(
        () => props[usingProp],
        (val) => {
            updateCurrentValue(val);
        },
    );

    return [
        computed({
            get() {
                return currentValue.value;
            },
            set(value) {
                updateCurrentValue(value);
            },
        }),
        updateItem,
    ];
};
