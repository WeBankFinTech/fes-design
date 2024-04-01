import { computed, defineComponent, inject } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { breadcrumbItemProps } from './props';
import { BREADCRUMB_KEY, itemCls } from './const';

export default defineComponent({
    name: 'FBreadcrumbItem',
    props: breadcrumbItemProps,
    emits: ['click'],
    setup(props, { emit, slots }) {
        useTheme();

        const { props: parentProps } = inject(BREADCRUMB_KEY);

        const itemStyle = computed(() => {
            return {
                fontSize: `${parentProps.fontSize}px`,
                lineHeight: 1,
            };
        });

        // 处理点击跳转的事件
        const handleClick = (url: string) => {
            // 触发用户自定义的click事件
            emit('click');
            if (!url) return;
            if (props.replace) {
                window.location.replace(url);
            } else {
                window.location.href = url;
            }
        };

        return () => (
            <div
                class={itemCls}
                style={itemStyle.value}
                onClick={() => handleClick(props.to)}
            >
                {slots.default?.()}
            </div>
        );
    },
});
