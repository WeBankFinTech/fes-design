import { reactive, provide } from 'vue';
import { MENU_KEY } from './const';

import type { MenuItemType } from './interface';

export default () => {
    const children = reactive<MenuItemType[]>([]);

    const addChild = (child: MenuItemType) => {
        children.push(child);
    };

    const removeChild = (child: MenuItemType) => {
        const index = children.indexOf(child);
        if (index !== -1) {
            children.splice(index, 1);
        }
    };

    provide(MENU_KEY, {
        addChild,
        removeChild,
    });

    return {
        children,
    };
};
