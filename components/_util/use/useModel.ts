import { ref, watch, computed, type WritableComputedRef, type Ref } from 'vue';
import { isEqual as isEqualFunc, isArray, isUndefined } from 'lodash-es';

// TODO: 后续考虑如何并入 useNormalModel
export type UseNormalModelReturn<
    Props extends Record<string, unknown>,
    Key extends keyof Props,
> = [WritableComputedRef<Props[Key]>, (value: Props[Key]) => void];

type ModelValuePropKey = 'modelValue';

export const useNormalModel = <
    Props extends Record<string, any>,
    Key extends Extract<
        keyof Props | ModelValuePropKey,
        string
    > = ModelValuePropKey,
>(
    props: Props,
    emit: (eventName: string, ...args: any[]) => void,
    config: {
        prop?: Key;
        isEqual?: boolean;
        deep?: boolean;
        defaultValue?: Props[Key];
    } = {},
): [WritableComputedRef<Props[Key]>, (val: Props[Key]) => void] => {
    const {
        prop = 'modelValue',
        deep = false,
        isEqual = false,
        defaultValue,
    } = config;
    const usingProp = prop as Key; // 实际使用中 'modelValue' 本就应该在 Key 中
    // NOTE: 不可以使用 ref<Type> 的写法，currentValue 会被直接推导成 Props[Key]
    const currentValue: Ref<Props[Key]> = ref(
        !isUndefined(props[usingProp]) ? props[usingProp] : defaultValue,
    );
    const pureUpdateCurrentValue = (value: Props[Key]) => {
        if (
            value === currentValue.value ||
            (isEqual && isEqualFunc(value, currentValue.value))
        ) {
            return;
        }
        currentValue.value = value;
    };

    const updateCurrentValue = (value: Props[Key]) => {
        pureUpdateCurrentValue(value);
        emit(`update:${usingProp}`, currentValue.value);
    };

    watch(
        () => props[usingProp],
        (val) => {
            if (val === currentValue.value) {
                return;
            }
            currentValue.value = val;
        },
        {
            deep,
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

type UseNormalModelOptions = {
    prop?: string;
    isEqual?: boolean;
    deep?: boolean;
    defaultValue?: any;
};

export const useArrayModel = (
    props: Record<string, any>,
    emit: any,
    config: UseNormalModelOptions = {},
): [WritableComputedRef<any>, (val: any) => void] => {
    const [computedValue, updateCurrentValue] = useNormalModel(props, emit, {
        ...config,
        defaultValue: [],
    });
    if (!isArray(computedValue.value)) {
        console.warn(
            '[useArrayModel] 绑定值类型不匹配, 仅支持数组类型, value:',
            props[config?.prop || 'modelValue'],
        );
        updateCurrentValue([]);
    }

    const updateItem = (value: any) => {
        if (isArray(value)) {
            updateCurrentValue(value);
            return;
        }
        const val = [...computedValue.value];
        const index = val.indexOf(value);
        if (index !== -1) {
            val.splice(index, 1);
        } else {
            val.push(value);
        }
        updateCurrentValue(val);
    };

    return [computedValue, updateItem];
};
