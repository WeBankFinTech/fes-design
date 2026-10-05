import {
    asyncExpect,
    concat,
    defaultContainer,
    degfy,
    depx,
    extractPropsDefaultValue,
    getParentNode,
    getScrollParent,
    hasOwn,
    isFirefox,
    noop,
    noopInNoop,
    pxfy,
    stringify,
} from '../utils';

describe('_util/utils 纯函数', () => {
    describe('noop 系列', () => {
        test('noop 无返回值', () => {
            expect(noop()).toBeUndefined();
        });

        test('noopInNoop 返回 noop 本身', () => {
            expect(noopInNoop()).toBe(noop);
        });

        test('defaultContainer 返回 document.body', () => {
            expect(defaultContainer()).toBe(document.body);
        });
    });

    describe('depx：px 值转数值', () => {
        test('数值字符串 "10px" → 10', () => {
            expect(depx('10px')).toBe(10);
        });

        test('数字 10 → 10', () => {
            expect(depx(10)).toBe(10);
        });

        test('纯数字字符串 "10" → 10', () => {
            expect(depx('10')).toBe(10);
        });

        test('小数 "10.5px" → 10.5', () => {
            expect(depx('10.5px')).toBe(10.5);
        });

        test('负值 "-10px" → -10', () => {
            expect(depx('-10px')).toBe(-10);
        });

        test('0 → 0（falsy 但合法）', () => {
            expect(depx(0)).toBe(0);
        });

        test('undefined/null 统一返回 undefined', () => {
            expect(depx(undefined)).toBeUndefined();
            // 实现语义：isNull 分支同样 return undefined（非原样返回 null）
            expect(depx(null)).toBeUndefined();
        });

        test('非法字符串走 console.warn 并原样返回', () => {
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
            expect(depx('abc')).toBe('abc');
            expect(warn).toHaveBeenCalledTimes(1);
            warn.mockRestore();
        });

        test('"px" 命中实现怪癖：Number("") === 0，返回 0 而非 warn', () => {
            // 'px'.slice 去掉后缀得 ''，Number('') === 0 是 finite → 走数字分支返回 0
            // 锁定该怪癖行为（若未来修复此处，此用例提醒同步调整）
            expect(depx('px')).toBe(0);
        });
    });

    describe('pxfy：数值转 px 字符串', () => {
        test('数字 10 → "10px"', () => {
            expect(pxfy(10)).toBe('10px');
        });

        test('数字字符串 "10" → "10px"', () => {
            expect(pxfy('10')).toBe('10px');
        });

        test('小数 10.5 → "10.5px"', () => {
            expect(pxfy(10.5)).toBe('10.5px');
        });

        test('0 → "0px"', () => {
            expect(pxfy(0)).toBe('0px');
        });

        test('undefined/null 统一返回 undefined', () => {
            expect(pxfy(undefined)).toBeUndefined();
            expect(pxfy(null)).toBeUndefined();
        });

        test('已是 px 字符串原样返回', () => {
            expect(pxfy('10px')).toBe('10px');
        });

        test('非法字符串原样返回', () => {
            expect(pxfy('abc')).toBe('abc');
        });
    });

    describe('degfy：数值转 deg 字符串', () => {
        test('数字 90 → "90deg"', () => {
            expect(degfy(90)).toBe('90deg');
        });

        test('数字字符串 "90" → "90deg"', () => {
            expect(degfy('90')).toBe('90deg');
        });

        test('已带 deg 后缀原样返回', () => {
            expect(degfy('90deg')).toBe('90deg');
        });

        test('非法值抛错（越界防护）', () => {
            expect(() => degfy('abc')).toThrow(/Invalid deg/);
        });
    });

    describe('hasOwn', () => {
        test('自有属性 true', () => {
            expect(hasOwn({ a: 1 }, 'a')).toBe(true);
        });

        test('原型链属性 false', () => {
            expect(hasOwn(Object.create({ a: 1 }), 'a')).toBe(false);
        });

        test('不存在的属性 false', () => {
            expect(hasOwn({ a: 1 }, 'b')).toBe(false);
        });
    });

    describe('isFirefox', () => {
        test('jsdom（非 Firefox）返回 false', () => {
            expect(isFirefox()).toBe(false);
        });

        test('Firefox UA 返回 true', () => {
            const origin = window.navigator.userAgent;
            Object.defineProperty(window.navigator, 'userAgent', {
                value: 'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
                configurable: true,
            });
            expect(isFirefox()).toBe(true);
            Object.defineProperty(window.navigator, 'userAgent', {
                value: origin,
                configurable: true,
            });
        });
    });

    describe('extractPropsDefaultValue', () => {
        test('仅收集 truthy default 的 prop（null 同样被过滤）', () => {
            expect(
                extractPropsDefaultValue({
                    a: { default: 1 },
                    b: { type: String },
                    c: { default: null },
                }),
            ).toEqual({ a: 1 });
        });

        test('default 为 false 的 falsy 值不被收集（实现按 truthy 判断）', () => {
            expect(
                extractPropsDefaultValue({
                    a: { default: false },
                    b: { default: 0 },
                }),
            ).toEqual({});
        });

        test('空对象返回空对象', () => {
            expect(extractPropsDefaultValue({})).toEqual({});
        });
    });

    describe('concat：原地拼接（比 Array.concat 快）', () => {
        test('拼接两数组且返回同一引用', () => {
            const a = [1, 2];
            const b = [3, 4];
            const result = concat(a, b);
            expect(result).toBe(a);
            expect(a).toEqual([1, 2, 3, 4]);
        });

        test('拼接空数组', () => {
            expect(concat([], [])).toEqual([]);
            expect(concat([1], [])).toEqual([1]);
            expect(concat([], [2])).toEqual([2]);
        });

        test('保留稀疏位置', () => {
            const a: any[] = [1];
            a.length = 3;
            concat(a, [4]);
            expect(a.length).toBe(4);
            expect(a[3]).toBe(4);
        });
    });

    describe('stringify：安全 JSON 序列化', () => {
        test('普通对象', () => {
            expect(stringify({ a: 1 })).toBe('{"a":1}');
        });

        test('循环引用走 onError 并返回 fallback', () => {
            const obj: any = {};
            obj.self = obj;
            const onError = vi.fn();
            expect(stringify(obj, onError)).toBe('');
            expect(onError).toHaveBeenCalledTimes(1);
        });

        test('自定义 fallbackValue', () => {
            const obj: any = {};
            obj.self = obj;
            expect(stringify(obj, undefined, 'fallback')).toBe('fallback');
        });

        test('undefined 序列化为 undefined 字符串（JSON 语义）', () => {
            expect(stringify(undefined)).toBe(undefined);
        });
    });

    describe('getParentNode / getScrollParent', () => {
        test('document 节点返回 null（nodeType 9）', () => {
            expect(getParentNode(document)).toBeNull();
        });

        test('普通元素返回 parentNode', () => {
            const div = document.createElement('div');
            const span = document.createElement('span');
            div.appendChild(span);
            expect(getParentNode(span)).toBe(div);
        });

        test('null 入参返回 null', () => {
            expect(getScrollParent(null)).toBeNull();
        });

        test('向上找到 document（无可滚动祖先）', () => {
            const div = document.createElement('div');
            document.body.appendChild(div);
            expect(getScrollParent(div)).toBe(document);
            document.body.removeChild(div);
        });

        test('overflow 滚动容器被识别', () => {
            const outer = document.createElement('div');
            const inner = document.createElement('div');
            outer.appendChild(inner);
            document.body.appendChild(outer);
            Object.defineProperty(outer, 'overflow', { value: 'auto', configurable: true });
            // jsdom getComputedStyle 读不到运行时 defineProperty 的 overflow，
            // 用 style 属性声明（getComputedStyle 可识别）
            outer.style.overflow = 'auto';
            expect(getScrollParent(inner)).toBe(outer);
            document.body.removeChild(outer);
        });
    });

    describe('asyncExpect', () => {
        test('无 timeout 走 nextTick', async () => {
            let called = false;
            await asyncExpect(() => {
                called = true;
            });
            expect(called).toBe(true);
        });

        test('timeout 走 setTimeout', async () => {
            let called = false;
            await asyncExpect(
                () => {
                    called = true;
                },
                10,
            );
            expect(called).toBe(true);
        });
    });
});
