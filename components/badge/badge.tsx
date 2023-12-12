import { defineComponent, computed } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { badgeProps } from './props';

const prefixCls = getPrefixCls('badge');

export default defineComponent({
    name: 'FBadge',
    props: badgeProps,
    setup(props, { slots }) {
        useTheme();
        // 徽标展示内容
        const displayCount = computed(() => {
            if (props.isDot) return '';
            // 只有在value是数值类型，才生效 超过阈值展示阈值+
            if (typeof props.value === 'number' && props.value > props.max)
                return `${props.max}+`;
            return props.value;
        });

        const shouldShowCount = computed(() => {
            // 如果是hidden，直接false，不展示
            if (props.hidden) return false;
            // 有插槽就直接展示自定义插槽内容
            return (
                slots.content ||
                props.isDot ||
                typeof props.value === 'string' ||
                (props.value === 0 && props.showZero) ||
                props.value > 0
            );
        });

        // 样式
        const classList = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                `${prefixCls}-wrapper-${props.type}`,
                props.isDot ? `${prefixCls}-wrapper-dot` : '',
                props.size === 'small' ? `${prefixCls}-wrapper-small` : '',
                !slots.default ? `${prefixCls}-wrapper-alone` : '',
            ];
        });

        return () => (
            <div class={prefixCls}>
                {slots.default?.()}
                {shouldShowCount.value && (
                    <span
                        class={classList.value}
                        style={{ backgroundColor: props.color }}
                    >
                        {slots.content ? slots.content() : displayCount.value}
                    </span>
                )}
            </div>
        );
    },
});
