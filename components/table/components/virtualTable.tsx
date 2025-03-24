import {
    type ComponentObjectPropsOptions,
    type PropType,
    type VNode,
    createVNode,
    defineComponent,
    inject,
} from 'vue';
import VirtualList from '../../virtual-list/virtualList';
import { provideKey } from '../const';
import type { ColumnInst } from '../column';
import Colgroup from './colgroup';
import Tr from './tr';

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
                        x: noFixedColumn.value,
                        y: true,
                    }}
                    shadowStyle={{ zIndex: 3 }}
                    verticalRatioStyle={{ zIndex: 3 }}
                    horizontalRatioStyle={{ zIndex: 3 }}
                    onScroll={onScroll}
                    dataSources={showData.value}
                    dataKey={rootProps.rowKey}
                    estimateSize={rootProps.virtualScrollOption.estimateSize ?? 54}
                    keeps={rootProps.virtualScrollOption.keeps ?? 20}
                    class={bodyWrapperClass.value}
                    maxHeight={layout.bodyHeight.value}
                    wrapTag={'table'}
                    wrapClass={`${prefixCls}-body`}
                    wrapStyle={bodyStyle.value}
                    always={rootProps.alwaysScrollbar}
                    renderItemList={renderItemList}
                    v-slots={{ default: renderDefault }}
                />
            );
        };
    },
});
