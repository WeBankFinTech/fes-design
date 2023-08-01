import { nextTick, ref, watch, Ref, onActivated, onDeactivated } from 'vue';
import { isEqual } from 'lodash-es';
import useResize from '../_util/use/useResize';

import type { TableProps } from './table';
import type { ColumnInst } from './column';

export type WidthItem = {
    id: number;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
};

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
    const widthList = ref<Record<string, WidthItem>>({});
    const isScrollX = ref(false);
    const isScrollY = ref(false);
    const headerHeight = ref(0);
    const bodyHeight = ref(0);
    const initRef = ref(false);

    const min = 80;

    const computeY = () => {
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

    const computeX = () => {
        const $wrapper = wrapperRef.value;
        if ($wrapper) {
            const _wrapperWidth = $wrapper.offsetWidth;
            const wrapperWidth = props.bordered
                ? _wrapperWidth - 2
                : _wrapperWidth;
            let bodyMinWidth = 0;

            Object.keys(widthList.value).forEach((id) => {
                const widthObj = widthList.value[id];
                bodyMinWidth += widthObj.width ?? widthObj.minWidth ?? min;
            });

            if (bodyMinWidth < wrapperWidth) {
                isScrollX.value = false;
                bodyWidth.value = wrapperWidth;
            } else {
                isScrollX.value = true;
                bodyWidth.value = bodyMinWidth;
            }
        }
    };

    const computeColumnWidth = () => {
        const newWidthList: Record<string, WidthItem> = {};
        columns.value.forEach((column) => {
            const widthObj: WidthItem = {
                id: column.id,
            };
            const width = column.props.width;
            const minWidth = column.props.minWidth;
            if (width || minWidth) {
                // 用户设置的宽度优先级最高
                widthObj.width = width;
                widthObj.minWidth = minWidth;
            } else if (
                column.props.type === 'selection' ||
                column.props.type === 'expand'
            ) {
                widthObj.width = min;
            }
            newWidthList[column.id] = widthObj;
        });
        // 如果值一样则没必要再次渲染，可减少一次多余渲染
        if (!isEqual(newWidthList, widthList.value)) {
            widthList.value = newWidthList;
        }
        nextTick(() => {
            initRef.value = true;
        });
    };

    const watchResizeDisableRef = ref(false);

    onDeactivated(() => {
        watchResizeDisableRef.value = true;
    });

    onActivated(() => {
        watchResizeDisableRef.value = false;
    });

    // 检测Table宽度变化，计算内容宽度
    useResize(wrapperRef, computeX, watchResizeDisableRef);

    // 根据列数据，计算列宽度
    watch([columns, wrapperRef], computeColumnWidth);

    watch([widthList, wrapperRef, () => props.bordered], computeX);

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
            nextTick(computeY);
        },
    );

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
