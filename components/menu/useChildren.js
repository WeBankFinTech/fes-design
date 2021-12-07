
import {
    reactive, provide,
} from 'vue';
import { MENU_KEY } from './const';

export default () => {
    const children = reactive([]);

    const addChild = (child) => {
        children.push(child);
    };

    const removeChild = (child) => {
        const index = children.indexOf(child);
        if (child !== -1) {
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
