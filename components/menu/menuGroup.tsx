import {
    defineComponent,
    getCurrentInstance,
    computed,
    onMounted,
    onBeforeUnmount,
} from 'vue';
import Ellipsis from '../ellipsis/ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import { COMPONENT_NAME } from './const';
import useChildren from './useChildren';
import useParent from './useParent';
import useMenu from './useMenu';
import type { ExtractPublicPropTypes } from '../_util/interface';

const prefixCls = getPrefixCls('menu-group');

export const menuGroupProps = {
    // 分组标题
    label: {
        type: String,
    },
} as const;

export type MenuGroupProps = ExtractPublicPropTypes<typeof menuGroupProps>;

export default defineComponent({
    name: COMPONENT_NAME.MENU_GROUP,
    props: menuGroupProps,
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const { indexPath } = useMenu(instance);
        const { rootMenu, parentMenu, paddingStyle } = useChildren(indexPath);
        // 根节点 menu
        if (!rootMenu) {
            console.warn(
                `[${COMPONENT_NAME.MENU_GROUP}] must be a child of ${COMPONENT_NAME.MENU}`,
            );
        }
        // 父级组件，可能为 menu 或者 sub-menu
        if (!parentMenu) {
            console.warn(
                `[${COMPONENT_NAME.MENU_GROUP}] must be a child of ${COMPONENT_NAME.MENU} or ${COMPONENT_NAME.SUB_MENU}`,
            );
        }
        const { children } = useParent();
        const isActive = computed(() =>
            children.some((child) => child?.isActive),
        );
        const subMenu = {
            uid: instance.uid,
            type: 'menuGroup',
            children,
            isActive,
        };
        onMounted(() => {
            parentMenu.addChild(subMenu);
        });
        onBeforeUnmount(() => {
            parentMenu.removeChild(subMenu);
        });
        const renderTitle = () => {
            return (
                <Ellipsis
                    class={`${prefixCls}-label`}
                    style={paddingStyle.value}
                >
                    {slots.label?.() || props.label}
                </Ellipsis>
            );
        };
        return () => (
            <div class={prefixCls}>
                {renderTitle()}
                {slots.default?.()}
            </div>
        );
    },
});
