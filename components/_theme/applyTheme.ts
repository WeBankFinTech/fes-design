import { kebabCase } from 'lodash-es';
import { baseTheme } from './base';
import type { Theme } from './interface';

const CSS_VAR_PREFIX = '--f-';

// 变量声明文本（"--f-primary-color:#5384ff"），applyTheme 的 DOM 写入与
// getThemeVarsCss 的 SSR 注入共用同一生成逻辑，确保两条路径值完全一致
const themeVarsEntries = (themeOverrides?: Theme) => {
    const vars = baseTheme(themeOverrides);
    return Object.keys(vars).map((key) => ({
        name: `${CSS_VAR_PREFIX}${kebabCase(key)}`,
        value: vars[key as keyof typeof vars],
    }));
};

export function applyTheme(
    container: HTMLElement,
    theme?: string,
    themeOverrides?: Theme,
) {
    const entries = themeVarsEntries(themeOverrides);
    const _theme = baseTheme(themeOverrides);
    const _container = container || document.body;
    entries.forEach(({ name, value }) => {
        _container.style.setProperty(name, value);
    });

    return {
        themeVars: _theme,
    };
}

/**
 * 生成主题 CSS 变量的声明文本（不含选择器与花括号），如：
 * `--f-primary-color:#5384ff;--f-white:#fff;...`
 *
 * 服务端渲染场景使用：fes-design 的主题变量默认值由运行时 applyTheme
 * 写入 DOM（非编译期 CSS），纯 SSR 首帧 JS 未执行时 var(--f-*) 解析
 * 不到值，页面呈无主题色的素颜状态（FOUC）。在 SSR 模板里把本函数
 * 输出注入 <head> 可让首帧即带主题：
 *
 * ```html
 * <style>:root{ { getThemeVarsCss() } }</style>
 * ```
 *
 * Nuxt（app.vue 或 layout）：
 * ```vue
 * <template>
 *   <div>
 *     <component :is="'style'">:root{ { themeVars } }</component>
 *     <NuxtLayout />
 *   </div>
 * </template>
 * <script setup>
 * import { getThemeVarsCss } from 'fes-design';
 * const themeVars = getThemeVarsCss();
 * </script>
 * ```
 */
export function getThemeVarsCss(themeOverrides?: Theme) {
    return themeVarsEntries(themeOverrides)
        .map(({ name, value }) => `${name}:${value};`)
        .join('');
}

/**
 * 生成完整的 <style> 标签字符串（含 :root 选择器），等价于
 * getThemeVarsCss 的便捷包装，可直接拼进 SSR HTML 的 <head>：
 *
 * `const head = `<head>${getThemeStyleTag()}</head>``
 */
export function getThemeStyleTag(themeOverrides?: Theme) {
    return `<style>:root{${getThemeVarsCss(themeOverrides)}}</style>`;
}
