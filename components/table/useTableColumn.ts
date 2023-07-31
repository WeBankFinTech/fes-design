import { reactive, computed } from 'vue';
import { omit } from 'lodash-es';
import { getHeaderRows, getColumns } from './helper';
import { getDefaultColProps } from './column';
import type { ColumnInst, ColumnChildren } from './column';
import type { TableProps } from './table';

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

export default function useColumn(props: TableProps) {
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

    const hasFixedColumn = computed(() =>
        columns.value.every((column) => {
            return !column.fixedLeft && !column.fixedRight;
        }),
    );

    return {
        addColumn,
        removeColumn,
        headerRows,
        columns,
        hasFixedColumn,
    };
}
