import { type Ref, isRef, onBeforeUnmount, ref, watch } from 'vue';

/**
 * Esc 关闭弹层的层栈仲裁：
 * 多个弹层同开时（Modal 上再开 Drawer），只有最后打开（栈顶）
 * 的弹层响应 Esc，避免一次 Esc 关闭全部弹层。
 */
const escStack: Array<() => void> = [];

function isStackTop(handler: () => void) {
    return escStack[escStack.length - 1] === handler;
}

export default function useEsc(
    action: (event: KeyboardEvent) => void,
    escClosable: Ref<boolean> = ref(true),
    open?: Ref<boolean>,
) {
    const onGlobalKeyDown = (event: KeyboardEvent) => {
        if (event.code === 'Escape') {
            // 仅栈顶弹层消费 Esc，并阻止事件继续传播到下层弹层
            if (isStackTop(onGlobalKeyDown)) {
                event.stopPropagation();
                action(event);
            }
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
            if (!escStack.includes(onGlobalKeyDown)) {
                escStack.push(onGlobalKeyDown);
            }
            window.addEventListener('keydown', onGlobalKeyDown);
        } else {
            const idx = escStack.indexOf(onGlobalKeyDown);
            if (idx !== -1) {
                escStack.splice(idx, 1);
            }
            window.removeEventListener('keydown', onGlobalKeyDown);
        }
    };

    if (isRef(open)) {
        watch([open, escClosable], syncListener, { immediate: true });
    } else {
        watch(escClosable, syncListener, { immediate: true });
    }

    onBeforeUnmount(() => {
        // 卸载清理：无条件出栈并移除监听（不能走 syncListener——
        // 它在 open/escClosable 为 true 时反而会注册）
        const idx = escStack.indexOf(onGlobalKeyDown);
        if (idx !== -1) {
            escStack.splice(idx, 1);
        }
        window.removeEventListener('keydown', onGlobalKeyDown);
    });
}
