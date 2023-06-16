import { tint, shade, fade } from './colors/colorFunc';
import type { Theme } from './interface';

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

        borderColorBase: tint(fontColorBase, 0.8),

        shadowColor: fade(fontColorBase, 0.1),
        shadowColorSm: fade(fontColorBase, 0.2),
        shadowRadius: '12px',
        shadowRadiusSm: '4px',

        maskColor: fade(fontColorBase, 0.45),
        maskDarkColor: fade(fontColorBase, 0.9),

        paddingLarge: '24px',
        paddingMiddle: '16px',
        paddingSmall: '12px',
        paddingXsmall: '8px',
    };
}

export type TThemeVars = ReturnType<typeof baseTheme>;

export const baseTheme = (themeOverrides: Theme = {}) => {
    const base = Object.assign(
        getDefaultThemeBase(themeOverrides.common?.fontColorBase),
        themeOverrides.common,
    );
    return {
        ...base,
        linkColor: base.primaryColor,

        componentBgColor: tint(base.fontColorBase, 0.97),

        hoverColorBase: tint(base.primaryColor, 0.2),
        hoverColorLight: tint(base.primaryColor, 0.94),

        hoverSuccessColor: tint(base.successColor, 0.94),
        activeSuccessColor: shade(base.successColor, 0.06),

        hoverWarningColor: tint(base.warningColor, 0.94),
        activeWarningColor: shade(base.warningColor, 0.06),

        hoverDangerColor: tint(base.dangerColor, 0.94),
        activeDangerColor: shade(base.dangerColor, 0.06),

        activeColor: shade(base.primaryColor, 0.06),
        focusColor: base.primaryColor,
        focusShadowColor: tint(base.primaryColor, 0.8),
        focusDangerShadowColor: tint(base.dangerColor, 0.8),

        processingColor: tint(base.primaryColor, 0.4),

        disabledColorBase: tint(base.fontColorBase, 0.8),
        disabledColorLight: tint(base.fontColorBase, 0.97),

        headColor: base.fontColorBase,
        subHeadColor: tint(base.fontColorBase, 0.35),
        textColor: base.fontColorBase,
        textColorSecondary: tint(base.fontColorBase, 0.55),
        textColorDisabled: tint(base.fontColorBase, 0.7),
        textColorDisabledLight: tint(base.fontColorBase, 0.8),
        textColorCaption: tint(base.fontColorBase, 0.8),

        borderColorDisabled: tint(base.fontColorBase, 0.8),
        borderColorSplit: tint(base.fontColorBase, 0.94),
        borderColorInverse: base.white,
        borderBase: `${base.borderWidthBase} ${base.borderStyleBase} ${base.borderColorBase}`,

        layoutInvertedBgColor: tint(base.fontColorBase, 0.05),

        tooltipTextBgColor: tint(base.fontColorBase, 0.3),

        selectTriggerIconColor: tint(base.fontColorBase, 0.6),

        scrollbarBgColor: fade(base.fontColorBase, 0.25),
        scrollbarActiveColor: fade(base.fontColorBase, 0.65),

        carouselColor: base.shadowColorSm,
        carouselHoverColor: base.maskColor,
        carouselActiveColor: fade(base.fontColorBase, 0.65),

        ...themeOverrides.derivedColor,
    };
};
