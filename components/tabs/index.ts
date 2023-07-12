import { withInstall, withNoopInstall } from '../_util/withInstall';
import Tabs from './tabs';
import TabPane from './tab-pane.vue';

import type { SFCWithInstall } from '../_util/interface';

type TabsType = SFCWithInstall<typeof Tabs>;
type TabPaneType = SFCWithInstall<typeof TabPane>;

export { tabsProps } from './tabs';
export type { TabsProps } from './tabs';
export const FTabs = withInstall<TabsType>(Tabs as TabsType, { TabPane });

export { tabProps as tabPaneProps } from './helper';
export type { TabProps as TabPaneProps } from './helper';
export const FTabPane = withNoopInstall<TabPaneType>(TabPane as TabPaneType);

export default FTabs;
