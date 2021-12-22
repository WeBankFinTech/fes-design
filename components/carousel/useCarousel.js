import { ref, computed, provide } from 'vue';
import { provideKey } from './const';
import getPrefixCls from '../_util/getPrefixCls';
import useCarouselItem from './useCarouselItem';

const prefixCls = getPrefixCls('carousel');

export default (props) => {
    const wrapperRef = ref(null); // 最外层容器句柄
    const activeIndex = ref(-1); // 当前激活的索引

    // 方向
    const direction = computed(() => {
        const { indicatorPlacement: propIndicatorPlacement } = props;
        if (
            propIndicatorPlacement === 'top' ||
            propIndicatorPlacement === 'bottom'
        ) {
            return 'horizontal';
        }
        if (
            propIndicatorPlacement === 'left' ||
            propIndicatorPlacement === 'right'
        ) {
            return 'vertical';
        }
        return '';
    });

    const itemState = useCarouselItem({
        props,
        activeIndex,
    });

    const state = {
        prefixCls,
        wrapperRef,
        direction,
        type: props.type,
        loop: props.loop,
        showArrow: props.showArrow,
        activeIndex,
        ...itemState,
    };

    provide(provideKey, state);

    return state;
};
