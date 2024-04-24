import { type Ref, nextTick, onBeforeUnmount, onMounted, watch } from 'vue';
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
        if (props.interval <= 0 || !props.autoplay || playTimer) {
            return;
        }
        playTimer = window.setInterval(play, props.interval);
    };

    // 暂停定时器
    const pauseTimer = () => {
        clearInterval(playTimer);
        playTimer = null;
    };

    // 清除定时器
    const clearTimer = () => {
        if (playTimer) {
            pauseTimer();
        }
    };

    // 监听是否自动播放
    watch(
        () => props.autoplay,
        (current) => {
            current ? startTimer() : pauseTimer();
        },
    );

    // 监听间隔时间变化，重新调整自动切换时间
    watch(
        () => props.interval,
        () => {
            clearTimer();
            startTimer();
        },
    );

    // lifecycle
    onMounted(() => {
        nextTick(() => {
            if (
                props.initialIndex >= 0
                && props.initialIndex < slideChildren.value.length
            ) {
                activeIndex.value = props.initialIndex;
            }
            startTimer();
        });
    });

    onBeforeUnmount(() => {
        clearTimer();
    });

    return {
        startTimer,
        pauseTimer,
    };
};
