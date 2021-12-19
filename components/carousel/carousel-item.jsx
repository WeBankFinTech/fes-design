import { computed, defineComponent, ref, toRefs, reactive, onMounted, onUnmounted, inject, getCurrentInstance } from 'vue';
import { provideKey, CARD_SCALE } from './const';

export default defineComponent({
    name: 'FCarouselItem',
    setup(props, { slots }) {
        const instance = getCurrentInstance();

        const state = reactive({
            hover: false,
            translate: 0,
            scale: 1,
            active: false,
            ready: false,
            inStage: false,
            animating: false,
        });

        const slideRef = ref(null);
        const { prefixCls, direction, wrapperRef, type: parentType, loop, slideChildren, setActiveItem, addItem, removeItem } = inject(provideKey);

        const itemStyle = computed(() => {
            const translateType = direction.value === 'vertical' ? 'translateY' : 'translateX';
            const value = `${translateType}(${state.translate}px) scale(${state.scale}, ${state.scale})`;
            const style = {
                transform: value,
            };
            return style;
        });

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

        function calcCardTranslate(index, activeIndex) {
            const parentWidth = wrapperRef.value?.offsetWidth || 0;
            if (state.inStage) {
                return (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4;
            }
            if (index < activeIndex) {
                return (-(1 + CARD_SCALE) * parentWidth) / 4;
            }
            return ((3 + CARD_SCALE) * parentWidth) / 4;
        }

        function calcTranslate(index, activeIndex, isVertical) {
            const distance = (isVertical ? wrapperRef.value?.offsetHeight : wrapperRef.value?.offsetWidth) || 0;
            return distance * (index - activeIndex);
        }

        const translateItem = (index, activeIndex, oldIndex) => {
            const length = slideChildren.value.length;
            // eslint-disable-next-line no-undefined
            if (parentType !== 'card' && oldIndex !== undefined) {
                state.animating = index === activeIndex || index === oldIndex;
            }
            if (index !== activeIndex && length > 2 && loop) {
                index = processIndex(index, activeIndex, length);
            }

            if (parentType === 'card') {
                if (direction.value === 'vertical') {
                    console.warn('[Vue-Carousel-Card Warn][Carousel-card] vertical direction is not supported in card mode.');
                }
                state.inStage = Math.round(Math.abs(index - activeIndex)) <= 1;
                state.active = index === activeIndex;
                state.translate = calcCardTranslate(index, activeIndex);
                state.scale = state.active ? 1 : CARD_SCALE;
            } else {
                state.active = index === activeIndex;
                const isVertical = direction.value === 'vertical';
                state.translate = calcTranslate(index, activeIndex, isVertical);
            }

            state.ready = true;
        };

        const onClickSlide = () => {
            if (parentType === 'card') {
                const index = slideChildren.value.map((item) => item.uid).indexOf(instance.uid);
                setActiveItem(index);
            }
        };

        onMounted(() => {
            addItem({
                uid: instance.uid,
                ...props,
                ...toRefs(state),
                translateItem,
            });
        });

        onUnmounted(() => {
            removeItem(instance.uid);
        });

        return () => (
            <div
                ref={slideRef}
                v-show={state.ready}
                class={{
                    [`${prefixCls}-item`]: true,
                    [`${prefixCls}-item-card`]: parentType === 'card',
                    'is-in-stage': state.inStage,
                    'is-active': state.active,
                    'is-animating': state.animating,
                }}
                style={itemStyle.value}
                onClick={onClickSlide}
            >
                {parentType === 'card' && <div v-show={!state.active} class={`${prefixCls}-item-mask`}></div>}
                {slots.default?.()}
            </div>
        );
    },
});
