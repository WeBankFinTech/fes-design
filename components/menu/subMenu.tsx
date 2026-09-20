import {
    computed,
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
} from 'vue';
import type {
    ComponentObjectPropsOptions,
    PropType,
} from 'vue';
import { pick } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import FadeInExpandTransition from '../_util/components/fadeInExpandTransition';
import Popper from '../popper/popper';
import DownOutlined from '../icon/DownOutlined';
import RightOutlined from '../icon/RightOutlined';
import Ellipsis from '../ellipsis/ellipsis';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, SUB_MENU_KEY } from './const';
import useChildren from './useChildren';
import useParent from './useParent';
import useMenu from './useMenu';
import type { MenuItemType } from './interface';

const prefixCls = getPrefixCls('sub-menu');

export const subMenuProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
    },
    label: String,
};

export type SubMenuProps = ExtractPublicPropTypes<typeof subMenuProps>;

export default defineComponent({
    name: COMPONENT_NAME.SUB_MENU,
    components: {
        Ellipsis,
        FadeInExpandTransition,
    },
    props: {
        value: {
            type: [String, Number],
            default: null,
        },
        label: String,
    } satisfies ComponentObjectPropsOptions,
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const { indexPath } = useMenu(instance);
        const subMenuRef = ref(null);
        const {
            rootMenu,
            parentMenu,
            paddingStyle,
            isFirstLevel,
            onlyIcon,
        } = useChildren(indexPath);
        // 根节点 menu
        if (!rootMenu) {
            console.warn(
                `[${COMPONENT_NAME.SUB_MENU}] must be a child of ${COMPONENT_NAME.MENU}`,
            );
        }
        // 父级组件，可能为 menu 或者 sub-menu
        if (!parentMenu) {
            console.warn(
                `[${COMPONENT_NAME.SUB_MENU}] must be a child of ${COMPONENT_NAME.MENU} or ${COMPONENT_NAME.SUB_MENU}`,
            );
        }
        const { children } = useParent();
        // #1034 根治：展开状态收敛为单一事实源（rootMenu.currentExpandedKeys）。
        // isOpened 不再独立持有 ref，而是从 expandedKeys 派生的只读值——
        // 所有写路径统一走 rootMenu.updateExpandedKeys，消除渲染-写环。
        const subMenuKey = computed(() => props.value ?? instance.uid);
        const isOpened = computed(() =>
            rootMenu.currentExpandedKeys.value.includes(subMenuKey.value),
        );
        // #1040 根治：isActive 不再渲染期反向遍历 children（读 reactive 解包
        // 快照，选中态变化时与 <FSubMenu> 自身渲染/内建 Transition update 阶段
        // 耦合形成自环 → Maximum recursive updates + unhandledRejection）。
        // 改为根菜单按 currentValue 推导的单一事实源 activeSubMenuKeys 判包含，
        // 渲染只读，无 children 读写。
        const isActive = computed(() =>
            rootMenu.activeSubMenuKeys.value.includes(subMenuKey.value),
        );
        const subMenu = {
            uid: instance.uid,
            value: props.value,
            type: 'subMenu',
            children,
            isOpened,
            isActive,
        };
        onMounted(() => {
            parentMenu.addChild(subMenu);
        });
        onBeforeUnmount(() => {
            parentMenu.removeChild(subMenu);
        });

        provide(SUB_MENU_KEY, {
            handleItemClick: () => {
                if (rootMenu.renderWithPopper.value) {
                    // 单一写路径：清空展开即收起（isOpened 派生自动跟随）
                    rootMenu.updateExpandedKeys([]);
                }
            },
        });

        const placement = computed(() => {
            if (rootMenu.props.mode === 'horizontal') {
                return isFirstLevel.value ? 'bottom-start' : 'right-start';
            }
            return 'right-start';
        });
        const classList = computed(() =>
            [prefixCls, isActive.value && 'is-active']
                .filter(Boolean)
                .join(' '),
        );

        const handleTriggerClick = () => {
            // 派生模式下点击即 toggle expandedKeys（accordion 收缩逻辑在
            // menu.handleSubMenuExpand 内基于当前 keys 判断）
            rootMenu.handleSubMenuExpand(subMenu as unknown as MenuItemType, indexPath);
        };

        // Popper 可见性经 expandedKeys 收敛：hover 打开/收起都写 keys，
        // 派生回 modelValue，避免 Popper 本地状态与展开状态脱节
        const handlePopperVisible = (val: boolean) => {
            if (val) {
                rootMenu.handleSubMenuExpand(
                    subMenu as unknown as MenuItemType,
                    indexPath,
                );
            } else {
                rootMenu.updateExpandedKeys(
                    rootMenu.currentExpandedKeys.value.filter(
                        (key) => key !== subMenuKey.value,
                    ),
                );
            }
        };

        const renderTitle = () => {
            return (
                <Ellipsis class={`${prefixCls}-label`}>
                    {slots.label?.() || props.label}
                </Ellipsis>
            );
        };

        const renderIcon = () => {
            if (slots.icon) {
                return <div class={`${prefixCls}-icon`}>{slots.icon()}</div>;
            }
            if (onlyIcon.value) {
                return renderTitle();
            }
            return null;
        };

        const renderArrow = () => {
            if (rootMenu.renderWithPopper.value && !isFirstLevel.value) {
                return (
                    <span class={`${prefixCls}-arrow`}>
                        <RightOutlined />
                    </span>
                );
            }
            return (
                <span
                    class={[
                        `${prefixCls}-arrow`,
                        isOpened.value && 'is-opened',
                    ]}
                >
                    <DownOutlined />
                </span>
            );
        };

        const wrapperContent = () => {
            return (
                <>
                    {renderIcon()}
                    {!onlyIcon.value ? renderTitle() : null}
                    {!onlyIcon.value ? renderArrow() : null}
                </>
            );
        };

        const renderWrapperClick = () => {
            return (
                <div
                    class={`${prefixCls}-wrapper`}
                    style={paddingStyle.value}
                    onClick={handleTriggerClick}
                >
                    {wrapperContent()}
                </div>
            );
        };

        const renderWrapperPopper = () => {
            return (
                <div
                    class={`${prefixCls}-wrapper`}
                    style={paddingStyle.value}
                >
                    {wrapperContent()}
                </div>
            );
        };

        const renderDefault = () => slots.default?.();
        const popperProps = computed(() => {
            if (!rootMenu.renderWithPopper.value) {
                return {};
            }
            return pick(rootMenu.props, ['getContainer', 'appendToContainer']);
        });

        const renderContent = () => {
            if (rootMenu.renderWithPopper.value) {
                return (
                    <Popper
                        modelValue={isOpened.value}
                        onUpdate:modelValue={handlePopperVisible}
                        {...popperProps.value}
                        trigger={`hover`}
                        placement={placement.value}
                        popperClass={`${prefixCls}-popper`}
                        appendToContainer={!(indexPath.value.length > 2)}
                        offset={1}
                        v-slots={{
                            default: renderDefault,
                            trigger: () => renderWrapperPopper(),
                        }}
                    />
                );
            }
            return (
                <>
                    {renderWrapperClick()}
                    <FadeInExpandTransition>
                        <div
                            v-show={isOpened.value}
                            class={`${prefixCls}-children`}
                        >
                            {renderDefault()}
                        </div>
                    </FadeInExpandTransition>
                </>
            );
        };
        return () => (
            <div class={classList.value} ref={subMenuRef}>
                {renderContent()}
            </div>
        );
    },
});
