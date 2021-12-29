import type { ObjectDirective } from 'vue';

import normalizeWheel from 'normalize-wheel';

const isFirefox =
    typeof navigator !== 'undefined' &&
    navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

type NormalizeWheel = ReturnType<typeof normalizeWheel>;

const mousewheel = function (
    element: HTMLElement,
    callback?: (event: Event, normalized: NormalizeWheel) => void,
) {
    if (element && element.addEventListener) {
        const fn = (event: Event) => {
            const normalized = normalizeWheel(event);
            callback && callback(event, normalized);
        };
        if (isFirefox) {
            element.addEventListener('DOMMouseScroll', fn);
        } else {
            // TODO: chrome 61 才支持标准的 wheel 事件，暂且这么实现
            (element as any).onmousewheel = fn;
        }
    }
};

const Mousewheel: ObjectDirective = {
    beforeMount(el, binding) {
        mousewheel(el, binding.value);
    },
};

export default Mousewheel;
