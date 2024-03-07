import {
    inject,
    defineComponent,
    Fragment,
    type PropType,
    computed,
    type ComponentObjectPropsOptions,
} from 'vue';
import FCheckbox from '../../checkbox/checkbox.vue';
import { provideKey } from '../const';
import useResize from '../useResize';
import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            headerRows,
            handleHeaderClick,
            handleHeaderResize,
            getCellClass,
            getCellStyle,
            getCustomCellStyle,
            isAllSelected,
            isCurrentDataAnySelected,
            handleSelectAll,
            handleClickSortHeader,
            prefixCls,
            sortState,
            layout,
        } = inject(provideKey);

        const { current, onMousedown } = useResize(
            props.columns,
            layout.widthList,
            handleHeaderResize,
        );

        /**
         * 实际渲染布局中，出现在行尾的 column
         *
         * 实现思路为，从 column 树（即 headerRows) 根节点出发，递归找到每个子树中最后一个 column 结点
         */
        const displayLastColumnIds = computed(() => {
            const getLastColumns = (columns: ColumnInst[]): ColumnInst[] => {
                const lastColumn = columns[columns.length - 1];
                if (!lastColumn) return [];
                return [
                    lastColumn,
                    ...getLastColumns(lastColumn.children ?? []),
                ];
            };

            return getLastColumns(headerRows.value[0]).map((c) => c.id);
        });

        const renderHeader = ({
            column,
            columnIndex,
        }: {
            column: ColumnInst;
            columnIndex: number;
        }) =>
            column?.slots?.header?.({ column, columnIndex }) ??
            column?.props?.label;

        const renderThList = (row: ColumnInst[]) =>
            row
                .map((column, columnIndex: number) => (
                    <th
                        key={column.id}
                        colspan={column.colSpan}
                        rowspan={column.rowSpan}
                        class={[
                            `${prefixCls}-th`,
                            column.props.sortable && `${prefixCls}-th-sortable`,
                            displayLastColumnIds.value.includes(column.id) &&
                                `${prefixCls}-th-last`,
                            ...getCellClass({
                                column,
                                columns: props.columns,
                            }),
                        ]}
                        style={[
                            getCellStyle({
                                column,
                                columns: props.columns,
                            }),
                            getCustomCellStyle({ column }),
                        ]}
                        onClick={($event) => {
                            handleHeaderClick({ column }, $event);
                            handleClickSortHeader({ column });
                        }}
                    >
                        {column.props.type === 'default' && (
                            <Fragment>
                                {renderHeader({ column, columnIndex })}
                                {column.props.sortable && (
                                    <span class={`${prefixCls}-sorter`}>
                                        {column.props.sortDirections?.includes(
                                            'ascend',
                                        ) && (
                                            <span
                                                class={[
                                                    `${prefixCls}-sorter-up`,
                                                    sortState.prop ===
                                                        column.props.prop &&
                                                        sortState.order ===
                                                            'ascend' &&
                                                        'is-active',
                                                ]}
                                            />
                                        )}
                                        {column.props.sortDirections?.includes(
                                            'descend',
                                        ) && (
                                            <span
                                                class={[
                                                    `${prefixCls}-sorter-down`,
                                                    sortState.prop ===
                                                        column.props.prop &&
                                                        sortState.order ===
                                                            'descend' &&
                                                        'is-active',
                                                ]}
                                            />
                                        )}
                                    </span>
                                )}
                            </Fragment>
                        )}
                        {column.props.type === 'selection' &&
                            // 多选场景展示头部全选
                            column.props.multiple && (
                                <div class={`${prefixCls}-center`}>
                                    <FCheckbox
                                        modelValue={isAllSelected.value}
                                        indeterminate={
                                            !isAllSelected.value &&
                                            isCurrentDataAnySelected.value
                                        }
                                        onChange={handleSelectAll}
                                    />
                                </div>
                            )}
                        {column.props.resizable && (
                            <span
                                class={[
                                    `${prefixCls}-resize-button`,
                                    current.value?.id === column.id &&
                                        'is-active',
                                ]}
                                onMousedown={(e) =>
                                    onMousedown(column, columnIndex, e)
                                }
                            ></span>
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
