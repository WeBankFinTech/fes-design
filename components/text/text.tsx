import { computed, defineComponent, h } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { getSlot } from '../_util/vnode';
import { degfy } from '../_util/utils';
import { textProps } from './props';

const prefixCls = getPrefixCls('text');

export default defineComponent({
    name: 'FText',
    components: {},
    props: {
        ...textProps,
    },
    setup(props) {
        useTheme();

        const isGradient = computed(() => {
            return props.gradient && props.gradient.from && props.gradient.to;
        });

        const textClass = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}-type--${props.type}`]: props.type,
            [`${prefixCls}-size--${props.size}`]: props.size,
            [`${prefixCls}-text--strong`]: props.strong,
            [`${prefixCls}-text--italic`]: props.italic,
            [`${prefixCls}-tag--mark`]: props.tag === 'mark', // 定义mark样式
            [`${prefixCls}-gradient`]: isGradient.value,
        }));

        const gradientStyle = computed(() => {
            if (isGradient.value) {
                const deg = degfy(props.gradient.deg || 0);
                return {
                    backgroundImage: `linear-gradient(${deg}, ${props.gradient.from}, ${props.gradient.to})`,
                };
            }
            return {};
        });

        return {
            prefixCls,
            textClass,
            gradientStyle,
        };
    },
    render() {
        const children = getSlot(this.$slots);
        return h(
            this.tag || 'span',
            {
                class: this.textClass,
                style: this.gradientStyle,
            },
            children,
        );
    },
});
