import { computed, defineComponent, onMounted, provide } from 'vue';
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

        const breadItemArr = computed(() => {
            return slots.default ? slots.default() : [];
        });

        // 渲染所有的层级
        const renderAllItem = () => {
            return breadItemArr.value.map((item) => {
                return (
                    <>
                        { item }
                    </>
                );
            });
        };
        return () => (
            <div class={prefixCls} style={breadcrumbStyle.value}>
                {slots.default && renderAllItem()}
            </div>
        );
    },
});
