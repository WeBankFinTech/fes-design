import {
    defineComponent,
    computed,
    onMounted,
    onBeforeUnmount,
    getCurrentInstance,
} from 'vue';
import Ellipsis from '../ellipsis/ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';
import useChildren from './useChildren';
import useMenu from './useMenu';
import type { PropType } from 'vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('menu-item');

export const menuItemProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    label: String,
} as const;

export type MenuItemProps = ExtractPublicPropTypes<typeof menuItemProps>;

export default defineComponent({
    name: COMPONENT_NAME.MENU_ITEM,
    components: {
        Ellipsis,
    },
    props: {
        value: {
            type: [String, Number],
            required: true,
        },
        label: String,
    },
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const { indexPath } = useMenu(instance);
        const { rootMenu, parentMenu, paddingStyle, onlyIcon } =
            useChildren(indexPath);
        // 根节点 menu
        if (!rootMenu) {
            console.warn(
                `[${COMPONENT_NAME.MENU_ITEM}] must be a child of ${COMPONENT_NAME.MENU}`,
            );
        }
        // 父级组件，可能为 menu 或者 sub-menu
        if (!parentMenu) {
            console.warn(
                `[${COMPONENT_NAME.MENU_ITEM}] must be a child of ${COMPONENT_NAME.MENU} or ${COMPONENT_NAME.SUB_MENU}`,
            );
        }
        const isActive = computed(
            () => rootMenu.currentValue.value === props.value,
        );
        const menuItem = {
            uid: instance.uid,
            type: 'menu',
            value: props.value,
            isActive,
        };
        onMounted(() => {
            parentMenu.addChild(menuItem);
        });
        onBeforeUnmount(() => {
            parentMenu.removeChild(menuItem);
        });
        const classList = computed(() =>
            [prefixCls, isActive.value && 'is-active']
                .filter(Boolean)
                .join(' '),
        );
        const handleClick = () => {
            rootMenu.clickMenuItem(props.value);
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
                return <span class={`${prefixCls}-icon`}>{slots.icon()}</span>;
            }
            if (onlyIcon.value) {
                return renderTitle();
            }
            return null;
        };
        return () => (
            <div class={classList.value} onClick={handleClick}>
                <div class={`${prefixCls}-wrapper`} style={paddingStyle.value}>
                    {renderIcon()}
                    {!onlyIcon.value ? renderTitle() : null}
                </div>
            </div>
        );
    },
});
