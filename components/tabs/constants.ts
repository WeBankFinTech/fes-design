import type { InjectionKey } from 'vue';
import type { TabsInject } from './interface';

export const TABS_INJECTION_KEY: InjectionKey<TabsInject> = Symbol('FTabs');
