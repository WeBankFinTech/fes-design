import { watch, reactive, computed, SetupContext, Ref } from 'vue';
import { isFunction } from 'lodash-es';
import { TABLE_NAME } from './const';

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

export default ({
    props,
    ctx,
    showData,
    columns,
    getRowKey,
}: {
    props: TableProps;
    ctx: SetupContext;
    showData: Ref<object[]>;
    columns: Ref<ColumnInst[]>;
    getRowKey: ({ row }: { row: RowType }) => string | number | RowType;
}) => {
    // 选择器列唯一
    const selectionColumn = computed(() => {
        const arr = columns.value.filter(
            (column) => column.props.type === 'selection',
        );
        if (arr.length > 1) {
            console.warn(`[${TABLE_NAME}]: type=selection 不能存在多个`);
        }
        return arr[0];
    });

    watch(selectionColumn, () => {
        if (selectionColumn.value && !props.rowKey) {
            console.warn(
                `[${TABLE_NAME}]: 当存在 selection 列时，请设置rowKey!`,
            );
        }
    });

    // 能被选择 && 展示 的数据
    const selectableData = computed(() =>
        showData.value.filter((row, rowIndex) => {
            if (!selectionColumn.value) return false;
            if (isFunction(selectionColumn.value?.props?.selectable)) {
                return selectionColumn.value.props.selectable({
                    row,
                    rowIndex,
                });
            }
            return true;
        }),
    );

    const selectionList = reactive([]);

    const selectionMap = reactive(new Map());

    const isAllSelected = computed(() => {
        return selectableData.value.every((_row) => {
            const _rowKey = getRowKey({ row: _row });
            return selectionMap.get(_rowKey);
        });
    });

    const isCurrentDataAnySelected = computed(() => {
        return selectableData.value.some((_row) => {
            const _rowKey = getRowKey({ row: _row });
            return selectionMap.get(_rowKey);
        });
    });

    watch(selectionList, () => {
        ctx.emit('selectionChange', selectionList);
    });

    const isSelectDisabled = ({ row }: { row: RowType }) => {
        if (!selectionColumn.value) return false;
        return !selectableData.value.includes(row);
    };

    const isSelected = ({ row }: { row: RowType }) => {
        const rowKey = getRowKey({ row });
        return selectionMap.get(rowKey);
    };

    const handleSelect = ({ row }: { row: RowType }) => {
        if (isSelectDisabled({ row })) return;
        const rowKey = getRowKey({ row });
        const index = selectionList.indexOf(rowKey);
        if (index !== -1) {
            selectionList.splice(index, 1);
            selectionMap.delete(rowKey);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: false,
            });
        } else {
            selectionList.push(rowKey);
            selectionMap.set(rowKey, true);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: true,
            });
        }
    };

    function splice(row: RowType) {
        const rowKey = getRowKey({ row });
        const index = selectionList.indexOf(rowKey);
        if (index !== -1) {
            selectionList.splice(index, 1);
            selectionMap.delete(rowKey);
        }
    }

    function push(row: RowType) {
        const rowKey = getRowKey({ row });
        const index = selectionList.indexOf(rowKey);
        if (index === -1) {
            selectionList.push(rowKey);
            selectionMap.set(rowKey, true);
        }
    }

    const handleSelectAll = () => {
        if (isAllSelected.value) {
            selectableData.value.forEach(splice);
        } else {
            selectableData.value.forEach(push);
        }
        ctx.emit('selectAll', {
            selection: selectionList,
            checked: !isAllSelected.value,
        });
    };

    const clearSelect = () => {
        selectionList.length = 0;
        selectionMap.clear();
    };

    return {
        selectionColumn,
        selectionList,
        isSelectDisabled,
        isSelected,
        isAllSelected,
        isCurrentDataAnySelected,
        handleSelect,
        handleSelectAll,
        clearSelect,
    };
};
