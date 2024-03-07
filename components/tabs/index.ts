import { withInstall, withNoopInstall } from '../_util/withInstall';
import Tabs from './tabs';
import TabPane from './tab-pane.vue';

import type { SFCWithInstall } from '../_util/interface';

type TabsType = SFCWithInstall<typeof Tabs>;
type TabPaneType = SFCWithInstall<typeof TabPane>;

export { tabsProps } from './props';
export type { TabsProps } from './props';
export const FTabs = withInstall<TabsType>(Tabs as TabsType, { TabPane });

export { tabProps as tabPaneProps } from './props';
export type { TabProps as TabPaneProps } from './props';
export const FTabPane = withNoopInstall<TabPaneType>(TabPane as TabPaneType);

export default FTabs;
