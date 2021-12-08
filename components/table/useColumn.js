import {
    inject,
    onBeforeMount,
    onBeforeUnmount,
    getCurrentInstance,
} from 'vue';
import { TABLE_NAME, TABLE_COLUMN_NAME, provideKey } from './const';

let columnIdSeed = 1;
export default (props, ctx) => {
    const table = inject(provideKey, null);
    if (!table) {
        return console.error(
            `[${TABLE_COLUMN_NAME}]: ${TABLE_COLUMN_NAME} 须搭配 ${TABLE_NAME} 组件使用！`,
        );
    }
    const instance = getCurrentInstance();
    const parentInstance = instance.vnode.vParent || instance.parent;
    const { id, addColumn, removeColumn } = table;
    const columnId = `${id}-column_${columnIdSeed++}`;
    instance.columnId = columnId;
    onBeforeMount(() => {
        addColumn({
            id: columnId,
            props,
            ctx,
            parentId: parentInstance.columnId || null,
        });
    });
    onBeforeUnmount(() => {
        removeColumn(columnId);
    });
    return {
        columnId,
    };
};
