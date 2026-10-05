import type { ComputedRef, Ref } from 'vue';
import { computed, ref } from 'vue';
import { throttle } from 'lodash-es';

export function useAnimate(duration = 300): {
    animating: Ref<boolean>;
    handelAnimate: () => void;
    animateClassName: ComputedRef<string>;
} {
    const animating = ref(false);
    const animateClassName = computed(() =>
        animating.value ? 'is-animate' : '',
    );
    const handelAnimate = throttle(() => {
        if (!animating.value) {
            animating.value = true;
        }
        setTimeout(() => {
            animating.value = false;
        }, duration);
    }, 100);

    return {
        animating,
        handelAnimate,
        animateClassName,
    };
}
