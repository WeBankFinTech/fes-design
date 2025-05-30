/**
 * virtual list default component
 * rewrite by uct8086
 */

import type {
    CSSProperties,
} from 'vue';
import {
    createVNode,
    defineComponent,
    onActivated,
    onBeforeUnmount,
    onMounted,
    ref,
    watch,
} from 'vue';
import { isEqual, isNil, throttle } from 'lodash-es';
import FScrollbar from '../scrollbar/scrollbar.vue';
import {
    RESIZED_EVENT,
    TO_BOTTOM_EVENT,
    TO_TOP_EVENT,
} from '../_util/constants';
import getPrefixCls from '../_util/getPrefixCls';
import Virtual from './virtual';
import { FVirtualListItem } from './listItem';
import { virtualProps } from './props';
import { ITME_RESIZE_UPDATE_SCROLL_BAR_TIMEOUT } from './const';

enum SLOT_TYPE {
    HEADER = 'thead', // string value also use for aria role attribute
    FOOTER = 'tfoot',
}

const prefixCls = getPrefixCls('virtual-list');

export default defineComponent({
    name: 'FVirtualList',
    props: virtualProps,
    emits: [TO_TOP_EVENT, TO_BOTTOM_EVENT, RESIZED_EVENT, 'scroll'],
    setup(props, { emit, slots }) {
        const isHorizontal = props.direction === 'horizontal';
        const directionKey = isHorizontal ? 'scrollLeft' : 'scrollTop';

        const rootRef = ref();

        const rangeRef = ref(Object.create(null));

        const scrollRef = ref();

        let virtual: Virtual = null;

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
                    buffer: Math.max(Math.round(props.keeps / 3), 5), // 增加缓冲区大小，最小为5
                    uniqueIds: getUniqueIdFromDataSources(),
                },
                (range) => {
                    // 智能更新策略：只有当范围变化足够大时才触发更新
                    const currentRange = rangeRef.value;
                    if (!isEqual(currentRange, range)) {
                        rangeRef.value = range;
                    }
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

        // set current scroll position to a expectant target
        const scrollToTarget = (position: number) => {
            const root = rootRef.value;
            if (root) {
                if (isHorizontal) {
                    root.scrollTo(position, 0);
                } else {
                    root.scrollTo(0, position); // 解决设置OffsetTop无效的问题
                }
            }
        };

        // set current scroll position to bottom
        const scrollToBottom = () => {
            const root = rootRef.value;
            if (root) {
                const scrollSize = getScrollSize();
                const clientSize = getClientSize();
                const maxScrollPosition = Math.max(0, scrollSize - clientSize);

                scrollToTarget(maxScrollPosition);

                // check if it's really scrolled to the bottom
                // maybe list doesn't render and calculate to last range
                // so we need retry in next event loop until it really at bottom
                setTimeout(() => {
                    // 修改条件判断：当滚动位置不在底部时才重试
                    const currentOffset = getOffset();
                    const currentClientSize = getClientSize();
                    const currentScrollSize = getScrollSize();

                    // 添加容错范围，避免因为像素精度问题导致的判断失误
                    const tolerance = 2;
                    if (currentOffset + currentClientSize + tolerance < currentScrollSize) {
                        scrollToBottom();
                    }
                }, ITME_RESIZE_UPDATE_SCROLL_BAR_TIMEOUT + 10);
            }
        };

        // set current scroll position to a expectant index
        const scrollToIndex = (index: number) => {
            // scroll to bottom
            if (index >= props.dataSources.length - 1) {
                scrollToBottom();
            } else {
                const offset = virtual.getOffset(index);
                scrollToTarget(offset);
            }
        };

        // reset all state back to initial
        const reset = () => {
            virtual.destroy();
            scrollToIndex(0);
            installVirtual();
        };

        let lastSize = getSizes();
        // 优化滚动条更新频率，减少不必要的更新
        const updateScrollBar = throttle(() => {
            const nowSize = getSizes();
            if (nowSize !== lastSize) {
                lastSize = nowSize;
                if (scrollRef.value) {
                    scrollRef.value.update?.();
                }
            }
        }, ITME_RESIZE_UPDATE_SCROLL_BAR_TIMEOUT);

        // 智能预渲染缓存系统
        interface CacheItem {
            node: any;
            timestamp: number;
            accessCount: number;
            distance: number; // 距离当前视口的距离
        }

        // 简化缓存管理，只使用单层缓存
        const cache = new Map<string | number, CacheItem>(); // 统一缓存

        // 优化的预渲染范围计算，考虑滚动方向和速度（简化版）
        const getPreRenderRange = (currentRange: [number, number]): [number, number] => {
            const [start, end] = currentRange;
            const buffer = Math.max(Math.round(props.keeps / 2), 5); // 基础缓冲区大小
            let preRenderStart = start;
            let preRenderEnd = end;

            // 根据滚动方向动态调整预渲染区域，但不过度扩展
            // 这里简化处理，仅使用固定缓冲区，高级的可以结合滚动速度
            preRenderStart = Math.max(0, start - buffer);
            preRenderEnd = Math.min(props.dataSources.length - 1, end + buffer);

            return [preRenderStart, preRenderEnd];
        };

        // 简化的缓存设置 - 优先保留视口内的节点
        const setSmartCache = (key: string | number, node: any) => {
            const item: CacheItem = {
                node,
                timestamp: Date.now(),
                accessCount: 1,
                distance: 0, // distance 暂时不在此处复杂计算，由清理逻辑处理
            };

            if (cache.has(key)) {
                cache.delete(key); // 保持LRU特性，访问的放到后面
            }
            cache.set(key, item);

            // 缓存清理移到滚动结束或特定时机，避免频繁操作
            if (cache.size > props.keeps * 2.5) { // 稍微放宽缓存大小
                // 简单LRU: 删除最早的条目
                const firstKey = cache.keys().next().value;
                if (firstKey !== undefined) {
                    cache.delete(firstKey);
                }
            }
        };

        // 简化的缓存获取 - 更新访问信息
        const getSmartCache = (key: string | number): any => {
            const item = cache.get(key);
            if (item) {
                item.accessCount++;
                item.timestamp = Date.now();
                // 将访问过的元素移到Map尾部（表示最近使用），如果Map本身不保证顺序，则需要手动管理
                // Vue3的Map默认是按插入顺序的，所以delete再set可以实现LRU
                cache.delete(key);
                cache.set(key, item);
                return item.node;
            }
            return null;
        };

        // event called when each item mounted or size changed
        const onItemResized = (id: number | string, size: number) => {
            const sizes = virtual.sizes;
            const oldSize = sizes.get(id);
            if (oldSize !== size) {
                virtual.saveSize(id, size);
                emit(RESIZED_EVENT, id, size);

                // 只有当尺寸变化较大时才更新滚动条，避免频繁更新
                const sizeChange = Math.abs((oldSize || 0) - size);
                if (sizeChange > 2) {
                    updateScrollBar();
                }
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
                virtual.isFront()
                && !!props.dataSources.length
                && offset - props.topThreshold <= 0
            ) {
                emit(TO_TOP_EVENT);
            } else if (
                virtual.isBehind()
                && offset + clientSize + props.bottomThreshold >= scrollSize
            ) {
                emit(TO_BOTTOM_EVENT);
            }
        };

        // 简化的滚动事件处理
        let scrollTimer: number | null = null;
        const onScroll = (evt: Event) => {
            const offset = getOffset();
            const clientSize = getClientSize();
            const scrollSize = getScrollSize();

            // iOS scroll-spring-back behavior will make direction mistake
            if (
                offset < 0
                || offset + clientSize > scrollSize + 1
                || !scrollSize
            ) {
                return;
            }

            // 立即处理滚动计算，不使用复杂的延迟策略
            virtual.handleScroll(offset);
            emitEvent(offset, clientSize, scrollSize, evt);

            // 简单的滚动结束检测
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }
            scrollTimer = setTimeout(() => {
                // 滚动结束后的缓存优化
                const now = Date.now();
                const expireTime = 2 * 60 * 1000; // 2分钟过期
                const currentVisibleRange = rangeRef.value;
                const buffer = Math.max(Math.round(props.keeps / 2), 5);

                const itemsToDelete: (string | number)[] = [];

                for (const [key, item] of cache.entries()) {
                    // 检查是否过期
                    if (now - item.timestamp > expireTime) {
                        itemsToDelete.push(key);
                        continue;
                    }

                    // 检查是否在当前视口及缓冲区之外 (基于item.node.props.index)
                    // 注意：这里需要确保item.node.props.index存在且正确
                    const itemIndex = item.node?.props?.index;
                    if (typeof itemIndex === 'number' && currentVisibleRange) {
                        if (itemIndex < currentVisibleRange.start - buffer || itemIndex > currentVisibleRange.end + buffer) {
                            // 进一步判断：如果访问次数少，则倾向于删除
                            if (item.accessCount < 2) { // 访问次数少的，且不在缓冲区内的，删除
                                itemsToDelete.push(key);
                            }
                        }
                    }
                }

                itemsToDelete.forEach((key) => cache.delete(key));

                // 确保缓存不会无限增长，即使没有过期或不在视口外的项
                while (cache.size > props.keeps * 3) {
                    const firstKey = cache.keys().next().value;
                    if (firstKey !== undefined) {
                        cache.delete(firstKey);
                    } else {
                        break; // 缓存已空
                    }
                }
            }, 200) as any; // 稍微延长检测时间
        };

        // get the real render slots based on range data
        // in-place patch strategy will try to reuse components as possible
        // so those components that are reused will not trigger lifecycle mounted
        const getRenderItems = () => {
            const itemVNodes = [];
            const { start, end } = rangeRef.value;
            const { dataSources, dataKey } = props;

            // 使用简化的预渲染范围计算
            const [extendedStart, extendedEnd] = getPreRenderRange([start, end]);

            for (let index = extendedStart; index <= extendedEnd; index++) {
                const dataSource = dataSources[index];
                if (!isNil(dataSource)) {
                    const uniqueKey
                        = typeof dataKey === 'function'
                            ? dataKey(dataSource)
                            : (dataSource as any)[dataKey];
                    if (
                        typeof uniqueKey === 'string'
                        || typeof uniqueKey === 'number'
                    ) {
                        // 简化缓存逻辑，尝试从缓存中获取
                        let tempNode = getSmartCache(uniqueKey);

                        if (!tempNode) {
                            tempNode = createVNode(
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

                            // 使用简化的缓存策略存储
                            setSmartCache(uniqueKey, tempNode);
                        }

                        // 只渲染在正常范围内的节点
                        if (index >= start && index <= end) {
                            itemVNodes.push(tempNode);
                        }
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

        onBeforeUnmount(() => {
            // 清理定时器
            if (scrollTimer) {
                clearTimeout(scrollTimer);
            }

            // 清理缓存
            cache.clear();

            virtual.destroy();
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
            isHorizontal,
            rootRef,
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
            renderItemList,
            shadow,
            height,
            maxHeight,
            native,
            always,
            minSize,
        } = this;

        const wrapperStyle = Object.assign(
            {},
            wrapStyle || {},
            isHorizontal
                ? {
                        display: 'flex',
                        flexDirection: 'row',
                        height: '100%',
                        padding: `0px ${padBehind}px 0px ${padFront}px`,
                    }
                : {
                        width: '100%',
                        padding: `${padFront}px 0px ${padBehind}px`,
                    },
        );

        const rootStyle: CSSProperties = isHorizontal
            ? {
                    position: 'relative',
                    height: '100%',
                }
            : {
                    position: 'relative',
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
                native={native}
                always={always}
                minSize={minSize}
                contentStyle={rootStyle}
                containerClass={`${prefixCls}-container`}
            >
                {wrapNode}
            </FScrollbar>
        );
    },
});
