import { provide, SetupContext, watch, ref } from 'vue';
import { isArray } from 'lodash-es';
import { getRowKey as _getRowKey, getCellValue } from './helper';
import { provideKey, TABLE_NAME } from './const';
import useTableColumn from './useTableColumn';
import useTableEvent from './useTableEvent';
import useTableSelect from './useTableSelect';
import useTableExpand from './useTableExpand';
import useTableStyle from './useTableStyle';
import useTableDrag from './useTableDrag';
import useTableSort from './useTableSort';

import type { TableProps } from './table';
import type { RowType } from './interface';

let tableIdSeed = 1;
export default (props: TableProps, ctx: SetupContext) => {
    const tableId = `f-table_${tableIdSeed++}`;

    const columnState = useTableColumn(props);

    // 展示的数据
    const showData = ref([]);

    const sortState = useTableSort({
        ctx,
        columns: columnState.columns,
    });

    watch(
        [() => props.data, sortState.sortState],
        () => {
            if (isArray(props.data)) {
                showData.value = sortState.handleRowDataBySort(
                    props.data.slice(0),
                    sortState.sortState,
                );
            } else {
                console.warn(`[${TABLE_NAME}]: data must be array`);
                showData.value = [];
            }
        },
        {
            immediate: true,
            deep: true,
        },
    );

    // 行数据的key
    const getRowKey = ({ row }: { row: RowType }) =>
        _getRowKey({ row, rowKey: props.rowKey });

    const eventState = useTableEvent(ctx);

    const expandState = useTableExpand({
        props,
        ctx,
        columns: columnState.columns,
        getRowKey,
    });

    const styleState = useTableStyle({
        props,
        columns: columnState.columns,
        expandColumn: expandState.expandColumn,
        isExpandOpened: expandState.isExpandOpened,
        showData,
    });

    const selectState = useTableSelect({
        props,
        ctx,
        showData,
        getRowKey,
        columns: columnState.columns,
    });

    const dragState = useTableDrag({ props, ctx });

    const state = {
        rootProps: props,
        rootCtx: ctx,
        getRowKey,
        getCellValue,
        tableId,
        showData,
        ...columnState,
        ...eventState,
        ...expandState,
        ...styleState,
        ...selectState,
        ...dragState,
        ...sortState,
    };

    provide(provideKey, state);

    return state;
};
