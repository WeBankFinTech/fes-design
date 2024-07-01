import {
    type Ref,
    type VNodeChild,
    computed,
    defineComponent,
    onMounted,
    provide,
    ref,
    watch,
} from 'vue';
import { isFunction } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useArrayModel, useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import { concat } from '../_util/utils';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME, ROOT_MENU_KEY, menuProps } from './const';
import useParent from './useParent';
import useMenu from './useMenu';
import MenuGroup from './menuGroup';
import MenuItem from './menuItem';
import SubMenu from './subMenu';
import type { MenuNode, TRIGGER } from './const';
import type { MenuItemTypePlain } from './useParent';

import type { MenuItemType, MenuOption } from './interface';

const prefixCls = getPrefixCls('menu');

export default defineComponent({
    name: COMPONENT_NAME.MENU,
    props: menuProps,
    emits: ['select', UPDATE_MODEL_EVENT, 'update:expandedKeys'],
    setup(props, { emit, slots }) {
        useTheme();

        useMenu();

        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const [currentExpandedKeys, updateExpandedKeys] = useArrayModel(
            props,
            emit,
            { prop: 'expandedKeys' },
        );

        // 水平模式一定是采用Popper的
        const renderWithPopper = computed(() => {
            if (props.mode === 'horizontal') {
                return true;
            }
            return props.collapsed;
        });

        const { children } = useParent();

        const clickMenuItem = (value: string | number) => {
            updateCurrentValue(value);
            emit('select', { value });
            // 选择后，关闭所有的子菜单
            if (renderWithPopper.value) {
                children.forEach((item) => {
                    if (item.type === 'subMenu') {
                        item.isOpened = false;
                    }
                });
            }
        };

        const flatNodes = (nodes: MenuItemTypePlain[] = []) =>
            nodes.reduce((res, node) => {
                if (node.type === 'subMenu') {
                    res.push(node.value || node.uid);
                }
                if (node.children?.length) {
                    const keys = flatNodes(node.children);
                    // 比Array.concat快
                    concat(res, keys);
                }
                return res;
            }, []);

        onMounted(() => {
            if (
                props.defaultExpandAll
                && currentExpandedKeys.value.length === 0
            ) {
                const keys = flatNodes(children);
                updateExpandedKeys(keys);
            }
        });

        const accordion = computed(() => {
            // 如果是水平的菜单，accordion 只能为true
            return (props.mode === 'horizontal' || props.collapsed) ? true : props.accordion;
        });

        watch(
            () => props.collapsed,
            (value) => {
                if (value) {
                    updateExpandedKeys([]);
                }
            },
        );

        // 展开的方式，垂直模式仅支持 click, 水平模式仅支持 hover
        const expandTrigger = computed<TRIGGER>(() => {
            if (props.mode === 'horizontal') {
                return 'hover';
            } else {
                return 'click';
            }
        });

        const handleSubMenuExpand = (
            subMenu: MenuItemType,
            indexPath: Ref<MenuNode[]>,
        ) => {
            if (subMenu.isOpened.value && accordion.value) {
                updateExpandedKeys(
                    currentExpandedKeys.value.filter((uid: string | number) =>
                        indexPath.value.some((node) => {
                            return node.uid === uid;
                        }),
                    ),
                );
            }
            updateExpandedKeys(subMenu.value || subMenu.uid);
        };

        const currentPopperShowSubMenus = ref<(string | number)[]>([]);
        const updatePopperShowSubMenu = (value: string | number, state: string) => {
            const current = currentPopperShowSubMenus.value;
            const index = current.indexOf(value);

            if (state === 'show') {
                if (index < 0) {
                    current.push(value);
                }
            } else {
                if (index > -1) {
                    current.splice(index, 1);
                }
            }
            currentPopperShowSubMenus.value = current;
        };
        watch(currentPopperShowSubMenus, () => {
            // 若鼠标滑出所有的子菜单区域，则隐藏所有子菜单
            if (currentPopperShowSubMenus.value.length === 0) {
                updateExpandedKeys([]);
            }
        }, {
            deep: true,
        });

        provide(ROOT_MENU_KEY, {
            props,
            currentValue,
            clickMenuItem,
            renderWithPopper,
            currentExpandedKeys,
            accordion,
            expandTrigger,
            updateExpandedKeys,
            handleSubMenuExpand,
            currentPopperShowSubMenus,
            updatePopperShowSubMenu,
        });

        const classList = computed(() =>
            [
                prefixCls,
                `is-${props.mode}`,
                props.inverted && 'is-inverted',
                props.mode === 'vertical' && props.collapsed && 'is-collapsed',
            ].filter(Boolean),
        );

        const renderChildren = (arr: MenuOption[]) =>
            arr.map((item) => {
                const itemSlots: {
                    icon?: () => VNodeChild;
                    label?: string | (() => VNodeChild);
                } = {};
                if (isFunction(item.icon)) {
                    itemSlots.icon = item.icon;
                }
                itemSlots.label = () =>
                    isFunction(item.label) ? item.label() : item.label;
                // 没有子菜单
                if (!item.children) {
                    return <MenuItem value={item.value} v-slots={itemSlots} />;
                }
                // 分组
                if (item.isGroup) {
                    return (
                        <MenuGroup v-slots={itemSlots}>
                            {renderChildren(item.children)}
                        </MenuGroup>
                    );
                }
                return (
                    <SubMenu value={item.value} v-slots={itemSlots}>
                        {renderChildren(item.children)}
                    </SubMenu>
                );
            });

        const render = () => {
            if (props.options.length === 0) {
                return slots.default?.();
            }
            return renderChildren(props.options);
        };

        return () => <div class={classList.value}>{render()}</div>;
    },
});
