import { type Ref, isRef, onBeforeUnmount, ref, watch } from 'vue';

interface EscEntry {
    /** 消费 Esc 的动作 */
    handler: (event: KeyboardEvent) => void;
    /** 当前是否允许被 Esc 关闭（escClosable 的实时取值） */
    isClosable: () => boolean;
}

/**
 * Esc 关闭弹层的层栈仲裁：
 * 多个弹层同开时（Modal 上再开 Drawer），只有最后打开（栈顶）
 * 的弹层响应 Esc，避免一次 Esc 关闭全部弹层。
 *
 * 入栈时机只看「是否打开」，不看 escClosable。
 * 否则下层弹层重新开启 escClosable 时会被 push 到栈顶，
 * 抢走本该由上层弹层消费的 Esc。
 */
const escStack: EscEntry[] = [];

export default function useEsc(
    action: (event: KeyboardEvent) => void,
    escClosable: Ref<boolean> = ref(true),
    open?: Ref<boolean>,
) {
    const entry: EscEntry = {
        handler: action,
        isClosable: () => escClosable.value,
    };

    const onGlobalKeyDown = (event: KeyboardEvent) => {
        if (event.code !== 'Escape') {
            return;
        }
        // 只有栈顶弹层消费 Esc：栈顶不可关闭时直接吞掉，
        // 不下沉给下层弹层（用户看到的是最上层）
        if (escStack[escStack.length - 1] !== entry) {
            return;
        }
        if (entry.isClosable()) {
            action(event);
        }
    };

    const isOpen = () => (isRef(open) ? Boolean(open.value) : true);

    const syncListener = () => {
        if (isOpen()) {
            if (!escStack.includes(entry)) {
                escStack.push(entry);
            }
            window.addEventListener('keydown', onGlobalKeyDown);
        } else {
            const idx = escStack.indexOf(entry);
            if (idx !== -1) {
                escStack.splice(idx, 1);
            }
            window.removeEventListener('keydown', onGlobalKeyDown);
        }
    };

    if (isRef(open)) {
        // 只在 open 变化时增删栈；escClosable 由 isClosable 实时读取，
        // 避免它翻转时打乱层栈顺序
        watch(open, syncListener, { immediate: true });
    } else {
        syncListener();
    }

    onBeforeUnmount(() => {
        const idx = escStack.indexOf(entry);
        if (idx !== -1) {
            escStack.splice(idx, 1);
        }
        window.removeEventListener('keydown', onGlobalKeyDown);
    });
}
