import { h, defineComponent, inject, PropType } from 'vue';
import { CaretDownOutlined } from '../../icon';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';
import Cell from './cell';

import type { ColumnInst } from '../interface'

export default defineComponent({
    name: 'FTableBodyTd',
    props: {
        row: {
            type: Object,
            required: true,
        },
        rowIndex: Number,
        column: {
            type: Object as PropType<ColumnInst>,
            required: true,
        },
        columnIndex: Number,
        onClick: Function as PropType<(e: Event) => void>
    },
    setup(props) {
        const {
            prefixCls,
            getCellSpan,
            getCellClass,
            getCustomCellClass,
            getCustomCellStyle,
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
                <td
                    rowspan={rowspan}
                    colspan={colspan}
                    style={getCustomCellStyle({
                        row,
                        column,
                        rowIndex,
                        columnIndex,
                    })}
                    class={[
                        ...getCellClass({ column }),
                        ...getCustomCellClass({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                        }),
                    ]}
                    onClick={props.onClick}
                >
                    {column.props.type === 'default' && (
                        <Cell
                            row={row}
                            rowIndex={rowIndex}
                            column={column}
                            columnIndex={columnIndex}
                            cellValue={getCellValue(row, column)}
                        />
                    )}
                    {column.props.type === 'selection' && (
                        <FCheckbox
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
                </td>
            );
        };
    },
});
