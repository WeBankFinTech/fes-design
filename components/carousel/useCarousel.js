import { reactive, provide } from 'vue';
import { provideKey } from './const';
import useCarouselItem from './useCarouselItem';
import useCarouselStyle from './useCarouselStyle';

const usePlayControl = ({ props, carouselState, slideChildren }) => {
    const play = () => {
        if (carouselState.activeIndex < slideChildren.value.length - 1) {
            carouselState.activeIndex = carouselState.activeIndex + 1;
        } else if (props.loop) {
            carouselState.activeIndex = 0;
        }
    };

    let playTimer = null;
    const useStartTimer = () => {
        if (props.interval <= 0 || !props.autoplay || playTimer) return;
        playTimer = setInterval(() => play(), props.interval);
    };

    const usePauseTimer = () => {
        if (playTimer) {
            clearInterval(playTimer);
            playTimer = null;
        }
    };
    return {
        useStartTimer,
        usePauseTimer,
    };
};

export default (props) => {
    const carouselState = reactive({
        activeIndex: -1,
    });

    const styleState = useCarouselStyle(props);

    const itemState = useCarouselItem({
        props,
        carouselState,
    });

    // control play
    const { useStartTimer, usePauseTimer } = usePlayControl({
        props,
        carouselState,
        slideChildren: itemState.slideChildren,
    });

    const state = {
        type: props.type,
        loop: props.loop,
        showArrow: props.showArrow,
        carouselState,
        useStartTimer,
        usePauseTimer,
        ...itemState,
        ...styleState,
    };

    provide(provideKey, state);

    return state;
};
