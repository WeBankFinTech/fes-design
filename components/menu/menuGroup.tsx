import {
    type ComponentObjectPropsOptions,
    computed,
    defineComponent,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
} from 'vue';
import Ellipsis from '../ellipsis/ellipsis';
import getPrefixCls from '../_util/getPrefixCls';
import type { ExtractPublicPropTypes } from '../_util/interface';
import { COMPONENT_NAME } from './const';
import useChildren from './useChildren';
import useParent from './useParent';
import useMenu from './useMenu';

const prefixCls = getPrefixCls('menu-group');

export const menuGroupProps = {
    // 分组标题
    label: {
        type: String,
    },
} as const satisfies ComponentObjectPropsOptions;

export type MenuGroupProps = ExtractPublicPropTypes<typeof menuGroupProps>;

export default defineComponent({
    name: COMPONENT_NAME.MENU_GROUP,
    props: menuGroupProps,
    setup(props, { slots }) {
        const instance = getCurrentInstance();
        const { indexPath } = useMenu(instance);
        const { rootMenu, parentMenu } = useChildren(indexPath);
        if (!rootMenu || !parentMenu) {
            console.warn(
                `[${COMPONENT_NAME.MENU_GROUP}] must be a child of ${COMPONENT_NAME.MENU} or ${COMPONENT_NAME.SUB_MENU}`,
            );
            return () => null; // 早退：跳过 useParent/onMounted/渲染
        }
        const { paddingStyle } = useChildren(indexPath);
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
