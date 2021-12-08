<script>
import {
    defineComponent, h, Fragment,
} from 'vue';
import { ALIGN, COL_TYPE, TABLE_COLUMN_NAME } from './const';
import useColumn from './useColumn';

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
    },
    setup(props, ctx) {
        useColumn(props, ctx);
    },
    render() {
        let children = [];
        try {
            const renderDefault = this.$slots.default?.();
            if (renderDefault instanceof Array) {
                renderDefault.forEach((childNode) => {
                    if (
                        childNode.type?.name === TABLE_COLUMN_NAME
                        || childNode.shapeFlag !== 36
                    ) {
                        children.push(childNode);
                    } else if (
                        childNode.type === Fragment
                        && childNode.children instanceof Array
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
