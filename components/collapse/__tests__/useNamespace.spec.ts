import { describe, expect, test } from 'vitest';
import { defaultNamespace, useNamespace } from '../useNamespace';

describe('useNamespace BEM 工具', () => {
    const ns = useNamespace('collapse');

    test('b 生成块名与块后缀', () => {
        expect(ns.b()).toBe(`${defaultNamespace}-collapse`);
        expect(ns.b('item')).toBe(`${defaultNamespace}-collapse-item`);
    });

    test('e 生成元素名，缺省返回空串', () => {
        expect(ns.e('header')).toBe(`${defaultNamespace}-collapse__header`);
        expect(ns.e()).toBe('');
        expect(ns.e(undefined)).toBe('');
    });

    test('m 生成修饰名，缺省返回空串', () => {
        expect(ns.m('active')).toBe(`${defaultNamespace}-collapse--active`);
        expect(ns.m()).toBe('');
    });

    test('be 块后缀+元素', () => {
        expect(ns.be('item', 'wrap')).toBe(
            `${defaultNamespace}-collapse-item__wrap`,
        );
        expect(ns.be('', 'wrap')).toBe('');
        expect(ns.be('item', '')).toBe('');
    });

    test('em 元素+修饰', () => {
        expect(ns.em('header', 'open')).toBe(
            `${defaultNamespace}-collapse__header--open`,
        );
        expect(ns.em('', 'open')).toBe('');
        expect(ns.em('header', '')).toBe('');
    });

    test('bm 块后缀+修饰', () => {
        expect(ns.bm('item', 'last')).toBe(
            `${defaultNamespace}-collapse-item--last`,
        );
        expect(ns.bm('', 'last')).toBe('');
        expect(ns.bm('item', '')).toBe('');
    });

    test('bem 完整三段', () => {
        expect(ns.bem('item', 'wrap', 'active')).toBe(
            `${defaultNamespace}-collapse-item__wrap--active`,
        );
        expect(ns.bem('item', '', 'active')).toBe('');
        expect(ns.bem('', 'wrap', 'active')).toBe('');
        expect(ns.bem('item', 'wrap', '')).toBe('');
    });

    test('is 状态类', () => {
        expect(ns.is('active')).toBe('is-active');
        expect(ns.is('active', true)).toBe('is-active');
        expect(ns.is('active', false)).toBe('');
        expect(ns.is('active', undefined)).toBe('');
        expect(ns.is('', true)).toBe('');
    });
});
