import { watch } from 'vue';
import { createSharedComposable } from '@vueuse/core';

import { getConfig } from '../config-provider';
import { applyTheme } from './applyTheme';

function _useTheme() {
    const config = getConfig();

    watch(
        () => {
            applyTheme(
                config.getContainer(),
                config.theme,
                config.themeOverrides,
            );
        },
        {
            immediate: true,
        },
    );

    return config;
}

export const useTheme = createSharedComposable(_useTheme);
