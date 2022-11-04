import { SetupContext, reactive, Ref, readonly } from 'vue';
import type { RowType } from './interface';
import type { ColumnInst, SortOrderType, SorterType } from './column';

type SortStateType = {
    prop?: string;
    order?: 'descend' | 'ascend';
    sorter?: SorterType;
};

export default ({
    ctx,
    columns,
}: {
    ctx: SetupContext;
    columns: Ref<ColumnInst[]>;
}) => {
    const sortState: SortStateType = reactive({});

    const handleRowDataBySort = (data: RowType[], param: SortStateType) => {
        const { prop, order, sorter } = param;
        if (order === 'ascend') {
            return data.sort((a: RowType, b: RowType) => {
                let res = 0;
                if (typeof sorter === 'function') {
                    try {
                        res = sorter(a, b) ? 1 : -1;
                    } catch (e) {}
                }
                if (sorter === 'default') {
                    res = a[prop] > b[prop] ? 1 : -1;
                }
                return res;
            });
        }
        if (order === 'descend') {
            return data.sort((a: RowType, b: RowType) => {
                let res = 0;
                if (typeof sorter === 'function') {
                    try {
                        res = sorter(a, b) ? -1 : 1;
                    } catch (e) {}
                }
                if (sorter === 'default') {
                    res = a[prop] > b[prop] ? -1 : 1;
                }
                return res;
            });
        }
        return data;
    };

    const handleClickSortHeader = ({ column }: { column: ColumnInst }) => {
        if (!column.props.sortable) return;
        if (sortState.prop !== column.props.prop) {
            const order = column.props.sortDirections[0];
            Object.assign(sortState, {
                prop: column.props.prop,
                order: order,
                sorter: column.props.sorter,
            });
        } else {
            const index = column.props.sortDirections.indexOf(sortState.order);
            const order = column.props.sortDirections[index + 1];
            Object.assign(sortState, {
                order: order ?? false,
                sorter: column.props.sorter,
            });
        }
        ctx.emit('sortChange', readonly(sortState));
    };

    const sort = (prop: string, order: SortOrderType) => {
        const column = columns.value.find((col) => {
            return col.props.prop === prop;
        });
        if (!column.props.sortable) return;
        Object.assign(sortState, {
            prop,
            order,
            sorter: column?.props?.sorter,
        });
        ctx.emit('sortChange', readonly(sortState));
    };

    const clearSorter = () => {
        Object.assign(sortState, {
            prop: undefined,
            order: undefined,
            sorter: undefined,
        });
        ctx.emit('sortChange', readonly(sortState));
    };

    return {
        sortState,
        handleClickSortHeader,
        sort,
        clearSorter,
        handleRowDataBySort,
    };
};
