import { inject } from 'vue';
import Checkbox from '../../checkbox';
import { provideKey } from '../const';
import Label from './label';

export default {
    components: {
        Label,
        Checkbox,
    },
    props: {},
    setup() {
        const {
            prefixCls,
            headerRows,
            handleHeaderClick,
            getColStyle,
            isAllSelected,
            selection,
            handleSelectAll,
        } = inject(provideKey);
        const renderThList = (row) =>
            row
                .map((column, columnIndex) => (
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
                                <Label
                                    column={column}
                                    columnIndex={columnIndex}
                                />
                            )}
                            {column.props.type === 'selection' && (
                                <Checkbox
                                    modelValue={isAllSelected.value}
                                    indeterminate={
                                        !isAllSelected.value &&
                                        selection.length > 0
                                    }
                                    onClick={handleSelectAll}
                                />
                            )}
                        </div>
                    </th>
                ))
                .filter(Boolean);

        const renderTrList = () =>
            headerRows.value.map((row, rowIndex) => (
                <tr key={rowIndex}>{renderThList(row)}</tr>
            ));

        return () => <thead>{renderTrList()}</thead>;
    },
};
