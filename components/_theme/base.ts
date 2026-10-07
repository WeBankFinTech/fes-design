import { fade, shade, tint } from './colors/colorFunc';
import type { Theme } from './interface';

/**
 * 派生函数分派：暗色模式下按「语义」而非机械 tint↔shade 互换。
 *
 * tint(c, amount) = amount 份白 + (1-amount) 份 c（向白混合）
 * shade(c, amount) = amount 份黑 + (1-amount) 份 c（向黑混合）
 * fade(c, amount) = c 的 alpha 通道
 *
 * 派生变量分三类（暗色下的正确行为）：
 *
 * 1. 灰阶淡化系（边框/次级文字/禁用——亮色向白淡出）：
 *    暗色下应向黑淡出 → tint 换 shade。
 *    亮度梯度方向保持一致：亮色下 ratio 越大越浅，
 *    暗色下 ratio 越大越深。
 *
 * 2. hover/active 强调系（亮色下 shade 加深表示按下、tint 提亮表示悬浮）：
 *    暗色下加深不可见，统一反转为提亮 → shade 换 tint，
 *    tint 保持 tint（本来就向白）。
 *
 * 3. fade 透明度系（遮罩/阴影/滚动条——锚定深色底色）：
 *    暗色下锚定 #0f1222，否则浅色底 fade 出来发灰发亮。
 */
function derivePair(theme: string) {
    const isDark = theme === 'dark';
    return {
        // 灰阶淡化系
        gray: isDark
            ? (color: string, amount: number) => shade(color, amount)
            : tint,
        // hover/active 强调系
        emphasis: isDark
            ? (color: string, amount: number) => tint(color, amount)
            : tint,
        // 按下加深（暗色反转为提亮）
        press: isDark
            ? (color: string, amount: number) => tint(color, amount)
            : shade,
        // fade 透明度系
        fade: isDark
            ? (color: string, amount: number) => fade('#0f1222', amount)
            : fade,
    };
}

function getDefaultThemeBase(fontColorBase = '#0f1222') {
    return {
        primaryColor: '#5384ff',

        successColor: '#00cb91',
        dangerColor: '#ff4d4f',
        warningColor: '#f29360',
        tipColor: '#5384ff',

        white: '#fff',
        black: '#000',

        bodyBgColor: '#fff',

        fontColorBase,
        fontSizeBase: '14px',

        borderRadiusBase: '4px',
        borderRadiusSm: '2px',
        borderWidthBase: '1px',
        borderStyleBase: 'solid',

        shadowRadius: '12px',
        shadowRadiusSm: '4px',

        paddingLarge: '24px',
        paddingMiddle: '16px',
        paddingSmall: '12px',
        paddingXsmall: '8px',
    };
}

export type TThemeVars = ReturnType<typeof baseTheme>;

export const baseTheme = (themeOverrides: Theme = {}, theme?: string) => {
    const { gray, emphasis, press, fade } = derivePair(theme ?? '');
    const base = Object.assign(
        getDefaultThemeBase(themeOverrides.common?.fontColorBase),
        themeOverrides.common,
    );
    // 派生链中间值（保持 main 的别名传导与覆盖能力：这几个变量
    // 在 main 里位于 getDefaultThemeBase，可被 themeOverrides.common
    // 覆盖；用户覆盖时 base 上已是覆盖值，直接沿用）
    const shadowColorSm = base.shadowColorSm ?? fade(base.fontColorBase, 0.2);
    const maskColor = base.maskColor ?? fade(base.fontColorBase, 0.45);
    const borderColorBase = base.borderColorBase ?? gray(base.fontColorBase, 0.8);
    const maskDarkColor = base.maskDarkColor ?? fade(base.fontColorBase, 0.9);
    return {
        ...base,

        linkColor: base.primaryColor,

        // 表面色：组件背景语义变量（暗色主题翻转为深灰表面；
        // 亮色路径保持 main 原有 tint 派生不变，避免线上外观回归）
        componentBgColor:
            theme === 'dark' ? '#1f1f1f' : tint(base.fontColorBase, 0.97),

        borderColorBase,

        shadowColor: fade(base.fontColorBase, 0.1),
        shadowColorSm,

        maskColor,
        maskDarkColor,

        // 浅色悬浮底（亮色 94% 白混合 → 暗色换 gray 成 94% 黑混合深底）
        hoverColorBase: emphasis(base.primaryColor, 0.2),
        hoverColorLight: gray(base.primaryColor, 0.94),

        hoverSuccessColor: gray(base.successColor, 0.94),
        activeSuccessColor: press(base.successColor, 0.06),
        hoverSuccessTextColor: emphasis(base.successColor, 0.2),

        hoverWarningColor: gray(base.warningColor, 0.94),
        activeWarningColor: press(base.warningColor, 0.06),
        hoverWarningTextColor: emphasis(base.warningColor, 0.2),

        hoverDangerColor: gray(base.dangerColor, 0.94),
        activeDangerColor: press(base.dangerColor, 0.06),
        hoverDangerTextColor: emphasis(base.dangerColor, 0.2),

        activeColor: press(base.primaryColor, 0.06),
        focusColor: base.primaryColor,
        focusShadowColor: gray(base.primaryColor, 0.8),
        focusDangerShadowColor: gray(base.dangerColor, 0.8),

        processingColor: emphasis(base.primaryColor, 0.4),

        disabledColorBase: gray(base.fontColorBase, 0.8),
        disabledColorLight: gray(base.fontColorBase, 0.97),

        headColor: base.fontColorBase,
        subHeadColor: gray(base.fontColorBase, 0.35),
        textColor: base.fontColorBase,
        textColorSecondary: gray(base.fontColorBase, 0.55),
        textColorDisabled: gray(base.fontColorBase, 0.7),
        textColorDisabledLight: gray(base.fontColorBase, 0.8),
        textColorCaption: gray(base.fontColorBase, 0.8),
        hoverBaseTextColor: emphasis(base.fontColorBase, 0.2),

        borderColorDisabled: gray(base.fontColorBase, 0.8),
        borderColorSplit: gray(base.fontColorBase, 0.9),
        borderColorInverse: base.white,
        borderBase: `${base.borderWidthBase} ${base.borderStyleBase} ${borderColorBase}`,

        // 反转布局底色（亮色近黑 → 暗色下用中灰保持区分）
        layoutInvertedBgColor:
            theme === 'dark' ? '#262626' : tint(base.fontColorBase, 0.05),

        // tooltip 气泡底：两种主题都保持深底（白字可读）
        tooltipTextBgColor:
            theme === 'dark' ? '#3a3a3c' : tint(base.fontColorBase, 0.3),

        selectTriggerIconColor: gray(base.fontColorBase, 0.6),

        scrollbarBgColor: fade(base.fontColorBase, 0.25),
        scrollbarActiveColor: fade(base.fontColorBase, 0.65),

        // 轮播箭头底色保持 main 的别名链（shadowColorSm/maskColor），
        // 用户覆盖这两个变量时继续传导到轮播箭头
        carouselColor: shadowColorSm,
        carouselHoverColor: maskColor,
        carouselActiveColor: fade(base.fontColorBase, 0.65),

        ...themeOverrides.derivedColor,
    };
};
