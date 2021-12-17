import { tint, shade } from './colors/colorFunc';

export const baseTheme = (themeOverrides = {}) => {
    const fontColorBase = '#0f1222';
    const base = Object.assign(
        {
            primaryColor: '#5384ff',

            successColor: '#00cb91',
            dangerColor: '#ff4d4f',
            warningColor: '#f29360',
            tipColor: '#5384ff',

            white: '#fff',
            black: '#000',

            bodyBackground: '#fff',

            fontColorBase,
            fontSizeBase: '14px',

            borderRadiusBase: '4px',
            borderRadiusSm: '2px',
            borderWidthBase: '1px',
            borderStyleBase: 'solid',

            borderColorBase: tint(fontColorBase, 0.8),

            shadowColor: tint(fontColorBase, 0.9),
            shadowRadius: '12px',
        },
        themeOverrides,
    );
    return {
        ...base,

        linkColor: base.primaryColor,

        componentBackground: tint(base.fontColorBase, 0.97),

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

        borderColorBase: tint(base.fontColorBase, 0.8),
        borderColorDisabled: tint(base.fontColorBase, 0.8),
        borderColorSplit: tint(base.fontColorBase, 0.94),
        borderColorInverse: base.white,
        borderBase: `${base.borderWidthBase} ${base.borderStyleBase} ${base.borderColorBase}`,
    };
};
