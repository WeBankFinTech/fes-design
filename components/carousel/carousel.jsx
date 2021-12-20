import {
    defineComponent,
    watch,
    onMounted,
    onBeforeUnmount,
    nextTick,
    ref,
} from 'vue';
import { addResizeListener, removeResizeListener } from '../_util/resizeEvent';
import { CAROUSEL_NAME, CAROUSEL_ITEM_NAME, CHANGE_EVENT } from './const';
import Arrow from './components/arrow';
import Indicator from './components/indicator';
import useCarousel from './useCarousel';

export default defineComponent({
    name: CAROUSEL_NAME,
    components: {
        Arrow,
    },
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
        const {
            prefixCls,
            wrapperRef,
            wrapperClass,
            carouselStyle,
            slideChildren,
            carouselState,
            prev,
            next,
            setActiveItem,
            resetItemPosition,
        } = useCarousel(props);

        const defaultNodes = slots.default();
        defaultNodes.forEach((childNode) => {
            if (childNode.type?.name !== CAROUSEL_ITEM_NAME) {
                console.error(
                    `[${CAROUSEL_NAME}]: The ${CAROUSEL_NAME} child node must be ${CAROUSEL_ITEM_NAME}`,
                );
            }
        });

        // control play
        const play = () => {
            if (carouselState.activeIndex < slideChildren.value.length - 1) {
                carouselState.activeIndex = carouselState.activeIndex + 1;
            } else if (props.loop) {
                carouselState.activeIndex = 0;
            }
        };

        const playTimer = ref(null);
        const startTimer = () => {
            if (props.interval <= 0 || !props.autoplay || playTimer.value)
                return;
            playTimer.value = setInterval(() => play(), props.interval);
        };

        const pauseTimer = () => {
            if (playTimer.value) {
                clearInterval(playTimer.value);
                playTimer.value = null;
            }
        };

        // mouse event
        const carouselHover = ref(false);
        const handleMouseEnter = (event) => {
            event.stopPropagation();
            carouselHover.value = true;
            if (props.pauseOnHover) pauseTimer();
        };

        const handleMouseLeave = (event) => {
            event.stopPropagation();
            carouselHover.value = false;
            startTimer();
        };

        // 操作指示器 (click / hover)
        const onOperateIndicator = ({ index }) => {
            carouselState.activeIndex = index;
        };

        // watch
        watch(
            () => carouselState.activeIndex,
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
                setActiveItem(carouselState.activeIndex);
            },
        );

        // lifecycle
        onMounted(() => {
            nextTick(() => {
                addResizeListener(wrapperRef.value, resetItemPosition);
                if (
                    props.initialIndex >= 0 &&
                    props.initialIndex < slideChildren.value.length
                ) {
                    carouselState.activeIndex = props.initialIndex;
                }
                startTimer();
            });
        });

        onBeforeUnmount(() => {
            if (wrapperRef.value)
                removeResizeListener(wrapperRef.value, resetItemPosition);
            pauseTimer();
        });

        // expose methods
        expose({
            setActiveItem,
            prev,
            next,
        });

        // render
        return () => (
            <div
                ref={wrapperRef}
                class={wrapperClass.value}
                onMouseenter={handleMouseEnter}
                onMouseleave={handleMouseLeave}
            >
                <div class={`${prefixCls}-slides`}>
                    <Arrow
                        hover={carouselHover.value}
                        activeIndex={carouselState.activeIndex}
                    />
                    <div
                        class={`${prefixCls}-list`}
                        style={carouselStyle.value}
                    >
                        {slots.default?.()}
                    </div>
                </div>
                <Indicator
                    trigger={props.trigger}
                    activeIndex={carouselState.activeIndex}
                    position={props.indicatorPosition}
                    placement={props.indicatorPlacement}
                    indicatorType={props.indicatorType}
                    onMouseOperate={onOperateIndicator}
                />
            </div>
        );
    },
});
