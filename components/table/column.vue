<script setup lang="ts">
import {
    defineComponent,
    h,
    Fragment,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    getCurrentInstance,
    VNode,
    useSlots,
} from 'vue';
import { TABLE_NAME, TABLE_COLUMN_NAME, provideKey } from './const';

import type { ColumnProps } from './interface';

const props = withDefaults(defineProps<ColumnProps>(), {
    type: 'default',
    align: 'left',
    resizable: false,
    sortable: false,
    ellipsis: false,
    visible: true,
});
const slots = useSlots();

const table = inject(provideKey, null);
if (!table) {
    console.error(
        `[${TABLE_COLUMN_NAME}]: ${TABLE_COLUMN_NAME} 须搭配 ${TABLE_NAME} 组件使用！`,
    );
}
const instance = getCurrentInstance();
const parentInstance = instance.parent;
const { addColumn, removeColumn } = table;
onBeforeMount(() => {
    addColumn({
        id: instance.uid,
        props,
        slots,
        parentId: parentInstance.uid || null,
    });
});
onBeforeUnmount(() => {
    removeColumn(instance.uid);
});
</script>

<script>
export default defineComponent({
    name: TABLE_COLUMN_NAME,
    render() {
        let children: VNode[] = [];
        try {
            const renderDefault = this.$slots.default?.();
            if (renderDefault instanceof Array) {
                renderDefault.forEach((childNode) => {
                    if (
                       (childNode.type as any)?.name === TABLE_COLUMN_NAME ||
                        childNode.shapeFlag !== 36
                    ) {
                        children.push(childNode);
                    } else if (
                        childNode.type === Fragment &&
                        childNode.children instanceof Array
                    ) {
                        children.push(...childNode.children as VNode[]);
                    }
                });
            }
        } catch {
            children = [];
        }
        return h('div', children);
    },
});
</script>
