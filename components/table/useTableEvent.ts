import type { SetupContext } from 'vue';

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

    return {
        handleCellClick,
        handleHeaderClick,
        handleRowClick,
    };
}
