import {
    onBeforeUnmount,
    watch,
    computed,
    unref,
    Ref,
    onMounted,
    nextTick,
} from 'vue';
import { ResizeObserver } from '@juggle/resize-observer';

type ResizeObserverCallback = ConstructorParameters<typeof ResizeObserver>[0];

export default (
    triggerRef: Ref<HTMLElement>,
    callback?: ResizeObserverCallback,
    disabled?: boolean | Ref<boolean>,
    immediate = true,
) => {
    const disabledRef = computed(() => unref(disabled));
    const handleResize: ResizeObserverCallback = (...params) => {
        if (disabledRef.value) {
            return;
        }
        if (!immediate) {
            immediate = true;
            return;
        }
        callback?.(...params);
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
