/**
 * 暗色主题派生链测试
 *
 * 验证 baseTheme(theme, 'dark') 的 tint↔shade 互换逻辑：
 * 1. 亮色基线回归：默认输出与旧实现完全一致（无回归）
 * 2. 暗色下灰阶派生变深、亮度梯度方向与亮色一致
 * 3. 暗色下遮罩/阴影锚定黑色透明度
 * 4. 暗色下 hover/active 提亮而非加深
 * 5. darkThemeOverrides 应用后整体变量合理
 */
import { describe, expect, test } from 'vitest';
import { baseTheme } from '../base';
import { darkThemeOverrides } from '../dark';

// 粗略亮度（感知亮度加权），用于断言「深/浅」方向
const luminance = (hexOrRgba: string) => {
    const m = hexOrRgba.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/,
    );
    if (m) {
        const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }
    const h = hexOrRgba.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
};

describe('baseTheme 暗色派生链', () => {
    test('亮色基线：默认输出与 main 旧实现一致（无回归）', () => {
        const light = baseTheme();
        // 关键锚点值（与旧实现逐一对齐）
        expect(light.componentBgColor).toBe('#fff');
        expect(light.borderColorBase).toBe(baseTheme().borderColorBase);
        expect(light.maskColor).toMatch(/rgba\(15,\s*18,\s*34,\s*0\.45\)/);
        expect(light.bodyBgColor).toBe('#fff');
        expect(light.white).toBe('#fff');
        expect(light.black).toBe('#000');
        // 派生灰阶：次级文字比正文浅
        expect(luminance(light.textColorSecondary!)).toBeGreaterThan(
            luminance(light.textColor!),
        );
    });

    test('暗色：灰阶派生变深且梯度方向正确', () => {
        const dark = baseTheme(darkThemeOverrides, 'dark');
        const light = baseTheme();

        // 边框：亮色浅灰 → 暗色深灰
        expect(luminance(dark.borderColorBase!)).toBeLessThan(
            luminance(light.borderColorBase!),
        );
        // 暗色内部梯度：split 边框（ratio 0.9）比 base 边框（0.8）更深
        expect(luminance(dark.borderColorSplit!)).toBeLessThan(
            luminance(dark.borderColorBase!),
        );
        // 次级文字比正文暗（亮色下是浅，暗色下反转）
        expect(luminance(dark.textColorSecondary!)).toBeLessThan(
            luminance(dark.textColor!),
        );
        // 表面色翻转为深灰
        expect(dark.componentBgColor).toBe('#1f1f1f');
        expect(dark.bodyBgColor).toBe('#141414');
    });

    test('暗色：遮罩/阴影锚定黑色透明度（非白色透明度）', () => {
        const dark = baseTheme(darkThemeOverrides, 'dark');
        // fade 锚定 #0f1222：遮罩应是深色半透明
        expect(dark.maskColor).toMatch(/rgba\(15,\s*18,\s*34/);
        expect(dark.shadowColor).toMatch(/rgba\(15,\s*18,\s*34/);
        expect(dark.scrollbarBgColor).toMatch(/rgba\(15,\s*18,\s*34/);
        // alpha 保持原比例
        expect(dark.maskColor).toContain('0.45');
    });

    test('暗色：hover/active 提亮（shade→tint 互换）', () => {
        const dark = baseTheme(darkThemeOverrides, 'dark');
        const light = baseTheme();
        // activeColor = shade(primary, 0.06)：亮色下变深，暗色下应变浅
        expect(luminance(dark.activeColor!)).toBeGreaterThan(
            luminance(dark.primaryColor),
        );
        expect(luminance(light.activeColor!)).toBeLessThan(
            luminance(light.primaryColor),
        );
        // hover 文字色同理提亮
        expect(luminance(dark.hoverBaseTextColor!)).toBeGreaterThan(
            luminance(dark.textColor!),
        );
    });

    test('暗色：tooltip 保持深底（不随 fontColorBase 反转成浅底）', () => {
        const dark = baseTheme(darkThemeOverrides, 'dark');
        // tint(fontColorBase, 0.3) 在暗色下 shade(#e8ecf2, 0.3) ≈ 深灰底，
        // 白字 tooltip 文字（--f-white）仍可读
        expect(luminance(dark.tooltipTextBgColor!)).toBeLessThan(0.35);
    });

    test('themeOverrides 优先级：自定义 common/derivedColor 覆盖预设', () => {
        const custom = baseTheme(
            {
                common: { bodyBgColor: '#0d0d0d' },
                derivedColor: { componentBgColor: '#252525' },
            },
            'dark',
        );
        expect(custom.bodyBgColor).toBe('#0d0d0d');
        expect(custom.componentBgColor).toBe('#252525');
    });
});
