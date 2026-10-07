import { type Ref, isRef, onBeforeUnmount, ref, watch } from 'vue';

export default function useEsc(
    action: (event: KeyboardEvent) => void,
    escClosable: Ref<boolean> = ref(true),
    open?: Ref<boolean>,
) {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            action(event);
        }
    };

    // 是否处于监听状态：传了 open 时仅在 open 期间监听
    const shouldListen = () => {
        if (isRef(open)) {
            return open.value && escClosable.value;
        }
        return escClosable.value;
    };

    const syncListener = () => {
        if (shouldListen()) {
            window.addEventListener('keydown', onGlobalKeyDown);
        } else {
            window.removeEventListener('keydown', onGlobalKeyDown);
        }
    };

    if (isRef(open)) {
        watch([open, escClosable], syncListener, { immediate: true });
    } else {
        watch(escClosable, syncListener, { immediate: true });
    }

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onGlobalKeyDown);
    });
}
