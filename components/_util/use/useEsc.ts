import { isRef, onBeforeUnmount, watch, ref, type Ref } from 'vue';

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

    // 性能优化，减少事件触发次数
    if (isRef(open)) {
        watch(open, () => {
            if (open.value) {
                escClosable.value &&
                    window.addEventListener('keydown', onGlobalKeyDown);
            } else {
                window.removeEventListener('keydown', onGlobalKeyDown);
            }
        });
    }

    watch(
        escClosable,
        () => {
            if (escClosable.value) {
                window.addEventListener('keydown', onGlobalKeyDown);
            } else {
                window.removeEventListener('keydown', onGlobalKeyDown);
            }
        },
        {
            immediate: true,
        },
    );

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onGlobalKeyDown);
    });
}
