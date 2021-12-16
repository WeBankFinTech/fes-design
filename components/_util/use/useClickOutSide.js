import { unref, watch, onBeforeUnmount, ref } from 'vue';
import getElementFromRef from '../getElementFromRef';

export default function useClickOutSide(
    watchList,
    callback = () => {},
    disabled = false,
) {
    let listened = false;
    const disabledRef = ref(disabled);
    function onGlobalMouseDown(event) {
        const target = event.target;
        const elements = Array.isArray(watchList)
            ? watchList.map((r) => getElementFromRef(unref(r)))
            : [getElementFromRef(unref(watchList))];
        if (
            elements.every(
                (element) =>
                    element && !element.contains(target) && element !== target,
            )
        ) {
            callback();
        }
    }

    const destroy = () => {
        if (listened) {
            listened = false;
            window.removeEventListener('click', onGlobalMouseDown, true);
        }
    };

    watch(
        disabledRef,
        () => {
            if (disabledRef.value) {
                destroy();
            } else if (!listened) {
                listened = true;
                window.addEventListener('click', onGlobalMouseDown, true);
            }
        },
        {
            immediate: true,
        },
    );

    onBeforeUnmount(destroy);

    return destroy;
}
