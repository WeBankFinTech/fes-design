import {
    defineComponent,
    reactive,
    PropType,
    provide,
    inject,
    toRef,
    Ref,
    computed,
    ComputedRef,
} from 'vue';
import { isObject, isNil } from 'lodash-es';

import type { Theme } from '../_theme/interface';
import type { GetContainer } from '../_util/interface';
import {  CONFIG_PROVIDER_INJECTION_KEY } from './const';
import { hasOwn } from '../_util/utils';
import type { TypeLanguage } from '../locales';
import { TypeConfigProviderContext } from './interface';
import { provideLocale } from './useLocale';

export const localeProps = {
    locale: {
        type: Object as PropType<TypeLanguage>,
    },
};

const globalConfig = reactive<TypeConfigProviderContext>({
    getContainer: () => document.body,
});

export const configProviderProps = {
    ...localeProps,

    getContainer: Function as PropType<GetContainer>,
    theme: String,
    themeOverrides: Object as PropType<Partial<Theme>>,
} as const;

// 全局设置
export const setConfig = (data: TypeConfigProviderContext) => {
    if (isObject(data)) {
        Object.keys(data).forEach((prop) => {
            if (!isNil(data[prop as keyof typeof data])) {
                (globalConfig as any)[prop] = data[prop as keyof typeof data];
            }
        });
    }
};

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
export function getConfig<K extends keyof TypeConfigProviderContext>(
    key: K,
): Ref<TypeConfigProviderContext[K]>;
export function getConfig(): ComputedRef<TypeConfigProviderContext>;
export function getConfig(key?: keyof TypeConfigProviderContext) {
    const providerConfig = inject(CONFIG_PROVIDER_INJECTION_KEY, null);
    const config = computed(() => {
        if (isObject(providerConfig)) {
            return {...globalConfig, ...providerConfig};
        } else {
            return globalConfig;
        }
    })

    if (key) {
        if (isObject(providerConfig) && hasOwn(providerConfig, key)) {
            return toRef(providerConfig, key);
        } else {
            return toRef(globalConfig, key);
        }
    } else {
        return config
    }
}

export default defineComponent({
    name: 'FConfigProvider',
    props: configProviderProps,
    setup(props, { slots }) {
        // 兼容子组件局部设置
        setProvideConfig(props);
        
        provideLocale(props)

        return () => slots.default?.();
    },
});
