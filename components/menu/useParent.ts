import { reactive, provide, UnwrapRef } from 'vue';
import { CHILDREN_KEY } from './const';

import type { MenuItemType } from './interface';

type MenuItemTypePlain = UnwrapRef<MenuItemType>;

export default () => {
    const children = reactive<MenuItemTypePlain[]>([]);

    const addChild = (child: MenuItemTypePlain) => {
        children.push(child);
    };

    const removeChild = (child: MenuItemTypePlain) => {
        const index = children.indexOf(child);
        if (index !== -1) {
            children.splice(index, 1);
        }
    };

    provide(CHILDREN_KEY, {
        addChild,
        removeChild,
    });

    return {
        children,
    };
};
