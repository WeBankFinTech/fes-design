import { h, computed, defineComponent } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { getSlot } from '../_util/vnode';
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

        const textClass = computed(() => ({
            [prefixCls]: true,
            [`${prefixCls}-type--${props.type}`]: props.type,
            [`${prefixCls}-size--${props.size}`]: props.size,
            [`${prefixCls}-text--strong`]: props.strong,
            [`${prefixCls}-text--italic`]: props.italic,
        }));

        return {
            prefixCls,
            textClass,
        };
    },
    render() {
        const {} = this;

        const children = getSlot(this.$slots);
        return h(
            this.tag || 'span',
            {
                class: this.textClass,
            },
            children,
        );
    },
});
