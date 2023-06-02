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
}

export interface Theme {
    common?: Partial<ThemeCommon>;
}
