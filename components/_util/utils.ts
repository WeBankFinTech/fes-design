import { nextTick } from 'vue';

import { isFinite, isNull, isString, isUndefined } from 'lodash-es';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const noopInNoop = () => noop;
export const defaultContainer = () => document.body;

export async function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function asyncExpect(fn: () => void, timeout: number) {
    return new Promise<void>((resolve) => {
        if (typeof timeout === 'number') {
            setTimeout(() => {
                fn();
                resolve();
            }, timeout);
        } else {
            nextTick(() => {
                fn();
                resolve();
            });
        }
    });
}

// in order to test transitions, we need to use
// await rAF() after firing transition events.
export const rAF = async () => {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(async () => {
                resolve(null);
                await nextTick();
            });
        });
    });
};

export const hasOwn = (val: object, key: string) =>
    Object.hasOwnProperty.call(val, key);

export const requestAnimationFrame = (() => {
    const hackRAF = function (func: () => void) {
        return setTimeout(() => {
            func?.();
        }, 10);
    };
    if (typeof window !== 'undefined') {
        return window.requestAnimationFrame || hackRAF;
    }
    return hackRAF;
})();

export const isFirefox = () => !!window.navigator.userAgent.match(/firefox/i);

export const extractPropsDefaultValue = (props: { [key: string]: any }) => {
    const defaultValue: {
        [key: string]: any;
    } = {};
    Object.keys(props).forEach((key) => {
        if (props[key].default) {
            defaultValue[key] = props[key].default;
        }
    });
    return defaultValue;
};

// 10px => 10
export const depx = (value: string | number): number => {
    if (isString(value) && value.endsWith('px')) {
        const formatValue = value.slice(0, value.length - 2);
        if (isFinite(Number(formatValue))) {
            return Number(formatValue);
        }
    }
    if (isFinite(Number(value))) {
        return Number(value);
    }

    console.warn('[depx] 转换失败，原始值为：', value);
    if (isUndefined(value) || isNull(value)) return undefined;
    return value as number;
};

// 10 => 10px
export const pxfy = (value: string | number): string => {
    if (isFinite(value)) {
        return `${value}px`;
    }
    if (isFinite(Number(value))) {
        return `${Number(value)}px`;
    }

    if (isUndefined(value) || isNull(value)) return undefined;
    return value as string;
};

export function getParentNode(node: Node): Node | null {
    // document type
    if (node.nodeType === 9) {
        return null;
    }
    return node.parentNode;
}

export function getScrollParent(
    node: Node | null,
): HTMLElement | Document | null {
    if (node == null) return null;

    const parentNode = getParentNode(node);

    if (parentNode === null) {
        return null;
    }

    // Document
    if (parentNode.nodeType === 9) {
        return document;
    }

    // Element
    if (parentNode.nodeType === 1) {
        // Firefox want us to check `-x` and `-y` variations as well
        const { overflow, overflowX, overflowY } = getComputedStyle(
            parentNode as HTMLElement,
        );
        if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
            return parentNode as HTMLElement;
        }
    }

    return getScrollParent(parentNode);
}

// 比Array.concat快
export function concat(arr: any[], arr2: any[]) {
    const arrLength = arr.length;
    const arr2Length = arr2.length;
    arr.length = arrLength + arr2Length;
    for (let i = 0; i < arr2Length; i++) {
        arr[arrLength + i] = arr2[i];
    }
    return arr;
}
