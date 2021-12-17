import { reactive, computed, watch } from 'vue';
import { TABLE_NAME } from './const';
import { getRowKey } from './helper';

export default ({ props, ctx, columns }) => {
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

    const expandOpenedList = reactive([]);

    const isExpandOpened = ({ row }) => {
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
        return expandOpenedList.includes(rowKey);
    };

    const handleExpand = ({ row }) => {
        const rowKey = getRowKey({ row, rowKey: props.rowKey });
        const index = expandOpenedList.indexOf(rowKey);
        if (index !== -1) {
            expandOpenedList.splice(index, 1);
        } else {
            expandOpenedList.push(rowKey);
        }
        ctx.emit('expand-change', { row, expanded: !index });
    };
    return {
        expandColumn,
        isExpandOpened,
        handleExpand,
    };
};
