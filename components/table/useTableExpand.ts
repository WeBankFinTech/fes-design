import { type Ref, type SetupContext, computed, watch } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import type { ArrayUnionToUnionArray } from '../_util/types';
import { TABLE_NAME } from './const';

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

// string[] | number[] 不能直接调用数组的大部分方法，因此转换为 (string | number)[] 后使用
type ExpandedKey = ArrayUnionToUnionArray<TableProps['expandedKeys']>[number];

export default ({
    props,
    ctx,
    columns,
    getRowKey,
}: {
    props: TableProps;
    ctx: SetupContext;
    columns: Ref<ColumnInst[]>;
    getRowKey: ({ row }: { row: RowType }) => string | number | RowType;
}) => {
    // 展开列唯一
    const expandColumn = computed(() => {
        const arr = columns.value.filter(
            (column) => column.props.type === 'expand',
        );
        if (arr.length > 1) {
            console.warn(`[${TABLE_NAME}]: type=expand 不能存在多个`);
        }
        return arr[0];
    });

    watch(expandColumn, () => {
        if (expandColumn.value && !props.rowKey) {
            console.warn(`[${TABLE_NAME}]: 当存在 expand 列时，请设置rowKey!`);
        }
    });

    const [currentExpandedKeys] = useNormalModel(props, ctx.emit, {
        prop: 'expandedKeys',
    });

    const isExpandOpened = ({ row }: { row: RowType }) => {
        const rowKey = getRowKey({ row });
        return (currentExpandedKeys.value as ExpandedKey[]).includes(
            rowKey as ExpandedKey,
        );
    };

    const toggleRowExpend = ({ row }: { row: RowType }) => {
        const rowKey = getRowKey({ row });
        const expandOpenedList = currentExpandedKeys.value as ExpandedKey[];
        const index = expandOpenedList.indexOf(rowKey as ExpandedKey);
        if (index !== -1) {
            expandOpenedList.splice(index, 1);
        } else {
            expandOpenedList.push(rowKey as ExpandedKey);
        }
        return index === -1;
    };

    const handleExpand = ({ row }: { row: RowType }) => {
        const expanded = toggleRowExpend({ row });
        ctx.emit('expandChange', { row, expanded });
    };

    return {
        expandColumn,
        isExpandOpened,
        toggleRowExpend,
        handleExpand,
    };
};
