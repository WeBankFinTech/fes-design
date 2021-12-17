import { computed, reactive } from 'vue';
import {
    getRowKey as _getRowKey,
    getHeaderRows,
    getColumns,
    getCellValue,
} from './helper';

let tableIdSeed = 1;
export default (props, ctx) => {
    const tableId = `f-table_${tableIdSeed++}`;
    const originColumns = reactive([]);

    const addColumn = (column) => {
        originColumns.push(column);
    };

    const removeColumn = (id) => {
        const colIndex = originColumns.findIndex((item) => item.id === id);
        if (colIndex !== -1) {
            originColumns.splice(colIndex, 1);
        }
    };

    // 表头Rows
    const headerRows = computed(() => getHeaderRows(originColumns));

    // 列配置
    const columns = computed(() => getColumns(originColumns));

    // 展示的数据
    const showData = computed(() => props.data);

    // 行数据的key
    const getRowKey = ({ row }) => _getRowKey({ row, rowKey: props.rowKey });

    const handleCellClick = (params, event) => {
        ctx.emit('cell-click', { ...params, event });
    };

    const handleHeaderClick = (params, event) => {
        ctx.emit('header-click', { ...params, event });
    };

    const handleRowClick = (params, event) => {
        ctx.emit('row-click', { ...params, event });
    };

    return {
        tableId,
        addColumn,
        removeColumn,
        headerRows,
        columns,
        showData,
        getCellValue,
        getRowKey,
        handleCellClick,
        handleHeaderClick,
        handleRowClick,
    };
};
