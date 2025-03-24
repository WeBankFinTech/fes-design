import {
    type ComponentObjectPropsOptions,
    type PropType,
    type VNodeChild,
    defineComponent,
    inject,
} from 'vue';
import VirtualScroller from '../../virtual-scroller/virtual-scroller';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';
import Colgroup from './colgroup';
import Tr from './tr';
import Td from './td';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            showData,
            rootProps,
            layout,
            prefixCls,
            bodyWrapperRef,
            bodyWrapperClass,
            bodyStyle,
            syncPosition,
            scrollbarRef,
            noFixedColumn,
            handleCellClick,
            getCellValue,
            getRowClassName,
            getRowStyle,
            handleRowClick,
        } = inject(provideKey);

        const renderTdList = (row: object, rowIndex: number) => {
            return [
                props.columns.map((column, columnIndex) => {
                    const width = layout.widthMap.value[column.id]?.width;
                    const minWidth = layout.widthMap.value[column.id]?.minWidth;
                    return (
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
                            style={[
                                { display: 'inline-block' },
                                width && { width: `${width}px` },
                                minWidth && { minWidth: `${minWidth}px` },
                            ]}
                        ></Td>
                    );
                }),
            ];
        };

        const renderItemList = (itemVNodes: VNodeChild) => {
            return (
                <table class={`${prefixCls}-body`} style={bodyStyle.value}>
                    <Colgroup columns={props.columns}></Colgroup>
                    { itemVNodes || (
                        <tbody>
                            <Tr columns={props.columns} />
                        </tbody>
                    ) }
                </table>
            );
        };

        const onScroll = (e: Event) => {
            if (layout.isScrollX.value || layout.isScrollY.value) {
                syncPosition(e);
            }
        };

        return () => {
            return (
                <VirtualScroller
                    ref={(el: any) => {
                        if (el) {
                            scrollbarRef.value = el.scrollRef;
                            bodyWrapperRef.value = el.$el;
                        }
                    }}
                    scrollbarProps={{
                        shadow: {
                            x: noFixedColumn.value,
                            y: true,
                        },
                        shadowStyle: { zIndex: 3 },
                        verticalRatioStyle: { zIndex: 3 },
                        horizontalRatioStyle: { zIndex: 3 },
                        maxHeight: layout.bodyHeight.value,
                        always: rootProps.alwaysScrollbar,
                    }}
                    onScroll={onScroll}
                    dataSources={showData.value}
                    itemTag={'tr'}
                    itemSize={rootProps.virtualScrollOption.estimateSize ?? 54}
                    keeps={rootProps.virtualScrollOption.keeps ?? 20}
                    class={bodyWrapperClass.value}
                    wrapTag={'tbody'}
                    renderItemList={renderItemList}
                    itemProps={({ item, index }) => {
                        return {
                            class: getRowClassName({ row: item, rowIndex: index }),
                            style: {
                                ...getRowStyle({ row: item, rowIndex: index }),
                            },
                            onClick: ($event: Event) => {
                                handleRowClick({ row: item, rowIndex: index }, $event);
                            },
                        };
                    }}
                    v-slots={{
                        default: ({ source, index }: { source: object; index: number }) => {
                            if (source) {
                                return renderTdList(source, index);
                            }
                            return null;
                        },
                    }}
                />
            );
        };
    },
});
