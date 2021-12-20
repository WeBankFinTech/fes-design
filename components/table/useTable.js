import { computed, provide } from 'vue';
import { getRowKey as _getRowKey, getCellValue } from './helper';
import { provideKey } from './const';
import useTableColumn from './useTableColumn';
import useTableEvent from './useTableEvent';
import useTableSelect from './useTableSelect';
import useTableExpand from './useTableExpand';
import useTableStyle from './useTableStyle';

let tableIdSeed = 1;
export default (props, ctx) => {
    const tableId = `f-table_${tableIdSeed++}`;

    // 展示的数据
    const showData = computed(() => props.data || []);

    // 行数据的key
    const getRowKey = ({ row }) => _getRowKey({ row, rowKey: props.rowKey });

    const columnState = useTableColumn();

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
    });

    const selectState = useTableSelect({
        props,
        ctx,
        showData,
        getRowKey,
        columns: columnState.columns,
    });

    const state = {
        getRowKey,
        getCellValue,
        tableId,
        showData,
        ...columnState,
        ...eventState,
        ...expandState,
        ...styleState,
        ...selectState,
    };

    provide(provideKey, state);

    return state;
};
