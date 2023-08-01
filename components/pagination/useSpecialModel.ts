import { ref, watch, computed, WritableComputedRef } from 'vue';
import { isEqual } from 'lodash-es';

export default (
    props: Record<string, any>,
    emit: any,
    config: {
        prop?: string;
        isEqual?: boolean;
    } = {
        prop: 'modelValue',
        isEqual: false,
    },
    // eslint-disable-next-line @typescript-eslint/ban-types
    callback: Function,
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
        currentValue.value = value;
    };
    const updateCurrentValue = (value: any) => {
        if (value === currentValue.value) {
            return;
        }
        pureUpdateCurrentValue(value);
        emit(`update:${usingProp}`, value);
        callback();
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
