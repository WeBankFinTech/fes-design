import { ref, watch, reactive, computed } from 'vue';
import { isFunction } from 'lodash-es';
import { TABLE_NAME } from './const';
import { getRowKey } from './helper';

export default ({ props, ctx, showData, columns }) => {
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
        ctx.emit('selection-change', selection);
    });

    const isSelectDisabled = ({ row }) => {
        if (!selectionColumn.value) return false;
        return !selectableData.value.includes(row);
    };

    const isSelected = ({ row }) => {
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
        return selection.includes(rowKey);
    };

    const handleSelect = ({ row }) => {
        if (isSelectDisabled({ row })) return;
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
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
                const _rowKey = getRowKey({ row: _row, rowKey: props.rowKey });
                return selection.includes(_rowKey);
            })
        ) {
            isAllSelected.value = true;
        }
        // 如果全部不选中，则设置全选按钮
        if (
            selectableData.value.some((_row) => {
                const _rowKey = getRowKey({ row: _row, rowKey: props.rowKey });
                return !selection.includes(_rowKey);
            })
        ) {
            isAllSelected.value = false;
        }
    };

    function splice(row) {
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
        const index = selection.indexOf(rowKey);
        if (index !== -1) {
            selection.splice(index, 1);
        }
    }

    function push(row) {
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
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
        ctx.emit('select-all', { selection });
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
