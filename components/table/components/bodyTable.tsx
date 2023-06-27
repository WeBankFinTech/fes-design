import { defineComponent, inject, PropType, computed } from 'vue';
import FScrollbar from '../../scrollbar/scrollbar.vue';
import Draggable from '../../draggable/draggable';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';
import Tr from './tr';
import NoData from './noData';

import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        composed: {
            type: Boolean,
            default: false,
        },
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props) {
        const {
            layout,
            prefixCls,
            bodyWrapperRef,
            bodyWrapperClass,
            bodyWrapperStyle,
            bodyStyle,
            rootProps,
            showData,
            getRowKey,
            syncPosition,
            scrollbarRef,
            hasFixedColumn,
            onDragstart,
            onDragend,
            beforeDragend,
        } = inject(provideKey);

        const hasResizableColumn = computed(() => {
            return props.columns.some((col) => col.props.resizable);
        });

        const renderBodyTrList = () =>
            showData.value.map((row: object, rowIndex: number) => (
                <Tr
                    row={row}
                    rowIndex={rowIndex}
                    columns={props.columns}
                    key={(getRowKey({ row }) || rowIndex) as any}
                />
            ));

        const slots = {
            default: ({ item, index }: { item: object; index: number }) => {
                return (
                    <Tr
                        row={item}
                        rowIndex={index}
                        columns={props.columns}
                        expanded={false}
                        key={(getRowKey({ row: item }) || index) as any}
                    />
                );
            },
        };

        const renderBody = () => {
            if (showData.value.length === 0) {
                return <NoData></NoData>;
            }
            if (rootProps.draggable) {
                return (
                    <Draggable
                        tag="tbody"
                        v-model={showData.value}
                        beforeDragend={beforeDragend}
                        onDragstart={onDragstart}
                        onDragend={onDragend}
                        v-slots={slots}
                    ></Draggable>
                );
            }
            return <tbody>{renderBodyTrList()}</tbody>;
        };

        const renderTable = () => {
            return (
                <table
                    class={`${prefixCls}-body`}
                    style={[
                        bodyStyle.value,
                        {
                            'table-layout': props.composed
                                ? 'fixed'
                                : rootProps.layout,
                        },
                    ]}
                    cellspacing="0"
                    cellpadding="0"
                >
                    <Colgroup columns={props.columns} />
                    {!props.composed && rootProps.showHeader && (
                        <Header columns={props.columns} />
                    )}
                    {renderBody()}
                </table>
            );
        };

        const onScroll = (e: Event) => {
            if (layout.isScrollX.value || layout.isScrollY.value) {
                syncPosition(e);
            }
        };

        return () => {
            if (
                hasResizableColumn.value ||
                layout.isScrollX.value ||
                layout.isScrollY.value
            ) {
                return (
                    <FScrollbar
                        ref={(el: any) => {
                            if (el) {
                                scrollbarRef.value = el;
                                bodyWrapperRef.value = el.$el;
                            }
                        }}
                        class={bodyWrapperClass.value}
                        style={bodyWrapperStyle.value}
                        horizontalRatioStyle={{ zIndex: 3 }}
                        verticalRatioStyle={{ zIndex: 3 }}
                        shadowStyle={{ zIndex: 3 }}
                        shadow={{
                            x: hasFixedColumn.value,
                            y: true,
                        }}
                        onScroll={onScroll}
                    >
                        {renderTable()}
                    </FScrollbar>
                );
            }
            return (
                <div
                    ref={(el) => {
                        bodyWrapperRef.value = el;
                    }}
                    class={bodyWrapperClass.value}
                    style={bodyWrapperStyle.value}
                >
                    {renderTable()}
                </div>
            );
        };
    },
});
