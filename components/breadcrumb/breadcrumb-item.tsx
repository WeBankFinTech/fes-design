import { computed, defineComponent, inject } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { BREADCRUMB_KEY, itemCls, prefixCls } from './const';

export default defineComponent({
    name: 'FBreadcrumbItem',
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
        const handleClick = () => {
            // 触发用户自定义的click事件
            emit('click');
        };

        return () => (
            <div
                class={itemCls}
                style={itemStyle.value}
                onClick={() => handleClick()}
            >
                {slots.default?.()}
                {/* 渲染分隔符 */}
                <div class={`${itemCls}-separator`}>
                    { parentProps.separator }
                </div>
            </div>
        );
    },
});
