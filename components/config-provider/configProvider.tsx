import {
    ref,
    defineComponent,
    provide,
    inject,
    toRefs,
    getCurrentInstance,
} from 'vue';
import { defaultContainer } from '../_util/utils';
import { CONFIG_PROVIDER_INJECTION_KEY, configProviderProps } from './const';

export function useConfig() {
    // 当不在vue实例使用时
    const vm = getCurrentInstance();
    if (!vm) {
        return {};
    }
    const providerConfig = inject(CONFIG_PROVIDER_INJECTION_KEY, {
        getContainer: ref(defaultContainer),
    });
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
