const renderColList = (columns) =>
    columns.map((column) => (
        <col
            key={column.id}
            name={column.id}
            style={{ width: `${column.width}px` }}
        />
    ));

export const renderColgroup = (columns, fixedColumn) => (
    <colgroup>
        {renderColList(
            columns.filter((column) => {
                if (!fixedColumn) return true;
                return column.id === fixedColumn.id;
            }),
        )}
    </colgroup>
);
