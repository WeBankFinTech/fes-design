import type { InjectionKey } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import type { DescriptionsProvide } from './interface';

export const DESCRIPTIONS_PROVIDE_KEY: InjectionKey<DescriptionsProvide>
    = Symbol('DESCRIPTIONS_PROVIDE_KEY');

export const DESCRIPTIONS_ITEM_DEFAULT_SPAN = 1;

export const DESCRIPTIONS_PREFIX_CLASS = getPrefixCls('descriptions');
