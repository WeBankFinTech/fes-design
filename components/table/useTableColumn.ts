import { reactive, computed } from 'vue';
import { random } from 'lodash-es';
import { getHeaderRows, getColumns } from './helper';
import { getDefaultColProps } from './column';
import type { ColumnInst, ColumnChildren } from './column';
import type { TableProps } from './table';

// 递归扁平化columns
const instColumns = (
    cols: ColumnChildren = [],
    instList: ColumnInst[] = [],
    parent?: ColumnInst,
) => {
    cols.forEach((props) => {
        const inst: ColumnInst = {
            id: Date.now() + random(0, 999, false),
            props: {
                ...getDefaultColProps(),
                ...props,
            },
            slots: {},
            parentId: parent?.id || null,
        };
        instList.push(inst);
        if (props.children?.length) {
            instColumns(props.children, instList, inst);
        }
    });
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
        const instList: ColumnInst[] = [];
        if (props.columns?.length) {
            instColumns(props.columns, instList);
        }
        return originColumns.concat(instList);
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
            return !column.fixLeft && !column.fixRight;
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
