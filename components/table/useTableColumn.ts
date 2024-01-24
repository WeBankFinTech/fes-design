import { reactive, computed } from 'vue';
import { omit } from 'lodash-es';
import { getHeaderRows, getColumns } from './helper';
import { getDefaultColProps } from './column';
import type { ColumnInst, ColumnChildren } from './column';
import type { TableProps } from './table';

export type ColumnFixedStatus = 'left' | 'right' | 'both' | 'none';

let seed = 0;

// 递归扁平化 columns
const instColumns = (cols: ColumnChildren = [], parent?: ColumnInst) => {
    let instList: ColumnInst[] = [];
    cols.forEach((props) => {
        const inst: ColumnInst = {
            id: ++seed,
            props: {
                ...getDefaultColProps(),
                ...omit(props, ['renderHeader', 'render']),
            },
            slots: {
                header: props.renderHeader,
                default: props.render,
            },
            parentId: parent?.id || null,
        };
        instList.push(inst);
        if (props.children?.length) {
            instList = instList.concat(instColumns(props.children, inst));
        }
    });
    return instList;
};

export default function (props: TableProps) {
    const originColumns = reactive<ColumnInst[]>([]);

    const addColumn = (column: ColumnInst) => {
        originColumns.push(column);
    };

    const removeColumn = (id: number) => {
        const colIndex = originColumns.findIndex((item) => item.id === id);
        if (colIndex !== -1) {
            originColumns.splice(colIndex, 1);
        }
    };

    // 合并template定义和props定义的column
    const mergeColumns = computed(() => {
        return originColumns.concat(
            props.columns?.length ? instColumns(props.columns) : [],
        );
    });

    const visibleColumns = computed(() =>
        mergeColumns.value.filter((column) => column.props.visible),
    );

    // 列配置
    const columns = computed(() => getColumns(visibleColumns.value));

    // 表头Rows
    const headerRows = computed(() => getHeaderRows(visibleColumns.value));

    const noFixedColumn = computed(() =>
        columns.value.every((column) => {
            return !column.fixedLeft && !column.fixedRight;
        }),
    );

    const columnsFixed = computed<ColumnFixedStatus>(() => {
        const mappedColumns = columns.value
            .map<'left' | 'right' | ''>((column) => {
                if (column.fixedLeft) return 'left';
                if (column.fixedRight) return 'right';
                return '';
            })
            .filter<'left' | 'right'>(
                (fixedStatus): fixedStatus is 'left' | 'right' => !!fixedStatus,
            );
        const uniqueColumns = Array.from(new Set(mappedColumns));

        // 没有固定列
        if (uniqueColumns.length === 0) return 'none';
        // 两侧都有固定列
        if (uniqueColumns.length !== 1) return 'both';
        // 仅有一侧有固定列
        return uniqueColumns[0];
    });

    return {
        addColumn,
        removeColumn,
        headerRows,
        columns,
        noFixedColumn,
        columnsFixed,
    };
}
