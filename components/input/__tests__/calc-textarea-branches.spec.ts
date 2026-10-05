import { afterEach, describe, expect, test, vi } from 'vitest';
import calcTextareaHeight from '../calcTextareaHeight';

/**
 * calcTextareaHeight 纯计算分支补全（border-box / content-box / padding-box / minRows=null）。
 *
 * jsdom 无布局引擎：真正测量 hidden textarea 高度恒为 0，因此
 * 1) 桩 HTMLTextareaElement.prototype.scrollHeight：
 *    有内容时 120（内容行高），清空后 50（单行高）—— 稳定、可手算断言；
 * 2) 桩 window.getComputedStyle 返回可控的 box-sizing/padding/border。
 * 期望值全部按源码公式手算（padding=8px，border=2px）。
 */

/** content 行高 120、空行高 50 */
const stubScrollHeight = () => {
    Object.defineProperty(HTMLTextAreaElement.prototype, 'scrollHeight', {
        configurable: true,
        get() {
            return (this as HTMLTextAreaElement).value ? 120 : 50;
        },
    });
};

const stubComputedStyle = (map: Record<string, string>) => {
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
        getPropertyValue: (name: string) => map[name] ?? '',
    } as CSSStyleDeclaration);
};

afterEach(() => {
    // @ts-expect-error 复原原型访问器
    delete HTMLTextAreaElement.prototype.scrollHeight;
    vi.restoreAllMocks();
    // calcTextareaHeight 每次调用后都会移除 hidden textarea 并置空引用
});

describe('calcTextareaHeight 高度计算分支', () => {
    test('border-box：高度加 border，min/max 行高含 padding+border', () => {
        stubScrollHeight();
        stubComputedStyle({
            'box-sizing': 'border-box',
            'padding-top': '4px',
            'padding-bottom': '4px',
            'border-top-width': '1px',
            'border-bottom-width': '1px',
        });
        const el = document.createElement('textarea');
        el.value = '两行内容';
        const result = calcTextareaHeight(el, 2, 4);
        // height = 120 + 2(border) = 122；minHeight = 42*2 + 8 + 2 = 94；
        // maxHeight = 42*4 + 8 + 2 = 178 → min(122, 178) = 122
        expect(result.height).toBe('122px');
        expect(result.minHeight).toBe('94px');
    });

    test('content-box：高度减 padding，min 行高不含 padding', () => {
        stubScrollHeight();
        stubComputedStyle({
            'box-sizing': 'content-box',
            'padding-top': '4px',
            'padding-bottom': '4px',
            'border-top-width': '1px',
            'border-bottom-width': '1px',
        });
        const el = document.createElement('textarea');
        el.value = '两行内容';
        const result = calcTextareaHeight(el);
        // height = 120 - 8(padding) = 112；minHeight = 42*1 = 42
        expect(result.height).toBe('112px');
        expect(result.minHeight).toBe('42px');
    });

    test('padding-box（既非 border 亦非 content）且 minRows=null：不调整、无 minHeight', () => {
        stubScrollHeight();
        stubComputedStyle({
            'box-sizing': 'padding-box',
            'padding-top': '4px',
            'padding-bottom': '4px',
            'border-top-width': '1px',
            'border-bottom-width': '1px',
        });
        const el = document.createElement('textarea');
        el.placeholder = '占位文本走 placeholder 兜底';
        // value 为空 → hidden textarea 取 placeholder → 内容行高 120
        const result = calcTextareaHeight(el, null, 3);
        // height 恒为 120（无任何 box-sizing 调整）；maxHeight = 42*3 = 126 → min(126,120)=120
        expect(result.height).toBe('120px');
        // minRows=null 时不下发 minHeight
        expect('minHeight' in result).toBe(false);
    });

    test('内容高度小于最小行高时取 minHeight（Math.max 分支）', () => {
        stubScrollHeight();
        stubComputedStyle({
            'box-sizing': 'content-box',
            'padding-top': '4px',
            'padding-bottom': '4px',
        });
        const el = document.createElement('textarea');
        el.value = '一行';
        const result = calcTextareaHeight(el, 5);
        // height=112 < minHeight = 42*5 = 210 → 取 210
        expect(result.height).toBe('210px');
        expect(result.minHeight).toBe('210px');
    });
});

// 未覆盖说明：`if (!hiddenTextarea)` 的 false 分支（calcTextareaHeight.ts:61）
// 是模块级缓存的重入守卫 —— hidden textarea 在每次调用末尾都会被移除并置空
// （:106-107），单次调用内不可能以非空态进入，属不可达的防御性分支，未硬造。
