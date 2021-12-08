import {
    isRef, onBeforeUnmount, onMounted, watch,
} from 'vue';

export default function useEsc(action, open) {
    const onGlobalKeyDown = (event) => {
        const which = event.which || event.keyCode;
        if (which === 27) {
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
