import {
    type Ref,
    type VNodeChild,
    computed,
    defineComponent,
    onMounted,
    provide,
    shallowReactive,
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
import type { MenuNode } from './const';
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

        // #1040 单一事实源：value → 该值所在祖先链上的 FSubMenu keys。
        // MenuItem 挂载自身时按 indexPath 注册，卸载时注销；选中态由
        // currentValue 唯一推导，SubMenu 渲染只读这个派生值（不再反向遍历
        // children 的 isActive 链，消除「子项选中 → <FSubMenu> 渲染自环」
        // 的 Maximum recursive updates / unhandledRejection）。
        const activePathMap = shallowReactive<
            Record<string | number, (string | number)[]>
        >({});
        const registerItemPath = (
            value: string | number,
            keys: (string | number)[],
        ) => {
            activePathMap[value] = keys;
        };
        const removeItemPath = (value: string | number) => {
            delete activePathMap[value];
        };
        const activeSubMenuKeys = computed(() => {
            const value = currentValue.value;
            if (value === undefined || value === null) {
                return [] as (string | number)[];
            }
            return activePathMap[value] ?? [];
        });

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
            // 选择后关闭所有子菜单（#1034 单一写路径：直接收敛 expandedKeys，
            // 不再写 children 中 unwrap 快照的 isOpened——后者已是派生只读值）
            if (renderWithPopper.value) {
                updateExpandedKeys([]);
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

        const handleSubMenuExpand = (
            subMenu: MenuItemType,
            indexPath: Ref<MenuNode[]>,
        ) => {
            // #1034 基于 expandedKeys 判断，不再读 subMenu.isOpened（派生只读值）
            const key = subMenu.value ?? subMenu.uid;
            const isExpanded = currentExpandedKeys.value.includes(key);
            // 将展开（当前收起）且 accordion → 收缩其它分支（保留当前祖先链）
            if (!isExpanded && accordion.value) {
                updateExpandedKeys(
                    currentExpandedKeys.value.filter((uid: string | number) =>
                        indexPath.value.some((node) => {
                            return node.uid === uid;
                        }),
                    ),
                );
            }
            updateExpandedKeys(key); // 单值 toggle（useArrayModel 语义：在则移除）
        };

        provide(ROOT_MENU_KEY, {
            props,
            currentValue,
            clickMenuItem,
            renderWithPopper,
            currentExpandedKeys,
            accordion,
            updateExpandedKeys,
            handleSubMenuExpand,
            activeSubMenuKeys,
            registerItemPath,
            removeItemPath,
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
                    return <MenuItem value={item.value} disabled={item.disabled} v-slots={itemSlots} />;
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
