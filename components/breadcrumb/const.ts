import { type InjectionKey } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { type BreadcrumbInject } from './props';

export const prefixCls = getPrefixCls('breadcrumb');

export const itemCls = getPrefixCls('breadcrumb-item');

export const BREADCRUMB_KEY: InjectionKey<BreadcrumbInject> =
    Symbol('BREADCRUMB_KEY');
