import { defineComponent, nextTick, watch, reactive } from 'vue';
import { isUndefined } from 'lodash-es';
import useScrollbar from '../scrollbar/useScrollbar';
import WBar from '../scrollbar/bar';
import { TABLE_NAME, SIZE } from './const';
import useTable from './useTable';
import Table from './components/composeTable';

export default defineComponent({
    name: TABLE_NAME,
    components: {
        Table,
        WBar,
    },
    props: {
        data: {
            type: Array,
            data: () => [],
        },
        rowKey: [Function, String],
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
            type: String,
            validator(value) {
                return SIZE.includes(value);
            },
            default: 'normal',
        },
        spanMethod: Function,
        rowClassName: [Function, String],
        rowStyle: [Function, Object],
        height: Number,
    },
    emits: [
        'cell-click',
        'expand-change',
        'header-click',
        'row-click',
        'select',
        'select-all',
        'selection-change',
        'sort-change',
    ],
    setup(props, ctx) {
        const {
            prefixCls,
            handleSelect,
            handleSelectAll,
            clearSelect,
            wrapperRef,
            wrapperClass,
            wrapperStyle,
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

        const scrollbarRef = reactive([]);

        watch([layout.bodyHeight, layout.isScrollX, layout.isScrollY], () => {
            nextTick(onUpdate);
        });

        const collectRef = (ref, el) => {
            if (!ref.includes(el)) {
                ref.push(el);
            }
        };

        const handleTableRef = (elObject) => {
            if (!headerWrapperRef.value && elObject.header) {
                headerWrapperRef.value = elObject.header;
            }
            if (!bodyWrapperRef.value && elObject.body) {
                bodyWrapperRef.value = elObject.body;
                collectRef(scrollbarRef, elObject.body);
                containerRef.value = elObject.body;
            }
        };

        return () => (
            <div
                ref={wrapperRef}
                className={wrapperClass.value}
                style={wrapperStyle.value}
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
                    onScroll={(e) => {
                        syncPosition(e);
                        onScroll(e);
                    }}
                    onMousewheelHeader={handleHeaderMousewheel}
                />
                <WBar
                    class={`${prefixCls}-scrollbar`}
                    scrollbarRef={scrollbarRef}
                    containerRef={containerRef.value}
                    move={thumbMoveX.value}
                    ratio={ratioX.value}
                    size={sizeWidth.value}
                    always={false}
                />
                <WBar
                    class={`${prefixCls}-scrollbar`}
                    scrollbarRef={scrollbarRef}
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
