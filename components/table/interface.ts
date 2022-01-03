import { useSlots, Ref } from 'vue';
import { COL_TYPE, ALIGN } from './const';
import { CellProps } from './components/cell';
import { getCellValue } from './helper';
import useTableColumn from './useTableColumn';
import useTableEvent from './useTableEvent';
import useTableSelect from './useTableSelect';
import useTableExpand from './useTableExpand';
import useTableStyle from './useTableStyle';

export type RowType = Record<string, any>;

export type RowKey = string | ((row: RowType) => string);

export interface ActionType {
    label: string | number;
    func: (row: object) => void;
}

export interface ColumnProps {
    label: string;
    prop: string;
    type: typeof COL_TYPE[number];
    align: typeof ALIGN[number];
    width: number;
    minWidth: number;
    colClassName:
        | string
        | (({
              row,
              column,
              rowIndex,
              columnIndex,
              cellValue,
          }: {
              row: RowType;
              column: ColumnInst;
              rowIndex: number;
              columnIndex: number;
              cellValue: any;
          }) => string);
    colStyle:
        | object
        | (({
              row,
              column,
              rowIndex,
              columnIndex,
              cellValue,
          }: {
              row: RowType;
              column: ColumnInst;
              rowIndex: number;
              columnIndex: number;
              cellValue: any;
          }) => object);
    fixed: 'left' | 'right' | true | false;
    formatter: (data: CellProps) => any;
    resizable: boolean;
    sortable: boolean;
    sortMethod: () => void;
    selectable: () => void;
    action: ActionType | ActionType[];
    ellipsis: boolean;
    visible: boolean;
}

export interface ColumnInst {
    id: number;
    props: ColumnProps;
    slots: ReturnType<typeof useSlots>;
    parentId?: number;
    width?: number;
    fixLeft?: boolean;
    fixRight?: boolean;
    colSpan?: number;
    rowSpan?: number;
    children?: ColumnInst[];
    level?: number;
}

export interface TableInst
    extends ReturnType<typeof useTableColumn>,
        ReturnType<typeof useTableEvent>,
        ReturnType<typeof useTableSelect>,
        ReturnType<typeof useTableExpand>,
        ReturnType<typeof useTableStyle> {
    getRowKey: ({ row }: { row: RowType }) => string | RowType;
    getCellValue: typeof getCellValue;
    tableId: string;
    showData: Ref<object[]>;
}
