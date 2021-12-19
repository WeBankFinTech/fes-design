import { computed, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('carousel');

export default (props) => {
    const wrapperRef = ref(null);
    // 方向
    const direction = computed(() => {
        const { indicatorPlacement: propIndicatorPlacement } = props;
        if (propIndicatorPlacement === 'top' || propIndicatorPlacement === 'bottom') {
            return 'horizontal';
        }
        if (propIndicatorPlacement === 'left' || propIndicatorPlacement === 'right') {
            return 'vertical';
        }
        return '';
    });

    const wrapperClass = computed(() => {
        const classes = [prefixCls, `${prefixCls}-${direction.value}`];
        if (props.type === 'card') {
            classes.push(`${prefixCls}-card`);
        }
        return classes;
    });

    const carouselStyle = computed(() => {
        const style = {
            height: props.height,
        };
        return style;
    });

    return {
        prefixCls,
        direction,
        wrapperRef,
        wrapperClass,
        carouselStyle,
    };
};
