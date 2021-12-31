import { reactive, computed } from 'vue';
import { getHeaderRows, getColumns } from './helper';

export default function useColumn() {
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

    const visibleColumns = computed(() =>
        originColumns.filter((column) => column.props.visible),
    );

    // 表头Rows
    const headerRows = computed(() => getHeaderRows(visibleColumns.value));

    // 列配置
    const columns = computed(() => getColumns(visibleColumns.value));

    return {
        addColumn,
        removeColumn,
        headerRows,
        columns,
    };
}
