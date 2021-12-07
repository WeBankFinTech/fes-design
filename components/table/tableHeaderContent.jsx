import { inject } from 'vue';
import TableHeaderLabel from './tableHeaderLabel';
import Checkbox from '../checkbox';
import { provideKey } from './const';

export default {
    components: {
        TableHeaderLabel,
        Checkbox,
    },
    props: {
        fixedColumn: Object,
    },
    setup(props) {
        const {
            prefixCls,
            headerRows,
            handleHeaderClick,
            getColStyle,
            isAllSelected,
            selection,
            handleSelectAll,
        } = inject(provideKey);
        const renderThList = row => row.map((column, columnIndex) => {
            if (!props.fixedColumn || props.fixedColumn.id === column.id) {
                return (
                        <th
                            key={column.id}
                            colspan={column.colSpan}
                            rowspan={column.rowSpan}
                            className={column.id}
                            onClick={($event) => {
                                handleHeaderClick({ column }, $event);
                            }}
                        >
                            <div
                                className={`${prefixCls}-cell`}
                                style={getColStyle({ column })}
                            >
                                {column.props.type === 'default' && (
                                    <TableHeaderLabel
                                        column={column}
                                        columnIndex={columnIndex}
                                    />
                                )}
                                {column.props.type === 'selection' && (
                                    <Checkbox
                                        modelValue={isAllSelected.value}
                                        indeterminate={
                                            !isAllSelected.value
                                            && selection.length > 0
                                        }
                                        onClick={handleSelectAll}
                                    />
                                )}
                            </div>
                        </th>
                );
            }
            return false;
        }).filter(Boolean);
        const renderTrList = () => headerRows.value.map((row, rowIndex) => (
                <tr key={rowIndex}>{renderThList(row)}</tr>
        ));
        return () => (
            <thead>{renderTrList()}</thead>
        );
    },
};
