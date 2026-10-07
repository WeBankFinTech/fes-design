/**
 * 亮色路径逐变量对照：main 版 baseTheme 输出 vs 重写版输出
 * 用 main 的公式（git show main:components/_theme/base.ts）逐变量复刻，
 * 断言亮色路径零回归——任何派生链重写都不得改变亮色输出。
 */
import { describe, expect, test } from 'vitest';
import { fade, shade, tint } from '../colors/colorFunc';
import { baseTheme } from '../base';

const F = '#0f1222';
const P = '#5384ff';

describe('亮色路径零回归（对照 main 公式逐变量）', () => {
    test('main 版全部派生变量与重写版完全一致', () => {
        const branch = baseTheme(); // 亮色
        // —— main 的公式复刻 ——
        const main = {
            linkColor: P,
            componentBgColor: tint(F, 0.97),
            hoverColorBase: tint(P, 0.2),
            hoverColorLight: tint(P, 0.94),
            hoverSuccessColor: tint('#00cb91', 0.94),
            activeSuccessColor: shade('#00cb91', 0.06),
            hoverSuccessTextColor: tint('#00cb91', 0.2),
            hoverWarningColor: tint('#f29360', 0.94),
            activeWarningColor: shade('#f29360', 0.06),
            hoverWarningTextColor: tint('#f29360', 0.2),
            hoverDangerColor: tint('#ff4d4f', 0.94),
            activeDangerColor: shade('#ff4d4f', 0.06),
            hoverDangerTextColor: tint('#ff4d4f', 0.2),
            activeColor: shade(P, 0.06),
            focusColor: P,
            focusShadowColor: tint(P, 0.8),
            focusDangerShadowColor: tint('#ff4d4f', 0.8),
            processingColor: tint(P, 0.4),
            disabledColorBase: tint(F, 0.8),
            disabledColorLight: tint(F, 0.97),
            headColor: F,
            subHeadColor: tint(F, 0.35),
            textColor: F,
            textColorSecondary: tint(F, 0.55),
            textColorDisabled: tint(F, 0.7),
            textColorDisabledLight: tint(F, 0.8),
            textColorCaption: tint(F, 0.8),
            hoverBaseTextColor: tint(F, 0.2),
            borderColorDisabled: tint(F, 0.8),
            borderColorSplit: tint(F, 0.9),
            borderColorInverse: '#fff',
            borderBase: `1px solid ${tint(F, 0.8)}`,
            layoutInvertedBgColor: tint(F, 0.05),
            tooltipTextBgColor: tint(F, 0.3),
            selectTriggerIconColor: tint(F, 0.6),
            scrollbarBgColor: fade(F, 0.25),
            scrollbarActiveColor: fade(F, 0.65),
            // main 中为别名引用：carouselColor=shadowColorSm、carouselHoverColor=maskColor
            carouselColor: fade(F, 0.2),
            carouselHoverColor: fade(F, 0.45),
            carouselActiveColor: fade(F, 0.65),
        } as Record<string, string>;

        const diffs: string[] = [];
        for (const k of Object.keys(main)) {
            if ((branch as any)[k] !== main[k]) {
                diffs.push(`${k}: main=${main[k]} branch=${(branch as any)[k]}`);
            }
        }
        // 亮色路径与 main 完全一致（零回归）
        expect(diffs).toEqual([]);
    });

    test('别名传导：覆盖 common.shadowColorSm / maskColor 联动轮播箭头色', () => {
        // main 的 carouselColor 是 shadowColorSm 的别名——用户覆盖后必须传导
        const themed = baseTheme({
            common: { shadowColorSm: 'rgba(1, 2, 3, 0.5)' },
        } as any);
        expect(themed.carouselColor).toBe('rgba(1, 2, 3, 0.5)');

        const themed2 = baseTheme({
            common: { maskColor: 'rgba(4, 5, 6, 0.7)' },
        } as any);
        expect(themed2.carouselHoverColor).toBe('rgba(4, 5, 6, 0.7)');
    });

    test('覆盖传导：maskDarkColor / borderColorBase 恢复 main 的可覆盖语义', () => {
        // main 里这两个变量在 getDefaultThemeBase（可被 common 覆盖），
        // 重写后必须保持覆盖能力
        const themed = baseTheme({
            common: { maskDarkColor: 'rgba(7, 7, 7, 0.9)' },
        } as any);
        expect(themed.maskDarkColor).toBe('rgba(7, 7, 7, 0.9)');

        const themed2 = baseTheme({
            common: { borderColorBase: '#abcabc' },
        } as any);
        expect(themed2.borderColorBase).toBe('#abcabc');
        // borderBase 字符串模板引用覆盖后的 borderColorBase
        expect(themed2.borderBase).toContain('#abcabc');
    });
});
