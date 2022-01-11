import { isRef, onBeforeUnmount, onMounted, watch, Ref } from 'vue';

export default function useEsc(action: () => void, open: Ref<boolean>) {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            action();
        }
    };

    // 性能优化，减少事件触发次数
    if (isRef(open)) {
        watch(open, () => {
            if (open.value) {
                window.addEventListener('keydown', onGlobalKeyDown);
            } else {
                window.removeEventListener('keydown', onGlobalKeyDown);
            }
        });
    }

    onMounted(() => {
        window.addEventListener('keydown', onGlobalKeyDown);
    });

    onBeforeUnmount(() => {
        window.removeEventListener('keydown', onGlobalKeyDown);
    });
}
