import { onMounted, computed, ref, reactive } from 'vue';
import {
    isString,
    isFunction,
    isPlainObject,
    throttle,
    isArray,
} from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { getCellValue } from './helper';
import useTableLayout from './useTableLayout';

const prefixCls = getPrefixCls('table');

export default ({ props, columns, expandColumn, isExpandOpened }) => {
    const wrapperRef = ref(null);
    const headerWrapperRef = ref(null);
    const bodyWrapperRef = ref(null);
    const fixedBodyWrapperRef = reactive([]);
    const fixeHeaderWrapperRef = reactive([]);

    const wrapperClass = computed(() =>
        [
            prefixCls,
            props.bordered && 'is-bordered',
            props.size && `is-size-${props.size}`,
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
    });

    const wrapperStyle = {};

    const headerWrapperStyle = {};

    const bodyWrapperStyle = computed(() => {
        const style = {};
        if (layout.isScrollY.value) {
            style['overflow-y'] = 'scroll';
            style.height = `${layout.bodyHeight.value}px`;
        }
        if (layout.isScrollX.value) {
            style['overflow-x'] = 'scroll';
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

    const getRowClassName = ({ row, rowIndex }) => {
        let defaultClass = '';
        const rowClassName = props.rowClassName;
        if (expandColumn.value) {
            defaultClass = isExpandOpened({ row, rowIndex }) ? 'is-opened' : '';
        }
        if (isString(rowClassName)) {
            return `${rowClassName} ${defaultClass}`;
        }
        if (isFunction(rowClassName)) {
            const res = rowClassName({ row, rowIndex });
            if (isString(res)) {
                return `${res} ${defaultClass}`;
            }
            if (isArray(res)) {
                return [...res, defaultClass];
            }
            if (isPlainObject(res)) {
                return {
                    ...res,
                    [defaultClass]: true,
                };
            }
        }
        return defaultClass;
    };

    const getRowStyle = ({ row, rowIndex }) => {
        const rowStyle = props.rowStyle;
        if (isPlainObject(rowStyle)) {
            return rowStyle;
        }
        if (isFunction(rowStyle)) {
            return rowStyle({ row, rowIndex });
        }
    };

    const getColClassName = ({ row, column, rowIndex, columnIndex }) => {
        const colClassName = column.props.colClassName;
        const cellValue = getCellValue(row, column);
        if (isString(colClassName)) {
            return colClassName;
        }
        if (isFunction(colClassName)) {
            return colClassName({
                row,
                column,
                rowIndex,
                columnIndex,
                cellValue,
            });
        }
    };

    const getColStyle = ({ row, column, rowIndex, columnIndex }) => {
        const cellValue = getCellValue(row, column);
        const colStyle = column.props.colStyle;
        const align = column.props.align;
        const alignStyle = {
            'text-align': !row && column.colSpan > 1 ? 'center' : align,
        };
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
        return { ...alignStyle, ...extraStyle };
    };

    const getCellSpan = ({ row, column, rowIndex, columnIndex }) => {
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

    const setScrollClassByEl = (el, className) => {
        if (!el) return;
        const classList = Array.from(el.classList).filter(
            (item) => !item.startsWith('is-scrolling'),
        );
        classList.push(className);
        el.className = classList.join(' ');
    };

    // 同步两个table的位移
    const syncPosition = throttle(() => {
        const $bodyWrapper = bodyWrapperRef.value;
        if (!$bodyWrapper) return;
        const { scrollLeft, scrollTop, offsetWidth, scrollWidth } =
            $bodyWrapper;
        const $headerWrapper = headerWrapperRef.value;
        if ($headerWrapper) {
            $headerWrapper.scrollLeft = scrollLeft;
        }
        const $fixedBodyWrapper = fixedBodyWrapperRef;
        if ($fixedBodyWrapper.length) {
            $fixedBodyWrapper.forEach((item) => {
                item.scrollTop = scrollTop;
            });
        }
        const maxScrollLeftPosition = scrollWidth - offsetWidth - 1;
        const isScrollX = layout.isScrollX.value;
        if (scrollLeft >= maxScrollLeftPosition) {
            setScrollClassByEl(
                $bodyWrapper,
                isScrollX ? 'is-scrolling-right' : '',
            );
        } else if (scrollLeft === 0) {
            setScrollClassByEl(
                $bodyWrapper,
                isScrollX ? 'is-scrolling-left' : '',
            );
        } else {
            setScrollClassByEl(
                $bodyWrapper,
                isScrollX ? 'is-scrolling-middle' : '',
            );
        }
        const isScrollY = layout.isScrollY.value;
        setScrollClassByEl(
            $headerWrapper,
            isScrollY && scrollTop > 0 ? 'is-scrolling' : '',
        );
        const $fixeHeaderWrapper = fixeHeaderWrapperRef;
        if ($fixeHeaderWrapper.length) {
            $fixeHeaderWrapper.forEach((item) => {
                setScrollClassByEl(
                    item,
                    isScrollY && scrollTop > 0 ? 'is-scrolling' : '',
                );
            });
        }
    }, 10);

    const handleHeaderMousewheel = (e, data) => {
        const { pixelX, pixelY } = data;
        if (Math.abs(pixelX) >= Math.abs(pixelY)) {
            e.preventDefault();
            bodyWrapperRef.value.scrollLeft += data.pixelX;
        }
    };

    const handleFixedMousewheel = (e, data) => {
        const { pixelX, pixelY } = data;
        if (Math.abs(pixelY) >= Math.abs(pixelX)) {
            e.preventDefault();
            bodyWrapperRef.value.scrollTop += data.pixelY;
        }
    };

    onMounted(() => {
        setScrollClassByEl(bodyWrapperRef.value, 'is-scrolling-left');
    });

    return {
        wrapperRef,
        headerWrapperRef,
        bodyWrapperRef,
        getRowClassName,
        getRowStyle,
        getColClassName,
        getColStyle,
        wrapperClass,
        prefixCls,
        layout,
        wrapperStyle,
        headerWrapperStyle,
        bodyWrapperStyle,
        headerStyle,
        bodyStyle,
        getCellSpan,
        syncPosition,
        fixedBodyWrapperRef,
        fixeHeaderWrapperRef,
        handleHeaderMousewheel,
        handleFixedMousewheel,
    };
};
