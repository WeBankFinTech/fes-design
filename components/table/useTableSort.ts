import { SetupContext, reactive, Ref, readonly } from 'vue';
import type { TableProps } from './table';
import type { RowType } from './interface';
import type { ColumnInst, SortOrderType, SorterType } from './column';

export default ({
    props,
    ctx,
    showData,
    columns,
}: {
    props: TableProps;
    ctx: SetupContext;
    showData: Ref<RowType[]>;
    columns: Ref<ColumnInst[]>;
}) => {
    const sortState: {
        prop?: string;
        order?: 'descend' | 'ascend';
    } = reactive({});

    const handleData = (
        prop: string,
        order: SortOrderType,
        sorter: SorterType,
    ) => {
        if (order === 'ascend') {
            showData.value = showData.value.sort((a: RowType, b: RowType) => {
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
        } else if (order === 'descend') {
            showData.value = showData.value.sort((a: RowType, b: RowType) => {
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
        } else {
            showData.value = props.data.slice(0);
        }
    };

    const handleClickSortHeader = ({ column }: { column: ColumnInst }) => {
        if (sortState.prop !== column.props.prop) {
            const order = column.props.sortDirections[0];
            Object.assign(sortState, {
                prop: column.props.prop,
                order: order,
            });
            handleData(column.props.prop, order, column.props.sorter);
        } else {
            const index = column.props.sortDirections.indexOf(sortState.order);
            const order = column.props.sortDirections[index + 1];
            if (order) {
                Object.assign(sortState, {
                    order: order,
                });
                handleData(column.props.prop, order, column.props.sorter);
            } else {
                Object.assign(sortState, {
                    order: false,
                });
                handleData(column.props.prop, false, column.props.sorter);
            }
        }
        ctx.emit('sortChange', readonly(sortState));
    };

    const sort = (prop: string, order: SortOrderType) => {
        const column = columns.value.find((col) => {
            return col.props.prop === prop;
        });
        Object.assign(sortState, {
            prop,
            order,
        });
        handleData(prop, order, column?.props?.sorter);
        ctx.emit('sortChange', readonly(sortState));
    };

    const clearSorter = () => {
        Object.assign(sortState, {
            prop: undefined,
            order: undefined,
        });
        handleData(undefined, false, undefined);
        ctx.emit('sortChange', readonly(sortState));
    };

    return {
        sortState,
        handleClickSortHeader,
        sort,
        clearSorter,
    };
};
