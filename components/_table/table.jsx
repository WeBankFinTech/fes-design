import { defineComponent, onMounted, nextTick, watch, reactive } from 'vue';
import { isUndefined } from 'lodash-es';
import { TABLE_NAME, SIZE } from '../const';
import useTable from '../useTable';
import TableHeader from './tableHeader';
import TableBody from './tableBody';
import Mousewheel from '../../_util/directives/mousewheel';
import WBar from '../scrollbar/bar';
import useScrollbar from '../../scrollbar/useScrollbar';

export default defineComponent({
    name: TABLE_NAME,
    directives: {
        mousewheel: Mousewheel,
    },
    components: {
        TableHeader,
        TableBody,
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
        console.log('table setup');
        const {
            handleSelect,
            handleSelectAll,
            clearSelect,
            layout,
            bodyWrapperRef,
            getFixClass,
            getFixStyle,
            fixeHeaderWrapperRef,
            prefixCls,
            headerWrapperStyle,
            fixedBodyWrapperRef,
            handleFixedMousewheel,
            bodyWrapperStyle,
            fixBodyWrapperStyle,
            wrapperRef,
            wrapperClass,
            wrapperStyle,
            headerWrapperRef,
            handleHeaderMousewheel,
            syncPosition,
            fixLeftColumn,
            fixRightColumn,
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

        watch(layout.bodyHeight, () => {
            nextTick(onUpdate);
        });

        onMounted(() => {
            nextTick(onUpdate);
        });

        const scrollbarRef = reactive([]);

        const collectRef = (ref, el) => {
            if (!ref.includes(el)) {
                ref.push(el);
            }
        };

        const handleRef = (el) => {
            bodyWrapperRef.value = el;
            collectRef(scrollbarRef, el);
            containerRef.value = el;
        };

        const renderFixTable = (fixedColumn) => (
            <div
                className={getFixClass(fixedColumn)}
                style={getFixStyle(fixedColumn)}
                ref={(el) => {
                    collectRef(scrollbarRef, el);
                }}
            >
                {props.showHeader && !isUndefined(props.height) && (
                    <div
                        ref={(el) => {
                            collectRef(fixeHeaderWrapperRef, el);
                        }}
                        className={`${prefixCls}-header-wrapper`}
                        style={headerWrapperStyle}
                    >
                        <TableHeader fixedColumn={fixedColumn} />
                    </div>
                )}
                <div
                    ref={(el) => {
                        collectRef(fixedBodyWrapperRef, el);
                    }}
                    v-mousewheel={handleFixedMousewheel}
                    className={`${prefixCls}-body-wrapper`}
                    style={{
                        ...bodyWrapperStyle.value,
                        ...fixBodyWrapperStyle.value,
                    }}
                >
                    <TableBody
                        emptyText={props.emptyText}
                        showHeader={props.showHeader}
                        fixedColumn={fixedColumn}
                        height={props.height}
                    />
                </div>
            </div>
        );

        return () => (
            <div
                ref={wrapperRef}
                className={wrapperClass.value}
                style={wrapperStyle.value}
            >
                <div ref="hiddenColumns" class="hidden-columns">
                    {ctx.slots?.default()}
                </div>
                {props.showHeader && !isUndefined(props.height) && (
                    <div
                        ref={headerWrapperRef}
                        v-mousewheel={handleHeaderMousewheel}
                        className={`${prefixCls}-header-wrapper`}
                        style={headerWrapperStyle}
                    >
                        <TableHeader />
                    </div>
                )}
                <div
                    ref={handleRef}
                    className={`${prefixCls}-body-wrapper`}
                    style={bodyWrapperStyle.value}
                    onScroll={(e) => {
                        syncPosition(e);
                        onScroll(e);
                    }}
                >
                    <TableBody
                        showHeader={props.showHeader}
                        emptyText={props.emptyText}
                        height={props.height}
                    />
                </div>
                {fixLeftColumn.value && renderFixTable(fixLeftColumn.value)}
                {fixRightColumn.value && renderFixTable(fixRightColumn.value)}
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
