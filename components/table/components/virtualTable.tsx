import { defineComponent, inject, VNode, PropType, createVNode } from 'vue';
import VirtualList from '../../virtual-list/virtualList';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Tr from './tr';

import type { ColumnInst } from '../column';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
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
            hasFixedColumn,
        } = inject(provideKey);

        const renderDefault = ({
            source,
            index,
        }: {
            source: Record<string, any>;
            index: number;
        }) => {
            return (
                <Tr
                    expanded={false}
                    row={source}
                    rowIndex={index}
                    columns={props.columns}
                />
            );
        };

        const renderItemList = (itemVNodes: VNode[]) => {
            return [
                createVNode(Colgroup, {
                    columns: props.columns,
                }),
                createVNode(
                    'tbody',
                    {},
                    itemVNodes.length
                        ? itemVNodes
                        : [<Tr columns={props.columns} />],
                ),
            ];
        };

        const onScroll = (e: Event) => {
            if (layout.isScrollX.value || layout.isScrollY.value) {
                syncPosition(e);
            }
        };

        return () => {
            return (
                <VirtualList
                    ref={(el: any) => {
                        if (el) {
                            scrollbarRef.value = el.scrollRef;
                            bodyWrapperRef.value = el.$el;
                        }
                    }}
                    shadow={{
                        x: hasFixedColumn.value,
                        y: true,
                    }}
                    horizontalRatioStyle={{ zIndex: 3 }}
                    verticalRatioStyle={{ zIndex: 3 }}
                    shadowStyle={{ zIndex: 3 }}
                    onScroll={onScroll}
                    dataSources={showData.value}
                    dataKey={rootProps.rowKey}
                    estimateSize={54}
                    keeps={20}
                    class={bodyWrapperClass.value}
                    maxHeight={layout.bodyHeight.value}
                    wrapTag={'table'}
                    wrapClass={`${prefixCls}-body`}
                    wrapStyle={bodyStyle.value}
                    renderItemList={renderItemList}
                    v-slots={{ default: renderDefault }}
                />
            );
        };
    },
});
