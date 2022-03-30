import { Ref, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme, TThemeVars } from './base';

function _useTheme() {
    const config = useConfig();
    const themeVars: Ref<TThemeVars> = ref(baseTheme());

    watch(
        config,
        () => {
            const { themeVars: currentThemeVars } = applyTheme(
                config.value.getContainer(),
                config.value.theme,
                config.value.themeOverrides,
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
