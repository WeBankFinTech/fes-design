import { type Ref, ref, watch } from 'vue';

import { tryOnMounted } from '@vueuse/core';
import { useConfig } from '../config-provider';
import { applyTheme } from './applyTheme';
import { baseTheme } from './base';
import type { TThemeVars } from './base';

function _useTheme() {
    const config = useConfig();
    const themeVars: Ref<TThemeVars> = ref(baseTheme());

    const handleApplyTheme = () => {
        const getContainer = config.getContainer?.value;
        const theme = config.theme?.value;
        const themeOverrides = config.themeOverrides?.value;

        if (!getContainer) {
            return;
        }

        const { themeVars: currentThemeVars } = applyTheme(
            getContainer(),
            theme,
            themeOverrides,
        );
        themeVars.value = currentThemeVars;
    };

    watch(
        [
            () => config.getContainer?.value,
            () => config.theme?.value,
            () => config.themeOverrides?.value,
        ],
        () => {
            handleApplyTheme();
        },
        {
            immediate: false,
        },
    );

    tryOnMounted(() => {
        handleApplyTheme();
    });

    return {
        config,
        themeVars,
    };
}

export const useTheme = _useTheme;
