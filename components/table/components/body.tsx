import { h, defineComponent, Fragment, inject, PropType } from 'vue';
import { provideKey } from '../const';
import Td from './td';
import ExpandTr from './expandTr';

import type { ColumnInst } from '../column.vue';

export default defineComponent({
    components: {
        ExpandTr,
        Td,
    },
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
        emptyText: {
            type: String,
        },
    },
    setup(props) {
        const {
            prefixCls,
            showData,
            getRowKey,
            handleRowClick,
            getRowStyle,
            getRowClassName,
            expandColumn,
            isExpandOpened,
            handleCellClick,
            getCellValue,
        } = inject(provideKey);

        const renderTdList = (row: object, rowIndex: number) =>
            props.columns
                .map((column, columnIndex) => (
                    <Td
                        key={column.id}
                        row={row}
                        rowIndex={rowIndex}
                        column={column}
                        columnIndex={columnIndex}
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
                ))
                .filter(Boolean);

        const renderTrList = () =>
            showData.value.length ? (
                showData.value.map((row: object, rowIndex: number) => (
                    <Fragment key={(getRowKey({ row }) || rowIndex) as any}>
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
                        {expandColumn.value && isExpandOpened({ row }) && (
                            <ExpandTr
                                row={row}
                                column={expandColumn.value}
                                rowIndex={rowIndex}
                                length={props.columns.length}
                            />
                        )}
                    </Fragment>
                ))
            ) : (
                <tr>
                    <td
                        colspan={props.columns.length}
                        class={`${prefixCls}-cell ${prefixCls}-no-data`}
                    >
                        {props.emptyText}
                    </td>
                </tr>
            );
        return () => <tbody>{renderTrList()}</tbody>;
    },
});
