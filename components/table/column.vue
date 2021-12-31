<script>
import {
    defineComponent,
    h,
    Fragment,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    getCurrentInstance,
} from 'vue';
import {
    TABLE_NAME,
    TABLE_COLUMN_NAME,
    ALIGN,
    COL_TYPE,
    provideKey,
} from './const';

let columnIdSeed = 1;

export default defineComponent({
    name: TABLE_COLUMN_NAME,
    props: {
        label: String,
        prop: String,
        type: {
            type: String,
            default: 'default',
            validator(value) {
                return COL_TYPE.includes(value);
            },
        },
        align: {
            type: String,
            default: 'left',
            validator(value) {
                return ALIGN.includes(value);
            },
        },
        width: Number,
        minWidth: Number,
        colClassName: [Function, String],
        colStyle: [Function, Object],
        fixed: {
            type: [Boolean, String],
            validator(value) {
                return ['left', 'right', true, false].includes(value);
            },
        },
        formatter: Function,
        resizable: {
            type: Boolean,
            default: false,
        },
        sortable: {
            type: Boolean,
            default: false,
        },
        sortMethod: Function,
        selectable: Function,
        action: [Object, Array],
        ellipsis: {
            type: Boolean,
            default: false,
        },
        visible: {
            type: Boolean,
            default: true,
        },
    },
    setup(props, ctx) {
        const table = inject(provideKey, null);
        if (!table) {
            return console.error(
                `[${TABLE_COLUMN_NAME}]: ${TABLE_COLUMN_NAME} 须搭配 ${TABLE_NAME} 组件使用！`,
            );
        }
        const instance = getCurrentInstance();
        const parentInstance = instance.vnode.vParent || instance.parent;
        const { tableId, addColumn, removeColumn } = table;
        const columnId = `${tableId}-column_${columnIdSeed++}`;
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
    },
    render() {
        let children = [];
        try {
            const renderDefault = this.$slots.default?.();
            if (renderDefault instanceof Array) {
                renderDefault.forEach((childNode) => {
                    if (
                        childNode.type?.name === TABLE_COLUMN_NAME ||
                        childNode.shapeFlag !== 36
                    ) {
                        children.push(childNode);
                    } else if (
                        childNode.type === Fragment &&
                        childNode.children instanceof Array
                    ) {
                        renderDefault.push(...childNode.children);
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
