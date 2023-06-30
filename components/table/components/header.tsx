import { inject, defineComponent, Fragment, PropType } from 'vue';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';
import useResize from '../useResize';
import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const {
            headerRows,
            handleHeaderClick,
            getCellClass,
            getCellStyle,
            getCustomCellStyle,
            isAllSelected,
            isCurrentDataAnySelected,
            handleSelectAll,
            handleClickSortHeader,
            prefixCls,
            sortState,
            layout,
        } = inject(provideKey);

        const { current, onMousedown } = useResize(
            props.columns,
            layout.widthList,
        );

        const renderHeader = ({
            column,
            columnIndex,
        }: {
            column: ColumnInst;
            columnIndex: number;
        }) =>
            column?.slots?.header?.({ column, columnIndex }) ??
            column?.props?.label;

        const renderThList = (row: ColumnInst[]) =>
            row
                .map((column, columnIndex: number) => (
                    <th
                        key={column.id}
                        colspan={column.colSpan}
                        rowspan={column.rowSpan}
                        class={[
                            `${prefixCls}-th`,
                            column.props.sortable && `${prefixCls}-th-sortable`,
                            ...getCellClass({
                                column,
                                columnIndex,
                                columns: props.columns,
                            }),
                        ]}
                        style={[
                            getCellStyle({
                                column,
                                columnIndex,
                                columns: props.columns,
                            }),
                            getCustomCellStyle({ column }),
                        ]}
                        onClick={($event) => {
                            handleHeaderClick({ column }, $event);
                            handleClickSortHeader({ column });
                        }}
                    >
                        {column.props.type === 'default' && (
                            <Fragment>
                                {renderHeader({ column, columnIndex })}
                                {column.props.sortable && (
                                    <span class={`${prefixCls}-sorter`}>
                                        {column.props.sortDirections?.includes(
                                            'ascend',
                                        ) && (
                                            <span
                                                class={[
                                                    `${prefixCls}-sorter-up`,
                                                    sortState.prop ===
                                                        column.props.prop &&
                                                        sortState.order ===
                                                            'ascend' &&
                                                        'is-active',
                                                ]}
                                            />
                                        )}
                                        {column.props.sortDirections?.includes(
                                            'descend',
                                        ) && (
                                            <span
                                                class={[
                                                    `${prefixCls}-sorter-down`,
                                                    sortState.prop ===
                                                        column.props.prop &&
                                                        sortState.order ===
                                                            'descend' &&
                                                        'is-active',
                                                ]}
                                            />
                                        )}
                                    </span>
                                )}
                            </Fragment>
                        )}
                        {column.props.type === 'selection' && (
                            <div class={`${prefixCls}-center`}>
                                <FCheckbox
                                    modelValue={isAllSelected.value}
                                    indeterminate={
                                        !isAllSelected.value &&
                                        isCurrentDataAnySelected.value
                                    }
                                    onClick={handleSelectAll}
                                />
                            </div>
                        )}
                        {column.props.resizable && (
                            <span
                                class={[
                                    `${prefixCls}-resize-button`,
                                    current.value?.id === column.id &&
                                        'is-active',
                                ]}
                                onMousedown={(e) =>
                                    onMousedown(column, columnIndex, e)
                                }
                            ></span>
                        )}
                    </th>
                ))
                .filter(Boolean);

        const renderTrList = () =>
            headerRows.value.map((row, rowIndex) => (
                <tr class={`${prefixCls}-row`} key={rowIndex}>
                    {renderThList(row)}
                </tr>
            ));

        return () => <thead>{renderTrList()}</thead>;
    },
});
