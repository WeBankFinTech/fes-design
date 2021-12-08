import { ref, watch, computed } from 'vue';
import { isEqual, isArray } from 'lodash-es';

export const useNormalModel = (
    props,
    emit,
    config = {
        prop: 'modelValue',
        isEqual: false,
    },
) => {
    const usingProp = config?.prop ?? 'modelValue';
    const currentValue = ref(props[usingProp]);
    const updateCurrentValue = (value) => {
        if (
            value === currentValue.value
            || (config.isEqual && isEqual(value, currentValue.value))
        ) {
            return;
        }
        currentValue.value = value;
        emit(`update:${usingProp}`, value);
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
        updateCurrentValue,
    ];
};

export const useArrayModel = (
    props,
    emit,
    config = {
        prop: 'modelValue',
    },
) => {
    const usingProp = config?.prop ?? 'modelValue';
    const currentValue = ref(props[usingProp] || []);

    const updateCurrentValue = (value) => {
        currentValue.value = value;
        emit(`update:${usingProp}`, currentValue.value);
    };

    const updateItem = (value) => {
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
