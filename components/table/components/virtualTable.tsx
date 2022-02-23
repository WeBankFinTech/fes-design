import { h, defineComponent, inject, VNode, PropType, createVNode } from 'vue';
import VirtualList from '../../virtual-list/virtualList';
import { provideKey } from '../const';
import Colgroup from './colgroup';
import Tr from './tr';

import type { ColumnInst } from '../column.vue';

export default defineComponent({
    props: {
        columns: {
            type: Array as PropType<ColumnInst[]>,
            required: true,
        },
    },
    setup(props, { emit }) {
        const {
            showData,
            rootProps,
            layout,
            prefixCls,
            bodyWrapperRef,
            bodyWrapperClass,
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
                createVNode('tbody', {}, itemVNodes),
            ];
        };

        return () => {
            return (
                <VirtualList
                    ref={(el: any) => {
                        if (el) {
                            bodyWrapperRef.value = el.$el;
                        }
                    }}
                    onScroll={(event: Event) => {
                        emit('scroll', event);
                    }}
                    dataSources={showData.value}
                    dataKey={rootProps.rowKey}
                    estimateSize={54}
                    keeps={20}
                    class={bodyWrapperClass.value}
                    style={{ height: `${layout.bodyHeight.value}px` }}
                    wrapTag={'table'}
                    wrapClass={`${prefixCls}-body`}
                    renderItemList={renderItemList}
                    v-slots={{ default: renderDefault }}
                />
            );
        };
    },
});
