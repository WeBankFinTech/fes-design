import {
    type Ref,
    computed,
    nextTick,
    onActivated,
    onDeactivated,
    ref,
    watch,
} from 'vue';
import { isEqual, isUndefined } from 'lodash-es';
import useResize from '../_util/use/useResize';

import type { TableProps } from './table';
import type { ColumnInst } from './column';

export interface WidthItem {
    id: number;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
}

/**
 * 更新列的宽度
 * 列最小宽度为80，如果设定了width则使用设定的width作为宽度，没有设定宽度的列平分剩余的宽度（容器的宽度减去已使用的宽度）
 */
export default function useTableLayout({
    props,
    wrapperRef,
    headerWrapperRef,
    bodyWrapperRef,
    bodyTableRef,
    columns,
    showData,
}: {
    showData: Ref<object[]>;
    props: TableProps;
    wrapperRef: Ref<HTMLElement>;
    headerWrapperRef: Ref<HTMLElement>;
    bodyWrapperRef: Ref<HTMLElement>;
    bodyTableRef: Ref<HTMLElement>;
    columns: Ref<ColumnInst[]>;
}) {
    const bodyWidth = ref(0);
    const widthMap = ref<Record<string, WidthItem>>({});
    const isScrollX = ref(false);
    const isScrollY = ref(false);
    const bodyHeight = ref(0);
    const initRef = ref(false);

    // 兼容 windows 浏览器滚动条导致高度有小数的场景
    const propHeight = computed(() => Math.floor(props.height));

    const isWidthAuto = computed(() => {
        return isUndefined(props.height) && props.layout === 'auto';
    });

    const min = 80;

    const computeY = () => {
        // 第一次渲染时会出现 bodyWrapperHeight = 0，必须再nextTick
        nextTick(() => {
            // 需要在宽度分配完，重新渲染后，此时table已经按照期望正常渲染，此时的高度才是最终高度
            const $wrapper = wrapperRef.value;
            const $bodyWrapper = bodyWrapperRef.value;
            if ($wrapper && $bodyWrapper) {
                if (propHeight.value) {
                    const $headerWrapper = props.showHeader
                        ? headerWrapperRef.value
                        : { offsetHeight: 0 };
                    const headerWrapperHeight = $headerWrapper.offsetHeight;
                    let remainBodyHeight = propHeight.value - headerWrapperHeight;
                    if (props.bordered) {
                        remainBodyHeight -= 2;
                    }
                    const bodyWrapperHeight = $bodyWrapper.offsetHeight;
                    bodyHeight.value = remainBodyHeight;
                    // 渲染后重新执行，会出现 remainBodyHeight === bodyWrapperHeight 的情况
                    if (remainBodyHeight <= bodyWrapperHeight) {
                        isScrollY.value = true;
                    } else {
                        isScrollY.value = false;
                    }
                } else {
                    isScrollY.value = false;
                }
            }
        });
    };

    const computeX = () => {
        const $wrapper = wrapperRef.value;
        if (!$wrapper) {
            return;
        }
        if (isWidthAuto.value) {
            const $bodyTable = bodyTableRef.value;
            if (!$bodyTable) {
                return;
            }
            isScrollX.value = $bodyTable.offsetWidth > (props.bordered ? $wrapper.offsetWidth - 2 : $wrapper.offsetWidth);
        } else {
            const _wrapperWidth = $wrapper.offsetWidth;
            const wrapperWidth = props.bordered
                ? _wrapperWidth - 2
                : _wrapperWidth;
            let bodyMinWidth = 0;

            Object.keys(widthMap.value).forEach((id) => {
                const widthObj = widthMap.value[id];
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
                column.props.type === 'selection'
                || column.props.type === 'expand'
            ) {
                widthObj.width = min;
            }
            newWidthList[column.id] = widthObj;
        });
        // 如果值一样则没必要再次渲染，可减少一次多余渲染
        if (!isEqual(newWidthList, widthMap.value)) {
            widthMap.value = newWidthList;
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

    // 检测Table宽度和高度变化，计算内容宽度和高度
    useResize(
        wrapperRef,
        () => {
            computeX();
            computeY();
        },
        watchResizeDisableRef,
    );

    useResize(bodyTableRef, () => {
        computeX();
    }, computed(() => {
        return watchResizeDisableRef.value || !isWidthAuto.value;
    }));

    // 根据列数据，计算列宽度
    watch([columns, wrapperRef], computeColumnWidth);

    watch([widthMap, wrapperRef, () => props.bordered], computeX);

    watch(
        [
            widthMap,
            propHeight,
            () => props.showHeader,
            () => props.bordered,
            wrapperRef,
            bodyWrapperRef,
            headerWrapperRef,
        ],
        () => {
            nextTick(computeY);
        },
    );

    // 数据变化的时候，要重置滚动的变量，不然数据不足的时候还是会用之前旧的 bodyWrapperRef
    watch(
        () => showData.value.length,
        () => {
            isScrollY.value = false;
            nextTick(computeY);
        },
    );

    return {
        widthMap,
        bodyWidth,
        bodyHeight,
        isScrollX,
        isScrollY,
        initRef,
    };
}
