import { h, inject, defineComponent } from 'vue';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';
import Label from './label';

import type { ColumnInst } from '../column.vue';

export default defineComponent({
    setup() {
        const {
            headerRows,
            handleHeaderClick,
            getCellClass,
            getCustomCellStyle,
            isAllSelected,
            selection,
            handleSelectAll,
            prefixCls,
        } = inject(provideKey);
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
                        }}
                    >
                        {column.props.type === 'default' && (
                            <Label column={column} columnIndex={columnIndex} />
                        )}
                        {column.props.type === 'selection' && (
                            <div class={`${prefixCls}-center`}>
                                <FCheckbox
                                    modelValue={isAllSelected.value}
                                    indeterminate={
                                        !isAllSelected.value &&
                                        selection.length > 0
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
