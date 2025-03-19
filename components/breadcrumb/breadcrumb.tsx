import { computed, defineComponent, provide } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { breadcrumbProps } from './props';
import { BREADCRUMB_KEY, prefixCls } from './const';

export default defineComponent({
    name: 'FBreadcrumb',
    props: breadcrumbProps,
    setup(props, { slots }) {
        useTheme();

        provide(BREADCRUMB_KEY, {
            props,
        });
        const breadcrumbStyle = computed(() => {
            return {
                fontSize: `${props.fontSize}px`,
            };
        });

        // 渲染所有的层级
        const renderAllItem = () => {
            const children = slots.default?.() || [];
            return children.map((item) => {
                return (
                    <>
                        { item }
                    </>
                );
            });
        };
        return () => (
            <div class={prefixCls} style={breadcrumbStyle.value}>
                { renderAllItem() }
            </div>
        );
    },
});
