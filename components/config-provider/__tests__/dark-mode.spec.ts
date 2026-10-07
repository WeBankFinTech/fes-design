/**
 * 暗色主题集成测试：FConfigProvider theme="dark" 全链路
 *
 * 验证：
 * 1. CSS 变量注入容器（componentBgColor/bodyBgColor/fontColorBase 翻转）
 * 2. 容器挂 fes-dark class（作用域覆盖钩子）
 * 3. 用户 themeOverrides 优先于 dark 预设
 * 4. theme 切换 dark→light 时变量与 class 同步还原
 * 5. applyTheme 单元行为（预设合并）
 */
import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import FConfigProvider from '../index';
import FButton from '../../button';
import { applyTheme, getThemeStyleTag, resolveThemePreset } from '../../_theme/applyTheme';
import { darkThemeOverrides } from '../../_theme/dark';
import { baseTheme } from '../../_theme/base';

const getVar = (container: HTMLElement, name: string) =>
    container.style.getPropertyValue(name).trim();

describe('FConfigProvider theme="dark"', () => {
    test('CSS 变量翻转 + 容器 fes-dark class', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(FConfigProvider as any, {
            props: {
                theme: 'dark',
                getContainer: () => div,
            },
            slots: { default: () => [h(FButton as any, () => '按钮'), h('div', 'content')] },
            attachTo: div,
        } as any);
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));

        expect(getVar(div, '--f-component-bg-color')).toBe('#1f1f1f');
        expect(getVar(div, '--f-body-bg-color')).toBe('#141414');
        expect(getVar(div, '--f-font-color-base')).toBe('#e8ecf2');
        // 派生链：暗色下边框向黑淡出（深灰）
        const borderColor = getVar(div, '--f-border-color-base');
        expect(borderColor).toBeTruthy();
        expect(borderColor).not.toBe(
            baseTheme().borderColorBase,
        );
        // 遮罩锚定深色
        expect(getVar(div, '--f-mask-color')).toContain('rgba(15, 18, 34');
        // white/black 语义保持（彩底白字不变）
        expect(getVar(div, '--f-white')).toBe('#fff');
        expect(getVar(div, '--f-black')).toBe('#000');
        // 容器 class 钩子
        expect(div.classList.contains('fes-dark')).toBe(true);

        wrapper.unmount();
        div.remove();
    });

    test('themeOverrides 优先于 dark 预设', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(FConfigProvider as any, {
            props: {
                theme: 'dark',
                getContainer: () => div,
                themeOverrides: {
                    common: { bodyBgColor: '#0d0d0d' },
                    derivedColor: { componentBgColor: '#2a2a2a' },
                },
            },
            slots: { default: () => h(FButton as any, () => '按钮') },
            attachTo: div,
        } as any);
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));

        expect(getVar(div, '--f-body-bg-color')).toBe('#0d0d0d');
        expect(getVar(div, '--f-component-bg-color')).toBe('#2a2a2a');
        // 未覆盖的预设仍生效
        expect(getVar(div, '--f-font-color-base')).toBe('#e8ecf2');
        wrapper.unmount();
        div.remove();
    });

    test('切换 theme dark → light 变量与 class 还原', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(FConfigProvider as any, {
            props: { theme: 'dark', getContainer: () => div },
            slots: { default: () => h(FButton as any, () => '按钮') },
            attachTo: div,
        } as any);
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));
        expect(div.classList.contains('fes-dark')).toBe(true);
        expect(getVar(div, '--f-component-bg-color')).toBe('#1f1f1f');

        await wrapper.setProps({ theme: 'light' });
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));
        expect(div.classList.contains('fes-dark')).toBe(false);
        // 亮色恢复 main 的 tint 派生值（tint(#0f1222, 0.97)）
        expect(getVar(div, '--f-component-bg-color')).toBe('#f8f8f8');
        expect(getVar(div, '--f-font-color-base')).toBe('#0f1222');
        wrapper.unmount();
        div.remove();
    });

    test('子组件在 dark 下可读（按钮文字色 = 暗色正文）', async () => {
        const div = document.createElement('div');
        document.body.appendChild(div);
        const wrapper = mount(FConfigProvider as any, {
            props: { theme: 'dark', getContainer: () => div },
            slots: { default: () => h(FButton as any, () => '按钮') },
            attachTo: div,
        } as any);
        await nextTick();
        await new Promise((r) => setTimeout(r, 30));
        // themeVars 注入子组件（FButton 通过 useTheme 读取）
        expect(getVar(div, '--f-text-color')).toBe('#e8ecf2');
        wrapper.unmount();
        div.remove();
    });
});

describe('applyTheme / resolveThemePreset 单元', () => {
    test('resolveThemePreset 返回 dark 预设或空对象', () => {
        expect(resolveThemePreset('dark')).toEqual(darkThemeOverrides);
        expect(resolveThemePreset('light')).toEqual({});
        expect(resolveThemePreset(undefined)).toEqual({});
    });

    test('applyTheme 将变量写到容器 style', () => {
        const div = document.createElement('div');
        const { themeVars } = applyTheme(div, 'dark');
        expect(themeVars.componentBgColor).toBe('#1f1f1f');
        expect(div.style.getPropertyValue('--f-component-bg-color')).toBe(
            '#1f1f1f',
        );
    });

    test('getThemeStyleTag：SSR 首屏防闪白的 style 标签', () => {
        const tag = getThemeStyleTag('dark');
        expect(tag.startsWith('<style>')).toBe(true);
        expect(tag).toContain(':root {');
        expect(tag).toContain('--f-component-bg-color: #1f1f1f;');
        expect(tag).toContain('--f-body-bg-color: #141414;');
        expect(tag).toContain('--f-font-color-base: #e8ecf2;');
        // 自定义 selector + overrides
        const scoped = getThemeStyleTag(
            'dark',
            { common: { bodyBgColor: '#101010' } },
            '.fes-dark',
        );
        expect(scoped).toContain('.fes-dark {');
        expect(scoped).toContain('--f-body-bg-color: #101010;');
        // 亮色默认输出（tint(#0f1222, 0.97) 派生）
        const light = getThemeStyleTag();
        expect(light).toContain('--f-component-bg-color: #f8f8f8;');
    });
});
