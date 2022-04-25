import type { InjectionKey } from 'vue';
import type { TableInst } from './interface';

export const ALIGN = ['left', 'center', 'right'] as const;
export const COL_TYPE = ['default', 'selection', 'expand'] as const;
export const SIZE = ['middle', 'small'] as const;
export const TABLE_NAME = 'FTable' as const;
export const TABLE_COLUMN_NAME = 'FTableColumn' as const;
export const provideKey: InjectionKey<TableInst> = Symbol('FTable');
