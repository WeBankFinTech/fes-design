import { defineComponent, computed, PropType, SetupContext, watch } from 'vue';
import { isUndefined } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { TABLE_NAME, SIZE } from './const';
import useTable from './useTable';
import HeaderTable from './components/headerTable';
import BodyTable from './components/bodyTable';
import VirtualTable from './components/virtualTable';
import type { ColumnChildren } from './column';
import type { BeforeDragEnd } from '../draggable/useDraggable';
import type { ExtractPublicPropTypes } from '../_util/interface';

import type { RowType, RowKey } from './interface';

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
        default: '暂无数据',
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
    layout: {
        type: String as PropType<'fixed' | 'auto'>,
        default: 'fixed',
    },
    draggable: {
        type: Boolean as PropType<boolean>,
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
} as const;

export type TableProps = ExtractPublicPropTypes<typeof tableProps>;

export default defineComponent({
    name: TABLE_NAME,
    props: tableProps,
    emits: [
        'cellClick',
        'expandChange',
        'headerClick',
        'rowClick',
        'select',
        'selectAll',
        'selectionChange',
        'sortChange',
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
            layout,
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
            () => props.virtualScroll,
            () => {
                if (props.virtualScroll && !props.rowKey) {
                    console.warn(
                        `[${TABLE_NAME}]: 当使用虚拟滚动时，请设置rowKey!`,
                    );
                }
            },
            {
                immediate: true,
            },
        );

        const render = () => {
            if (!layout.initRef.value) {
                return;
            }
            return (
                <>
                    {composed.value && rootProps.showHeader && (
                        <HeaderTable columns={columns.value} />
                    )}
                    {rootProps.virtualScroll && showData.value.length ? (
                        <VirtualTable columns={columns.value} />
                    ) : (
                        <BodyTable
                            composed={composed.value}
                            columns={columns.value}
                        />
                    )}
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
