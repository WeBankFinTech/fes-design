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

function getFocusableChildren(container: HTMLElement): HTMLElement[] {
    if (!container) {
        return [];
    }
    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    ).filter(
        (element) =>
            element.offsetWidth > 0
            || element.offsetHeight > 0
            || element === document.activeElement,
    );
}

/**
 * 弹层焦点管理（参考 element-plus el-focus-trap / antd vc-dialog）：
 * - 打开时记录此前焦点，关闭后归还
 * - Tab 在弹层内圈闭（focus trap），Shift+Tab 循环到末尾
 * - 打开时初始聚焦（data-autofocus 元素优先，否则首个可聚焦元素）
 */
export default function useFocusTrap(
    containerRef: Ref<HTMLElement | undefined>,
    open: Ref<boolean>,
) {
    // SSR 无 DOM，跳过焦点管理
    if (typeof window === 'undefined') {
        return;
    }

    let restoreFocusEl: HTMLElement | null = null;

    const trap = (event: KeyboardEvent) => {
        if (event.key !== 'Tab') {
            return;
        }
        const container = containerRef.value;
        if (!container) {
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
        const active = document.activeElement;
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
        const container = containerRef.value;
        if (!container) {
            return;
        }
        restoreFocusEl = document.activeElement as HTMLElement | null;
        window.addEventListener('keydown', trap, true);
        const autofocusEl = container.querySelector<HTMLElement>('[data-autofocus]');
        (autofocusEl || getFocusableChildren(container)[0] || container).focus?.();
    };

    const teardown = () => {
        window.removeEventListener('keydown', trap, true);
        if (restoreFocusEl && document.contains(restoreFocusEl)) {
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
