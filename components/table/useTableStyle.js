import { onMounted, onBeforeUnmount, computed, nextTick, ref, reactive, watch } from 'vue';
import { isString, isFunction, isPlainObject, throttle, debounce, isArray } from 'lodash-es';
import { ResizeObserver } from '@juggle/resize-observer';
import getPrefixCls from '../_util/getPrefixCls';
import { getCellValue } from './helper';

const prefixCls = getPrefixCls('table');

/**
 * 更新列的宽度
 * 列最小宽度为80，如果设定了width则使用设定的width作为宽度，没有设定宽度的列平分剩余的宽度（容器的宽度减去已使用的宽度）
 */
function useTableLayout({ props, wrapperRef, headerWrapperRef, bodyWrapperRef, columns }) {
    const widthList = ref([]);
    const heightList = ref([]);
    const bodyWidth = ref(0);
    const isScrollX = ref(false);
    const isScrollY = ref(false);
    const wrapperHeight = ref(0);
    const headerHeight = ref(0);
    const bodyHeight = ref(0);

    const handlerHeight = () => {
        // 需要在宽度分配完，重新渲染后，此时table已经按照期望正常渲染，此时的高度才是最终高度
        const $wrapper = wrapperRef.value;
        const $bodyWrapper = bodyWrapperRef.value;
        if ($wrapper && $bodyWrapper) {
            const bodyWrapperHeight = $bodyWrapper.offsetHeight;
            if (props.height) {
                const $headerWrapper = props.showHeader ? headerWrapperRef.value : { offsetHeight: 0 };
                const headerWrapperHeight = $headerWrapper.offsetHeight;
                // 减去wrapperRef的border-bottom
                const remainBodyHeight = props.height - headerWrapperHeight - 1;
                bodyHeight.value = remainBodyHeight;
                if (remainBodyHeight < bodyWrapperHeight) {
                    isScrollY.value = true;
                }
                headerHeight.value = headerWrapperHeight;
            }
            wrapperHeight.value = $wrapper.offsetHeight;
            heightList.value = Array.from($bodyWrapper.querySelectorAll('tbody tr')).map(($tr) => $tr.offsetHeight);
        }
    };

    const handlerWidth = () => {
        if (wrapperRef.value) {
            const $wrapper = wrapperRef.value;
            const _wrapperWidth = $wrapper.offsetWidth;
            const wrapperWidth = props.bordered ? _wrapperWidth - 2 : _wrapperWidth;
            let bodyMinWidth = 0;
            const min = 80;
            const _widthList = [];
            columns.value.forEach((column) => {
                const widthObj = {
                    id: column.id,
                };
                const width = column.props.width;
                const minWidth = column.props.minWidth;
                if (width) {
                    // 用户设置的宽度优先级最高
                    bodyMinWidth += width;
                    widthObj.width = width;
                } else if (minWidth) {
                    // minWidth次之
                    bodyMinWidth += minWidth;
                    widthObj.minWidth = minWidth;
                } else if (column.props.type === 'selection' || column.props.type === 'expand') {
                    // 展开和选择列固定为80（如果没有设置宽度的话）
                    bodyMinWidth += min;
                    widthObj.width = min;
                } else {
                    bodyMinWidth += min;
                }
                _widthList.push(widthObj);
            });
            widthList.value = _widthList;
            const needAddWidthColumns = widthList.value.filter((column) => !column.width);
            // 如果不够，则需要补宽度
            if (bodyMinWidth < wrapperWidth) {
                bodyWidth.value = wrapperWidth;
                const surplus = (wrapperWidth - bodyMinWidth) % needAddWidthColumns.length;
                const average = (wrapperWidth - bodyMinWidth - surplus) / needAddWidthColumns.length;
                needAddWidthColumns.forEach((column, index) => {
                    column.width = (column.minWidth || min) + (index === 0 ? average + surplus : average);
                });
            } else {
                isScrollX.value = true;
                bodyWidth.value = bodyMinWidth;
                needAddWidthColumns.forEach((column) => {
                    column.width = column.minWidth || min;
                });
            }
        }
    };

    // 检测Table宽度变化
    const ro = new ResizeObserver(
        debounce(() => {
            nextTick(() => {
                handlerWidth();
            });
        }, 100),
    );

    watch(wrapperRef, ($wrapper) => {
        if ($wrapper) {
            ro.observe($wrapper);
        }
    });

    onBeforeUnmount(() => {
        ro.disconnect();
    });

    watch([columns, () => props.bordered, wrapperRef], handlerWidth);

    // 当宽度计算出来，table渲染后，这是height才固定
    // 第一层nextTick避免在width计算出来后无意义的计算
    nextTick(() => {
        watch(
            [widthList, () => props.height, () => props.showHeader, wrapperRef, bodyWrapperRef, headerWrapperRef],
            () => {
                // 假如宽度发生变化，则需要等待渲染后再计算
                nextTick(handlerHeight);
            },
            {
                immediate: true,
            },
        );
    });

    return {
        widthList,
        heightList,
        wrapperHeight,
        headerHeight,
        bodyWidth,
        bodyHeight,
        isScrollX,
        isScrollY,
    };
}

export default ({ props, columns, expandColumn, isExpandOpened }) => {
    const wrapperRef = ref(null);
    const headerWrapperRef = ref(null);
    const bodyWrapperRef = ref(null);
    const fixedBodyWrapperRef = reactive([]);
    const fixeHeaderWrapperRef = reactive([]);

    const wrapperClass = computed(() => [prefixCls, props.bordered && 'is-bordered', props.size && `is-size-${props.size}`].filter(Boolean).join(' '));

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
        const classList = Array.from(el.classList).filter((item) => !item.startsWith('is-scrolling'));
        classList.push(className);
        el.className = classList.join(' ');
    };

    // 同步两个table的位移
    const syncPosition = throttle(() => {
        const $bodyWrapper = bodyWrapperRef.value;
        if (!$bodyWrapper) return;
        const { scrollLeft, scrollTop, offsetWidth, scrollWidth } = $bodyWrapper;
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
            setScrollClassByEl($bodyWrapper, isScrollX ? 'is-scrolling-right' : '');
        } else if (scrollLeft === 0) {
            setScrollClassByEl($bodyWrapper, isScrollX ? 'is-scrolling-left' : '');
        } else {
            setScrollClassByEl($bodyWrapper, isScrollX ? 'is-scrolling-middle' : '');
        }
        const isScrollY = layout.isScrollY.value;
        setScrollClassByEl($headerWrapper, isScrollY && scrollTop > 0 ? 'is-scrolling' : '');
        const $fixeHeaderWrapper = fixeHeaderWrapperRef;
        if ($fixeHeaderWrapper.length) {
            $fixeHeaderWrapper.forEach((item) => {
                setScrollClassByEl(item, isScrollY && scrollTop > 0 ? 'is-scrolling' : '');
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
