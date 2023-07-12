import {
    computed,
    defineComponent,
    ref,
    reactive,
    onMounted,
    onUnmounted,
    inject,
    getCurrentInstance,
    ComputedRef,
} from 'vue';
import { useTheme } from '../_theme/useTheme';
import {
    CAROUSEL_NAME,
    CAROUSEL_ITEM_NAME,
    CARD_SCALE,
    provideKey,
} from './const';

import { carouselItemProps } from './interface';
import type { CarouselItemData, Direction } from './interface';

const useItemStyle = (direction: ComputedRef<Direction>) => {
    const itemStyleState = reactive({
        translate: 0,
        scale: 1,
    });

    const itemStyle = computed(() => {
        const translateType =
            direction.value === 'vertical' ? 'translateY' : 'translateX';
        const value = `${translateType}(${itemStyleState.translate}px) scale(${itemStyleState.scale}, ${itemStyleState.scale})`;
        const style = {
            transform: value,
        };
        return style;
    });

    const setItemStyle = (translate: number, scale?: number) => {
        itemStyleState.translate = translate;
        if (scale) itemStyleState.scale = scale;
    };

    return {
        itemStyle,
        setItemStyle,
    };
};

export default defineComponent({
    name: CAROUSEL_ITEM_NAME,
    props: carouselItemProps,
    setup(props, { slots }) {
        useTheme();
        const instance = getCurrentInstance();

        const slideRef = ref(null);
        const {
            prefixCls,
            direction,
            wrapperRef,
            type: parentType,
            loop,
            slideChildren,
            setActiveItem,
            addItem,
            removeItem,
        } = inject(provideKey);

        const { itemStyle, setItemStyle } = useItemStyle(direction);

        function processIndex(
            index: number,
            activeIndex: number,
            length: number,
        ) {
            if (activeIndex === 0 && index === length - 1) {
                return -1;
            }
            if (activeIndex === length - 1 && index === 0) {
                return length;
            }
            if (index < activeIndex - 1 && activeIndex - index >= length / 2) {
                return length + 1;
            }
            if (index > activeIndex + 1 && index - activeIndex >= length / 2) {
                return -2;
            }
            return index;
        }

        const itemStatus = reactive({
            hover: false,
            active: false,
            inStage: false,
            animating: false,
        });

        function calcCardTranslate(index: number, activeIndex: number) {
            const parentWidth = wrapperRef.value?.offsetWidth || 0;
            if (itemStatus.inStage) {
                return (
                    (parentWidth *
                        ((2 - CARD_SCALE) * (index - activeIndex) + 1)) /
                    4
                );
            }
            if (index < activeIndex) {
                return (-(1 + CARD_SCALE) * parentWidth) / 4;
            }
            return ((3 + CARD_SCALE) * parentWidth) / 4;
        }

        function calcTranslate(
            index: number,
            activeIndex: number,
            isVertical: boolean,
        ) {
            const distance =
                (isVertical
                    ? wrapperRef.value?.offsetHeight
                    : wrapperRef.value?.offsetWidth) || 0;
            return distance * (index - activeIndex);
        }

        const itemReady = ref(false);
        const translateItem = (
            index: number,
            activeIndex: number,
            oldIndex: number,
        ) => {
            const length = slideChildren.value.length;
            // eslint-disable-next-line no-undefined
            if (parentType !== 'card' && oldIndex !== undefined) {
                itemStatus.animating =
                    index === activeIndex || index === oldIndex;
            }
            if (index !== activeIndex && length > 2 && loop) {
                index = processIndex(index, activeIndex, length);
            }

            if (parentType === 'card') {
                if (direction.value === 'vertical') {
                    console.warn(
                        `[${CAROUSEL_ITEM_NAME}]: ${CAROUSEL_NAME} vertical direction is not supported in card mode.`,
                    );
                }
                itemStatus.inStage =
                    Math.round(Math.abs(index - activeIndex)) <= 1;
                itemStatus.active = index === activeIndex;

                setItemStyle(
                    calcCardTranslate(index, activeIndex),
                    itemStatus.active ? 1 : CARD_SCALE,
                );
            } else {
                itemStatus.active = index === activeIndex;

                const isVertical = direction.value === 'vertical';
                setItemStyle(calcTranslate(index, activeIndex, isVertical));
            }

            itemReady.value = true;
        };

        const onClickSlide = () => {
            if (parentType === 'card') {
                const index = slideChildren.value
                    .map((item: CarouselItemData) => item.uid)
                    .indexOf(instance.uid);
                setActiveItem(index);
            }
        };

        onMounted(() => {
            addItem({
                uid: instance.uid,
                key: props.key,
                states: itemStatus,
                translateItem,
            } as CarouselItemData);
        });

        onUnmounted(() => {
            removeItem(instance.uid);
        });

        return () => (
            <div
                ref={slideRef}
                v-show={itemReady.value}
                class={{
                    [`${prefixCls}-item`]: true,
                    [`${prefixCls}-item-card`]: parentType === 'card',
                    'is-in-stage': itemStatus.inStage,
                    'is-hover': itemStatus.hover,
                    'is-active': itemStatus.active,
                    'is-animating': itemStatus.animating,
                }}
                style={itemStyle.value}
                onClick={onClickSlide}
            >
                {parentType === 'card' && (
                    <div
                        v-show={!itemStatus.active}
                        class={`${prefixCls}-item-mask`}
                    ></div>
                )}
                {slots.default?.()}
            </div>
        );
    },
});
