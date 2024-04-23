import { Fragment, Transition, computed, defineComponent, inject } from 'vue';
import { throttle } from 'lodash-es';
import { LeftOutlined, RightOutlined } from '../icon';
import { provideKey } from './const';
import type { ComponentObjectPropsOptions, PropType } from 'vue';
import type { ArrowType, CarouselItemData } from './interface';

export default defineComponent({
    name: 'FCarouselArrow',
    components: {
        LeftOutlined,
        RightOutlined,
    },
    props: {
        hover: {
            type: Boolean,
            required: true,
        },
        showArrow: {
            type: String as PropType<ArrowType>,
            default: 'hover',
        },
        activeIndex: Number,
    } satisfies ComponentObjectPropsOptions,
    setup(props) {
        const {
            prefixCls,
            direction,
            rootProps,
            slideChildren,
            setActiveItem,
        } = inject(provideKey);

        const arrowVisible = computed(
            () =>
                props.showArrow !== 'never' && direction.value === 'horizontal',
        );

        const arrowLeftShow = computed(
            () =>
                (props.showArrow === 'always' || props.hover) &&
                (rootProps.loop || props.activeIndex > 0),
        );

        const arrowRightShow = computed(
            () =>
                (props.showArrow === 'always' || props.hover) &&
                (rootProps.loop ||
                props.activeIndex < slideChildren.value.length - 1),
        );

        const slideItemInStage = (
            slideItem: CarouselItemData,
            index: number,
        ) => {
            const length = slideChildren.value.length;
            if (
                (index === length - 1 &&
                slideItem.states.inStage &&
                slideChildren.value[0].states.active) ||
                (slideItem.states.inStage &&
                slideChildren.value[index + 1] &&
                slideChildren.value[index + 1].states.active)
            ) {
                return 'left';
            }
            if (
                (index === 0 &&
                slideItem.states.inStage &&
                slideChildren.value[length - 1].states.active) ||
                (slideItem.states.inStage &&
                slideChildren.value[index - 1] &&
                slideChildren.value[index - 1].states.active)
            ) {
                return 'right';
            }
            return false;
        };

        // 当鼠标进入箭头按钮
        const onEnterArrowButton = (arrow: string) => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item, index) => {
                if (arrow === slideItemInStage(item, index)) {
                    item.states.hover = true;
                }
            });
        };

        // 当鼠标离开箭头按钮
        const onLeaveArrowButton = () => {
            if (direction.value === 'vertical') return;
            slideChildren.value.forEach((item) => {
                item.states.hover = false;
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
                                v-show={arrowLeftShow.value}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-left`}
                                onMouseenter={() => onEnterArrowButton('left')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) =>
                                    handleArrowClick(e, props.activeIndex - 1)
                                }
                            >
                                <LeftOutlined />
                            </button>
                        </Transition>
                        <Transition name="carousel-arrow-right">
                            <button
                                v-show={arrowRightShow.value}
                                type="button"
                                class={`${prefixCls}-arrow ${prefixCls}-arrow-right`}
                                onMouseenter={() => onEnterArrowButton('right')}
                                onMouseleave={onLeaveArrowButton}
                                onClick={(e) =>
                                    handleArrowClick(e, props.activeIndex + 1)
                                }
                            >
                                <RightOutlined />
                            </button>
                        </Transition>
                    </Fragment>
                );
            }
        };
    },
});
