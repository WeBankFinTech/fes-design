import { reactive, computed } from 'vue';
import { getHeaderRows, getColumns } from './helper';

import type { ColumnInst } from './column.vue';

export default function useColumn() {
    const originColumns = reactive<ColumnInst[]>([]);

    const addColumn = (column: ColumnInst) => {
        originColumns.push(column);
    };

    const removeColumn = (id: number) => {
        const colIndex = originColumns.findIndex((item) => item.id === id);
        if (colIndex !== -1) {
            originColumns.splice(colIndex, 1);
        }
    };

    const visibleColumns = computed(() =>
        originColumns.filter((column) => column.props.visible),
    );

    // 列配置
    const columns = computed(() => getColumns(visibleColumns.value));

    // 表头Rows
    const headerRows = computed(() => getHeaderRows(columns.value));

    const hasFixedColumn = computed(() =>
        columns.value.every((column) => {
            return !column.fixLeft && !column.fixRight;
        }),
    );

    return {
        addColumn,
        removeColumn,
        headerRows,
        columns,
        hasFixedColumn,
    };
}
