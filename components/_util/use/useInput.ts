import { ref } from 'vue';

export function useInput(updateValue: (val: string) => void) {
    const isComposing = ref(false);
    const handleInput = (event: Event | string) => {
        if (!isComposing.value) {
            if (event instanceof Event) {
                const { value } = event.target as HTMLInputElement;
                updateValue(value);
            } else {
                updateValue(event);
            }
        }
    };
    const handleCompositionStart = () => {
        isComposing.value = true;
    };
    const handleCompositionEnd = (event: Event) => {
        if (isComposing.value) {
            isComposing.value = false;
            handleInput(event);
        }
    };

    return {
        handleInput,
        handleCompositionStart,
        handleCompositionEnd,
    };
}
