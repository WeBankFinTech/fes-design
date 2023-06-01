import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';
import type { Theme } from './interface';

const CSS_VAR_PREFIX = '--f-';
export function applyTheme(
    container: HTMLElement,
    theme?: string,
    themeOverrides?: Theme,
) {
    // TODO 逻辑优化
    const _theme = baseTheme(themeOverrides);
    const _container = container || document.body;
    Object.keys(_theme).forEach((key) => {
        _container.style.setProperty(
            `${CSS_VAR_PREFIX}${kebabCase(key)}`,
            _theme[key as keyof typeof _theme],
        );
    });

    return {
        themeVars: _theme,
    };
}
