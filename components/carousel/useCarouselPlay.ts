import { watch, onMounted, onBeforeUnmount, nextTick, Ref } from 'vue';

interface UseCarouselPlayType {
    loop: boolean;
    autoplay: boolean;
    interval: number;
    initialIndex: number;
    activeIndex: Ref<number>;
    slideChildren: Ref<object[]>;
}

// control play
export default ({
    loop,
    autoplay,
    interval,
    initialIndex,
    activeIndex,
    slideChildren,
}: UseCarouselPlayType) => {
    const play = () => {
        if (activeIndex.value < slideChildren.value.length - 1) {
            activeIndex.value = activeIndex.value + 1;
        } else if (loop) {
            activeIndex.value = 0;
        }
    };

    let playTimer: number = null;
    const startTimer = () => {
        if (interval <= 0 || !autoplay || playTimer) return;
        playTimer = window.setInterval(play, interval);
    };

    const pauseTimer = () => {
        clearInterval(playTimer);
        playTimer = null;
    };

    watch(
        () => autoplay,
        (current) => {
            // eslint-disable-next-line no-unused-expressions
            current ? startTimer() : pauseTimer();
        },
    );

    // lifecycle
    onMounted(() => {
        nextTick(() => {
            if (
                initialIndex >= 0 &&
                initialIndex < slideChildren.value.length
            ) {
                activeIndex.value = initialIndex;
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
