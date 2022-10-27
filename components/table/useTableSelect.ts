import { watch, computed, SetupContext, Ref } from 'vue';
import { isFunction } from 'lodash-es';
import { useNormalModel } from '../_util/use/useModel';
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

    const [currentCheckedKeys] = useNormalModel(props, ctx.emit, {
        prop: 'checkedKeys',
    });

    const isAllSelected = computed(() => {
        return (
            selectableData.value.length > 0 &&
            selectableData.value.every((_row) => {
                const _rowKey = getRowKey({ row: _row });
                return currentCheckedKeys.value.includes(_rowKey);
            })
        );
    });

    const isCurrentDataAnySelected = computed(() => {
        return selectableData.value.some((_row) => {
            const _rowKey = getRowKey({ row: _row });
            return currentCheckedKeys.value.includes(_rowKey);
        });
    });

    watch(
        currentCheckedKeys,
        () => {
            ctx.emit('selectionChange', currentCheckedKeys.value);
        },
        {
            deep: true,
        },
    );

    const isSelectDisabled = ({ row }: { row: RowType }) => {
        if (!selectionColumn.value) return false;
        return !selectableData.value.includes(row);
    };

    const isSelected = ({ row }: { row: RowType }) => {
        const _rowKey = getRowKey({ row });
        return currentCheckedKeys.value.includes(_rowKey);
    };

    const handleSelect = ({ row }: { row: RowType }) => {
        if (isSelectDisabled({ row })) return;
        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value;
        const index = selectionList.indexOf(rowKey);
        if (index !== -1) {
            selectionList.splice(index, 1);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: false,
            });
        } else {
            selectionList.push(rowKey);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: true,
            });
        }
    };

    function splice(row: RowType) {
        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value;
        const index = selectionList.indexOf(rowKey);
        if (index !== -1) {
            selectionList.splice(index, 1);
        }
    }

    function push(row: RowType) {
        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value;
        const index = selectionList.indexOf(rowKey);
        if (index === -1) {
            selectionList.push(rowKey);
        }
    }

    const handleSelectAll = () => {
        if (isAllSelected.value) {
            selectableData.value.forEach(splice);
        } else {
            selectableData.value.forEach(push);
        }
        ctx.emit('selectAll', {
            selection: currentCheckedKeys.value,
            checked: !isAllSelected.value,
        });
    };

    const clearSelect = () => {
        currentCheckedKeys.value.length = 0;
    };

    return {
        isSelectDisabled,
        isSelected,
        isAllSelected,
        isCurrentDataAnySelected,
        handleSelect,
        handleSelectAll,
        clearSelect,
    };
};
