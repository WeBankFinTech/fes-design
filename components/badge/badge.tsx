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
            if (props.dot) return '';
            // 超过阈值展示阈值+
            if (
                typeof props.count === 'number' &&
                props.count > props.overflowCount
            )
                return `${props.overflowCount}+`;
            return props.count;
        });

        const shouldShowCount = computed(() => {
            // 有插槽就直接展示自定义插槽内容
            return (
                slots.count ||
                props.dot ||
                typeof props.count === 'string' ||
                (props.count === 0 && props.showZero) ||
                props.count > 0
            );
        });

        // 样式
        const classList = computed(() => {
            return [
                `${prefixCls}-wrapper`,
                props.dot ? `${prefixCls}-wrapper-dot` : '',
                props.size === 'small' ? `${prefixCls}-wrapper-small` : '',
                !slots.default ? `${prefixCls}-wrapper-standalone` : '',
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
                        {slots.count ? slots.count() : displayCount.value}
                    </span>
                )}
            </div>
        );
    },
});
