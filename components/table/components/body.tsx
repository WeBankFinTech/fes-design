import { h, defineComponent, Fragment, inject } from 'vue';
import { provideKey } from '../const';
import Td from './td';
import ExpandTr from './expandTr';

export default defineComponent({
    components: {
        ExpandTr,
        Td,
    },
    props: {
        columns: {
            type: Array,
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

        const renderTdList = (row, rowIndex) =>
            props.columns
                .map((column, columnIndex) => (
                    <Td
                        key={column.id}
                        row={row}
                        rowIndex={rowIndex}
                        column={column}
                        columnIndex={columnIndex}
                        onClick={($event) => {
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
                showData.value.map((row, rowIndex) => (
                    <Fragment key={getRowKey({ row }) || rowIndex}>
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
                        colSpan={props.columns.length}
                        class={`${prefixCls}-cell ${prefixCls}-no-data`}
                    >
                        {props.emptyText}
                    </td>
                </tr>
            );
        return () => <tbody>{renderTrList()}</tbody>;
    },
});
