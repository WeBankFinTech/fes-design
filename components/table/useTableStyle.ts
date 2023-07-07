import { computed, ref, reactive, Ref, CSSProperties } from 'vue';
import { isFunction, isPlainObject, throttle } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { getCellValue } from './helper';
import useTableLayout from './useTableLayout';

const prefixCls = getPrefixCls('table');

import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst } from './column';

export default ({
    props,
    columns,
    expandColumn,
    isExpandOpened,
    showData,
}: {
    showData: Ref<object[]>;
    props: TableProps;
    columns: Ref<ColumnInst[]>;
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

    const bodyWrapperClass = computed(() => {
        const arr = [`${prefixCls}-body-wrapper`];
        if (scrollState.x) {
            arr.push(`is-scrolling-x-${scrollState.x}`);
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
        const defaultClass = [`${prefixCls}-row`];
        const rowClassName = props.rowClassName;
        if (expandColumn.value) {
            defaultClass.push(isExpandOpened({ row }) && ' is-opened');
        }
        defaultClass.push(
            typeof rowClassName === 'function'
                ? rowClassName({ row, rowIndex })
                : rowClassName,
        );
        return defaultClass;
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
        columnIndex,
    }: {
        column: ColumnInst;
        columns: ColumnInst[];
        columnIndex: number;
    }) => {
        const arr = [`${prefixCls}-cell`, column.id];
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
        columnIndex,
        row,
    }: {
        column: ColumnInst;
        columns: ColumnInst[];
        columnIndex: number;
        row?: RowType;
    }): CSSProperties => {
        const align = column.props.align;
        const alignStyle: CSSProperties = {
            'text-align': !row && column.colSpan > 1 ? 'center' : align,
        };
        const fixedStyle: CSSProperties = {};
        if (column.fixedLeft && layout.isScrollX.value) {
            const leftColumns = columns.slice(0, columnIndex);
            const width = leftColumns.reduce((accumulator, currentValue) => {
                const width = layout.widthList.value[currentValue.id]?.width;
                const minWidth =
                    layout.widthList.value[currentValue.id]?.minWidth;
                return (width || minWidth) + accumulator;
            }, 0);
            fixedStyle.left = `${width}px`;
        } else if (column.fixedRight && layout.isScrollX.value) {
            const rightColumns = columns.slice(columnIndex + 1);
            const width = rightColumns.reduceRight(
                (accumulator, currentValue) => {
                    const width =
                        layout.widthList.value[currentValue.id]?.width;
                    const minWidth =
                        layout.widthList.value[currentValue.id]?.minWidth;
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

    // 同步两个table的位移
    const syncPosition = throttle((e: Event) => {
        const $bodyWrapper = e.target as HTMLElement;
        if (!$bodyWrapper) return;
        const { scrollLeft, offsetWidth, scrollWidth } = $bodyWrapper;
        const $headerWrapper = headerWrapperRef.value;
        if ($headerWrapper) {
            $headerWrapper.scrollLeft = scrollLeft;
        }
        const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
        if (scrollLeft >= maxScrollLeftPosition) {
            scrollState.x = 'right';
        } else if (scrollLeft === 0) {
            scrollState.x = 'left';
        } else {
            scrollState.x = 'middle';
        }
    }, 10);

    const handleHeaderMousewheel = (e: WheelEvent) => {
        const { deltaX, deltaY } = e;
        if (Math.abs(deltaX) >= Math.abs(deltaY)) {
            e.preventDefault();
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
        handleHeaderMousewheel,
        headerWrapperClass,
        bodyWrapperClass,
        scrollbarRef,
    };
};
