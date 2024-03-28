import { watch, onMounted, onBeforeUnmount, nextTick, type Ref } from 'vue';
import type { CarouselProps } from './carousel';

interface UseCarouselPlayType {
    props: CarouselProps;
    activeIndex: Ref<number>;
    slideChildren: Ref<object[]>;
}

// control play
export default ({ props, activeIndex, slideChildren }: UseCarouselPlayType) => {
    const play = () => {
        if (activeIndex.value < slideChildren.value.length - 1) {
            activeIndex.value = activeIndex.value + 1;
        } else if (props.loop) {
            activeIndex.value = 0;
        }
    };

    let playTimer: number = null;
    const startTimer = () => {
        if (props.interval <= 0 || !props.autoplay || playTimer) return;
        playTimer = window.setInterval(play, props.interval);
    };

    const pauseTimer = () => {
        clearInterval(playTimer);
        playTimer = null;
    };

    watch(
        () => props.autoplay,
        (current) => {
            current ? startTimer() : pauseTimer();
        },
    );

    // lifecycle
    onMounted(() => {
        nextTick(() => {
            if (
                props.initialIndex >= 0 &&
                props.initialIndex < slideChildren.value.length
            ) {
                activeIndex.value = props.initialIndex;
            }
            startTimer();
        });
    });

    onBeforeUnmount(() => {
        pauseTimer();
    });

    return {
        startTimer,
        pauseTimer,
    };
};
