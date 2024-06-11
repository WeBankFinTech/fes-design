import { type CSSProperties, type Ref, computed, reactive, ref, watch } from 'vue';
import { isFunction, isPlainObject, isUndefined, throttle } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { getCellValue } from './helper';
import useTableLayout from './useTableLayout';

import type { ColumnFixedStatus } from './useTableColumn';
import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

const prefixCls = getPrefixCls('table');

export default ({
    props,
    columns,
    columnsFixed,
    expandColumn,
    isExpandOpened,
    showData,
}: {
    showData: Ref<object[]>;
    props: TableProps;
    columns: Ref<ColumnInst[]>;
    columnsFixed: Ref<ColumnFixedStatus>;
    expandColumn: Ref<ColumnInst>;
    isExpandOpened: ({ row }: { row: RowType }) => boolean;
}) => {
    const wrapperRef = ref<HTMLElement>(null);
    const headerWrapperRef = ref(null);
    const bodyWrapperRef = ref(null);
    const scrollbarRef = ref(null);

    const wrapperClass = computed(() =>
        [
            prefixCls,
            props.bordered && 'is-bordered',
            props.size && `is-size-${props.size}`,
            props.horizontalLine && 'is-horizontal-line',
            props.verticalLine && 'is-vertical-line',
        ]
            .filter(Boolean)
            .join(' '),
    );

    const layout = useTableLayout({
        wrapperRef,
        headerWrapperRef,
        bodyWrapperRef,
        props,
        columns,
        showData,
    });

    const scrollState = reactive({
        x: 'left',
    });

    const headerWrapperClass = computed(() => {
        const arr = [`${prefixCls}-header-wrapper`];
        if (scrollState.x) {
            arr.push(`is-scrolling-x-${scrollState.x}`);
        }
        return arr;
    });

    /**
     * HeaderTable 不使用 Scrollbar
     * 因此需要处理 left, right, none 三种情况下的滚动内阴影
     * both 的情况由 cell 绘制阴影
     */
    const headerShadowVisible = computed<{ left: boolean; right: boolean }>(
        () => {
            if (columnsFixed.value === 'both') {
                return { left: false, right: false };
            }

            if (columnsFixed.value === 'none') {
                return {
                    left: ['left', 'middle'].includes(scrollState.x),
                    right: ['right', 'middle'].includes(scrollState.x),
                };
            }

            let left = false;
            let right = false;

            if (columnsFixed.value === 'left') {
                left = ['left', 'middle'].includes(scrollState.x);
            } else if (columnsFixed.value === 'right') {
                right = ['right', 'middle'].includes(scrollState.x);
            }

            return { left, right };
        },
    );

    const bodyWrapperClass = computed(() => {
        const arr = [`${prefixCls}-body-wrapper`];
        if (scrollState.x) {
            arr.push(`is-scrolling-x-${scrollState.x}`);
        }
        /**
         * BodyTable 使用 Scrollbar
         * 仅处理单侧有固定列的情况
         * none 的情况由 Scrollbar 绘制阴影
         * both 的情况由 cell 绘制阴影
         */
        if (['left', 'right'].includes(columnsFixed.value)) {
            arr.push(`columns-fixed-${columnsFixed.value}`);
        }
        return arr;
    });

    const bodyWrapperStyle = computed(() => {
        const style: CSSProperties = {};
        if (layout.isScrollY.value) {
            style.height = `${layout.bodyHeight.value}px`;
        }
        return style;
    });

    const headerStyle = computed(() => {
        const style = {
            width: `${layout.bodyWidth.value}px`,
        };
        return style;
    });

    const bodyStyle = computed(() => {
        const style = {
            width: `${layout.bodyWidth.value}px`,
        };
        return style;
    });

    const getRowClassName = ({
        row,
        rowIndex,
    }: {
        row: RowType;
        rowIndex: number;
    }) => {
        const classList = [`${prefixCls}-row`];
        const rowClassName = props.rowClassName;
        if (expandColumn.value) {
            classList.push(isExpandOpened({ row }) && 'is-opened');
        }
        classList.push(
            typeof rowClassName === 'function'
                ? rowClassName({ row, rowIndex })
                : rowClassName,
        );
        if (props.striped && rowIndex % 2 === 1) {
            classList.push('is-striped');
        }
        return classList.filter(Boolean);
    };

    const getRowStyle = ({
        row,
        rowIndex,
    }: {
        row: RowType;
        rowIndex: number;
    }) => {
        const rowStyle = props.rowStyle;
        if (isPlainObject(rowStyle)) {
            return rowStyle;
        }
        if (isFunction(rowStyle)) {
            return rowStyle({ row, rowIndex });
        }
    };

    const getCellClass = ({
        column,
        columns,
    }: {
        column: ColumnInst;
        columns: ColumnInst[];
    }) => {
        const arr = [`${prefixCls}-cell`, column.id];
        // 兼容多级表头的情况
        const columnIndex = columns.findIndex((item) => item.id === column.id);
        if (layout.isScrollX.value && column.fixedLeft) {
            arr.push(`${prefixCls}-fixed-left`);
            if (!columns[columnIndex + 1]?.fixedLeft) {
                arr.push('is-last');
            }
        }
        if (layout.isScrollX.value && column.fixedRight) {
            arr.push(`${prefixCls}-fixed-right`);
            if (!columns[columnIndex - 1]?.fixedRight) {
                arr.push('is-first');
            }
        }
        return arr;
    };

    const getCustomCellClass = ({
        row,
        column,
        rowIndex,
        columnIndex,
    }: {
        row: RowType;
        column: ColumnInst;
        rowIndex: number;
        columnIndex: number;
    }) => {
        const colClassName = column.props.colClassName;
        const cellValue = getCellValue(row, column);
        return [
            typeof colClassName === 'function'
                ? colClassName({
                    row,
                    column,
                    rowIndex,
                    columnIndex,
                    cellValue,
                })
                : colClassName,
        ];
    };

    const getCellStyle = ({
        column,
        columns,
        row,
    }: {
        column: ColumnInst;
        columns: ColumnInst[];
        row?: RowType;
    }): CSSProperties => {
        // 兼容多级表头的情况
        const columnIndex = columns.findIndex((item) => item.id === column.id);
        const align = column.props.align;
        const alignStyle: CSSProperties = {
            'text-align': !row && column.colSpan > 1 ? 'center' : align,
        };
        const fixedStyle: CSSProperties = {};
        if (column.fixedLeft && layout.isScrollX.value) {
            const leftColumns = columns.slice(0, columnIndex);
            const width = leftColumns.reduce((accumulator, currentValue) => {
                const width = layout.widthMap.value[currentValue.id]?.width;
                const minWidth
                    = layout.widthMap.value[currentValue.id]?.minWidth;
                return (width || minWidth) + accumulator;
            }, 0);
            fixedStyle.left = `${width}px`;
        } else if (column.fixedRight && layout.isScrollX.value) {
            const rightColumns = columns.slice(columnIndex + 1);
            const width = rightColumns.reduceRight(
                (accumulator, currentValue) => {
                    const width = layout.widthMap.value[currentValue.id]?.width;
                    const minWidth
                        = layout.widthMap.value[currentValue.id]?.minWidth;
                    return (width || minWidth) + accumulator;
                },
                0,
            );
            fixedStyle.right = `${width}px`;
        }
        return { ...alignStyle, ...fixedStyle };
    };

    const getCustomCellStyle = ({
        row,
        column,
        rowIndex,
        columnIndex,
    }: {
        row?: RowType;
        column: ColumnInst;
        rowIndex?: number;
        columnIndex?: number;
    }) => {
        const cellValue = getCellValue(row, column);
        const colStyle = column.props.colStyle;
        let extraStyle = {};
        // row 为空，则是表头，表头不处理 colStyle
        if (row) {
            if (isPlainObject(colStyle)) {
                extraStyle = colStyle;
            }
            if (isFunction(colStyle)) {
                extraStyle = colStyle({
                    row,
                    column,
                    rowIndex,
                    columnIndex,
                    cellValue,
                });
            }
        }
        return extraStyle;
    };

    const getCellSpan = ({
        row,
        column,
        rowIndex,
        columnIndex,
    }: {
        row: RowType;
        column: ColumnInst;
        rowIndex: number;
        columnIndex: number;
    }) => {
        let rowspan = '1';
        let colspan = '1';
        if (isFunction(props.spanMethod)) {
            const result = props.spanMethod({
                row,
                column,
                rowIndex,
                columnIndex,
            });
            if (isPlainObject(result)) {
                rowspan = result.rowspan;
                colspan = result.colspan;
            }
        }
        return {
            rowspan,
            colspan,
        };
    };

    // 更新 scrollState，根据 bodyWrapper 或 headerWrapper 的尺寸位置信息
    const updateScrollState = (
        { scrollLeft, offsetWidth, scrollWidth }:
        { scrollLeft: number; offsetWidth: number; scrollWidth: number },
    ): void => {
        const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
        if (scrollLeft >= maxScrollLeftPosition) {
            scrollState.x = 'right';
        } else if (scrollLeft === 0) {
            scrollState.x = 'left';
        } else {
            scrollState.x = 'middle';
        }
    };

    // 边界场景：重置滚动状态
    watch(
        [
            () => props.height,
            () => showData.value.length,
        ],
        (
            [nextHeight, nextDataLength],
            [prevHeight, prevDataLength],
        ) => {
            if (!props.showHeader) {
                return;
            }

            const resetScrolling = (resetBodyTable = true): void => {
                // BodyTable
                if (resetBodyTable && scrollbarRef.value) {
                    scrollbarRef.value.containerRef.scrollLeft = 0;
                }
                // HeaderTable
                if (headerWrapperRef.value) {
                    headerWrapperRef.value.scrollLeft = 0;
                }
                // updateScrollState
                scrollState.x = 'left';
            };

            if (
                // <BodyTable> -> <NoData>
                prevDataLength !== 0 && nextDataLength === 0
            ) {
                resetScrolling(false);
            } else if (
                // <NoData> -> <BodyTable>
                prevDataLength === 0 && nextDataLength !== 0
            ) {
                resetScrolling();
            } else if (
                // 不固定表头 -> 固定表头
                isUndefined(prevHeight) && !isUndefined(nextHeight)
            ) {
                resetScrolling();
            }
        },
    );

    // BodyTable 滚动后，同步 HeaderTable(可能不存在) 的 scrollLeft
    const syncPosition = throttle((e: Event) => {
        const $bodyWrapper = e.target as HTMLElement;
        if (!$bodyWrapper) {
            return;
        }
        const { scrollLeft, offsetWidth, scrollWidth } = $bodyWrapper;

        const $headerWrapper = headerWrapperRef.value;
        if ($headerWrapper) {
            $headerWrapper.scrollLeft = scrollLeft;
        }

        updateScrollState({ scrollLeft, offsetWidth, scrollWidth });
    }, 10);

    const handleHeaderMousewheel = (e: WheelEvent) => {
        const { deltaX, deltaY } = e;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            e.preventDefault();

            /**
             * 没有数据时，
             * bodyWrapper 的 offsetWidth === scrollWidth，此时设置 scrollLeft 不生效
             * 无法通过 bodyWrapper 的 scroll 事件回调触发 syncPosition 以更新 headerWrapper 的 scrollLeft
             * 注意，headerWrapper 的 overflow 为 hidden，可以响应 scroll 事件但是元素无法滚动
             */
            if (showData.value.length === 0 && headerWrapperRef.value) {
                headerWrapperRef.value.scrollLeft += deltaX;

                const { scrollLeft, offsetWidth, scrollWidth } = headerWrapperRef.value;
                updateScrollState({ scrollLeft, offsetWidth, scrollWidth });

                return;
            }

            /**
             * 有数据时，
             * 仍按照原逻辑，先更新 bodyWrapper 的 scrollLeft，再 syncPosition
             */
            if (scrollbarRef.value) {
                scrollbarRef.value.containerRef.scrollLeft += deltaX;
            }
        }
    };

    return {
        prefixCls,
        wrapperRef,
        headerWrapperRef,
        bodyWrapperRef,
        layout,
        wrapperClass,
        bodyWrapperStyle,
        headerStyle,
        bodyStyle,
        getCellSpan,
        getRowClassName,
        getRowStyle,
        getCellClass,
        getCustomCellClass,
        getCellStyle,
        getCustomCellStyle,
        syncPosition,
        headerShadowVisible,
        handleHeaderMousewheel,
        headerWrapperClass,
        bodyWrapperClass,
        scrollbarRef,
    };
};
