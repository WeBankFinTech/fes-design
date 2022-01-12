import { h, defineComponent, nextTick, watch, PropType, ExtractPropTypes, SetupContext } from 'vue';
import { isUndefined } from 'lodash-es';
import { useTheme } from '../_theme/useTheme';
import useScrollbar from '../scrollbar/useScrollbar';
import FBar from '../scrollbar/bar.vue';
import { TABLE_NAME, SIZE } from './const';
import useTable from './useTable';
import Table from './components/composeTable';

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
    rowClassName: [Function, String] as PropType<string | (({ row, rowIndex }: {
        row: RowType,
        rowIndex: number
    }) => string | string[] | object)>,
    rowStyle: [Function, Object] as PropType<object | ((({ row, rowIndex }: {
        row: RowType,
        rowIndex: number
    }) => object))>,
    height: Number,
} as const;

export type TableProps = Partial<ExtractPropTypes<typeof tableProps>>;

export default defineComponent({
    name: TABLE_NAME,
    components: {
        Table,
        FBar,
    },
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
            prefixCls,
            handleSelect,
            handleSelectAll,
            clearSelect,
            wrapperRef,
            wrapperClass,
            columns,
            headerWrapperRef,
            bodyWrapperRef,
            layout,
            syncPosition,
            handleHeaderMousewheel,
        } = useTable(props, ctx);

        ctx.expose &&
            ctx.expose({
                toggleRowSelection: handleSelect,
                toggleAllSelection: handleSelectAll,
                clearSelection: clearSelect,
            });

        const {
            onUpdate,
            onScroll,
            containerRef,
            ratioX,
            ratioY,
            thumbMoveX,
            thumbMoveY,
            sizeHeight,
            sizeWidth,
        } = useScrollbar({ minSize: 20 });

        watch([layout.bodyHeight, layout.isScrollX, layout.isScrollY], () => {
            nextTick(onUpdate);
        });

        const handleTableRef = (elObject: any) => {
            if (!headerWrapperRef.value && elObject.header) {
                headerWrapperRef.value = elObject.header;
            }
            if (!bodyWrapperRef.value && elObject.body) {
                bodyWrapperRef.value = elObject.body;
                containerRef.value = elObject.body;
            }
        };

        return () => (
            <div
                ref={wrapperRef}
                class={wrapperClass.value}
            >
                <div ref="hiddenColumns" class="hidden-columns">
                    {ctx.slots?.default()}
                </div>
                <Table
                    onRef={handleTableRef}
                    showHeader={props.showHeader}
                    columns={columns.value}
                    composed={!isUndefined(props.height)}
                    emptyText={props.emptyText}
                    onScroll={(e: Event) => {
                        syncPosition();
                        onScroll();
                    }}
                    onMousewheelHeader={handleHeaderMousewheel}
                />
                <FBar
                    class={`${prefixCls}-scrollbar`}
                    scrollbarRef={[wrapperRef.value]}
                    containerRef={containerRef.value}
                    move={thumbMoveX.value}
                    ratio={ratioX.value}
                    size={sizeWidth.value}
                    always={false}
                />
                <FBar
                    class={`${prefixCls}-scrollbar`}
                    scrollbarRef={[wrapperRef.value]}
                    containerRef={containerRef.value}
                    move={thumbMoveY.value}
                    ratio={ratioY.value}
                    size={sizeHeight.value}
                    vertical
                    always={false}
                    style={{ top: `${layout.headerHeight.value + 2}px` }}
                />
            </div>
        );
    },
});
