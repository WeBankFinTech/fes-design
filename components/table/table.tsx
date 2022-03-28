import {
    h,
    defineComponent,
    computed,
    PropType,
    ExtractPropTypes,
    SetupContext,
    watch,
} from 'vue';
import { isUndefined } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import { TABLE_NAME, SIZE } from './const';
import useTable from './useTable';
import HeaderTable from './components/headerTable';
import BodyTable from './components/bodyTable';
import VirtualTable from './components/virtualTable';

import type { RowType, RowKey } from './interface';

const tableProps = {
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
        type: String as PropType<typeof SIZE[number]>,
        default: 'normal',
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
} as const;

export type TableProps = Partial<ExtractPropTypes<typeof tableProps>>;

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
    ],
    setup(props, ctx: SetupContext) {
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
        } = useTable(props, ctx);

        ctx.expose &&
            ctx.expose({
                toggleRowSelection: handleSelect,
                toggleAllSelection: handleSelectAll,
                clearSelection: clearSelect,
            });

        // 计算出传入columns列的对应的宽度
        const columnsRef = computed(() => {
            const widthListValue = layout.widthList.value;
            return columns.value.map((column) => ({
                ...column,
                width: (widthListValue as any)[column.id],
            }));
        });

        // 是否两个table
        const composed = computed(() => {
            return !isUndefined(rootProps.height);
        });

        watch(()=> props.virtualScroll, () => {
            if (props.virtualScroll && !props.rowKey) {
                console.warn(
                    `[${TABLE_NAME}]: 当使用虚拟滚动时，请设置rowKey!`,
                );
            }
        }, {
            immediate: true
        });

        return () => (
            <div ref={wrapperRef} class={wrapperClass.value}>
                <div ref="hiddenColumns" class="hidden-columns">
                    {ctx.slots?.default()}
                </div>
                <HeaderTable
                    composed={composed.value}
                    columns={columnsRef.value}
                />
                {rootProps.virtualScroll ? (
                    <VirtualTable columns={columnsRef.value} />
                ) : (
                    <BodyTable
                        composed={composed.value}
                        columns={columnsRef.value}
                    />
                )}
            </div>
        );
    },
});
