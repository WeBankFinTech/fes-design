import { withInstall, withNoopInstall } from '../_util/withInstall';
import Table from './table';
import Column from './column';

import type { SFCWithInstall } from '../_util/interface';

type TableType = SFCWithInstall<typeof Table>;
type ColumnType = SFCWithInstall<typeof Column>;

export { tableProps } from './table';
export type { TableProps } from './table';
export const FTable = withInstall<TableType>(Table as TableType, { Column });

export { columnProps } from './column';
export type { ColumnProps } from './column';
export const FTableColumn = withNoopInstall<ColumnType>(Column as ColumnType);

export default FTable;
