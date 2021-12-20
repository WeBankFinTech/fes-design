export default function useTableEvent(ctx) {
    const handleCellClick = (params, event) => {
        ctx.emit('cellClick', { ...params, event });
    };

    const handleHeaderClick = (params, event) => {
        ctx.emit('headerClick', { ...params, event });
    };

    const handleRowClick = (params, event) => {
        ctx.emit('rowClick', { ...params, event });
    };

    return {
        handleCellClick,
        handleHeaderClick,
        handleRowClick,
    };
}
