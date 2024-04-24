import { type ComputedRef, computed, inject } from 'vue';
import { CHILDREN_KEY, COMPONENT_NAME, MODE, TRIGGER } from './const';
import type { MenuNode } from './const';

export default (indexPath: ComputedRef<MenuNode[]>) => {
    // 根节点 menu
    const rootMenu = inject('rootMenu', null);
    // 父级组件，可能为 menu / sub-menu / menu-group
    const parentMenu = inject(CHILDREN_KEY, null);

    const paddingStyle = computed(() => {
        if (rootMenu.renderWithPopper.value) {
            return {};
        }
        let padding = 16;
        const len = indexPath.value.length;
        if (len > 2) {
            for (let i = len - 2; i >= 0; i--) {
                const node = indexPath.value[i];
                if (node.name === COMPONENT_NAME.SUB_MENU) {
                    padding += 14;
                }
                if (node.name === COMPONENT_NAME.MENU_GROUP) {
                    padding += 8;
                }
            }
        }
        return { paddingLeft: `${padding}px` };
    });

    // 触发的方式
    const trigger = computed(() => {
        if (rootMenu.props.trigger) return rootMenu.props.trigger;
        // 水平默认是hover，垂直默认是click
        return rootMenu.props.mode === MODE[0] ? TRIGGER.HOVER : TRIGGER.CLICK;
    });

    const isFirstLevel = computed(() => {
        return indexPath.value.length < 3;
    });

    const onlyIcon = computed(() => {
        if (rootMenu.props.mode !== 'vertical') {
            return false;
        }
        return isFirstLevel.value && rootMenu.props.collapsed;
    });

    return {
        rootMenu,
        parentMenu,
        paddingStyle,
        onlyIcon,
        isFirstLevel,
        indexPath,
        trigger,
    };
};
