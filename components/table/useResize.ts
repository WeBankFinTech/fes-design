import { Ref, ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import { depx } from '../_util/utils';
import type { ColumnInst } from './column';
import type { WidthItem } from './useTableLayout';

export default (
    columns: ColumnInst[],
    widthList: Ref<Record<string, WidthItem>>,
) => {
    const current = ref<{ id: number; clientX: number; width: number }>(null);
    const onMousedown = (column: ColumnInst, event: MouseEvent) => {
        current.value = {
            id: column.id,
            clientX: event.clientX,
            width: depx(
                (event.target as HTMLElement).parentElement.offsetWidth,
            ),
        };
    };

    const onMousemove = (event: MouseEvent) => {
        if (!current.value) return;
        const offsetX = event.clientX - current.value.clientX;
        const width = current.value.width + offsetX;
        const _widthList = cloneDeep(widthList.value);
        _widthList[current.value.id].width = width;
        _widthList[current.value.id].minWidth = width;
        widthList.value = _widthList;
    };

    const onMouseup = () => {
        if (!current.value) return;
        current.value = null;
    };

    return {
        onMousedown,
        onMousemove,
        onMouseup,
        current,
    };
};
