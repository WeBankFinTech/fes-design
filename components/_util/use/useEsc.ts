import { type Ref, isRef, onBeforeUnmount, ref, watch } from 'vue';
import { isServer } from '../isServer';

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

    // SSR：无 window，跳过监听注册（客户端激活后 watch 变化会重新注册）
    if (isServer) {
        return;
    }

    // 性能优化，减少事件触发次数
    if (isRef(open)) {
        watch(open, () => {
            if (open.value) {
                escClosable.value
                && window.addEventListener('keydown', onGlobalKeyDown);
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
