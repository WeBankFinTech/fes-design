import { inject, Fragment } from 'vue';
import { isUndefined } from 'lodash-es';
import TableExpand from './tableExpand';
import TableBodyTd from './tableBodyTd';
import TableHeaderContent from './tableHeaderContent';
import { provideKey } from './const';
import { renderColgroup } from './renderHelper';

export default {
    components: {
        TableExpand,
        TableBodyTd,
        TableHeaderContent,
    },
    props: {
        fixedColumn: Object,
        height: Number,
        emptyText: String,
        showHeader: Boolean,
    },
    setup(props) {
        const {
            prefixCls,
            bodyStyle,
            layout,
            showData,
            getRowKey,
            handleRowClick,
            getRowStyle,
            getRowClassName,
            expandColumn,
            isExpandOpened,
            columns,
            handleCellClick,
            getCellValue,
            getFixTrStyle,
        } = inject(provideKey);

        const renderTdList = (row, rowIndex) =>
            columns.value
                .map((column, columnIndex) => {
                    if (
                        !props.fixedColumn ||
                        props.fixedColumn.id === column.id
                    ) {
                        return (
                            <TableBodyTd
                                key={column.id}
                                row={row}
                                rowIndex={rowIndex}
                                column={column}
                                columnIndex={columnIndex}
                                class={column.id}
                                onClick={($event) => {
                                    handleCellClick(
                                        {
                                            row,
                                            column,
                                            cellValue: getCellValue(
                                                row,
                                                column,
                                            ),
                                        },
                                        $event,
                                    );
                                }}
                            ></TableBodyTd>
                        );
                    }
                    return false;
                })
                .filter(Boolean);
        const renderTrList = () =>
            showData.value.length ? (
                showData.value.map((row, rowIndex) => (
                    <Fragment key={getRowKey({ row }) || rowIndex}>
                        <tr
                            className={getRowClassName({ row, rowIndex })}
                            style={{
                                ...getRowStyle({ row, rowIndex }),
                                ...getFixTrStyle(props.fixedColumn, rowIndex),
                            }}
                            onClick={($event) => {
                                handleRowClick({ row, rowIndex }, $event);
                            }}
                        >
                            {renderTdList(row, rowIndex)}
                        </tr>
                        {expandColumn.value && isExpandOpened({ row }) && (
                            <TableExpand
                                row={row}
                                column={expandColumn.value}
                                rowIndex={rowIndex}
                                length={columns.value.length}
                            />
                        )}
                    </Fragment>
                ))
            ) : (
                <tr>
                    <td colSpan={props.fixedColumn ? 1 : columns.value.length}>
                        <div
                            className={`${prefixCls}-cell ${prefixCls}-no-data`}
                        >
                            {' '}
                            {props.fixedColumn ? '' : props.emptyText}
                        </div>
                    </td>
                </tr>
            );
        return () => (
            <table
                className={`${prefixCls}-body`}
                cellspacing="0"
                cellpadding="0"
                border="0"
                style={props.fixedColumn ? { width: '100%' } : bodyStyle.value}
            >
                {renderColgroup(layout.widthList.value, props.fixedColumn)}
                {props.showHeader && isUndefined(props.height) && (
                    <TableHeaderContent fixedColumn={props.fixedColumn} />
                )}
                <tbody>{renderTrList()}</tbody>
            </table>
        );
    },
};
