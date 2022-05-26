import { ref } from 'vue';

export function useHover() {
    const isHover = ref(false);

    const mouseCloseOver = () => {
        isHover.value = true;
    };
    const mouseCloseLeave = () => {
        isHover.value = false;
    };

    return {
        isHover,
        mouseCloseOver,
        mouseCloseLeave,
    };
}
