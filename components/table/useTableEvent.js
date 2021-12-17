export default function useTableEvent(ctx) {
    const handleCellClick = (params, event) => {
        ctx.emit('cell-click', { ...params, event });
    };

    const handleHeaderClick = (params, event) => {
        ctx.emit('header-click', { ...params, event });
    };

    const handleRowClick = (params, event) => {
        ctx.emit('row-click', { ...params, event });
    };

    return {
        handleCellClick,
        handleHeaderClick,
        handleRowClick,
    };
}
