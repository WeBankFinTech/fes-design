import { withInstall, withNoopInstall } from '../_util/withInstall';
import Table from './table';
import Column from './column.vue';

import type { SFCWithInstall } from '../_util/interface';

type TableType = SFCWithInstall<typeof Table>;
type ColumnType = SFCWithInstall<typeof Column>;

export const FTable = withInstall<TableType>(Table as TableType, { Column });
export const FTableColumn = withNoopInstall<ColumnType>(Column as ColumnType);

export default FTable;
