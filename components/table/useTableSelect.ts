import { ref, watch, reactive, computed, SetupContext, Ref } from 'vue';
import { isFunction } from 'lodash-es';
import { TABLE_NAME } from './const';

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column.vue';

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

    const isAllSelected = ref(false);

    const selection = reactive([]);

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

    watch(selection, () => {
        ctx.emit('selectionChange', selection);
    });

    const isSelectDisabled = ({ row }: { row: RowType }) => {
        if (!selectionColumn.value) return false;
        return !selectableData.value.includes(row);
    };

    const isSelected = ({ row }: { row: RowType }) => {
        const rowKey = getRowKey({ row });
        return selection.includes(rowKey);
    };

    const handleSelect = ({ row }: { row: RowType }) => {
        if (isSelectDisabled({ row })) return;
        const rowKey = getRowKey({ row });
        const index = selection.indexOf(rowKey);
        if (index !== -1) {
            selection.splice(index, 1);
            ctx.emit('select', {
                selection,
                row,
                checked: false,
            });
        } else {
            selection.push(rowKey);
            ctx.emit('select', {
                selection,
                row,
                checked: true,
            });
        }
        // 如果全部选中，则设置全选按钮
        if (
            selectableData.value.every((_row) => {
                const _rowKey = getRowKey({ row: _row });
                return selection.includes(_rowKey);
            })
        ) {
            isAllSelected.value = true;
        }
        // 如果全部不选中，则设置全选按钮
        if (
            selectableData.value.some((_row) => {
                const _rowKey = getRowKey({ row: _row });
                return !selection.includes(_rowKey);
            })
        ) {
            isAllSelected.value = false;
        }
    };

    function splice(row: RowType) {
        const rowKey = getRowKey({ row });
        const index = selection.indexOf(rowKey);
        if (index !== -1) {
            selection.splice(index, 1);
        }
    }

    function push(row: RowType) {
        const rowKey = getRowKey({ row });
        const index = selection.indexOf(rowKey);
        if (index === -1) {
            selection.push(rowKey);
        }
    }

    const handleSelectAll = () => {
        if (isAllSelected.value) {
            selectableData.value.forEach(splice);
            isAllSelected.value = false;
        } else {
            selectableData.value.forEach(push);
            isAllSelected.value = true;
        }
        ctx.emit('selectAll', { selection });
    };

    const clearSelect = () => {
        selectableData.value.forEach(splice);
        isAllSelected.value = false;
    };

    return {
        selectionColumn,
        selection,
        isSelectDisabled,
        isSelected,
        isAllSelected,
        handleSelect,
        handleSelectAll,
        clearSelect,
    };
};
