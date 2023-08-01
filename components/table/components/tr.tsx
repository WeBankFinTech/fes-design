import { defineComponent, Fragment, inject, PropType } from 'vue';
import { provideKey } from '../const';
import Td from './td';
import ExpandTr from './expandTr';

import type { ColumnInst } from '../column';

export default defineComponent({
    components: {
        ExpandTr,
        // eslint-disable-next-line vue/no-reserved-component-names
        Td,
    },
    props: {
        row: {
            type: Object,
        },
        rowIndex: {
            type: Number,
        },
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
        expanded: {
            type: Boolean,
            default: true,
        },
    },
    setup(props) {
        const {
            handleRowClick,
            getRowStyle,
            getRowClassName,
            expandColumn,
            isExpandOpened,
            handleCellClick,
            getCellValue,
        } = inject(provideKey);

        const renderTdList = (row: object, rowIndex: number) =>
            props.columns.map((column, columnIndex) => (
                <Td
                    key={column.id}
                    row={row}
                    rowIndex={rowIndex}
                    column={column}
                    columnIndex={columnIndex}
                    columns={props.columns}
                    onClick={($event: Event) => {
                        handleCellClick(
                            {
                                row,
                                column,
                                cellValue: getCellValue(row, column),
                            },
                            $event,
                        );
                    }}
                ></Td>
            ));

        const renderTr = () => {
            const { row, rowIndex } = props;
            return (
                <tr
                    class={getRowClassName({ row, rowIndex })}
                    style={{
                        ...getRowStyle({ row, rowIndex }),
                    }}
                    onClick={($event) => {
                        handleRowClick({ row, rowIndex }, $event);
                    }}
                >
                    {renderTdList(row, rowIndex)}
                </tr>
            );
        };

        return () => {
            const { row, rowIndex, expanded } = props;

            if (!expanded) {
                return renderTr();
            }

            return (
                <Fragment>
                    {renderTr()}
                    {expandColumn.value && isExpandOpened({ row }) && (
                        <ExpandTr
                            row={row}
                            column={expandColumn.value}
                            rowIndex={rowIndex}
                            length={props.columns.length}
                        />
                    )}
                </Fragment>
            );
        };
    },
});
