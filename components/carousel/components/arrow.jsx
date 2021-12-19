import { defineComponent, computed, inject, Fragment, Transition } from 'vue';
import { throttle } from 'lodash-es';
import { provideKey } from '../const';

export default defineComponent({
    name: 'FCarouselArrow',
    props: {
        hover: {
            type: Boolean,
            required: true,
        },
        activeIndex: Number,
    },
    setup(props) {
        const { prefixCls, direction, slideChildren, showArrow, loop, setActiveItem } = inject(provideKey);
        const arrowVisible = computed(() => showArrow !== 'never' && direction.value === 'horizontal');

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

        const throttledArrowClick = throttle(
            (event, index) => {
                event.stopPropagation();
                setActiveItem(index);
            },
            300,
            { trailing: true },
        );

        return () => {
            if (arrowVisible.value) {
                return (
                    <Fragment>
                        <Transition name="carousel-arrow-left">
                            <button
                                vShow={(showArrow === 'always' || props.hover) && (loop || props.activeIndex > 0)}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-left`}
                                onMouseenter={() => onEnterArrowButton('left')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) => throttledArrowClick(e, props.activeIndex - 1)}
                            >
                                <i></i>
                            </button>
                        </Transition>
                        <Transition name="carousel-arrow-right">
                            <button
                                vShow={(showArrow === 'always' || props.hover) && (loop || props.activeIndex < slideChildren.value.length - 1)}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-right`}
                                onMouseenter={() => onEnterArrowButton('right')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) => throttledArrowClick(e, props.activeIndex + 1)}
                            >
                                <i></i>
                            </button>
                        </Transition>
                    </Fragment>
                );
            }
        };
    },
});
