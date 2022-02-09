import { isNull, isNumber, isString, isUndefined } from 'lodash-es';
import type { CascaderNode } from '../cascader-panel/interface';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};
export const noopInNoop = () => noop;

export const sleep = (time: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, time);
    });

export const hasOwn = (val: object, key: string) =>
    Object.hasOwnProperty.call(val, key);

export const addUnit = (val: number | string) => {
    if (isNumber(val)) {
        return `${val}px`;
    }
    if (isString(val)) return val;

    return null;
};

export const requestAnimationFrame = (() => {
    const hackRAF = function (func: () => void) {
        return setTimeout(() => {
            func && func();
        }, 10);
    };
    if (typeof window !== 'undefined') {
        return window.requestAnimationFrame || hackRAF;
    }
    return hackRAF;
})();

export const isFirefox = () => !!window.navigator.userAgent.match(/firefox/i);

export const flatNodes = (nodes: CascaderNode[] = [], leafOnly = false) =>
    nodes.reduce((res: CascaderNode[], node) => {
        if (node.isLeaf) {
            res.push(node);
        } else {
            !leafOnly && res.push(node);
            res = res.concat(flatNodes(node.children, leafOnly));
        }
        return res;
    }, []);

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
export const depx = (value: string | number) => {
    if (isString(value)) {
        if (value.endsWith('px')) {
            return Number(value.slice(0, value.length - 2));
        }
        return Number(value);
    }
    return value;
};

// 10 => 10px
export const pxfy = (value: string | number) => {
    if (isUndefined(value) || isNull(value)) return undefined;
    if (isNumber(value)) return `${value}px`;
    if (value.endsWith('px')) return value;
    return `${value}px`;
};
