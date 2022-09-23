import {
    defineComponent,
    h,
    Fragment,
    inject,
    onBeforeMount,
    onBeforeUnmount,
    getCurrentInstance,
    VNode,
    PropType,
    useSlots,
    ExtractPropTypes,
} from 'vue';
import {
    COL_TYPE,
    ALIGN,
    TABLE_NAME,
    TABLE_COLUMN_NAME,
    provideKey,
} from './const';

import type { CellProps } from './components/cell';
import type { RowType, ActionType } from './interface';

const columnProps = {
    label: String,
    prop: String,
    type: {
        type: String as PropType<typeof COL_TYPE[number]>,
        default: 'default',
    },
    align: {
        type: String as PropType<typeof ALIGN[number]>,
        default: 'left',
    },
    width: Number,
    minWidth: Number,
    colClassName: [Function, String, Array, Object] as PropType<
        | string
        | []
        | object
        | (({
              row,
              column,
              rowIndex,
              columnIndex,
              cellValue,
          }: {
              row: RowType;
              column: ColumnInst;
              rowIndex: number;
              columnIndex: number;
              cellValue: any;
          }) => string | [] | object)
    >,
    colStyle: [Function, Object] as PropType<
        | object
        | (({
              row,
              column,
              rowIndex,
              columnIndex,
              cellValue,
          }: {
              row: RowType;
              column: ColumnInst;
              rowIndex: number;
              columnIndex: number;
              cellValue: any;
          }) => object)
    >,
    fixed: {
        type: [Boolean, String] as PropType<'left' | 'right' | true | false>,
    },
    formatter: Function as PropType<(data: CellProps) => any>,
    resizable: {
        type: Boolean,
        default: false,
    },
    sortable: {
        type: Boolean,
        default: false,
    },
    sortMethod: Function as PropType<() => void>,
    selectable: Function as PropType<() => void>,
    action: [Object, Array] as PropType<ActionType | ActionType[]>,
    ellipsis: {
        type: Boolean,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    },
} as const;

export type ColumnProps = Partial<ExtractPropTypes<typeof columnProps>>;

export interface ColumnInst {
    id: number;
    props: ColumnProps;
    slots: ReturnType<typeof useSlots>;
    parentId?: number;
    width?: number;
    minWidth?: number;
    fixLeft?: boolean;
    fixRight?: boolean;
    colSpan?: number;
    rowSpan?: number;
    children?: ColumnInst[];
    level?: number;
}

export default defineComponent({
    name: TABLE_COLUMN_NAME,
    props: columnProps,
    setup(props, ctx) {
        const table = inject(provideKey, null);
        if (!table) {
            return console.error(
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
                slots: ctx.slots,
                parentId: parentInstance.uid || null,
            });
        });
        onBeforeUnmount(() => {
            removeColumn(instance.uid);
        });
    },
    render() {
        let children: VNode[] = [];
        try {
            const renderDefault = this.$slots.default?.({
                row: {},
                rowIndex: -1,
                column: {},
                columnIndex: -1,
                cellValue: null,
            });
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
                        children.push(...(childNode.children as VNode[]));
                    }
                });
            }
        } catch {
            children = [];
        }
        return h('div', children);
    },
});
