import { type Ref, onBeforeMount, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme } from './base';
import type { TThemeVars } from './base';

function _useTheme() {
    // TODO: theme 和当前组件 config provider 的 getContainer 关联，目前只有第一个调用 useTheme 的组件生效
    const config = useConfig();
    const themeVars: Ref<TThemeVars> = ref(baseTheme());

    // 参考 naive-ui src/_mixins/use-theme.ts 的 SSR 处理：
    // DOM 写入不在 setup 期 immediate watch 里同步执行，而是挪进
    // onBeforeMount——服务端渲染不执行生命周期钩子，结构性避免崩溃。
    onBeforeMount(() => {
        watch(
            [
                () => config.getContainer?.value,
                () => config.theme?.value,
                () => config.themeOverrides?.value,
            ],
            ([getContainer, theme, themeOverrides]) => {
                if (!getContainer) {
                    return;
                }
                const { themeVars: currentThemeVars } = applyTheme(
                    getContainer(),
                    theme,
                    themeOverrides,
                );
                themeVars.value = currentThemeVars;
            },
            { immediate: true },
        );
    });

    return {
        config,
        themeVars,
    };
}

export const useTheme = createSharedComposable(_useTheme);
