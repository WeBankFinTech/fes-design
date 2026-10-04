import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';
import type { Theme } from './interface';
import { isServer } from '../_util/isServer';

const CSS_VAR_PREFIX = '--f-';
export function applyTheme(
    container: HTMLElement,
    theme?: string,
    themeOverrides?: Theme,
) {
    const _theme = baseTheme(themeOverrides);
    // SSR：无 DOM 可写，直接返回变量表（主题变量只在客户端注入；
    // 此处不守卫会在 container 为空时经 document.body 回退再崩一次）
    if (isServer) {
        return {
            themeVars: _theme,
        };
    }
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
