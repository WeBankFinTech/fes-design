import { defineComponent, watch, ref, PropType } from 'vue';
import { useTheme } from '../_theme/useTheme';
import useResize from '../_util/use/useResize';
import { CAROUSEL_NAME, CHANGE_EVENT } from './const';
import Arrow from './arrow';
import Indicator from './indicator';
import useCarousel from './useCarousel';
import useCarouselStyle from './useCarouselStyle';
import useCarouselPlay from './useCarouselPlay';
import type { Placement } from './interface';
import type { ExtractPublicPropTypes } from '../_util/interface';

export const carouselProps = {
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
        type: String as PropType<'linear' | 'dot'>,
        default: 'linear',
    },
    indicatorPlacement: {
        type: String as PropType<Placement>,
        default: 'bottom',
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
} as const;

export type CarouselProps = ExtractPublicPropTypes<typeof carouselProps>;

export default defineComponent({
    name: CAROUSEL_NAME,
    components: {
        Arrow,
    },
    props: carouselProps,
    emits: [CHANGE_EVENT],
    setup(props, { slots, emit, expose }) {
        useTheme();
        const {
            prefixCls,
            wrapperRef,
            direction,
            slideChildren,
            activeIndex,
            prev,
            next,
            setActiveItem,
            resetItemPosition,
        } = useCarousel(props);

        const { wrapperClass, carouselStyle } = useCarouselStyle({
            prefixCls,
            height: props.height,
            type: props.type,
            direction,
        });

        const { startTimer, pauseTimer } = useCarouselPlay({
            interval: props.interval,
            initialIndex: props.initialIndex,
            autoplay: props.autoplay,
            loop: props.loop,
            activeIndex,
            slideChildren,
        });

        // mouse event
        const carouselHover = ref(false);
        const handleMouseEnter = (event: MouseEvent) => {
            event.stopPropagation();
            carouselHover.value = true;
            if (props.pauseOnHover) pauseTimer();
        };

        const handleMouseLeave = (event: MouseEvent) => {
            event.stopPropagation();
            carouselHover.value = false;
            startTimer();
        };

        // 操作指示器 (click / hover)
        const onOperateIndicator = (index: number) => {
            activeIndex.value = index;
        };

        // watch
        watch(
            () => activeIndex.value,
            (currValue, prevState) => {
                resetItemPosition(prevState);
                if (prevState > -1) {
                    emit(CHANGE_EVENT, currValue, prevState);
                }
            },
        );

        watch(
            () => props.loop,
            () => {
                setActiveItem(activeIndex.value);
            },
        );

        useResize(wrapperRef, resetItemPosition);

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
                        activeIndex={activeIndex.value}
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
                    activeIndex={activeIndex.value}
                    position={props.indicatorPosition}
                    placement={props.indicatorPlacement}
                    indicatorType={props.indicatorType}
                    type={props.type}
                    onMouseOperate={onOperateIndicator}
                />
            </div>
        );
    },
});
