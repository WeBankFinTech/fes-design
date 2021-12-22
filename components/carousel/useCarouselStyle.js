import { computed } from 'vue';

export default ({ prefixCls, height, type, direction }) => {
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
