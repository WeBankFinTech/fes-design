import {
    unref, watchEffect, onBeforeUnmount,
} from 'vue';
import getElementFromRef from '../getElementFromRef';

export default function useClickOutSide(ref, options) {
    let listened = false;
    function onGlobalMouseDown(event) {
        const target = event.target;
        const elements = Array.isArray(ref) ? ref.map(r => getElementFromRef(unref(r))) : [getElementFromRef(unref(ref))];
        if (
            elements.every(
                element => element && !element.contains(target) && element !== target,
            )
        ) {
            options.callback?.();
        }
    }

    const destroy = () => {
        if (listened) {
            listened = false;
            window.removeEventListener('click', onGlobalMouseDown);
        }
    };

    watchEffect(() => {
        if (options.enable && !options.enable()) {
            destroy();
        } else if (!listened) {
            listened = true;
            window.addEventListener('click', onGlobalMouseDown);
        }
    });

    onBeforeUnmount(destroy);

    return destroy;
}
