import { defineComponent, inject } from 'vue';
import { CaretDownOutlined } from '../icon';
import Checkbox from '../checkbox';
import TableCell from './tableCell';
import { provideKey } from './const';

export default defineComponent({
    name: 'FTableBodyTd',
    components: {
        TableCell,
        CaretDownOutlined,
        Checkbox,
    },
    props: {
        row: {
            type: Object,
            required: true,
        },
        rowIndex: Number,
        column: {
            type: Object,
            required: true,
        },
        columnIndex: Number,
    },
    setup(props) {
        const {
            prefixCls,
            getCellSpan,
            getColStyle,
            getColClassName,
            isSelected,
            isSelectDisabled,
            handleSelect,
            handleExpand,
            getCellValue,
        } = inject(provideKey);
        return () => {
            const { row, column, rowIndex, columnIndex } = props;
            const { rowspan, colspan } = getCellSpan(props);
            if (!rowspan || !colspan) {
                return null;
            }
            return (
                <td rowspan={rowspan} colspan={colspan}>
                    <div
                        style={getColStyle({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                        })}
                        className={`${prefixCls}-cell ${
                            getColClassName({
                                row,
                                column,
                                rowIndex,
                                columnIndex,
                            }) || ''
                        }`}
                    >
                        {column.props.type === 'default' && (
                            <TableCell
                                row={row}
                                rowIndex={rowIndex}
                                column={column}
                                columnIndex={columnIndex}
                                cellValue={getCellValue(row, column)}
                            />
                        )}
                        {column.props.type === 'selection' && (
                            <Checkbox
                                modelValue={isSelected({ row })}
                                disabled={isSelectDisabled({ row })}
                                onClick={() => {
                                    handleSelect({ row });
                                }}
                            />
                        )}
                        {column.props.type === 'expand' && (
                            <CaretDownOutlined
                                class={`${prefixCls}-expand`}
                                onClick={() => {
                                    handleExpand({ row });
                                }}
                            />
                        )}
                    </div>
                </td>
            );
        };
    },
});
