import {
    inject, computed,
} from 'vue';
import { MENU_KEY, COMPONENT_NAME } from './const';

export default (instance) => {
    // 根节点 menu
    const rootMenu = inject('rootMenu', null);
    // 父级组件，可能为 menu / sub-menu / menu-group
    const parentMenu = inject(MENU_KEY, null);

    const indexPath = computed(() => {
        let parent = instance.parent;
        const path = [instance.props.value || instance.uid];
        while (parent.type.name !== COMPONENT_NAME.MENU) {
            path.unshift(parent.props.value || parent.uid);
            parent = parent.parent;
        }
        return path;
    });

    const paddingStyle = computed(() => {
        let parent = instance.parent;
        if (rootMenu.renderWithPopper.value) return {};
        let padding = 16;
        while (parent && parent.type.name !== COMPONENT_NAME.MENU) {
            if (parent.type.name === COMPONENT_NAME.SUB_MENU) {
                padding += 14;
            }
            if (parent.type.name === COMPONENT_NAME.MENU_GROUP) {
                padding += 8;
            }
            parent = parent.parent;
        }
        return { paddingLeft: `${padding}px` };
    });

    const isFirstLevel = computed(() => {
        let res = true;
        let p = instance.parent;
        while (p && p.type.name !== COMPONENT_NAME.MENU) {
            if (
                [
                    COMPONENT_NAME.SUB_MENU,
                    COMPONENT_NAME.MENU_GROUP,
                ].includes(p.type.name)
            ) {
                res = false;
                break;
            } else {
                p = p.parent;
            }
        }
        return res;
    });

    const onlyIcon = computed(() => {
        if (rootMenu.props.mode !== 'vertical') return false;
        return isFirstLevel.value && rootMenu.props.collapsed;
    });

    return {
        rootMenu,
        parentMenu,
        paddingStyle,
        onlyIcon,
        isFirstLevel,
        indexPath,
    };
};
