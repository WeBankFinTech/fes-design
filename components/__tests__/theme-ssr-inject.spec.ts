import { describe, expect, test } from 'vitest';
import { baseTheme } from '../_theme/base';
import { applyTheme, getThemeStyleTag, getThemeVarsCss } from '../_theme/applyTheme';
import type { Theme } from '../_theme/interface';

const CSS_VAR_RE = /^--f-[a-z0-9-]+:.+$/;

describe('SSR 主题变量注入（getThemeVarsCss / getThemeStyleTag）', () => {
    test('输出形如 --f-xxx:value; 的声明序列，覆盖全部基础变量', () => {
        const css = getThemeVarsCss();
        const entries = css.split(';').filter(Boolean);
        expect(entries.length).toBe(Object.keys(baseTheme()).length);
        entries.forEach((entry) => {
            expect(entry).toMatch(CSS_VAR_RE);
        });
    });

    test('包含关键主题变量且值正确', () => {
        const css = getThemeVarsCss();
        expect(css).toContain('--f-primary-color:#5384ff');
        expect(css).toContain('--f-white:#fff');
        expect(css).toContain('--f-border-radius-base:4px');
    });

    test('getThemeStyleTag 输出完整可用的 <style> 标签', () => {
        const tag = getThemeStyleTag();
        expect(tag.startsWith('<style>:root{--f-')).toBe(true);
        expect(tag.endsWith('}</style>')).toBe(true);
        // 内容与 getThemeVarsCss 一致
        expect(tag).toBe(`<style>:root{${getThemeVarsCss()}}</style>`);
    });

    test('与 applyTheme 的 DOM 写入完全一致（同一数据源同一规则）', () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        applyTheme(div);

        const domVars = new Map<string, string>();
        for (let i = 0; i < div.style.length; i++) {
            const name = div.style.item(i);
            domVars.set(name, div.style.getPropertyValue(name));
        }

        const cssVars = new Map<string, string>();
        getThemeVarsCss()
            .split(';')
            .filter(Boolean)
            .forEach((entry) => {
                const idx = entry.indexOf(':');
                cssVars.set(entry.slice(0, idx), entry.slice(idx + 1));
            });

        expect(cssVars.size).toBe(domVars.size);
        cssVars.forEach((value, name) => {
            expect(domVars.get(name)).toBe(value);
        });
        div.remove();
    });

    test('支持 themeOverrides 定制（与 applyTheme 定制路径一致）', () => {
        const overrides: Theme = { common: { primaryColor: '#ff0000' } };
        const css = getThemeVarsCss(overrides);
        expect(css).toContain('--f-primary-color:#ff0000');

        const div = document.createElement('div');
        document.body.appendChild(div);
        applyTheme(div, undefined, overrides);
        expect(div.style.getPropertyValue('--f-primary-color')).toBe('#ff0000');
        div.remove();
    });
});
