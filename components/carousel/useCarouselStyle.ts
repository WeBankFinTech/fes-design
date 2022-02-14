import { computed, ComputedRef } from 'vue';
import type { Direction } from './interface';

interface UseCarouselStyleType {
    prefixCls: string;
    height: string;
    type: string;
    direction: ComputedRef<Direction>;
}

export default ({
    prefixCls,
    height,
    type,
    direction,
}: UseCarouselStyleType) => {
    const wrapperClass = computed(() => {
        const classes = [prefixCls, `${prefixCls}-${direction.value}`];
        if (type === 'card') {
            classes.push(`${prefixCls}-card`);
        }
        return classes;
    });

    const carouselStyle = computed(() => {
        const style = { height };
        return style;
    });

    return {
        wrapperClass,
        carouselStyle,
    };
};
