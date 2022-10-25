import { inject, defineComponent, Fragment } from 'vue';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';

import type { ColumnInst } from '../column';

export default defineComponent({
    setup() {
        const {
            headerRows,
            handleHeaderClick,
            getCellClass,
            getCustomCellStyle,
            isAllSelected,
            isCurrentDataAnySelected,
            handleSelectAll,
            handleClickSortHeader,
            prefixCls,
            sortState,
        } = inject(provideKey);

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
                        class={[`${prefixCls}-th`, ...getCellClass({ column })]}
                        style={getCustomCellStyle({ column })}
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
