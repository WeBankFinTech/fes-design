import type { SetupContext } from 'vue';
import type { ColumnResizeInfo } from './useResize';

export default function useTableEvent(ctx: SetupContext) {
    const handleCellClick = (params: object, event: Event) => {
        ctx.emit('cellClick', { ...params, event });
    };

    const handleHeaderClick = (params: object, event: Event) => {
        ctx.emit('headerClick', { ...params, event });
    };

    const handleRowClick = (params: object, event: Event) => {
        ctx.emit('rowClick', { ...params, event });
    };

    const handleHeaderResize = (
        params: {
            current: ColumnResizeInfo;
            columns: ColumnResizeInfo[];
        },
        event: Event,
    ) => {
        ctx.emit('headerResize', { ...params, event });
    };

    return {
        handleCellClick,
        handleHeaderClick,
        handleHeaderResize,
        handleRowClick,
    };
}
