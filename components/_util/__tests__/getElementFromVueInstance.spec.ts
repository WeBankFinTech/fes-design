import { describe, expect, test } from 'vitest';
import getElementFromVueInstance from '../getElementFromVueInstance';

describe('getElementFromVueInstance', () => {
    test('null/undefined 返回 null', () => {
        expect(getElementFromVueInstance(undefined)).toBeNull();
        expect(getElementFromVueInstance(null as any)).toBeNull();
    });

    test('Text 节点直接返回', () => {
        const text = document.createTextNode('文本');
        expect(getElementFromVueInstance(text)).toBe(text);
    });

    test('HTMLElement 直接返回', () => {
        const el = document.createElement('div');
        expect(getElementFromVueInstance(el)).toBe(el);
    });

    test('SVGElement 直接返回', () => {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg',
        );
        expect(getElementFromVueInstance(svg)).toBe(svg);
    });

    test('Vue 组件实例返回 $el', () => {
        const el = document.createElement('span');
        const comp = { $el: el };
        expect(getElementFromVueInstance(comp as any)).toBe(el);
    });

    test('非法输入抛出错误', () => {
        expect(() => getElementFromVueInstance({} as any)).toThrow();
        expect(() => getElementFromVueInstance(42 as any)).toThrow();
    });
});
