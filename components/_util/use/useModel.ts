import { ref, watch, computed, type WritableComputedRef, type Ref } from 'vue';
import { isEqual as isEqualFunc, isArray, isUndefined } from 'lodash-es';

type ModelValuePropKey = 'modelValue';

type UseNormalModelOptions<
    Props extends Record<string, any>,
    Key extends keyof Props,
> = {
    prop?: Key;
    isEqual?: boolean;
    deep?: boolean;
    defaultValue?: Props[Key];
};

export const useNormalModel = <
    Props extends Record<string, any>,
    Key extends Extract<
        keyof Props | ModelValuePropKey,
        string
    > = ModelValuePropKey,
    EventName extends string = string,
>(
    props: Props,
    emit: (eventName: EventName, ...args: any[]) => void,
    config: UseNormalModelOptions<Props, Key> = {},
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
        // TODO: need a more proper way instead of `as`
        emit(`update:${usingProp}` as EventName, currentValue.value);
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

type ArrayOrItem<T> = [T] extends [unknown[]] ? T | T[number] : T[] | T;
// type IncludeArray<U> = U extends unknown[] ? U : never;
// type ExtractArray<U> = U extends unknown[] ? U : never;
type GetKeysIsArrayType<Props> = keyof {
    [Key in keyof Props as Props[Key] extends unknown[]
        ? Key
        : never]: Props[Key];
};
/**
 * TODO: 后续优化
 * 使得 useArrayModel 在不传 config 使用 modelValue，且 modelValue 的类型不为数组的情况下，有更友好的类型报错提示
 * 目前在上述情况下，modelValue 的类型被推导为 never，保证了部分场景。
 */
/* type UseArrayModelReturn<
    Props extends Record<string, any>,
    Key extends keyof Props,
> = Props[Key] extends never
    ? never
    : [WritableComputedRef<Props[Key]>, (val: ArrayOrItem<Props[Key]>) => void]; */

export const useArrayModel = <
    Props extends Record<string, any>,
    Key extends Extract<
        Extract<keyof Props | ModelValuePropKey, string>,
        GetKeysIsArrayType<Props>
    > = Extract<ModelValuePropKey, GetKeysIsArrayType<Props>>,
    EventName extends string = string,
>(
    props: Props,
    emit: (eventName: EventName, ...args: any[]) => void,
    config: UseNormalModelOptions<Props, Key> = {},
): [
    WritableComputedRef<Props[Key]>,
    (val: ArrayOrItem<Props[Key]>) => void,
] => {
    const [computedValue, updateCurrentValue] = useNormalModel(props, emit, {
        ...config,
        defaultValue: [] as Props[Key],
    });
    if (!isArray(computedValue.value)) {
        console.warn(
            '[useArrayModel] 绑定值类型不匹配, 仅支持数组类型, value:',
            props[config?.prop || 'modelValue'],
        );
        updateCurrentValue([] as Props[Key]);
    }

    const updateItem = (value: ArrayOrItem<Props[Key]>) => {
        if (isArray(value)) {
            updateCurrentValue(value as Props[Key]);
            return;
        }
        const val = [...computedValue.value];
        const index = val.indexOf(value);
        if (index !== -1) {
            val.splice(index, 1);
        } else {
            val.push(value);
        }
        updateCurrentValue(val as Props[Key]);
    };

    return [computedValue, updateItem];
};
