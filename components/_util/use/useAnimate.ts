import { ref, computed } from 'vue';
import { throttle } from 'lodash-es';

export function useAnimate(duration = 300) {
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
