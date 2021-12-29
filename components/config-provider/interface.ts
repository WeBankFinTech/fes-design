import type { Theme } from '../_theme/interface';

export interface ConfigProvider {
    getContainer: () => HTMLElement;
    theme?: string;
    themeOverrides?: Partial<Theme>;
}
