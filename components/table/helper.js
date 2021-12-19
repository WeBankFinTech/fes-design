export const getRowKey = ({ row, rowKey }) => {
    if (rowKey) {
        if (typeof rowKey === 'string') {
            if (rowKey.indexOf('.') < 0) {
                return `${row[rowKey]}`;
            }
            const key = rowKey.split('.');
            let current = row;
            for (let i = 0; i < key.length; i++) {
                current = current[key[i]];
            }
            return `${current}`;
        }
        if (typeof rowKey === 'function') {
            return rowKey(row);
        }
    }
    return row;
};

/**
 *  考虑到存在聚合表头的场景，需要根据原始列数据的格式计算出聚合表头中每个单元格的 rowSpan、colSpan 和它所属的level
 * @param {} originColumns
 * @returns
 */
export function getHeaderRows(originColumns) {
    const rows = [];

    // copy，避免污染源数据，导致多次执行 getHeaderRows
    const cols = originColumns.map((column) => ({
        ...column,
    }));

    let isChildren = [];
    cols.forEach((column) => {
        column.children = cols.filter((col) => col.parentId === column.id);
        isChildren = isChildren.concat(column.children.map((col) => col.id));
    });
    const treeCols = cols.filter((column) => !isChildren.includes(column.id));

    let maxLevel = 1;
    const traverse = (column, parent) => {
        column.level = parent ? parent.level + 1 : 1;
        maxLevel = Math.max(column.level, maxLevel);
        if (column.children && column.children.length > 0) {
            let colSpan = 0;
            column.children.forEach((subColumn) => {
                traverse(subColumn, column);
                colSpan += subColumn.colSpan || 1;
            });
            column.colSpan = colSpan;
        } else {
            column.colSpan = 1;
        }
    };

    treeCols.forEach((column) => {
        traverse(column);
    });

    cols.forEach((column) => {
        if (column.children.length === 0) {
            column.rowSpan = maxLevel - column.level + 1;
        } else {
            column.rowSpan = 1;
        }
        if (!rows[column.level - 1]) {
            rows[column.level - 1] = [];
        }
        rows[column.level - 1].push(column);
    });

    return rows;
}

/**
 * 返回最终叶子列，也就是跟数据对应的列
 * @param {*} originColumns
 * @returns
 */
export function getColumns(originColumns) {
    const arr = originColumns.filter(
        (col) => !originColumns.some((c) => c.parentId === col.id),
    );
    // fixed固定列需要排在首尾
    const fixLeftIndex = arr.findIndex(
        (column) =>
            column.props.fixed === true || column.props.fixed === 'left',
    );
    if (fixLeftIndex !== -1) {
        const fixLeftColumn = arr[fixLeftIndex];
        fixLeftColumn.fixLeft = true;
        arr.splice(fixLeftIndex, 1);
        arr.unshift(fixLeftColumn);
    }
    const fixRightIndex = arr.findIndex(
        (column) => column.props.fixed === 'right',
    );
    if (fixRightIndex !== -1) {
        const fixRightColumn = arr[fixRightIndex];
        fixRightColumn.fixRight = true;
        arr.splice(fixRightIndex, 1);
        arr.push(fixRightColumn);
    }
    return arr;
}

export const getCellValue = (row, column) => {
    if (!row) {
        // eslint-disable-next-line no-undefined
        return undefined;
    }
    return row[column?.props?.prop];
};
