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
} from 'vue';
import {
    COL_TYPE,
    ALIGN,
    TABLE_NAME,
    TABLE_COLUMN_NAME,
    provideKey,
} from './const';
import type { EllipsisProps } from '../ellipsis';

import type { CellProps } from './components/cell';
import type { RowType, ActionType } from './interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

export type SortOrderType = 'descend' | 'ascend' | false;
export type SorterType = ((a: RowType, b: RowType) => boolean) | 'default';

export const columnProps = {
    label: String,
    prop: String,
    type: {
        type: String as PropType<(typeof COL_TYPE)[number]>,
        default: 'default',
    },
    align: {
        type: String as PropType<(typeof ALIGN)[number]>,
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
    sortDirections: {
        type: Array as PropType<Array<'descend' | 'ascend'>>,
        default: ['descend', 'ascend'],
    },
    sortOrder: {
        type: [String, Boolean] as PropType<SortOrderType>,
        default: false,
    },
    sorter: {
        type: [Function, String] as PropType<SorterType>,
        default: 'default',
    },
    selectable: Function as PropType<
        ({ row, index }: { row: RowType; index: number }) => void
    >,
    action: [Object, Array] as PropType<ActionType | ActionType[]>,
    ellipsis: {
        type: [Boolean, Object] as PropType<boolean | EllipsisProps>,
        default: false,
    },
    visible: {
        type: Boolean,
        default: true,
    },
} as const;

export type ColumnProps = ExtractPublicPropTypes<typeof columnProps>;

export type ColumnChildren = Array<
    ColumnProps & {
        render?: (data: CellProps) => VNode[];
        renderHeader?: (data: CellProps) => VNode[];
        children?: ColumnChildren;
    }
>;

export const getDefaultColProps = (): ColumnProps => {
    const values: Record<string, any> = {};
    Object.keys(columnProps).forEach((key) => {
        const val: any = (columnProps as Record<string, any>)[key].default;
        values[key] = val;
    });
    return values as ColumnProps;
};
export interface ColumnInst {
    id: number;
    props: ColumnProps;
    slots: ReturnType<typeof useSlots>;
    parentId?: number;
    fixedLeft?: boolean;
    fixedRight?: boolean;
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
