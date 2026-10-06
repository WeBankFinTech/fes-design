import {
    type ComponentObjectPropsOptions,
    Fragment,
    type PropType,
    defineComponent,
    inject,
} from 'vue';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';
import Td from './td';
import ExpandTr from './expandTr';

export default defineComponent({
    components: {
        ExpandTr,
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
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            handleRowClick,
            getRowStyle,
            getRowClassName,
            expandColumn,
            isExpandOpened,
            handleCellClick,
            getCellValue,
            columns: injectedColumns,
        } = inject(provideKey);

        // 列来源用响应式注入值（与 Colgroup 同理）：SSR 单趟渲染下
        // props.columns 快照可能固化为空数组，computed 注入值在本组件
        // 渲染时求值，此时候选已就绪；列本身仍可通过 props 覆盖
        // （virtualTable 的兜底空 Tr 不传数据，不受影响）
        const currentColumns = () => injectedColumns?.value ?? props.columns;

        const renderTdList = (row: object, rowIndex: number) =>
            currentColumns().map((column, columnIndex) => (
                <Td
                    key={column.id}
                    row={row}
                    rowIndex={rowIndex}
                    column={column}
                    columnIndex={columnIndex}
                    columns={currentColumns()}
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
                            length={currentColumns().length}
                        />
                    )}
                </Fragment>
            );
        };
    },
});
