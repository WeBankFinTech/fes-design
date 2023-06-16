export interface ThemeCommon {
    primaryColor: string;

    successColor: string;
    dangerColor: string;
    warningColor: string;
    tipColor: string;

    white: string;
    black: string;

    bodyBgColor: string;

    fontColorBase: string;
    fontSizeBase: string;

    borderRadiusBase: string;
    borderRadiusSm: string;
    borderWidthBase: string;
    borderStyleBase: string;

    borderColorBase: string;

    shadowColor: string;
    shadowColorSm: string;
    shadowRadius: string;
    shadowRadiusSm: string;

    maskColor: string;

    paddingLarge: string;
    paddingMiddle: string;
    paddingSmall: string;
    paddingXSmall: string;

    [key: string]: string;
}

export interface Theme {
    common?: Partial<ThemeCommon>;
    derivedColor?: {
        linkColor?: string;

        componentBgColor?: string;

        hoverColorBase?: string;
        hoverColorLight?: string;

        hoverSuccessColor?: string;
        activeSuccessColor?: string;

        hoverWarningColor?: string;
        activeWarningColor?: string;

        hoverDangerColor?: string;
        activeDangerColor?: string;

        activeColor?: string;
        focusColor?: string;
        focusShadowColor?: string;
        focusDangerShadowColor?: string;

        processingColor?: string;

        disabledColorBase?: string;
        disabledColorLight?: string;

        headColor?: string;
        subHeadColor?: string;
        textColor?: string;
        textColorSecondary?: string;
        textColorDisabled?: string;
        textColorDisabledLight?: string;
        textColorCaption?: string;

        borderColorDisabled?: string;
        borderColorSplit?: string;
        borderColorInverse?: string;
        borderBase?: string;

        layoutInvertedBgColor?: string;

        tooltipTextBgColor?: string;

        selectTriggerIconColor?: string;

        scrollbarBgColor?: string;
        scrollbarActiveColor?: string;

        carouselColor?: string;
        carouselHoverColor?: string;
        carouselActiveColor?: string;
    };
}
