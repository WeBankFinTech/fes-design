import { requestAnimationFrame } from './utils';

// 将元素滚动到指定位置
export default function scrollTo(
    element: HTMLElement,
    to: number,
    duration: number,
) {
    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }
    const difference = to - element.scrollTop;
    const perTick = (difference / duration) * 10;
    requestAnimationFrame(() => {
        element.scrollTop += perTick;
        if (element.scrollTop === to) {
            return;
        }
        scrollTo(element, to, duration - 10);
    });
}
