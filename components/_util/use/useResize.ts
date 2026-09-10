import {
    type Ref,
    computed,
    nextTick,
    onBeforeUnmount,
    onMounted,
    unref,
    watch,
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
    // immediate=false 时用于跳过 observe 触发的首次回调。
    // 注意：@juggle/resize-observer 对 display:none 元素 observe() 时不派发初始回调，
    // 首次回调可能延迟到元素真正显示、尺寸发生变化时才到达（此时是唯一一次有效回调）。
    // 因此不能只依赖"吞掉第一次"的计数，还要忽略初始回调中与 observe 时相同的零尺寸，
    // 否则隐藏挂载（如 Modal 内）场景下唯一一次真实回调会被误吞 (#716)。
    let hasInitialLayout = false;
    const handleResize: ResizeObserverCallback = (...params) => {
        if (disabledRef.value) {
            return;
        }
        const entry = params[0]?.[0];
        const { width = 0, height = 0 } = entry?.contentRect || {};
        if (!immediate) {
            if (!hasInitialLayout) {
                hasInitialLayout = true;
                // 元素从未有过有效布局（挂载时不可见），跳过零尺寸的初始回调
                if (width === 0 && height === 0) {
                    return;
                }
                // 拿到的直接是真实尺寸：这是有效的首次回调，继续执行
            } else {
                return;
            }
        }
        hasInitialLayout = true;
        callback?.(...params);
    };

    const ro = new ResizeObserver(handleResize);

    let observedDom: HTMLElement = null;

    const handle = (dom: HTMLElement) => {
        if (observedDom) {
            ro.unobserve(observedDom);
        }
        if (dom) {
            try {
                ro.observe(dom);
                observedDom = dom;
            } catch (err) {
                console.warn(
                    '[useResize] observe dom fail, dom:',
                    dom,
                    ' dom.parentNode:',
                    dom.parentNode,
                    ' error:',
                    err,
                );
            }
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
        if (observedDom) {
            ro.unobserve(observedDom);
        }
        ro.disconnect();
        observedDom = null;
    });
};
