import { computed, defineComponent, provide } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import AppstoreOutlined from '../icon/AppstoreOutlined';

import HomeOutlined from '../icon/HomeOutlined';
import { breadcrumbProps } from './props';
import { BREAD_CRUMB_KEY } from './const';

const prefixCls = getPrefixCls('breadcrumb');

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

        const iconStyle = computed(() => {
            return {
                width: `${props.fontSize}px`,
                height: `${props.fontSize}px`,
                lineHeight: `${props.fontSize}px`,
            };
        });

        // 渲染icon
        const renderIcon = (index: number) => {
            return (
                <div class="icon" style={iconStyle.value}>
                    {/* 默认第一个 展示home 图标 */}
                    {index === 0 ? <HomeOutlined /> : <AppstoreOutlined />}
                </div>
            );
        };

        // 渲染所有的层级
        const renderAllItem = () => {
            const len = slots.default().length;
            return slots.default().map((item, index) => {
                return (
                    <div class={`${prefixCls}-child`}>
                        {/* 渲染icon */}
                        {props.icon && renderIcon(index)}
                        {item}
                        <div
                            class={`${prefixCls}-separator`}
                            style={iconStyle.value}
                        >
                            {index !== len - 1 && props.separator}
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
