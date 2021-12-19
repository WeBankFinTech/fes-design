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
            headerRows,
            handleHeaderClick,
            getCellClass,
            getCustomCellStyle,
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
                        class={getCellClass({ column })}
                        style={getCustomCellStyle({ column })}
                        onClick={($event) => {
                            handleHeaderClick({ column }, $event);
                        }}
                    >
                        {column.props.type === 'default' && (
                            <Label column={column} columnIndex={columnIndex} />
                        )}
                        {column.props.type === 'selection' && (
                            <Checkbox
                                modelValue={isAllSelected.value}
                                indeterminate={
                                    !isAllSelected.value && selection.length > 0
                                }
                                onClick={handleSelectAll}
                            />
                        )}
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
