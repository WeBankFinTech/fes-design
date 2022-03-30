import {
    defineComponent,
    reactive,
    provide,
    inject,
    toRef,
    Ref,
    computed,
    ComputedRef,
    getCurrentInstance,
} from 'vue';
import { isObject, isNil } from 'lodash-es';

import { hasOwn } from '../_util/utils';
import { CONFIG_PROVIDER_INJECTION_KEY, configProviderProps } from './const';
import type { TypeConfigProviderContext } from './const';
import { provideLocale } from './useLocale';

const globalConfig = reactive<TypeConfigProviderContext>({
    getContainer: () => document.body,
});

// // 全局设置
// export const setConfig = (data: TypeConfigProviderContext) => {
//     if (isObject(data)) {
//         Object.keys(data).forEach((prop) => {
//             if (!isNil(data[prop as keyof typeof data])) {
//                 (globalConfig as any)[prop] = data[prop as keyof typeof data];
//             }
//         });
//     }
// };

// 局部设置，仅子组件生效
const setProvideConfig = (data: TypeConfigProviderContext) => {
    const providerConfig = reactive<TypeConfigProviderContext>({});
    if (isObject(data)) {
        Object.keys(data).forEach((prop) => {
            if (!isNil(data[prop as keyof typeof data])) {
                (providerConfig as any)[prop] = data[prop as keyof typeof data];
            }
        });
    }
    provide(CONFIG_PROVIDER_INJECTION_KEY, providerConfig);
};

/**
 * 组件中获取配置项，若有局部设置，则取局部设置，若无局部设置，则返回全局设置，为了兼容以下场景：
 *
 *  <config-provider :locale="lang1">
 *      locale for here is lang1.
 *      <config-provider :locale="lang2">
 *          locale for here is lang2.
 *      </config-provider>
 *  </config-provider>
 */
export function useConfig<K extends keyof TypeConfigProviderContext>(
    key: K,
): Ref<TypeConfigProviderContext[K]>;

export function useConfig(): ComputedRef<TypeConfigProviderContext>;

export function useConfig(key?: keyof TypeConfigProviderContext) {
    // 当不在vue实例使用时
    const vm = getCurrentInstance();
    if (!vm) {
        return computed(() => globalConfig);
    }
    const providerConfig = inject(CONFIG_PROVIDER_INJECTION_KEY, null);
    const config = computed(() => {
        if (isObject(providerConfig)) {
            return { ...globalConfig, ...providerConfig };
        } else {
            return globalConfig;
        }
    });

    if (key) {
        if (isObject(providerConfig) && hasOwn(providerConfig, key)) {
            return toRef(providerConfig, key);
        } else {
            return toRef(globalConfig, key);
        }
    } else {
        return config;
    }
}

export default defineComponent({
    name: 'FConfigProvider',
    props: configProviderProps,
    setup(props, { slots }) {
        // 兼容子组件局部设置
        setProvideConfig(props);

        provideLocale(props, useConfig());

        return () => slots.default?.();
    },
});
