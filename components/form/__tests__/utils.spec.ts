import { describe, expect, test, vi } from 'vitest';
import { allPromiseFinish, wrapValidator } from '../utils';

describe('wrapValidator', () => {
    test('同步 validator 返回 boolean 原样透传', () => {
        const wrapped = wrapValidator(() => false, false);
        expect(wrapped('x')).toBe(false);
    });

    test('同步 validator 返回 Error / Error 数组透传', () => {
        const err = new Error('bad');
        expect(wrapValidator(() => err, false)('x')).toBe(err);
        const errs = [new Error('a')];
        expect(wrapValidator(() => errs, false)('x')).toBe(errs);
    });

    test('异步 validator 返回 Promise 透传', async () => {
        const wrapped = wrapValidator(async () => false, true);
        const result = wrapped('x');
        expect(typeof result.then).toBe('function');
        await expect(result).resolves.toBe(false);
    });

    test('返回 undefined 视为通过', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapped = wrapValidator(() => undefined, false);
        expect(wrapped('x')).toBe(true);
        spy.mockRestore();
    });

    test('返回不推荐类型时告警并通过', () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // 同步返回字符串 → 告警 boolean 分支
        (wrapValidator(() => 'oops', false) as any)('x');
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spy.mock.calls[0][1]).toContain('`boolean`');
        spy.mockClear();
        // 异步返回字符串 → 告警 Promise 分支
        (wrapValidator(() => 'oops', true) as any)('x');
        expect(spy.mock.calls[0][1]).toContain('`Promise`');
        spy.mockRestore();
    });

    test('validator 抛错时告警并返回 "undefined" 占位', () => {
        const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const error = vi.spyOn(console, 'error').mockImplementation(() => {});
        const wrapped = wrapValidator(() => {
            throw new Error('boom');
        }, false);
        expect(wrapped('x')).toBe('undefined');
        expect(warn).toHaveBeenCalled();
        expect(error).toHaveBeenCalled();
        warn.mockRestore();
        error.mockRestore();
    });
});

describe('allPromiseFinish', () => {
    test('空列表直接 resolve 空数组', async () => {
        await expect(allPromiseFinish([])).resolves.toEqual([]);
    });

    test('全部成功时按原索引收集结果', async () => {
        const result = await allPromiseFinish([
            Promise.resolve('a'),
            new Promise((r) => setTimeout(() => r('b'), 10)),
        ]);
        expect(result).toEqual(['a', 'b']);
    });

    test('任一失败时等全部结束后 reject 结果数组', async () => {
        await expect(
            allPromiseFinish([
                Promise.resolve('ok'),
                Promise.reject(new Error('fail')),
            ]),
        ).rejects.toBeTruthy();
    });
});
