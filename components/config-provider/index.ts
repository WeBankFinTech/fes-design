import { withInstall } from '../_util/withInstall';
import type { SFCWithInstall } from '../_util/interface';
import ConfigProvider from './configProvider';

type ConfigProviderType = SFCWithInstall<typeof ConfigProvider>;
export const FConfigProvider = withInstall<ConfigProviderType>(
    ConfigProvider as ConfigProviderType,
);

export { configProviderProps } from './const';
export type { ConfigProviderProps } from './const';

export default FConfigProvider;

export { useConfig } from './configProvider';
