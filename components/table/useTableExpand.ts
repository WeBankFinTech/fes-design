import { computed, watch, SetupContext, Ref } from 'vue';
import { useNormalModel } from '../_util/use/useModel';
import { TABLE_NAME } from './const';

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

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
        return currentExpandedKeys.value.includes(rowKey);
    };

    const toggleRowExpend = ({ row }: { row: RowType }) => {
        const rowKey = getRowKey({ row });
        const expandOpenedList = currentExpandedKeys.value;
        const index = expandOpenedList.indexOf(rowKey);
        if (index !== -1) {
            expandOpenedList.splice(index, 1);
        } else {
            expandOpenedList.push(rowKey);
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
