/**
 * virtual list default component
 * rewrite by uct8086
 */

import {
    defineComponent,
    watch,
    onActivated,
    onMounted,
    ref,
    createVNode,
    computed,
    CSSProperties,
} from 'vue';
import { throttle } from 'lodash-es';
import FScrollbar from '../scrollbar/scrollbar.vue';
import {
    TO_TOP_EVENT,
    TO_BOTTOM_EVENT,
    RESIZED_EVENT,
} from '../_util/constants';
import Virtual from './virtual';
import { FVirtualListItem } from './listItem';
import { virtualProps } from './props';

enum SLOT_TYPE {
    HEADER = 'thead', // string value also use for aria role attribute
    FOOTER = 'tfoot',
}

export default defineComponent({
    name: 'FVirtualList',
    props: virtualProps,
    emits: [TO_TOP_EVENT, TO_BOTTOM_EVENT, RESIZED_EVENT, 'scroll'],
    setup(props, { emit, slots }) {
        const isHorizontal = props.direction === 'horizontal';
        const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop';

        const rootRef = ref();
        const shepherdRef = ref();
        const rangeRef = ref(Object.create(null));

        const scrollRef = ref();

        let virtual: Virtual = null;

        const fullHeight = computed(() => {
            const { padBehind } = rangeRef.value;
            // 当未全部加载所有子项时，高度跟随getEstimateSize变化
            void virtual.sizes.size;
            if (padBehind !== 0) {
                return (
                    virtual &&
                    virtual.getEstimateSize() * props.dataSources.length
                );
            }
            return virtual.getTotalSize();
        });

        const getUniqueIdFromDataSources = () => {
            const { dataKey } = props;
            return props.dataSources.map((dataSource) =>
                typeof dataKey === 'function'
                    ? dataKey(dataSource)
                    : (dataSource as any)[dataKey],
            );
        };

        const installVirtual = () => {
            virtual = new Virtual(
                {
                    slotHeaderSize: 0,
                    slotFooterSize: 0,
                    keeps: props.keeps,
                    estimateSize: props.estimateSize,
                    buffer: Math.round(props.keeps / 3), // recommend for a third of keeps
                    uniqueIds: getUniqueIdFromDataSources(),
                },
                (range) => {
                    rangeRef.value = range;
                },
            );
            // sync initial range
            rangeRef.value = virtual.getRange();
        };

        installVirtual();

        // get item size by id
        const getSize = (id: number | string) => virtual.sizes.get(id);

        // get the total number of stored (rendered) items
        const getSizes = () => virtual.sizes.size;

        // return current scroll offset
        const getOffset = () => {
            const root = rootRef.value;
            return root ? Math.ceil(root[directionKey]) : 0;
        };

        // return client viewport size
        const getClientSize = () => {
            const key = isHorizontal ? 'clientWidth' : 'clientHeight';
            const root = rootRef.value;
            return root ? Math.ceil(root[key]) : 0;
        };

        // return all scroll size
        const getScrollSize = () => {
            const key = isHorizontal ? 'scrollWidth' : 'scrollHeight';
            const root = rootRef.value;
            return root ? Math.ceil(root[key]) : 0;
        };

        // set current scroll position to a expectant offset
        const scrollToOffset = (offset: number) => {
            const root = rootRef.value;
            if (root) {
                if (isHorizontal) {
                    root.scrollBy(offset, 0);
                } else {
                    root.scrollBy(0, offset); // 解决设置OffsetTop无效的问题
                }
            }
        };

        // set current scroll position to bottom
        const scrollToBottom = () => {
            const shepherd = rootRef.value;
            if (shepherd) {
                const offset =
                    shepherd[isHorizontal ? 'scrollWidth' : 'scrollHeight'];
                scrollToOffset(offset);
                // check if it's really scrolled to the bottom
                // maybe list doesn't render and calculate to last range
                // so we need retry in next event loop until it really at bottom
                const time = setTimeout(() => {
                    if (getOffset() + getClientSize() < getScrollSize()) {
                        scrollToBottom();
                    }
                    clearTimeout(time);
                }, 3);
            }
        };

        // set current scroll position to a expectant index
        const scrollToIndex = (index: number) => {
            // scroll to bottom
            if (index >= props.dataSources.length - 1) {
                scrollToBottom();
            } else {
                const offset = virtual.getOffset(index);
                scrollToOffset(offset);
            }
        };

        // reset all state back to initial
        const reset = () => {
            virtual.destroy();
            scrollToOffset(0);
            installVirtual();
        };

        let lastSize = getSizes();
        const updateScrollBar = throttle(() => {
            const nowSize = getSizes();
            if (nowSize !== lastSize) {
                lastSize = nowSize;
                if (scrollRef.value) {
                    scrollRef.value.update?.();
                }
            }
        }, 10);

        // event called when each item mounted or size changed
        const onItemResized = (id: number | string, size: number) => {
            const sizes = virtual.sizes;
            const oldSize = sizes.get(id);
            if (oldSize !== size) {
                virtual.saveSize(id, size);
                emit(RESIZED_EVENT, id, size);
                updateScrollBar();
            }
        };

        // event called when slot mounted or size changed
        const onSlotResized = (
            type: SLOT_TYPE,
            size: number,
            hasInit: boolean,
        ) => {
            if (slots.header() || slots.footer()) {
                if (type === SLOT_TYPE.HEADER) {
                    virtual.updateParam('slotHeaderSize', size);
                } else if (type === SLOT_TYPE.FOOTER) {
                    virtual.updateParam('slotFooterSize', size);
                }

                if (hasInit) {
                    virtual.handleSlotSizeChange();
                }
            }
        };

        // emit event in special position
        const emitEvent = (
            offset: number,
            clientSize: number,
            scrollSize: number,
            evt: Event,
        ) => {
            emit('scroll', evt, virtual.getRange());

            if (
                virtual.isFront() &&
                !!props.dataSources.length &&
                offset - props.topThreshold <= 0
            ) {
                emit(TO_TOP_EVENT);
            } else if (
                virtual.isBehind() &&
                offset + clientSize + props.bottomThreshold >= scrollSize
            ) {
                emit(TO_BOTTOM_EVENT);
            }
        };

        const onScroll = (evt: Event) => {
            const offset = getOffset();
            const clientSize = getClientSize();
            const scrollSize = getScrollSize();

            // iOS scroll-spring-back behavior will make direction mistake
            if (
                offset < 0 ||
                offset + clientSize > scrollSize + 1 ||
                !scrollSize
            ) {
                return;
            }
            virtual.handleScroll(offset);
            emitEvent(offset, clientSize, scrollSize, evt);
        };

        // get the real render slots based on range data
        // in-place patch strategy will try to reuse components as possible
        // so those components that are reused will not trigger lifecycle mounted
        const getRenderItems = () => {
            const itemVNodes = [];
            const { start, end } = rangeRef.value;
            const { dataSources, dataKey } = props;
            for (let index = start; index <= end; index++) {
                const dataSource = dataSources[index];
                if (dataSource) {
                    const uniqueKey =
                        typeof dataKey === 'function'
                            ? dataKey(dataSource)
                            : (dataSource as any)[dataKey];
                    if (
                        typeof uniqueKey === 'string' ||
                        typeof uniqueKey === 'number'
                    ) {
                        const tempNode = createVNode(
                            FVirtualListItem,
                            {
                                key: uniqueKey,
                                index,
                                horizontal: isHorizontal,
                                uniqueKey,
                                source: dataSource,
                                onItemResized,
                                observeResize: props.observeResize,
                            },
                            {
                                default: slots.default,
                            },
                        );
                        itemVNodes.push(tempNode);
                    } else {
                        console.warn(
                            `Cannot get the data-key '${dataKey}' from data-sources.`,
                        );
                    }
                } else {
                    console.warn(
                        `Cannot get the index '${index}' from data-sources.`,
                    );
                }
            }
            return itemVNodes;
        };

        watch(
            () => props.dataSources,
            () => {
                virtual.updateParam('uniqueIds', getUniqueIdFromDataSources());
                virtual.handleDataSourcesChange();
            },
        );

        watch(
            () => props.keeps,
            (newValue) => {
                virtual.updateParam('keeps', newValue);
                virtual.handleSlotSizeChange();
            },
        );

        watch(
            () => props.start,
            (newValue) => {
                scrollToIndex(newValue);
            },
        );

        watch(
            () => props.offset,
            (newValue) => {
                scrollToOffset(newValue);
            },
        );

        // set back offset when awake from keep-alive
        onActivated(() => {
            scrollToOffset(virtual.offset);
        });

        onMounted(() => {
            // set position
            if (props.start) {
                scrollToIndex(props.start);
            } else if (props.offset) {
                scrollToOffset(props.offset);
            }
        });

        return {
            reset,
            scrollToBottom,
            scrollToIndex,
            scrollToOffset,
            getSize,
            getSizes,
            getOffset,
            getClientSize,
            getScrollSize,
            onScroll,
            getRenderItems,
            onItemResized,
            onSlotResized,
            fullHeight,
            isHorizontal,
            rootRef,
            shepherdRef,
            rangeRef,
            scrollRef,
        };
    },
    render() {
        const { padFront, padBehind } = this.rangeRef;
        const {
            isHorizontal,
            wrapTag,
            wrapClass,
            wrapStyle,
            onScroll,
            fullHeight,
            renderItemList,
            shadow,
            height,
            maxHeight,
        } = this;

        // wrap style
        const horizontalStyle = {
            display: 'flex',
            'flex-direction': 'row',
            position: 'absolute',
            bottom: 0,
            top: 0,
            left: `${padFront}px`,
            right: `${padBehind}px`,
        };
        const verticalStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: `${padFront}px`,
            bottom: `${padBehind}px`,
        };
        const wrapperStyle = Object.assign(
            {},
            wrapStyle || {},
            isHorizontal ? horizontalStyle : verticalStyle,
        );
        const rootStyle: CSSProperties = isHorizontal
            ? {
                  position: 'relative',
                  width: `${fullHeight}px`,
                  height: '100%',
              }
            : {
                  position: 'relative',
                  height: `${fullHeight}px`,
                  width: '100%',
              };

        const wrapNode = createVNode(
            wrapTag,
            {
                class: wrapClass,
                style: wrapperStyle,
            },
            renderItemList
                ? renderItemList(this.getRenderItems())
                : this.getRenderItems(),
        );

        return (
            <FScrollbar
                ref={(e: any) => {
                    this.scrollRef = e;
                    this.rootRef = e?.containerRef;
                }}
                onScroll={onScroll}
                shadow={shadow}
                height={height}
                maxHeight={maxHeight}
                contentStyle={rootStyle}
            >
                {wrapNode}
            </FScrollbar>
        );
    },
});
