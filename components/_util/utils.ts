import { isNumber, isString } from 'lodash-es';
import { Node } from '../cascader-panel/interface';

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

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

export const flatNodes = (nodes: Node[] = [], leafOnly = false) =>
    nodes.reduce((res: Node[], node) => {
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
