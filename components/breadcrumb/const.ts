import { type InjectionKey } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { type BreadcrumbInject } from './props';

export const prefixCls = getPrefixCls('breadcrumb');

export const itemCls = getPrefixCls('breadcrumb-item');

export const BREAD_CRUMB_KEY: InjectionKey<BreadcrumbInject> =
    Symbol('BREAD_CRUMB_KEY');
