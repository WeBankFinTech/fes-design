import { onBeforeUnmount, watch, ref, Ref, onMounted, nextTick } from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';

export default (
    triggerRef: Ref<HTMLElement>,
    callback?: () => void,
    disabled?: boolean | Ref<boolean>,
) => {
    const disabledRef = ref(disabled);
    const handleResize = () => {
        if (disabledRef.value) {
            return;
        }
        callback && callback();
    };

    const ro = new ResizeObserver(handleResize);

    let observedDom: HTMLElement = null;

    const handle = (dom: HTMLElement) => {
        if (observedDom) {
            ro.unobserve(observedDom);
        }
        if (dom) {
            ro.observe(dom);
            observedDom = dom;
        }
    };

    onMounted(() => {
        watch(
            triggerRef,
            () => {
                nextTick(() => {
                    handle(triggerRef.value);
                });
            },
            {
                immediate: true,
            },
        );
    });

    onBeforeUnmount(() => {
        ro.disconnect();
    });
};
