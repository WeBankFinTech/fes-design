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
        const {
            prefixCls,
            direction,
            slideChildren,
            showArrow,
            loop,
            setActiveItem,
        } = inject(provideKey);

        const arrowVisible = computed(
            () => showArrow !== 'never' && direction.value === 'horizontal',
        );

        const arrowLeftShow = computed(
            () =>
                (showArrow === 'always' || props.hover) &&
                (loop || props.activeIndex > 0),
        );

        const arrowRightShow = computed(
            () =>
                (showArrow === 'always' || props.hover) &&
                (loop || props.activeIndex < slideChildren.value.length - 1),
        );

        const slideItemInStage = (slideItem, index) => {
            const length = slideChildren.value.length;
            if (
                (index === length - 1 &&
                    slideItem.inStage &&
                    slideChildren.value[0].active) ||
                (slideItem.inStage &&
                    slideChildren.value[index + 1] &&
                    slideChildren.value[index + 1].active)
            ) {
                return 'left';
            }
            if (
                (index === 0 &&
                    slideItem.inStage &&
                    slideChildren.value[length - 1].active) ||
                (slideItem.inStage &&
                    slideChildren.value[index - 1] &&
                    slideChildren.value[index - 1].active)
            ) {
                return 'right';
            }
            return false;
        };

        // 当鼠标进入箭头按钮
        const onEnterArrowButton = (arrow) => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item, index) => {
                if (arrow === slideItemInStage(item, index)) {
                    item.hover = true;
                }
            });
        };

        // 当鼠标离开箭头按钮
        const onLeaveArrowButton = () => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item) => {
                item.hover = false;
            });
        };

        // 处理点击箭头按钮
        const handleArrowClick = throttle(
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
                                vShow={arrowLeftShow.value}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-left`}
                                onMouseenter={() => onEnterArrowButton('left')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) =>
                                    handleArrowClick(e, props.activeIndex - 1)
                                }
                            >
                                <i
                                    class={`${prefixCls}-arrow-icon ${prefixCls}-arrow-icon-left`}
                                ></i>
                            </button>
                        </Transition>
                        <Transition name="carousel-arrow-right">
                            <button
                                vShow={arrowRightShow.value}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-right`}
                                onMouseenter={() => onEnterArrowButton('right')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) =>
                                    handleArrowClick(e, props.activeIndex + 1)
                                }
                            >
                                <i
                                    class={`${prefixCls}-arrow-icon ${prefixCls}-arrow-icon-right`}
                                ></i>
                            </button>
                        </Transition>
                    </Fragment>
                );
            }
        };
    },
});
