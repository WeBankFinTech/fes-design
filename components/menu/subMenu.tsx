import {
    computed,
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    provide,
    ref,
    watch,
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
import { COMPONENT_NAME, MODE, SUB_MENU_KEY, TRIGGER } from './const';
import useChildren from './useChildren';
import useParent from './useParent';
import useMenu from './useMenu';

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
        const isOpened = ref(false);
        const isActive = computed(() =>
            children.some((child) => child?.isActive),
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
                    isOpened.value = false;
                    rootMenu.updateExpandedKeys([]);
                }
            },
        });

        const placement = computed(() => {
            if (rootMenu.props.mode === MODE.HORIZONTAL) {
                return isFirstLevel.value ? 'bottom-start' : 'right-start';
            }
            return 'right-start';
        });
        const classList = computed(() =>
            [prefixCls, isActive.value && 'is-active']
                .filter(Boolean)
                .join(' '),
        );

        const handleTrigger = () => {
            isOpened.value = !isOpened.value;
            rootMenu.handleSubMenu(subMenu, indexPath);
        };

        const handleEnter = () => {
            // 如果是hover 且 只能展开一项的场景，进入第一层的时候要清空
            if (rootMenu.accordion.value && isFirstLevel.value) {
                rootMenu.updateExpandedKeys([]);
            }
            rootMenu.handleSubMenu(subMenu, indexPath);
        };

        watch(
            rootMenu.currentExpandedKeys,
            () => {
                // 要通过监听currentExpandedKeys，自动打开或者关闭子菜单
                const isHas = rootMenu.currentExpandedKeys.value.includes(
                    props.value || instance.uid,
                );
                if (!isHas && isOpened.value) {
                    isOpened.value = false;
                } else if (isHas && !isOpened.value) {
                    isOpened.value = true;
                }
            },
            {
                immediate: true,
            },
        );

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

        // 两种触发的方式 hover&click
        const renderWrapper = (trigger: string) => {
            const wrapperContent = (
                <>
                    {renderIcon()}
                    {!onlyIcon.value ? renderTitle() : null}
                    {!onlyIcon.value ? renderArrow() : null}
                </>
            );
            return trigger === TRIGGER.CLICK
                ? (
                    <div
                        class={`${prefixCls}-wrapper`}
                        style={paddingStyle.value}
                        onClick={handleTrigger}
                    >
                        {wrapperContent}
                    </div>
                    )
                : (
                    <div
                        class={`${prefixCls}-wrapper`}
                        style={paddingStyle.value}
                        onMouseenter={handleEnter}
                    >
                        {wrapperContent}
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
                        v-model={isOpened.value}
                        {...popperProps.value}
                        trigger={rootMenu.trigger.value}
                        onlyShowTrigger={true} // 只在展示的时候生效，是为了在子菜单中选择的时候，popper不消失
                        placement={placement.value}
                        popperClass={`${prefixCls}-popper`}
                        offset={1}
                        v-slots={{
                            default: renderDefault,
                            trigger: () => renderWrapper(rootMenu.trigger.value),
                        }}
                    />
                );
            }
            return (
                <>
                    {renderWrapper(rootMenu.trigger.value)}
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
