/**
 * virtual list default component
 * rewrite by uct8086
 */

import { defineComponent, watch, onActivated, onMounted, ref, createVNode, computed } from 'vue';
import Virtual from './virtual';
import { FVirtualListItem } from './listItem';
import { VirtualProps } from './props';
import WScrollbar from '../scrollbar/scrollbar';
import { TO_TOP_EVENT, TO_BOTTOM_EVENT, RESIZED_EVENT } from '../_util/constants';

import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('virtuallist');

const SLOT_TYPE = {
    HEADER: 'thead', // string value also use for aria role attribute
    FOOTER: 'tfoot',
};

export default defineComponent({
    name: 'FVirtualList',
    props: VirtualProps,
    emits: [TO_TOP_EVENT, TO_BOTTOM_EVENT, RESIZED_EVENT, 'scroll'],
    setup(props, { emit, slots }) {
        const isHorizontal = props.direction === 'horizontal';
        const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop';

        const rootRef = ref();
        const shepherdRef = ref();
        const rangeRef = ref(Object.create(null));

        let virtual = null;

        const fullHeight = computed(() => {
            const { padBehind } = rangeRef.value;
            if (padBehind !== 0) {
                return virtual && virtual.getEstimateSize() * props.dataSources.length;
            }
            return virtual.getTotalSize();
        });

        const getUniqueIdFromDataSources = () => {
            const { dataKey } = props;
            return props.dataSources.map((dataSource) => (typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey]));
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
        const getSize = (id) => virtual.sizes.get(id);

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
        const scrollToOffset = (offset) => {
            const root = rootRef.value;
            if (root) {
                isHorizontal ? root.scrollBy(offset, 0) : root.scrollBy(0, offset); // 解决设置OffsetTop无效的问题
            }
        };

        // set current scroll position to bottom
        const scrollToBottom = () => {
            const shepherd = rootRef.value;
            if (shepherd) {
                const offset = shepherd[isHorizontal ? 'offsetLeft' : 'offsetTop'];
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
        const scrollToIndex = (index) => {
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

        // event called when each item mounted or size changed
        const onItemResized = (id, size) => {
            virtual.saveSize(id, size);
            emit(RESIZED_EVENT, id, size);
        };

        // event called when slot mounted or size changed
        const onSlotResized = (type, size, hasInit) => {
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
        const emitEvent = (offset, clientSize, scrollSize, evt) => {
            emit('scroll', evt, virtual.getRange());

            if (virtual.isFront() && !!props.dataSources.length && offset - props.topThreshold <= 0) {
                emit(TO_TOP_EVENT);
            } else if (virtual.isBehind() && offset + clientSize + props.bottomThreshold >= scrollSize) {
                emit(TO_BOTTOM_EVENT);
            }
        };

        const onScroll = (evt) => {
            const offset = getOffset();
            const clientSize = getClientSize();
            const scrollSize = getScrollSize();

            // iOS scroll-spring-back behavior will make direction mistake
            if (offset < 0 || offset + clientSize > scrollSize + 1 || !scrollSize) {
                return;
            }

            virtual.handleScroll(offset);
            emitEvent(offset, clientSize, scrollSize, evt);
        };

        // get the real render slots based on range data
        // in-place patch strategy will try to reuse components as possible
        // so those components that are reused will not trigger lifecycle mounted
        const getRenderSlots = () => {
            const _slots = [];
            const { start, end } = rangeRef.value;
            try {
                const { dataSources, dataKey, itemClass, itemTag, itemStyle, extraProps, itemScopedSlots, itemClassAdd } = props;
                const slotComponent = slots && slots.default;
                for (let index = start; index <= end; index++) {
                    const dataSource = dataSources[index];
                    if (dataSource) {
                        const uniqueKey = typeof dataKey === 'function' ? dataKey(dataSource) : dataSource[dataKey];
                        if (typeof uniqueKey === 'string' || typeof uniqueKey === 'number') {
                            const tempNode = createVNode(FVirtualListItem, {
                                index,
                                key: index, // Vue3采用Key变更刷新，最省事
                                tag: itemTag,
                                horizontal: isHorizontal,
                                uniqueKey,
                                source: dataSource,
                                extraProps,
                                slotComponent,
                                scopedSlots: itemScopedSlots,
                                style: itemStyle,
                                onItemResized,
                                class: `${itemClass}${itemClassAdd ? ` ${itemClassAdd(index)}` : ''}`,
                            });
                            _slots.push(tempNode);
                        } else {
                            console.warn(`Cannot get the data-key '${dataKey}' from data-sources.`);
                        }
                    } else {
                        console.warn(`Cannot get the index '${index}' from data-sources.`);
                    }
                }
                return _slots;
            } catch (e) {
                console.warn(e);
            }
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
            getRenderSlots,
            onItemResized,
            onSlotResized,
            fullHeight,
            isHorizontal,
            rootRef,
            shepherdRef,
            rangeRef,
        };
    },
    render() {
        const { padFront, padBehind } = this.rangeRef;
        const { isHorizontal, rootTag, wrapTag, wrapClass, wrapStyle, onScroll, fullHeight } = this;

        // wrap style
        const horizontalStyle = { position: 'absolute', left: `${padFront}px`, right: `${padBehind}px` };
        const verticalStyle = { position: 'absolute', top: `${padFront}px`, bottom: `${padBehind}px` };
        const extraStyle = isHorizontal ? horizontalStyle : verticalStyle;
        const wrapperStyle = wrapStyle ? Object.assign({}, wrapStyle, extraStyle) : extraStyle;
        // root style
        const rootStyle = isHorizontal ? { position: 'relative', width: `${fullHeight}px` } : { position: 'relative', height: `${fullHeight}px` };

        const tempVirtualVNode = createVNode(
            rootTag,
            {
                style: rootStyle,
                ref: (el) => {
                    if (el) this.rootRef = el.parentElement;
                },
            },
            [
                // 主列表
                createVNode(
                    wrapTag,
                    {
                        class: wrapClass,
                        role: 'group',
                        style: wrapperStyle,
                    },
                    this.getRenderSlots(),
                ),
            ],
        );

        return <WScrollbar onScroll={onScroll}>{tempVirtualVNode}</WScrollbar>;
    },
});
