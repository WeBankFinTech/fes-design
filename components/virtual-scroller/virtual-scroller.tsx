import type {
    ComponentObjectPropsOptions,
    ExtractPublicPropTypes,
    NativeElements,
    PropType,
    VNodeChild,
} from 'vue';
import {
    computed,
    defineComponent,
    ref,
} from 'vue';
import {
    Virtualizer,
} from 'virtua/vue';
import type { ScrollbarProps } from '../scrollbar/const';
import FScrollbar from '../scrollbar/scrollbar.vue';

type ItemData = Record<string, any>;

export const virtualScrollerProps = {
    scrollbarProps: Object as PropType<ScrollbarProps>,
    dataSources: {
        type: Array as PropType<ItemData[]>,
        default: () => [] as ItemData[],
    },
    keeps: {
        type: Number,
        default: 30,
    },
    direction: {
        type: String as PropType<'horizontal' | 'vertical'>,
        default: 'vertical', // the other value is horizontal
    },
    wrapTag: {
        type: String as PropType<keyof NativeElements>,
        default: 'div',
    },
    wrapClass: {
        type: String,
        default: '',
    },
    wrapStyle: {
        type: Object,
    },
    itemSize: {
        type: Number,
        required: true,
    },
    itemProps: Function as PropType<({ item, index }: { item: ItemData; index: number }) => any>,
    itemTag: {
        type: String as PropType<keyof NativeElements>,
        default: 'div',
    },
    renderItemList: {
        type: Function as PropType<(itemVNodes: VNodeChild) => VNodeChild>,
    },
    topThreshold: {
        type: Number,
        default: 0,
    },
    bottomThreshold: {
        type: Number,
        default: 0,
    },
} as const satisfies ComponentObjectPropsOptions;

export type VirtualScrollerProps = ExtractPublicPropTypes<typeof virtualScrollerProps>;

export default defineComponent({
    name: 'FVirtualScroller',
    props: virtualScrollerProps,
    emits: ['toTop', 'toBottom', 'scroll'],
    setup(props, { slots, expose, emit }) {
        const scrollRef = ref();
        const scrollContainerRef = ref();
        const virtualRef = ref();

        const isHorizontal = computed(() => {
            return props.direction === 'horizontal';
        });

        const directionKey = computed(() => {
            return isHorizontal.value ? 'scrollLeft' : 'scrollTop';
        });

        const getOffset = () => {
            const root = scrollContainerRef.value;
            return root ? Math.ceil(root[directionKey.value]) : 0;
        };

        const getScrollSize = () => {
            const key = isHorizontal.value ? 'scrollWidth' : 'scrollHeight';
            const root = scrollContainerRef.value;
            return root ? Math.ceil(root[key]) : 0;
        };
        // return client viewport size
        const getClientSize = () => {
            const key = isHorizontal.value ? 'clientWidth' : 'clientHeight';
            const root = scrollContainerRef.value;
            return root ? Math.ceil(root[key]) : 0;
        };

        // set current scroll position to bottom
        const scrollToBottom = () => {
            const root = scrollContainerRef.value;
            if (root) {
                virtualRef.value?.scrollTo(getScrollSize());
                // check if it's really scrolled to the bottom
                // maybe list doesn't render and calculate to last range
                // so we need retry in next event loop until it really at bottom
                setTimeout(() => {
                    if (getOffset() + getClientSize() < getScrollSize()) {
                        scrollToBottom();
                    }
                }, 10);
            }
        };

        expose({
            scrollRef,
            virtualRef,
            scrollToIndex: (index: number, opt?: any) => {
                virtualRef.value?.scrollToIndex(index, opt);
            },
            scrollToBottom,
            scrollTo: (offset: number) => {
                virtualRef.value?.scrollTo(offset);
            },
            scrollBy: (offset: number) => {
                virtualRef.value?.scrollBy(offset);
            },
            getItemOffset: (index: number) => {
                return virtualRef.value?.getItemOffset(index);
            },
            getItemSize: (index: number) => {
                return virtualRef.value?.getItemSize(index);
            },
            findStartIndex: () => {
                virtualRef.value?.findStartIndex();
            },
            findEndIndex: () => {
                virtualRef.value?.findEndIndex();
            },
            getOffset,
            getScrollSize,
            getClientSize,
        });

        let lastScrollTop = 0;
        const onScroll = (e: Event) => {
            emit('scroll', e);
            const currentScrollTop = (e.target as HTMLElement).scrollTop;
            const isScrollUp = currentScrollTop < lastScrollTop;
            lastScrollTop = currentScrollTop;

            const offset = getOffset();
            const scrollSize = getScrollSize();
            const clientSize = getClientSize();
            if (isScrollUp && offset <= props.topThreshold) {
                emit('toTop');
            }
            if (!isScrollUp && offset + clientSize >= scrollSize - props.bottomThreshold) {
                emit('toBottom');
            }
        };

        return () => {
            const virtualizer = (
                <Virtualizer
                    ref={virtualRef}
                    data={props.dataSources}
                    scrollRef={scrollContainerRef.value}
                    horizontal={isHorizontal.value}
                    as={props.wrapTag}
                    class={props.wrapClass}
                    style={props.wrapStyle}
                    itemSize={props.itemSize}
                    itemProps={props.itemProps}
                    item={props.itemTag}
                    overscan={Math.ceil(props.keeps / 3)}
                >
                    {{
                        default: ({ item, index }: { item: ItemData; index: number }) => {
                            return slots.default?.({ source: item, index });
                        },
                    }}
                </Virtualizer>
            );
            return (
                <FScrollbar
                    ref={(e: any) => {
                        scrollRef.value = e;
                        scrollContainerRef.value = e?.containerRef;
                    }}
                    {...(props.scrollbarProps as ScrollbarProps)}
                    onScroll={onScroll}
                >
                    { props.renderItemList ? props.renderItemList(virtualizer) : virtualizer }
                </FScrollbar>
            );
        };
    },
});
