import { camelize } from '@vue/shared';

/* istanbul ignore next */
export function hasClass(el: HTMLElement, cls: string) {
    if (!el || !cls) return false;
    if (cls.indexOf(' ') !== -1)
        throw new Error('className should not contain space.');
    if (el.classList) {
        return el.classList.contains(cls);
    }
    return ` ${el.className} `.indexOf(` ${cls} `) > -1;
}

/* istanbul ignore next */
export function addClass(el: HTMLElement, cls: string) {
    if (!el) return;
    let curClass = el.className;
    const classes = (cls || '').split(' ');

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.add(clsName);
        } else if (!hasClass(el, clsName)) {
            curClass += ` ${clsName}`;
        }
    }
    if (!el.classList) {
        el.className = curClass;
    }
}

/* istanbul ignore next */
export function removeClass(el: HTMLElement, cls: string) {
    if (!el || !cls) return;
    const classes = cls.split(' ');
    let curClass = ` ${el.className} `;

    for (let i = 0, j = classes.length; i < j; i++) {
        const clsName = classes[i];
        if (!clsName) continue;

        if (el.classList) {
            el.classList.remove(clsName);
        } else if (hasClass(el, clsName)) {
            curClass = curClass.replace(` ${clsName} `, ' ');
        }
    }
    if (!el.classList) {
        el.className = curClass.trim();
    }
}

/* istanbul ignore next */
// Here I want to use the type CSSProperties, but the definition for CSSProperties
// has { [index: number]: string } in its type annotation, which does not satisfy the method
// camelize(s: string)
// Same as the return type
export const getStyle = function (element: HTMLElement, styleName: string) {
    if (!element || !styleName) return '';
    styleName = camelize(styleName);
    if (styleName === 'float') {
        styleName = 'cssFloat';
    }
    try {
        const style = element.style[styleName as any];
        if (style) return style;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const computed = document.defaultView!.getComputedStyle(element, '');
        return computed ? computed[styleName as any] : '';
    } catch (e) {
        return element.style[styleName as any];
    }
};

let scrollBarWidth: number;
export function getScrollBarWidth() {
    if (scrollBarWidth || scrollBarWidth === 0) return scrollBarWidth;
    const outer = document.createElement('div');
    outer.className = 'el-scrollbar__wrap';
    outer.style.visibility = 'hidden';
    outer.style.width = '100px';
    outer.style.position = 'absolute';
    outer.style.top = '-9999px';
    document.body.appendChild(outer);

    const widthNoScroll = outer.offsetWidth;
    outer.style.overflow = 'scroll';

    const inner = document.createElement('div');
    inner.style.width = '100%';
    outer.appendChild(inner);

    const widthWithScroll = inner.offsetWidth;
    outer.parentNode?.removeChild(outer);
    scrollBarWidth = widthNoScroll - widthWithScroll;

    return scrollBarWidth;
}

export function isHtmlElement(el: any) {
    return el && el.nodeType === Node.ELEMENT_NODE;
}

export function isScroll(el: HTMLElement, isVertical?: boolean) {
    const hasDirection = isVertical ?? '';
    const overflow = hasDirection
        ? isVertical
            ? getStyle(el, 'overflow-y')
            : getStyle(el, 'overflow-x')
        : getStyle(el, 'overflow');

    return overflow.match(/(scroll|auto|overlay)/);
}

export function getScrollContainer(el: HTMLElement, isVertical?: boolean) {
    let parent: HTMLElement | null = el;

    while (parent) {
        if ([window, document, document.documentElement].includes(parent)) {
            return window;
        }
        if (isScroll(parent, isVertical)) {
            return parent;
        }
        parent = parent.parentNode as HTMLElement;
    }
    return parent;
}

export function isInContainer(el: HTMLElement, container: HTMLElement) {
    // 仅适用从右往左进入视口和从下往上进入视口
    if (!el || !container) return false;

    const elRect = el.getBoundingClientRect();

    let containerRect;

    if (container instanceof Element) {
        containerRect = container.getBoundingClientRect();
    } else {
        containerRect = {
            top: 0,
            right: window.innerWidth,
            bottom: window.innerHeight,
            left: 0,
        };
    }
    return (
        elRect.top < containerRect.bottom &&
        elRect.bottom > containerRect.top &&
        elRect.right > containerRect.left &&
        elRect.left < containerRect.right
    );
}
