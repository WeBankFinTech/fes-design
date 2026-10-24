import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';
import { darkThemeOverrides } from './dark';
import type { Theme } from './interface';

const CSS_VAR_PREFIX = '--f-';

/**
 * 将主题名映射为主题覆盖预设。
 * dark 预设提供灰阶基色翻转；用户 themeOverrides 优先级更高，
 * 覆盖 common 中同名变量。
 */
export function resolveThemePreset(theme?: string): Theme {
    if (theme === 'dark') {
        return darkThemeOverrides;
    }
    return {};
}

export function mergeThemeOverrides(
    theme: string | undefined,
    themeOverrides?: Theme,
): Theme {
    const preset = resolveThemePreset(theme);
    return {
        common: {
            ...preset.common,
            ...themeOverrides?.common,
        },
        derivedColor: {
            ...preset.derivedColor,
            ...themeOverrides?.derivedColor,
        },
    };
}

export function applyTheme(
    container: HTMLElement,
    theme?: string,
    themeOverrides?: Theme,
) {
    const merged = mergeThemeOverrides(theme, themeOverrides);
    const _theme = baseTheme(merged, theme);
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

/**
 * SSR 输出：生成主题 CSS 变量的 style 标签字符串。
 *
 * 客户端由 useTheme 在组件挂载后注入变量，SSR 首屏会在
 * 挂载前以默认亮色渲染造成暗色主题闪白。在入口 HTML
 * head 中插入本函数输出可消除闪烁：
 *
 *   ${getThemeStyleTag('dark')}
 *
 * selector 传空时变量挂在 :root；传容器选择器（如 '.fes-dark'）
 * 时挂在该容器上，与客户端 ConfigProvider getContainer 对应。
 */
export function getThemeStyleTag(
    theme?: string,
    themeOverrides?: Theme,
    selector = ':root',
): string {
    const merged = mergeThemeOverrides(theme, themeOverrides);
    const vars = baseTheme(merged, theme);
    const decls = Object.keys(vars)
        .map(
            (key) =>
                `  ${CSS_VAR_PREFIX}${kebabCase(key)}: ${vars[key as keyof typeof vars]};`,
        )
        .join('\n');
    return `<style>\n${selector} {\n${decls}\n}\n</style>`;
}
