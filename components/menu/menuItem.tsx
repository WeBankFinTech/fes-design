import {
    computed,
    defineComponent,
    getCurrentInstance,
    inject,
    onBeforeUnmount,
    onMounted,
} from 'vue';
import type { ComponentObjectPropsOptions, PropType } from 'vue';
import Ellipsis from '../ellipsis/ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import { noop } from '../_util/utils';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME, SUB_MENU_KEY } from './const';
import useChildren from './useChildren';
import useMenu from './useMenu';

const prefixCls = getPrefixCls('menu-item');

export const menuItemProps = {
    value: {
        type: [String, Number] as PropType<string | number>,
        required: true,
    },
    label: String,
    disabled: Boolean,
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
        disabled: Boolean,
    } satisfies ComponentObjectPropsOptions,
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const { indexPath } = useMenu(instance);
        const { rootMenu, parentMenu, paddingStyle, onlyIcon }
            = useChildren(indexPath);
        const { handleItemClick } = inject(SUB_MENU_KEY, {
            handleItemClick: noop,
        });
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
        const isDisabled = computed(
            () => props.disabled === true,
        );
        const menuItem = {
            uid: instance.uid,
            type: 'menu',
            value: props.value,
            isActive,
            isDisabled,
        };
        onMounted(() => {
            parentMenu.addChild(menuItem);
        });
        onBeforeUnmount(() => {
            parentMenu.removeChild(menuItem);
        });
        const classList = computed(() =>
            [prefixCls, isActive.value && 'is-active', isDisabled.value && 'is-disabled']
                .filter(Boolean)
                .join(' '),
        );
        const handleClick = () => {
            if (isDisabled.value) {
                return;
            }
            rootMenu.clickMenuItem(props.value);
            handleItemClick();
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
            <div
                class={classList.value}
                onClick={handleClick}
            >
                <div class={`${prefixCls}-wrapper`} style={paddingStyle.value}>
                    {renderIcon()}
                    {!onlyIcon.value ? renderTitle() : null}
                </div>
            </div>
        );
    },
});
