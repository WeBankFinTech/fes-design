import { onBeforeUnmount, watch, ref, Ref } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';

export default (
    triggerRef: Ref<HTMLElement>,
    callback?: () => void,
    disabledRef?: boolean | Ref<boolean>,
) => {
    const _disabledRef = ref(disabledRef);
    const handleResize = () => {
        if (_disabledRef.value) {
            return;
        }
        callback && callback();
    };

    const ro = new ResizeObserver(handleResize);

    watch(triggerRef, ($trigger, $oldTrigger) => {
        if ($oldTrigger) {
            ro.unobserve($oldTrigger);
        }
        if ($trigger) {
            ro.observe($trigger);
        }
    });

    onBeforeUnmount(() => {
        ro.disconnect();
    });
};
