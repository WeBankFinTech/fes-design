import {
    defineComponent,
    getCurrentInstance,
    inject,
    nextTick,
    provide,
    ref,
    toRefs,
    watch,
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

        // 主题容器钩子：theme="dark" 时给容器挂 fes-dark class，
        // 供无法变量化的样式（如第三方内容、内联硬编码色）作用域覆盖
        const syncThemeClass = () => {
            const container = props.getContainer?.();
            if (container) {
                container.classList.toggle('fes-dark', props.theme === 'dark');
            }
        };
        watch(
            () => [props.theme, props.getContainer],
            () => nextTick(syncThemeClass),
            { immediate: true },
        );

        return () => slots.default?.();
    },
});
