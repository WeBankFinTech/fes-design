import type { InjectionKey } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import type { TransferInjection } from './interface';

export const COMPONENT_NAME = 'FTransfer';

export const COMPONENT_CLASS = getPrefixCls('transfer');

export const COMPONENT_ONE_WAY_CLASS = `${COMPONENT_CLASS}-one-way`;

export const COMPONENT_TWO_WAY_CLASS = `${COMPONENT_CLASS}-two-way`;

export const TRANSFER_INJECT_KEY: InjectionKey<TransferInjection> = Symbol();

/** 与 less 中的变量对应 */
export const TransferStyle = {
    PANEL_PADDING: 16,
    PANEL_HEADER_HEIGHT: 22,
    PANEL_FILTER_HEIGHT: 32,
    PANEL_BLOCK_GAP: 16,
};
