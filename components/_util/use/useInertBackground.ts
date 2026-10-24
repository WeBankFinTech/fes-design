import { type Ref, onBeforeUnmount, watch } from 'vue';
import { FOCUS_SCOPE_ATTR } from './useFocusTrap';

/**
 * 弹层背景隔离：
 * `aria-modal="true"` 要求弹层之外的内容对辅助技术不可达。
 * 这里给 body 下不属于栈顶弹层的兄弟节点加 `inert` + `aria-hidden="true"`，
 * 关闭后按原值还原。
 */

/** 播报区域不能被隐藏，否则 Message / Notification 不再朗读 */
const LIVE_REGION_SELECTOR = '[aria-live], [role="alert"], [role="status"], [role="log"]';

/** 这些标签无渲染内容，跳过即可 */
const IGNORE_TAGS = [
    'SCRIPT',
    'STYLE',
    'LINK',
    'META',
    'TEMPLATE',
    'NOSCRIPT',
    'TITLE',
    'BASE',
];

interface InertEntry {
    getContainer: () => HTMLElement | null | undefined;
}

/** 打开顺序栈：只有栈顶弹层决定背景隔离范围 */
const stack: InertEntry[] = [];

/** 被标记的元素及其原始属性值，用于还原 */
const marked = new Map<
    HTMLElement,
    { inert: boolean; ariaHidden: string | null }
>();

function unmarkAll() {
    marked.forEach((previous, element) => {
        if (previous.inert) {
            element.setAttribute('inert', '');
        } else {
            element.removeAttribute('inert');
        }
        if (previous.ariaHidden === null) {
            element.removeAttribute('aria-hidden');
        } else {
            element.setAttribute('aria-hidden', previous.ariaHidden);
        }
    });
    marked.clear();
}

function isSkipped(element: Element, top: HTMLElement) {
    if (!(element instanceof HTMLElement) || IGNORE_TAGS.includes(element.tagName)) {
        return true;
    }
    // 栈顶弹层自身（含其遮罩所在的 Teleport 根节点）
    if (element.contains(top)) {
        return true;
    }
    // 播报区域。只看节点自身是否带 live 语义，不看后代：
    // 应用根节点里常有 role="alert" 的表单错误，若按后代判断，
    // 整个应用根节点都会被豁免，背景隔离静默失效。
    // Message / Notification 的容器是 body 直接子节点，自身带 live 语义即可豁免。
    if (element.matches(LIVE_REGION_SELECTOR)) {
        return true;
    }
    // 浮层内容（Teleport 到 body 的 Popper）：弹层内打开的下拉面板必须保持可交互。
    // Popper 的 Teleport 根节点就是带标记的节点本身（见 lazyTeleport），
    // 同样只看自身，避免把「内含内联浮层」的容器整体豁免。
    if (element.matches(`[${FOCUS_SCOPE_ATTR}]`)) {
        return true;
    }
    return false;
}

function syncInert() {
    unmarkAll();
    const top = stack[stack.length - 1]?.getContainer?.();
    if (!top?.isConnected) {
        return;
    }
    // 以 body 为扫描根：弹层自身的 Teleport 根节点整体跳过，
    // 遮罩点击关闭不受影响；getContainer 指向自定义节点时同样成立
    Array.from(document.body.children).forEach((element) => {
        if (isSkipped(element, top)) {
            return;
        }
        marked.set(element as HTMLElement, {
            inert: element.hasAttribute('inert'),
            ariaHidden: element.getAttribute('aria-hidden'),
        });
        element.setAttribute('inert', '');
        element.setAttribute('aria-hidden', 'true');
    });
}

export default function useInertBackground(
    containerRef: Ref<HTMLElement | null | undefined>,
    open: Ref<boolean>,
) {
    // SSR 无 DOM，跳过
    if (typeof window === 'undefined') {
        return;
    }

    let disposed = false;
    const entry: InertEntry = { getContainer: () => containerRef.value };

    // 摘除标记：关闭与卸载都必须同步完成。
    // focus trap 在关闭时会归还焦点，若归还目标仍在 inert 子树内，
    // focus() 会静默失败，触发元素拿不回焦点。
    const release = () => {
        const idx = stack.indexOf(entry);
        if (idx !== -1) {
            stack.splice(idx, 1);
        }
        syncInert();
    };

    watch(
        open,
        (isOpen) => {
            if (!isOpen) {
                release();
                return;
            }
            // 打开：等 focus trap 完成初始聚焦后再标记。
            // 否则 inert 会让触发元素立刻失焦，焦点归还目标丢失。
            // 用宏任务而非 nextTick：focus trap 的 setup 内部也 await nextTick，
            // 只靠 nextTick 无法保证顺序。
            setTimeout(() => {
                if (disposed || !open.value || stack.includes(entry)) {
                    return;
                }
                stack.push(entry);
                syncInert();
            }, 0);
        },
        { flush: 'sync' },
    );

    onBeforeUnmount(() => {
        disposed = true;
        release();
    });
}
