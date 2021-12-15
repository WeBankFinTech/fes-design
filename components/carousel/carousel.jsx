import { computed, defineComponent, ref, reactive, watch, onMounted, onBeforeUnmount, nextTick, provide, Transition } from 'vue';
import { throttle } from 'lodash-es';
import CarouselItem from './carousel-item';
import getPrefixCls from '../_util/getPrefixCls';
import { addResizeListener, removeResizeListener } from '../_util/resizeEvent';

const CHANGE_EVENT = 'change';

const prefixCls = getPrefixCls('carousel');

export default defineComponent({
    name: 'FCarousel',
    props: {
        height: {
            type: String,
            default: '',
        },
        initialIndex: {
            type: Number,
            default: 0,
        },
        trigger: {
            type: String,
            default: 'click',
        },
        autoplay: {
            type: Boolean,
            default: true,
        },
        interval: {
            type: Number,
            default: 3000,
        },
        indicatorType: {
            type: String,
            default: 'linear',
            validator(val) {
                return ['linear', 'dot'].includes(val);
            },
        },
        indicatorPlacement: {
            type: String,
            default: 'bottom',
            validator(val) {
                return ['top', 'bottom', 'left', 'right'].includes(val);
            },
        },
        indicatorPosition: {
            type: String,
            default: '',
        },
        showArrow: {
            type: String,
            default: 'hover',
        },
        type: {
            type: String,
            default: '',
        },
        loop: {
            type: Boolean,
            default: true,
        },
        pauseOnHover: {
            type: Boolean,
            default: true,
        },
    },
    emits: [CHANGE_EVENT],
    setup(props, { slots, emit, expose }) {
        const state = reactive({
            activeIndex: -1,
            containerWidth: 0, // 滑动器容器宽度
            timer: null,
            hover: false,
        });
        const rootRef = ref(null);
        const slideChildren = ref([]);

        const defaultNodes = slots.default();
        defaultNodes.forEach((tag) => {
            if (tag.type !== CarouselItem) {
                throw new Error('Carousel 子标签必须是 CarouselItem');
            }
        });

        // 方向
        const direction = computed(() => {
            const { indicatorPlacement: propIndicatorPlacement } = props;
            if (propIndicatorPlacement === 'top' || propIndicatorPlacement === 'bottom') {
                return 'horizontal';
            }
            if (propIndicatorPlacement === 'left' || propIndicatorPlacement === 'right') {
                return 'vertical';
            }
            return '';
        });

        // arrow visible
        const arrowVisible = computed(() => props.showArrow !== 'never' && direction.value === 'horizontal');

        const carouselCls = computed(() => {
            const classes = [prefixCls, `${prefixCls}-${direction.value}`];
            if (props.type === 'card') {
                classes.push(`${prefixCls}-card`);
            }
            return classes;
        });

        const indicatorsCls = computed(() => {
            const classes = [`${prefixCls}-indicators`, `${prefixCls}-indicators-${props.indicatorPlacement}`];
            if (props.indicatorPosition === 'outside' || props.type === 'card') {
                classes.push(`${prefixCls}-indicators-outside`);
            }
            return classes;
        });

        const trackStyle = computed(() => {
            const style = {
                height: props.height,
            };
            return style;
        });

        const resetItemPosition = (oldIndex) => {
            slideChildren.value.forEach((item, index) => {
                item.translateItem(index, state.activeIndex, oldIndex);
            });
        };

        function setActiveItem(index) {
            const idx = Number(index);
            if (Number.isNaN(idx) || idx !== Math.floor(idx)) {
                console.warn('Carousel index must be an integer.');
                return;
            }
            const childrenCount = slideChildren.value.length;
            const oldIndex = state.activeIndex;
            if (idx < 0) {
                state.activeIndex = props.loop ? childrenCount - 1 : 0;
            } else if (idx >= childrenCount) {
                state.activeIndex = props.loop ? 0 : childrenCount - 1;
            } else {
                state.activeIndex = idx;
            }
            if (oldIndex === state.activeIndex) {
                resetItemPosition(oldIndex);
            }
        }

        function prev() {
            setActiveItem(state.activeIndex - 1);
        }

        function next() {
            setActiveItem(state.activeIndex + 1);
        }

        function addChildNode(item) {
            slideChildren.value.push(item);
        }

        function removeChildNode(uid) {
            const index = slideChildren.value.findIndex((item) => item.uid === uid);
            if (index !== -1) {
                slideChildren.value.splice(index, 1);
                if (state.activeIndex === index) next();
            }
        }

        const playSlides = () => {
            if (state.activeIndex < slideChildren.value.length - 1) {
                state.activeIndex = state.activeIndex + 1;
            } else if (props.loop) {
                state.activeIndex = 0;
            }
        };

        const startTimer = () => {
            if (props.interval <= 0 || !props.autoplay || state.timer) return;
            state.timer = setInterval(() => playSlides(), props.interval);
        };

        const pauseTimer = () => {
            if (state.timer) {
                clearInterval(state.timer);
                state.timer = null;
            }
        };

        const slideItemInStage = (slideItem, index) => {
            const length = slideChildren.value.length;
            if (
                (index === length - 1 && slideItem.inStage && slideChildren.value[0].active) ||
                (slideItem.inStage && slideChildren.value[index + 1] && slideChildren.value[index + 1].active)
            ) {
                return 'left';
            }
            if (
                (index === 0 && slideItem.inStage && slideChildren.value[length - 1].active) ||
                (slideItem.inStage && slideChildren.value[index - 1] && slideChildren.value[index - 1].active)
            ) {
                return 'right';
            }
            return false;
        };

        const handleMouseEnter = (event) => {
            event.stopPropagation();
            state.hover = true;
            if (props.pauseOnHover) pauseTimer();
        };

        const handleMouseLeave = (event) => {
            event.stopPropagation();
            state.hover = false;
            startTimer();
        };

        const onEnterArrowButton = (arrow) => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item, index) => {
                if (arrow === slideItemInStage(item, index)) {
                    item.hover = false;
                }
            });
        };

        const onLeaveArrowButton = () => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item) => {
                item.hover = false;
            });
        };

        const onClickIndicator = (event, index) => {
            event.stopPropagation();
            state.activeIndex = index;
        };

        const onHoverIndicator = (index) => {
            if (props.trigger === 'hover' && index !== state.activeIndex) {
                state.activeIndex = index;
            }
        };

        const throttledArrowClick = throttle(
            (event, index) => {
                event.stopPropagation();
                setActiveItem(index);
            },
            300,
            { trailing: true },
        );
        const throttledIndicatorHover = throttle((event, index) => {
            event.stopPropagation();
            onHoverIndicator(index);
        }, 300);

        watch(
            () => state.activeIndex,
            (currValue, prevState) => {
                resetItemPosition(prevState);
                if (prevState > -1) {
                    emit(CHANGE_EVENT, currValue, prevState);
                }
            },
        );

        watch(
            () => props.autoplay,
            (current) => {
                current ? startTimer() : pauseTimer();
            },
        );

        watch(
            () => props.loop,
            () => {
                setActiveItem(state.activeIndex);
            },
        );

        onMounted(() => {
            nextTick(() => {
                addResizeListener(rootRef.value, resetItemPosition);
                state.containerWidth = rootRef.value.offsetWidth;
                if (props.initialIndex >= 0 && props.initialIndex < slideChildren.value.length) {
                    state.activeIndex = props.initialIndex;
                }
                startTimer();
            });
        });

        onBeforeUnmount(() => {
            if (rootRef.value) removeResizeListener(rootRef.value, resetItemPosition);
            pauseTimer();
        });

        provide('carouselScope', {
            rootRef,
            direction: direction.value,
            slideChildren,
            type: props.type,
            loop: props.loop,
            addChildNode,
            removeChildNode,
            setActiveItem,
        });

        expose({
            prev,
            next,
            setActiveItem,
        });

        const renderArrow = () => (
            <>
                <Transition name="carousel-arrow-left">
                    <button
                        vShow={(props.showArrow === 'always' || state.hover) && (props.loop || state.activeIndex > 0)}
                        type="button"
                        class={`${prefixCls}-arrow ${prefixCls}-arrow-left`}
                        onMouseenter={() => onEnterArrowButton('left')}
                        onMouseleave={onLeaveArrowButton}
                        onClick={(e) => throttledArrowClick(e, state.activeIndex - 1)}
                    >
                        <i></i>
                    </button>
                </Transition>
                <Transition name="carousel-arrow-right">
                    <button
                        vShow={(props.showArrow === 'always' || state.hover) && (props.loop || state.activeIndex < slideChildren.value.length - 1)}
                        type="button"
                        class={`${prefixCls}-arrow ${prefixCls}-arrow-right`}
                        onMouseenter={() => onEnterArrowButton('right')}
                        onMouseleave={onLeaveArrowButton}
                        onClick={(e) => throttledArrowClick(e, state.activeIndex + 1)}
                    >
                        <i></i>
                    </button>
                </Transition>
            </>
        );

        const renderIndicator = () => {
            if (props.indicatorPosition !== 'none') {
                return (
                    <ul class={indicatorsCls.value}>
                        {slideChildren.value.map((item, index) => (
                            <li
                                key={index}
                                class={[
                                    `${prefixCls}-indicator`,
                                    `${prefixCls}-indicator-${props.indicatorType}`,
                                    state.activeIndex === index ? 'is-active' : '',
                                ]}
                                onMouseenter={(e) => throttledIndicatorHover(e, index)}
                                onClick={(e) => onClickIndicator(e, index)}
                            >
                                <button type="button" class={`${prefixCls}-indicator-btn`}></button>
                            </li>
                        ))}
                    </ul>
                );
            }
        };

        return () => (
            <div ref={rootRef} class={carouselCls.value} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave}>
                <div class={`${prefixCls}-slides`}>
                    {arrowVisible.value && renderArrow()}
                    <div class={`${prefixCls}-list`} style={trackStyle.value}>
                        {slots.default?.()}
                    </div>
                </div>
                {renderIndicator()}
            </div>
        );
    },
});
