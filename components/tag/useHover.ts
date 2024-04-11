import { ref } from 'vue';

export function useHover() {
    const isHover = ref(false);

    const mouseCloseEnter = () => {
        isHover.value = true;
    };

    const mouseCloseLeave = () => {
        isHover.value = false;
    };

    return {
        isHover,
        mouseCloseEnter,
        mouseCloseLeave,
    };
}
