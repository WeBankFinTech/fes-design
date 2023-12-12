import { defineComponent, computed } from 'vue';
import { isNumber, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import { badgeProps } from './props';

const prefixCls = getPrefixCls('badge');

export default defineComponent({
    name: 'FBadge',
    props: badgeProps,
    setup(props, { slots }) {
        useTheme();
        // 展示内容
        const badgeValue = computed(() => {
            if (props.isDot) return '';
            // 只有在 value 是数值类型，才生效 超过阈值展示阈值+
            if (isNumber(props.value) && props.value > props.max)
                return `${props.max}+`;
            return props.value;
        });

        const showBadge = computed(() => {
            // 如果是 hidden ，直接 false，不展示
            if (props.hidden) return false;
            // 有插槽就直接展示自定义插槽内容
            return (
                slots.content ||
                props.isDot ||
                isString(props.value) ||
                isNumber(props.value)
            );
        });

        // 样式
        const badgeClassList = computed(() => {
            return [
                `${prefixCls}-sup`,
                `${prefixCls}-sup-type-${props.type}`,
                props.isDot ? `${prefixCls}-sup-dot` : '',
                props.size === 'small' ? `${prefixCls}-sup-size-small` : '',
                !slots.default ? `${prefixCls}-sup-alone` : '',
            ].filter(Boolean);
        });
        const badgeStyle = computed(() => {
            return props.backgroundColor
                ? {
                      backgroundColor: props.backgroundColor,
                  }
                : {};
        });

        return () => (
            <div class={prefixCls}>
                {slots.default?.()}
                {showBadge.value && (
                    <span class={badgeClassList.value} style={badgeStyle.value}>
                        {slots.content ? slots.content() : badgeValue.value}
                    </span>
                )}
            </div>
        );
    },
});
