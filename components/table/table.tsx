import {
    type ComponentObjectPropsOptions,
    type PropType,
    type SetupContext,
    computed,
    defineComponent,
    watch,
} from 'vue';
import { isUndefined } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import type { BeforeDragEnd } from '../draggable/useDraggable';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { type SIZE, TABLE_NAME } from './const';
import useTable from './useTable';
import HeaderTable from './components/headerTable';
import BodyTable from './components/bodyTable';
import VirtualTable from './components/virtualTable';
import NoData from './components/noData';
import type { ColumnChildren } from './column';

import type { RowKey, RowType } from './interface';

export const tableProps = {
    data: {
        type: Array as PropType<object[]>,
        default: (): object[] => [],
    },
    rowKey: [Function, String] as PropType<RowKey>,
    bordered: {
        type: Boolean,
        default: false,
    },
    showHeader: {
        type: Boolean,
        default: true,
    },
    emptyText: {
        type: String,
    },
    size: {
        type: String as PropType<(typeof SIZE)[number]>,
        default: 'middle',
    },
    spanMethod: Function,
    rowClassName: [Function, String, Array, Object] as PropType<
        | string
        | []
        | object
        | (({
            row,
            rowIndex,
        }: {
            row: RowType;
            rowIndex: number;
        }) => string | [] | object)
    >,
    rowStyle: [Function, Object] as PropType<
        | object
        | (({ row, rowIndex }: { row: RowType; rowIndex: number }) => object)
    >,
    height: Number,
    virtualScroll: {
        type: Boolean,
        default: false,
    },
    virtualScrollOption: {
        type: Object as PropType<{ keeps: number;estimateSize: number }>,
        default: () => ({}),
    },
    layout: {
        type: String as PropType<'fixed' | 'auto'>,
        default: 'fixed',
    },
    draggable: {
        type: Boolean,
        default: false,
    },
    beforeDragend: Function as PropType<BeforeDragEnd>,
    checkedKeys: {
        type: Array as PropType<string[] | number[]>,
        default(): string[] | number[] {
            return [];
        },
    },
    expandedKeys: {
        type: Array as PropType<string[] | number[]>,
        default(): string[] | number[] {
            return [];
        },
    },
    columns: {
        type: Array as PropType<ColumnChildren>,
        default(): ColumnChildren {
            return [];
        },
    },
    horizontalLine: {
        type: Boolean,
        default: true,
    },
    verticalLine: {
        type: Boolean,
        default: false,
    },
    hoverable: {
        type: Boolean,
        default: true,
    },
    striped: {
        type: Boolean,
        default: false,
    },
    alwaysScrollbar: {
        type: Boolean,
        default: false,
    },
} as const satisfies ComponentObjectPropsOptions;

export type TableProps = ExtractPublicPropTypes<typeof tableProps>;

export default defineComponent({
    name: TABLE_NAME,
    props: tableProps,
    emits: [
        'cellClick',
        'expandChange',
        'headerClick',
        'headerResize',
        'rowClick',
        'select',
        'selectAll',
        'selectionChange',
        'sortChange',
        'afterSort',
        'dragstart',
        'dragend',
        'update:checkedKeys',
        'update:expandedKeys',
    ],
    setup(props, ctx: any) {
        useTheme();
        const {
            handleSelect,
            handleSelectAll,
            clearSelect,
            wrapperRef,
            wrapperClass,
            columns,
            rootProps,
            toggleRowExpend,
            sort,
            clearSorter,
            showData,
        } = useTable(props, ctx as SetupContext);

        (ctx as SetupContext).expose?.({
            toggleRowSelection: handleSelect,
            toggleAllSelection: handleSelectAll,
            clearSelection: clearSelect,
            toggleRowExpend,
            sort,
            clearSorter,
        });

        // 是否两个table
        const composed = computed(() => {
            return !isUndefined(rootProps.height);
        });

        watch(
            [() => props.virtualScroll, () => props.rowKey, () => props.height],
            () => {
                if (props.virtualScroll && !props.rowKey) {
                    console.warn(
                        `[${TABLE_NAME}]: 当使用虚拟滚动时，请设置rowKey!`,
                    );
                }
                if (props.virtualScroll && !props.height) {
                    console.warn(
                        `[${TABLE_NAME}]: 当使用虚拟滚动时，请设置height!`,
                    );
                }
            },
            {
                immediate: true,
            },
        );

        const render = () => {
            return (
                <>
                    {composed.value && rootProps.showHeader && (
                        <HeaderTable columns={columns.value} />
                    )}
                    {rootProps.virtualScroll && showData.value.length
                        ? (
                                <VirtualTable columns={columns.value} />
                            )
                        : (
                                <BodyTable
                                    composed={composed.value}
                                    columns={columns.value}
                                />
                            )}
                    {showData.value.length === 0 && <NoData></NoData>}
                </>
            );
        };

        return () => (
            <div ref={wrapperRef} class={wrapperClass.value}>
                <div ref="hiddenColumns" class="hidden-columns">
                    {(ctx as SetupContext).slots.default?.()}
                </div>
                {render()}
            </div>
        );
    },
});
