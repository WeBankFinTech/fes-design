import {
    computed,
    defineComponent,
    ref,
    toRefs,
    reactive,
    onMounted,
    onUnmounted,
    inject,
    getCurrentInstance,
} from 'vue';
import {
    CAROUSEL_NAME,
    CAROUSEL_ITEM_NAME,
    CARD_SCALE,
    provideKey,
} from './const';

const useItemStyle = (direction) => {
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
    return {
        itemStyleState,
        itemStyle,
    };
};

export default defineComponent({
    name: 'FCarouselItem',
    setup(props, { slots }) {
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

        const { itemStyleState, itemStyle } = useItemStyle(direction);

        function processIndex(index, activeIndex, length) {
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

        function calcCardTranslate(index, activeIndex) {
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

        function calcTranslate(index, activeIndex, isVertical) {
            const distance =
                (isVertical
                    ? wrapperRef.value?.offsetHeight
                    : wrapperRef.value?.offsetWidth) || 0;
            return distance * (index - activeIndex);
        }

        const itemReady = ref(false);
        const translateItem = (index, activeIndex, oldIndex) => {
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

                itemStyleState.translate = calcCardTranslate(
                    index,
                    activeIndex,
                );
                itemStyleState.scale = itemStatus.active ? 1 : CARD_SCALE;
            } else {
                itemStatus.active = index === activeIndex;

                const isVertical = direction.value === 'vertical';
                itemStyleState.translate = calcTranslate(
                    index,
                    activeIndex,
                    isVertical,
                );
            }

            itemReady.value = true;
        };

        const onClickSlide = () => {
            if (parentType === 'card') {
                const index = slideChildren.value
                    .map((item) => item.uid)
                    .indexOf(instance.uid);
                setActiveItem(index);
            }
        };

        onMounted(() => {
            addItem({
                uid: instance.uid,
                ...props,
                ...toRefs(itemStatus),
                translateItem,
            });
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
