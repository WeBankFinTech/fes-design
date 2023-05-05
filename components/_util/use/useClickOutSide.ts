import { unref, watch, onBeforeUnmount, ref, Ref } from 'vue';
import getElementFromVueInstance from '../getElementFromVueInstance';

export default function useClickOutSide(
    watchList:
        | HTMLElement
        | Ref<HTMLElement | undefined>
        | Ref<HTMLElement | undefined>[]
        | HTMLElement[],
    callback?: () => void,
    disabled: boolean | Ref<boolean> = false,
) {
    const _watchList = Array.isArray(watchList) ? watchList : [watchList];
    let listened = false;
    const disabledRef = ref(disabled);
    function onGlobalMouseDown(event: MouseEvent) {
        const target = event.target;
        if (
            _watchList.every((watchElement) => {
                const element = getElementFromVueInstance(unref(watchElement));
                return (
                    element && !element.contains(target) && element !== target
                );
            })
        ) {
            callback?.();
        }
    }

    const destroy = () => {
        if (listened) {
            listened = false;
            // 事件捕获
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
