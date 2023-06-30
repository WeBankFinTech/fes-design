import { Ref, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { useEventListener } from '@vueuse/core';
import { depx } from '../_util/utils';
import type { ColumnInst } from './column';
import type { WidthItem } from './useTableLayout';

export default (
    columns: ColumnInst[],
    widthList: Ref<Record<string, WidthItem>>,
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
        const _widthList = cloneDeep(widthList.value);
        const leftColumns = columns
            .slice(0, current.value.columnIndex)
            .filter((col) => {
                return !_widthList[col.id].width;
            });
        const rightColumns = columns
            .slice(current.value.columnIndex + 1)
            .filter((col) => {
                return !_widthList[col.id].width;
            });
        const offsetX =
            ((event.clientX - current.value.clientX) *
                (leftColumns.length + rightColumns.length)) /
            rightColumns.length;
        const width = current.value.width + offsetX;
        const currentColumn = columns[current.value.columnIndex];
        if (
            currentColumn.props.minWidth &&
            width >= currentColumn.props.minWidth
        ) {
            _widthList[current.value.id].width = width;
            _widthList[current.value.id].minWidth = width;
            widthList.value = _widthList;
        }
    };

    const onMouseup = () => {
        if (!current.value) return;
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
