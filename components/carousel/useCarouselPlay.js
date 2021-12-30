import { watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import useResize from '../_util/use/useResize';

// control play
export default ({
    wrapperRef,
    loop,
    autoplay,
    interval,
    initialIndex,
    activeIndex,
    slideChildren,
    resetItemPosition,
}) => {
    const play = () => {
        if (activeIndex.value < slideChildren.value.length - 1) {
            activeIndex.value = activeIndex.value + 1;
        } else if (loop) {
            activeIndex.value = 0;
        }
    };

    let playTimer = null;
    const startTimer = () => {
        if (interval <= 0 || !autoplay || playTimer) return;
        playTimer = setInterval(play, interval);
    };

    const pauseTimer = () => {
        clearInterval(playTimer);
        playTimer = null;
    };

    watch(
        () => autoplay,
        (current) => {
            current ? startTimer() : pauseTimer();
        },
    );

    // lifecycle
    onMounted(() => {
        nextTick(() => {
            useResize(wrapperRef, resetItemPosition);
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
        // if (wrapperRef.value) removeResizeListener(wrapperRef.value, resetItemPosition);
        pauseTimer();
    });

    return {
        startTimer,
        pauseTimer,
    };
};
