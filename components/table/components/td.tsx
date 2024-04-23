import {
    type ComponentObjectPropsOptions,
    type PropType,
    defineComponent,
    inject,
} from 'vue';
import { DownOutlined } from '../../icon';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';
import FRadio from '../../radio';
import type { ColumnInst } from '../column';
import Cell from './cell';

export default defineComponent({
    name: 'FTableBodyTd',
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
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
        onClick: Function as PropType<(e: Event) => void>,
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            prefixCls,
            showData,
            columns,
            getCellSpan,
            getCellClass,
            getCustomCellClass,
            getCellStyle,
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

            const isLastRow =
                rowIndex + Number(rowspan) >= showData.value.length;
            const isLastColumn =
                columnIndex + Number(colspan) >= columns.value.length;

            return (
                <td
                    rowspan={rowspan}
                    colspan={colspan}
                    style={[
                        getCellStyle({
                            row,
                            column,
                            columns: props.columns,
                        }),
                        getCustomCellStyle({
                            row,
                            column,
                            rowIndex,
                            columnIndex,
                        }),
                    ]}
                    class={[
                        `${prefixCls}-td`,
                        isLastRow && 'is-last-row',
                        isLastColumn && 'is-last-column',
                        ...getCellClass({
                            column,
                            columns: props.columns,
                        }),
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
                        <div class={`${prefixCls}-center`}>
                            {column.props.multiple ? (
                                <FCheckbox
                                    modelValue={isSelected({ row })}
                                    disabled={isSelectDisabled({ row })}
                                    onChange={() => {
                                        handleSelect({ row });
                                    }}
                                />
                            ) : (
                                <FRadio
                                    modelValue={isSelected({ row })}
                                    disabled={isSelectDisabled({ row })}
                                    onChange={() => {
                                        handleSelect({ row });
                                    }}
                                ></FRadio>
                            )}
                        </div>
                    )}
                    {column.props.type === 'expand' && (
                        <div class={`${prefixCls}-center`}>
                            <DownOutlined
                                class={`${prefixCls}-expand-icon`}
                                onClick={() => {
                                    handleExpand({ row });
                                }}
                            />
                        </div>
                    )}
                </td>
            );
        };
    },
});
