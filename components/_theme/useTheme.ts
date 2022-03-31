import { Ref, ref, watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme, TThemeVars } from './base';

function _useTheme() {
    const config = useConfig();
    const themeVars: Ref<TThemeVars> = ref(baseTheme());

    watch(
        [config.getContainer, config.theme, config.themeOverrides],
        () => {
            const { themeVars: currentThemeVars } = applyTheme(
                config.getContainer?.value(),
                config.theme?.value,
                config.themeOverrides?.value,
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
