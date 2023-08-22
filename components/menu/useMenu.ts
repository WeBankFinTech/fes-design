import {
    provide,
    inject,
    computed,
    getCurrentInstance,
    ComponentInternalInstance,
} from 'vue';
import { MENU_KEY } from './const';
import type { MenuNode } from './const';

export default (instance?: ComponentInternalInstance) => {
    instance = instance ?? getCurrentInstance();

    const node: MenuNode = {
        name: instance.type.name,
        uid: (instance.props.value as string) || instance.uid,
    };

    const { parentPath } = inject(MENU_KEY, {
        parentPath: computed(() => [] as MenuNode[]),
    });

    const indexPath = computed(() => {
        return parentPath.value.concat(node);
    });

    provide(MENU_KEY, {
        parentPath: indexPath,
    });

    return {
        indexPath,
    };
};
