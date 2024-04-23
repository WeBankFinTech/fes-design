import type { Ref, SetupContext } from 'vue';
import type { getCellValue } from './helper';
import type useTableColumn from './useTableColumn';
import type useTableEvent from './useTableEvent';
import type useTableSelect from './useTableSelect';
import type useTableExpand from './useTableExpand';
import type useTableStyle from './useTableStyle';
import type useTableDrag from './useTableDrag';
import type useTableSort from './useTableSort';
import type { TableProps } from './table';

export type RowType = Record<string, any>;
export type RowKey = string | ((row: RowType) => string | number);

export interface ActionType {
    label: string | number;
    func: (row: any) => void;
}

export interface TableInst
    extends ReturnType<typeof useTableColumn>,
    ReturnType<typeof useTableEvent>,
    ReturnType<typeof useTableSelect>,
    ReturnType<typeof useTableExpand>,
    ReturnType<typeof useTableStyle>,
    ReturnType<typeof useTableDrag>,
    ReturnType<typeof useTableSort> {
    rootProps: TableProps;
    rootCtx: SetupContext;
    getRowKey: ({ row }: { row: RowType }) => string | number | RowType;
    getCellValue: typeof getCellValue;
    tableId: string;
    showData: Ref<object[]>;
}
