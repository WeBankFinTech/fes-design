import { TABLE_NAME } from './const';
import type { RowType, RowKey } from './interface';
import type { ColumnInst } from './column';

export const getRowKey = ({
    row,
    rowKey,
}: {
    row: RowType;
    rowKey?: RowKey;
}) => {
    if (rowKey) {
        let res: any;
        if (typeof rowKey === 'string') {
            if (rowKey.indexOf('.') < 0) {
                res = row[rowKey];
            } else {
                try {
                    const key = rowKey.split('.');
                    let current = row;
                    for (let i = 0; i < key.length; i++) {
                        current = current[key[i]];
                    }
                    res = current;
                } catch (error) {
                    console.error(
                        `[${TABLE_NAME}]: reading rowKey from row data failed`,
                        error,
                    );
                    throw error;
                }
            }
        } else if (typeof rowKey === 'function') {
            res = rowKey(row);
        }
        if (typeof res !== 'string' && typeof res !== 'number') {
            console.warn(
                `[${TABLE_NAME}]: rowKey ${res} must be number or string`,
            );
        }
        return res;
    }
    return row;
};

const handleFixedColumns = (arr: ColumnInst[]) => {
    // fixed固定列需要排在首尾
    const fixedLeftColumns = [];
    const fixedRightColumns = [];
    const otherColumns = [];
    for (let i = 0; i < arr.length; i++) {
        const column = arr[i];
        if (column.props.fixed === true || column.props.fixed === 'left') {
            column.fixedLeft = true;
            fixedLeftColumns.push(column);
        } else if (column.props.fixed === 'right') {
            column.fixedRight = true;
            fixedRightColumns.push(column);
        } else {
            otherColumns.push(column);
        }
    }

    return fixedLeftColumns.concat(otherColumns, fixedRightColumns);
};

/**
 *  考虑到存在聚合表头的场景，需要根据原始列数据的格式计算出聚合表头中每个单元格的 rowSpan、colSpan 和它所属的level
 * @param {} originColumns
 * @returns
 */
export function getHeaderRows(originColumns: ColumnInst[]) {
    const rows: ColumnInst[][] = [];

    // copy，避免污染源数据，导致多次执行 getHeaderRows
    const cols = handleFixedColumns(
        originColumns.map((column) => ({
            ...column,
        })),
    );

    let isChildren: number[] = [];
    cols.forEach((column) => {
        column.children = cols.filter((col) => col.parentId === column.id);
        isChildren = isChildren.concat(column.children.map((col) => col.id));
    });
    const treeCols = cols.filter((column) => !isChildren.includes(column.id));

    let maxLevel = 1;
    const traverse = (column: ColumnInst, parent?: ColumnInst) => {
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
export function getColumns(originColumns: ColumnInst[]) {
    const arr = originColumns.filter(
        (col) => !originColumns.some((c) => c.parentId === col.id),
    );
    return handleFixedColumns(arr);
}

export const getCellValue = (row?: RowType, column?: ColumnInst) => {
    if (!row) {
        // eslint-disable-next-line no-undefined
        return undefined;
    }
    return row[column?.props?.prop];
};
