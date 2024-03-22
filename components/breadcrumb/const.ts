import { type InjectionKey } from 'vue';
import { type BreadcrumbInject } from './props';

export const BREAD_CRUMB_KEY: InjectionKey<BreadcrumbInject> =
    Symbol('BREAD_CRUMB_KEY');
