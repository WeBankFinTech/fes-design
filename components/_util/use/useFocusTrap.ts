import { type Ref, nextTick, onBeforeUnmount, watch } from 'vue';

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'iframe',
    'object',
    'embed',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable]:not([contenteditable="false"])',
]
    .map((selector) => `${selector}:not([inert])`)
    .join(',');

/**
 * 浮层焦点作用域标记：Popper 内容挂在 body 上（Teleport），
 * 不在弹层容器的 DOM 子树内。焦点进入这类浮层时，
 * 弹层的 Tab 圈闭必须放行，否则会把焦点从浮层里拽回弹层。
 */
export const FOCUS_SCOPE_ATTR = 'data-fes-focus-scope';

function isInFocusScope(element: Element | null): boolean {
    return Boolean(element?.closest?.(`[${FOCUS_SCOPE_ATTR}]`));
}

function isFocusable(element: HTMLElement): boolean {
    if (element === document.activeElement) {
        return true;
    }
    // 排除隐藏元素：display:none（尺寸为 0）、hidden / aria-hidden 子树
    if (
        (element.offsetWidth <= 0 && element.offsetHeight <= 0)
        || element.closest('[hidden], [aria-hidden="true"]')
    ) {
        return false;
    }
    return window.getComputedStyle(element).visibility !== 'hidden';
}

function getFocusableChildren(container: HTMLElement): HTMLElement[] {
    if (!container) {
        return [];
    }
    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(isFocusable);
}

/**
 * 焦点圈闭的层栈仲裁：
 * 多个弹层叠放时（Modal 上再开 Drawer），只有栈顶（最后打开）
 * 的 trap 响应 Tab，避免多个 trap 同时拉焦造成抖动。
 */
type Trap = (event: KeyboardEvent) => void;
const trapStack: Trap[] = [];

function isStackTop(trap: Trap) {
    return trapStack[trapStack.length - 1] === trap;
}

/**
 * 弹层焦点管理（参考 element-plus el-focus-trap / antd vc-dialog）：
 * - 打开时记录此前焦点，关闭后归还（若归还目标已被移出 DOM 则放弃）
 * - 打开时初始聚焦（data-autofocus 元素优先，否则首个可聚焦元素）
 * - Tab 在弹层内圈闭（focus trap），Shift+Tab 循环到末尾
 * - 焦点位于 Popper 浮层（Teleport 到 body）时不干预
 */
export default function useFocusTrap(
    containerRef: Ref<HTMLElement | null | undefined>,
    open: Ref<boolean>,
) {
    // SSR 无 DOM，跳过焦点管理
    if (typeof window === 'undefined') {
        return;
    }

    let restoreFocusEl: HTMLElement | null = null;

    const trap: Trap = (event) => {
        if (event.key !== 'Tab') {
            return;
        }
        // 仅栈顶弹层圈闭焦点；下层弹层的 trap 不动作
        if (!isStackTop(trap)) {
            return;
        }
        const container = containerRef.value;
        if (!container) {
            return;
        }
        const active = document.activeElement;
        // 焦点在浮层内（且该浮层不在弹层子树内）：交给浏览器处理，
        // 不抢焦。否则 Modal 内的 Select / DatePicker 浮层按 Tab 会失焦。
        if (isInFocusScope(active) && !container.contains(active)) {
            return;
        }
        const focusableChildren = getFocusableChildren(container);
        if (!focusableChildren.length) {
            // 无可聚焦元素时，保持在容器上，避免焦点逃逸到 body
            event.preventDefault();
            container.focus();
            return;
        }
        const first = focusableChildren[0];
        const last = focusableChildren[focusableChildren.length - 1];
        if (event.shiftKey) {
            if (active === first || !container.contains(active)) {
                event.preventDefault();
                last.focus();
            }
        } else if (active === last || !container.contains(active)) {
            event.preventDefault();
            first.focus();
        }
    };

    const setup = async () => {
        await nextTick();
        // 等待期间弹层可能已经关闭：此时不能再注册，
        // 否则残留 trap 会霸占层栈栈顶并抢焦
        if (!open.value) {
            return;
        }
        const container = containerRef.value;
        if (!container) {
            return;
        }
        // 记录打开前的焦点：若此刻焦点已在本弹层容器内（如
        // displayDirective=if 下 DOM 随挂载移动），则无可归还目标
        restoreFocusEl = document.activeElement as HTMLElement | null;
        if (restoreFocusEl && container.contains(restoreFocusEl)) {
            restoreFocusEl = null;
        }
        if (!trapStack.includes(trap)) {
            trapStack.push(trap);
        }
        window.addEventListener('keydown', trap, true);
        // 初始聚焦：仅在焦点不在容器内时聚焦（避免与命令式
        // 连续开关弹窗、按钮节流等交互抢焦）
        if (!container.contains(document.activeElement)) {
            const autofocusEl = container.querySelector<HTMLElement>(
                '[data-autofocus]',
            );
            (autofocusEl || getFocusableChildren(container)[0] || container)
                .focus?.();
        }
    };

    const teardown = () => {
        const idx = trapStack.indexOf(trap);
        if (idx !== -1) {
            trapStack.splice(idx, 1);
        }
        window.removeEventListener('keydown', trap, true);
        // 归还焦点：仅当归还目标仍在文档中；若归还后焦点会脱离当前
        // 交互上下文（如命令式 API 连续开关弹窗），保持现状更稳妥——
        // 只有焦点还落在（已关闭的）弹层内时才拉回
        const container = containerRef.value;
        if (
            restoreFocusEl
            && document.contains(restoreFocusEl)
            && (!document.activeElement
                || !container
                || container.contains(document.activeElement)
                || document.activeElement === document.body)
        ) {
            restoreFocusEl.focus?.();
        }
        restoreFocusEl = null;
    };

    watch(
        open,
        (isOpen) => {
            if (isOpen) {
                setup();
            } else {
                teardown();
            }
        },
        { immediate: true },
    );

    onBeforeUnmount(() => {
        teardown();
    });
}
