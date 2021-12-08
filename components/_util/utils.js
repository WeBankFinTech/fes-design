import { isNumber, isString } from 'lodash-es';

export const noop = () => { };

export const sleep = time => new Promise((resolve) => {
    setTimeout(resolve, time);
});

export const hasOwn = (val, key) => hasOwnProperty.call(val, key);

export const addUnit = (val) => {
    if (isNumber(val)) {
        return `${val}px`;
    }
    if (isString(val)) return val;

    return null;
};

export const requestAnimationFrame = (() => {
    const hackRAF = function (func) {
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
