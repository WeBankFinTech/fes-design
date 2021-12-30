import { unref, watch, onBeforeUnmount, ref, Ref } from 'vue';
import getElementFromRef from '../getElementFromRef';

export default function useClickOutSide(
    watchList:
        | HTMLElement
        | Ref<HTMLElement>
        | Ref<HTMLElement>[]
        | HTMLElement[],
    callback?: () => void,
    disabled: boolean | Ref<boolean> = false,
) {
    const _watchList = Array.isArray(watchList) ? watchList : [watchList];
    let listened = false;
    const disabledRef = ref(disabled);
    function onGlobalMouseDown(event: MouseEvent) {
        const target = event.target;
        const elements = _watchList.map((r) => getElementFromRef(unref(r)));
        if (
            elements.every(
                (element) =>
                    element && !element.contains(target) && element !== target,
            )
        ) {
            callback && callback();
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
