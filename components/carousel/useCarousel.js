import { reactive, provide } from 'vue';
import { provideKey } from './const';
import useCarouselItem from './useCarouselItem';
import useCarouselStyle from './useCarouselStyle';

export default (props) => {
    const carouselState = reactive({
        activeIndex: -1,
    });

    const itemState = useCarouselItem({
        props,
        carouselState,
    });

    const styleState = useCarouselStyle(props);

    const state = {
        type: props.type,
        loop: props.loop,
        showArrow: props.showArrow,
        carouselState,
        ...itemState,
        ...styleState,
    };

    provide(provideKey, state);

    return state;
};
