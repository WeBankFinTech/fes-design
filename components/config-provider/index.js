import { withInstall } from '../_util/withInstall';
import ConfigProvider from './configProvider';
import config from './config';

ConfigProvider.setConfig = config.setConfig;

ConfigProvider.getConfig = config.getConfig;

export const FConfigProvider = withInstall(ConfigProvider);

export default ConfigProvider;
