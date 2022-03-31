import {
    defineComponent,
    provide,
    inject,
    ref,
    toRefs,
    ToRefs,
    getCurrentInstance,
} from 'vue';

import { CONFIG_PROVIDER_INJECTION_KEY, configProviderProps } from './const';
import type { ConfigProviderContextType } from './const';

export function useConfig() {
    // 当不在vue实例使用时
    const vm = getCurrentInstance();
    if (!vm) {
        return {};
    }
    const providerConfig: ToRefs<ConfigProviderContextType> = inject(
        CONFIG_PROVIDER_INJECTION_KEY,
        {},
    );
    if (!providerConfig.getContainer) {
        providerConfig.getContainer = ref(() => {
            return document.body;
        });
    }
    return providerConfig;
}

export default defineComponent({
    name: 'FConfigProvider',
    props: configProviderProps,
    setup(props, { slots }) {
        // 兼容子组件局部设置
        provide(CONFIG_PROVIDER_INJECTION_KEY, toRefs(props));

        return () => slots.default?.();
    },
});
