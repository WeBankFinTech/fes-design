import type { ComputedRef, Ref } from 'vue';
import { ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useEventListener } from '@vueuse/core';
import { depx } from '../_util/utils';
import type useTableEvent from './useTableEvent';
import type { ColumnInst, ColumnProps } from './column';
import type { WidthItem } from './useTableLayout';

export interface ColumnResizeInfo {
    prop: ColumnProps['prop'];
    width: WidthItem['width'];
    index: number;
}

export default (
    columns: ColumnInst[],
    widthMap: Ref<Record<string, WidthItem>>,
    handleHeaderResize: ReturnType<typeof useTableEvent>['handleHeaderResize'],
    isWatchX: Ref<boolean>,
    isWidthAuto: ComputedRef<boolean>,
) => {
    const current = ref<{
        id: number;
        columnIndex: number;
        clientX: number;
        width: number;
    }>(null);

    let _widthMap: Record<string, WidthItem> = null;

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
        _widthMap = cloneDeep(widthMap.value);
        isWatchX.value = false;
    };

    const onMousemove = (event: MouseEvent) => {
        if (!current.value) {
            return;
        }
        if (!_widthMap) {
            return;
        }
        const currentClientX = event.clientX;
        const offset = currentClientX - current.value.clientX;

        if (!isWidthAuto.value) {
            const rightColumns = columns.slice(current.value.columnIndex + 1);
            widthMap.value[current.value.id].width = offset + _widthMap[current.value.id].width;
            rightColumns.forEach((col) => {
                widthMap.value[col.id].width = (-offset / rightColumns.length) + _widthMap[col.id].width;
            });
        } else {
            widthMap.value[current.value.id] = {
                ..._widthMap[current.value.id],
                width: offset + current.value.width,
                minWidth: offset + current.value.width,
                maxWidth: offset + current.value.width,
            };
        }
    };

    const onMouseup = (event: MouseEvent) => {
        if (!current.value) {
            return;
        }

        // emit header resize event
        const currentColumnInstance = columns.find(
            (c) => c.id === current.value.id,
        );
        if (!currentColumnInstance) {
            return;
        }

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
        _widthMap = null;
        isWatchX.value = true;
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
