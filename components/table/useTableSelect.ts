import { type Ref, type SetupContext, computed, watch } from 'vue';
import { isFunction } from 'lodash-es';
import { useNormalModel } from '../_util/use/useModel';
import { type ArrayUnionToUnionArray } from '../_util/types';
import { TABLE_NAME } from './const';

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

// string[] | number[] 不能直接调用数组的大部分方法，因此转换为 (string | number)[] 后使用
type CheckedKey = ArrayUnionToUnionArray<TableProps['checkedKeys']>[number];

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

    // 是否是全选了
    const isAllSelected = computed(() => {
        return (
            selectableData.value.length > 0
            && selectableData.value.every((_row) => {
                const _rowKey = getRowKey({ row: _row });
                return (currentCheckedKeys.value as CheckedKey[]).includes(
                    _rowKey as CheckedKey,
                );
            })
        );
    });

    const isCurrentDataAnySelected = computed(() => {
        return selectableData.value.some((_row) => {
            const _rowKey = getRowKey({ row: _row });
            return (currentCheckedKeys.value as CheckedKey[]).includes(
                _rowKey as CheckedKey,
            );
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

    // 是否单选模式
    const isSingleSelect = computed(() => {
        return selectionColumn.value && !selectionColumn.value.props.multiple;
    });

    const isSelectDisabled = ({ row }: { row: RowType }) => {
        if (!selectionColumn.value) return false;
        return !selectableData.value.includes(row);
    };

    const isSelected = ({ row }: { row: RowType }) => {
        const _rowKey = getRowKey({ row });
        return (currentCheckedKeys.value as CheckedKey[]).includes(
            _rowKey as CheckedKey,
        );
    };

    // 选择框的点击事件
    const handleSelect = ({ row }: { row: RowType }) => {
        if (isSelectDisabled({ row })) return;

        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value as CheckedKey[];
        const index = selectionList.indexOf(rowKey as CheckedKey);
        // 如果是单选模式
        if (isSingleSelect.value) {
            // 如果是单选直接先置空
            clearSelect();
        }

        // 点击的是已有的，则取消
        if (index !== -1) {
            selectionList.splice(index, 1);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: false,
            });
        } else {
            selectionList.push(rowKey as CheckedKey);
            ctx.emit('select', {
                selection: selectionList,
                row,
                checked: true,
            });
        }
    };

    function splice(row: RowType) {
        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value as CheckedKey[];
        const index = selectionList.indexOf(rowKey as CheckedKey);
        if (index !== -1) {
            selectionList.splice(index, 1);
        }
    }

    function push(row: RowType) {
        const rowKey = getRowKey({ row });
        const selectionList = currentCheckedKeys.value as CheckedKey[];
        const index = selectionList.indexOf(rowKey as CheckedKey);
        if (index === -1) {
            selectionList.push(rowKey as CheckedKey);
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

    // 模式变更，单选只能有一个被选择
    watch(
        isSingleSelect,
        () => {
            // 切换后，清空当前选择
            clearSelect();
        },
        {
            immediate: true,
        },
    );

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
