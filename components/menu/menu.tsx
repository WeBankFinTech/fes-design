import { h, computed, onMounted, provide, ref, defineComponent, Ref, VNodeChild } from 'vue';
import { isFunction } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useNormalModel } from '../_util/use/useModel';
import { UPDATE_MODEL_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import { COMPONENT_NAME, MENU_PROPS } from './const';
import useChildren from './useChildren';
import MenuGroup from './menuGroup';
import MenuItem from './menuItem';
import SubMenu from './subMenu';

import type { MenuItemType, MenuOption } from './interface';

const prefixCls = getPrefixCls('menu');
export default defineComponent({
    name: COMPONENT_NAME.MENU,
    props: MENU_PROPS,
    emits: ['select', UPDATE_MODEL_EVENT],
    setup(props, { emit, slots }) {
        useTheme();
        const [currentValue, updateCurrentValue] = useNormalModel(props, emit);

        const renderWithPopper = computed(() => {
            if (props.mode === 'horizontal') {
                return true;
            }
            return props.collapsed;
        });

        const { children } = useChildren();

        const clickMenuItem = (value: string) => {
            updateCurrentValue(value);
            emit('select', value);
            // 当水平时，默认是hover，当垂直收起时也是hover
            if (renderWithPopper.value) {
                children.forEach((item) => {
                    if (item.type === 'subMenu') {
                        item.isOpened = false;
                    }
                });
            }
        };

        const openedMenus = ref([]);

        onMounted(() => {
            if (!props.defaultExpandAll) {
                openedMenus.value = props.expandedKeys;
            }
        });

        const clickSubMenu = (subMenu: MenuItemType, indexPath: Ref<string[]>) => {
            if (subMenu.isOpened.value) {
                if (props.accordion) {
                    openedMenus.value = openedMenus.value.filter((uid) =>
                        indexPath.value.includes(uid),
                    );
                }
                openedMenus.value.push(subMenu.value || subMenu.uid);
            } else {
                const index = openedMenus.value.indexOf(
                    subMenu.value || subMenu.uid,
                );
                if (index !== -1) {
                    openedMenus.value.splice(index, 1);
                }
            }
        };

        provide('rootMenu', {
            props,
            currentValue,
            clickMenuItem,
            clickSubMenu,
            renderWithPopper,
            openedMenus,
        });

        const classList = computed(() =>
            [
                prefixCls,
                `is-${props.mode}`,
                props.inverted && 'is-inverted',
                props.collapsed && 'is-collapsed',
            ]
                .filter(Boolean)
                .join(' '),
        );

        const renderChildren = (arr: MenuOption[]) =>
            arr.map((item) => {
                const itemSlots: {
                    icon?: () => VNodeChild,
                    label?: string | (() => VNodeChild)
                } = {};
                if (isFunction(item.icon)) {
                    itemSlots.icon = item.icon;
                }
                itemSlots.label = () =>
                    isFunction(item.label) ? item.label() : item.label;
                if (!item.children) {
                    return <MenuItem value={item.value} v-slots={itemSlots} />;
                }
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
                return slots.default();
            }
            return renderChildren(props.options);
        };

        return () => <div class={classList.value}>{render()}</div>;
    },
});
