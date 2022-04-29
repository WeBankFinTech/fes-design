import { Ref, onMounted, onUnmounted } from 'vue';
import { getScrollParent } from '../_util/utils';

export default function useScroll(
    targetRef: Ref<HTMLElement>,
    onScroll: (e: Event) => void,
) {
    // scroll related
    let scrollableNodes: Array<Element | Document> = [];

    const ensureScrollListener = (): void => {
        let cursor: Element | Document | null = targetRef.value;
        while (true) {
            cursor = getScrollParent(cursor);
            if (cursor === null) break;
            scrollableNodes.push(cursor);
        }
        for (const el of scrollableNodes) {
            el.addEventListener('scroll', onScroll, true);
        }
    };

    const removeScrollListeners = (): void => {
        for (const el of scrollableNodes) {
            el.removeEventListener('scroll', onScroll, true);
        }
        scrollableNodes = [];
    };

    onMounted(() => {
        ensureScrollListener();
    });

    onUnmounted(() => {
        removeScrollListeners();
    });
}
