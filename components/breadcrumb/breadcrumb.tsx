import { computed, defineComponent, provide } from 'vue';
import { useTheme } from '../_theme/useTheme';
import { breadcrumbProps } from './props';
import { BREAD_CRUMB_KEY, prefixCls } from './const';

export default defineComponent({
    name: 'FBreadcrumb',
    props: breadcrumbProps,
    setup(props, { slots }) {
        useTheme();

        provide(BREAD_CRUMB_KEY, {
            props: props,
        });
        const breadcrumbStyle = computed(() => {
            return {
                fontSize: `${props.fontSize}px`,
            };
        });

        const separatorStyle = computed(() => {
            return {
                height: `${props.fontSize}px`,
                lineHeight: `${props.fontSize}px`,
            };
        });

        const breadItemArr = computed(() => {
            return slots.default ? slots.default() : [];
        });

        // 渲染所有的层级
        const renderAllItem = () => {
            return breadItemArr.value.map((item, index) => {
                return (
                    <div class={`${prefixCls}-child`}>
                        {item}
                        {/* 渲染分隔符 */}
                        <div
                            class={`${prefixCls}-separator`}
                            style={separatorStyle.value}
                        >
                            {index !== breadItemArr.value.length - 1 &&
                                props.separator}
                        </div>
                    </div>
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
