import { withInstall, withNoopInstall } from '../_util/withInstall';
import Tabs from './tabs';
import TabPane from './tab-pane';

export const FTabs = withInstall(Tabs, { TabPane });
export const FTabPane = withNoopInstall(TabPane);

export default FTabs;
