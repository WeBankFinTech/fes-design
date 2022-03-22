import { h, defineComponent, inject, PropType } from 'vue';
import FScrollbar from '../../scrollbar/scrollbar.vue';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Header from './header';
import Tr from './tr';

import type { ColumnInst } from '../column.vue';

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
            columns
        } = inject(provideKey);

        const renderBodyTrList = () =>
            showData.value.length ? (
                showData.value.map((row: object, rowIndex: number) => (
                    <Tr
                        row={row}
                        rowIndex={rowIndex}
                        columns={props.columns}
                        key={(getRowKey({ row }) || rowIndex) as any}
                    />
                ))
            ) : (
                <Tr columns={props.columns} />
            );

        const renderTable = () => {
            return (
                <table
                    class={`${prefixCls}-body`}
                    style={bodyStyle.value}
                    cellspacing="0"
                    cellpadding="0"
                >
                    <Colgroup columns={props.columns} />
                    {!props.composed && rootProps.showHeader && <Header />}
                    <tbody>{renderBodyTrList()}</tbody>
                </table>
            );
        };

        const onScroll = (e: Event) => {
            if (layout.isScrollX.value || layout.isScrollY.value) {
                syncPosition(e);
            }
        };

        return () => {
            if (layout.isScrollX.value || layout.isScrollY.value) {
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
                        shadow={{
                            x: columns.value.every(column=> {
                                return !column.fixLeft &&!column.fixRight
                            }),
                            y: true
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
