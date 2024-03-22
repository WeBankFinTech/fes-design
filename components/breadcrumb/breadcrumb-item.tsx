import { computed, defineComponent, inject, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import DownOutlined from '../icon/DownOutlined';
import UpOutlined from '../icon/UpOutlined';
import { FTooltip } from '../tooltip';
import { breadcrumbItemProps } from './props';
import { BREAD_CRUMB_KEY } from './const';

const prefixCls = getPrefixCls('breadcrumb-item');

export default defineComponent({
    name: 'FBreadcrumbItem',
    props: breadcrumbItemProps,
    setup(props, { slots }) {
        useTheme();

        const { props: parentProps } = inject(BREAD_CRUMB_KEY);

        const itemStyle = computed(() => {
            return {
                height: `${parentProps.fontSize}px`,
                lineHeight: `${parentProps.fontSize}px`,
            };
        });

        // 处理点击跳转的事件
        const handleClick = (url: string) => {
            if (!url) return;
            if (props.replace) {
                window.location.replace(url);
            } else {
                window.location.href = url;
            }
        };

        // 用于判断菜单箭头icon
        const isHover = ref(false);

        // 渲染菜单
        const renderMenu = () => {
            return props.menu
                .map((item) => {
                    return (
                        <div
                            class="menu-item"
                            style={itemStyle.value}
                            onClick={() => handleClick(item.path)}
                        >
                            {item.name}
                        </div>
                    );
                })
                .filter(Boolean);
        };

        const trigger = ref();

        const getContainer = () => trigger.value;

        // 渲染内容
        const renderContent = () => {
            if (props.menu.length === 0) {
                return slots.default?.();
            } else {
                return (
                    <div ref={trigger}>
                        <FTooltip
                            mode="popover"
                            arrow={false}
                            popperClass={`${prefixCls}-menu`}
                            getContainer={getContainer}
                            v-slots={{
                                content: renderMenu,
                            }}
                        >
                            <div class="content">
                                {slots.default?.()}
                                <div
                                    style={itemStyle.value}
                                    class="content-icon"
                                >
                                    {isHover.value ? (
                                        <UpOutlined />
                                    ) : (
                                        <DownOutlined />
                                    )}
                                </div>
                            </div>
                        </FTooltip>
                    </div>
                );
            }
        };

        return () => (
            <div
                class={prefixCls}
                style={itemStyle.value}
                onClick={() => handleClick(props.to)}
                onMouseenter={() => (isHover.value = true)}
                onMouseleave={() => (isHover.value = false)}
            >
                {renderContent()}
            </div>
        );
    },
});
