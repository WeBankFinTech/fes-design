import { computed } from 'vue';
import type { ComputedRef } from 'vue';
import type { Direction } from './interface';
import type { CarouselProps } from './carousel';

interface UseCarouselStyleType {
    props: CarouselProps;
    prefixCls: string;
    direction: ComputedRef<Direction>;
}

export default ({ props, prefixCls, direction }: UseCarouselStyleType) => {
    const wrapperClass = computed(() => {
        const classes = [prefixCls, `${prefixCls}-${direction.value}`];
        if (props.type === 'card') {
            classes.push(`${prefixCls}-card`);
        }
        return classes;
    });

    const carouselStyle = computed(() => {
        const style = { height: props.height };
        return style;
    });

    return {
        wrapperClass,
        carouselStyle,
    };
};
