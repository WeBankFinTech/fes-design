import { nextTick, ref, watch, Ref, onActivated, onDeactivated } from 'vue';
import { isEqual } from 'lodash-es';
import useResize from '../_util/use/useResize';

import type { TableProps } from './table';
import type { ColumnInst } from './column.vue';

/**
 * 更新列的宽度
 * 列最小宽度为80，如果设定了width则使用设定的width作为宽度，没有设定宽度的列平分剩余的宽度（容器的宽度减去已使用的宽度）
 */
export default function useTableLayout({
    props,
    wrapperRef,
    headerWrapperRef,
    bodyWrapperRef,
    columns,
    showData,
}: {
    showData: Ref<object[]>;
    props: TableProps;
    wrapperRef: Ref<HTMLElement>;
    headerWrapperRef: Ref<HTMLElement>;
    bodyWrapperRef: Ref<HTMLElement>;
    columns: Ref<ColumnInst[]>;
}) {
    const bodyWidth = ref(0);
    const widthList = ref({});
    const isScrollX = ref(false);
    const isScrollY = ref(false);
    const headerHeight = ref(0);
    const bodyHeight = ref(0);
    const initRef = ref(false);

    const handlerHeight = () => {
        // 第一次渲染时会出现 bodyWrapperHeight = 0，必须再nexttick
        nextTick(() => {
            // 需要在宽度分配完，重新渲染后，此时table已经按照期望正常渲染，此时的高度才是最终高度
            const $wrapper = wrapperRef.value;
            const $bodyWrapper = bodyWrapperRef.value;
            if ($wrapper && $bodyWrapper && props.height) {
                const $headerWrapper = props.showHeader
                    ? headerWrapperRef.value
                    : { offsetHeight: 0 };
                const headerWrapperHeight = $headerWrapper.offsetHeight;
                // 减去wrapperRef的border-bottom
                const remainBodyHeight = props.height - headerWrapperHeight - 1;
                bodyHeight.value = remainBodyHeight;
                const bodyWrapperHeight = $bodyWrapper.offsetHeight;
                if (remainBodyHeight < bodyWrapperHeight) {
                    isScrollY.value = true;
                }
                headerHeight.value = headerWrapperHeight;
            }
        });
    };

    const handlerWidth = () => {
        if (wrapperRef.value) {
            const $wrapper = wrapperRef.value;
            const _wrapperWidth = $wrapper.offsetWidth;
            const wrapperWidth = props.bordered
                ? _wrapperWidth - 2
                : _wrapperWidth;
            let bodyMinWidth = 0;
            const min = 80;
            type WidthItem = {
                id: number;
                width?: number;
                minWidth?: number;
            };
            const newWidthList: Record<string, WidthItem> = {};
            columns.value.forEach((column) => {
                const widthObj: WidthItem = {
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
                } else if (
                    column.props.type === 'selection' ||
                    column.props.type === 'expand'
                ) {
                    // 展开和选择列固定为80（如果没有设置宽度的话）
                    bodyMinWidth += min;
                    widthObj.width = min;
                } else {
                    bodyMinWidth += min;
                }
                newWidthList[column.id] = widthObj;
            });
            if (bodyMinWidth < wrapperWidth) {
                isScrollX.value = false;
                bodyWidth.value = wrapperWidth;
            } else {
                isScrollX.value = true;
                bodyWidth.value = bodyMinWidth;
            }
            // 如果值一样则没必要再次渲染，可减少一次多余渲染
            if (!isEqual(newWidthList, widthList.value)) {
                widthList.value = newWidthList;
            }
            nextTick(() => {
                initRef.value = true;
            });
        }
    };

    const watchResizeDisableRef = ref(false);

    onDeactivated(() => {
        watchResizeDisableRef.value = true;
    });

    onActivated(() => {
        watchResizeDisableRef.value = false;
    });

    // 检测Table宽度变化
    useResize(wrapperRef, handlerWidth, watchResizeDisableRef);

    watch([columns, () => props.bordered, wrapperRef], handlerWidth);

    // 当宽度计算出来，table渲染后，这是height才固定
    // 第一层nextTick避免在width计算出来后无意义的计算
    nextTick(() => {
        watch(
            [
                widthList,
                () => props.height,
                () => props.showHeader,
                wrapperRef,
                bodyWrapperRef,
                headerWrapperRef,
                () => showData.value.length,
            ],
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
        headerHeight,
        bodyWidth,
        bodyHeight,
        isScrollX,
        isScrollY,
        initRef,
    };
}
