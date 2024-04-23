import { type Ref, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useEventListener } from '@vueuse/core';
import { depx } from '../_util/utils';
import type useTableEvent from './useTableEvent';
import type { ColumnInst, ColumnProps } from './column';
import type { WidthItem } from './useTableLayout';

export type ColumnResizeInfo = {
    prop: ColumnProps['prop'];
    width: WidthItem['width'];
    index: number;
};

export default (
    columns: ColumnInst[],
    widthMap: Ref<Record<string, WidthItem>>,
    handleHeaderResize: ReturnType<typeof useTableEvent>['handleHeaderResize'],
) => {
    const current = ref<{
        id: number;
        columnIndex: number;
        clientX: number;
        width: number;
    }>(null);

    const onMousedown = (
        column: ColumnInst,
        columnIndex: number,
        event: MouseEvent,
    ) => {
        current.value = {
            id: column.id,
            clientX: event.clientX,
            columnIndex,
            width: depx(
                (event.target as HTMLElement).parentElement.offsetWidth,
            ),
        };
    };

    const onMousemove = (event: MouseEvent) => {
        if (!current.value) return;
        const _widthMap = cloneDeep(widthMap.value);
        const leftColumns = columns
            .slice(0, current.value.columnIndex)
            .filter((col) => {
                return !_widthMap[col.id].width;
            });
        const rightColumns = columns
            .slice(current.value.columnIndex + 1)
            .filter((col) => {
                return !_widthMap[col.id].width;
            });
        const offsetX
            = ((event.clientX - current.value.clientX)
            * (leftColumns.length + rightColumns.length))
            / rightColumns.length;
        const width = current.value.width + offsetX;
        const currentColumn = columns[current.value.columnIndex];
        if (
            currentColumn.props.minWidth
            && width >= currentColumn.props.minWidth
        ) {
            _widthMap[current.value.id].width = width;
            _widthMap[current.value.id].minWidth = width;
            widthMap.value = _widthMap;
        }
    };

    const onMouseup = (event: MouseEvent) => {
        if (!current.value) return;

        // emit header resize event
        const currentColumnInstance = columns.find(
            (c) => c.id === current.value.id,
        );
        if (!currentColumnInstance) return;

        handleHeaderResize(
            {
                current: {
                    prop: currentColumnInstance.props.prop,
                    width: current.value.width,
                    index: current.value.columnIndex,
                },
                columns: columns.map((c, i) => {
                    const width = widthMap.value[c.id].width;
                    return {
                        width,
                        prop: c.props.prop,
                        index: i,
                    };
                }),
            },
            event,
        );

        // reset current
        current.value = null;
    };

    useEventListener(window.document, 'mousemove', onMousemove);

    useEventListener(window.document, 'mouseup', onMouseup);

    return {
        onMousedown,
        onMousemove,
        onMouseup,
        current,
    };
};
