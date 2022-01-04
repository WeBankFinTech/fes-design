import type { Theme } from '../_theme/interface';
import type { GetContainer } from '../_util/interface';
export interface ConfigProvider {
    getContainer: GetContainer;
    theme?: string;
    themeOverrides?: Partial<Theme>;
}
