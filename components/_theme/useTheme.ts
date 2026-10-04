import { type Ref, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme } from './base';
import type { TThemeVars } from './base';
import { isServer } from '../_util/isServer';

function _useTheme() {
    // TODO: theme 和当前组件 config provider 的 getContainer 关联，目前只有第一个调用 useTheme 的组件生效
    const config = useConfig();
    const themeVars: Ref<TThemeVars> = ref(baseTheme());

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
            // SSR：无 DOM，主题变量只在客户端写入（setup 期 immediate watch
            // 同步执行，不守卫会让任何组件在服务端渲染即抛 ReferenceError）
            if (isServer) {
                return;
            }
            const { themeVars: currentThemeVars } = applyTheme(
                getContainer(),
                theme,
                themeOverrides,
            );
            themeVars.value = currentThemeVars;
        },
        {
            immediate: true,
        },
    );

    return {
        config,
        themeVars,
    };
}

export const useTheme = createSharedComposable(_useTheme);
