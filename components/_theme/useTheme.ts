import { Ref, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme } from './base';
import type { TThemeVars } from './base';

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
            if (!getContainer) return;
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
