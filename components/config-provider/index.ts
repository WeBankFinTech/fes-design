import { withInstall } from '../_util/withInstall';
import ConfigProvider from './configProvider';

export const FConfigProvider = withInstall(ConfigProvider);

export default FConfigProvider;
export { setConfig, getConfig } from './configProvider';
