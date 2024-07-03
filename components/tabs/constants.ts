import type { InjectionKey } from 'vue';
import type { TabsInject } from './interface';

export const COMPONENT_NAME = 'FTabs';

export const ADD_EVENT = 'add';

export const CLICK_TAB_EVENT = 'clickTab';

export const TABS_INJECTION_KEY: InjectionKey<TabsInject> = Symbol('FTabs');
