import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from 'vitest';
import { Comment, Fragment, Text, createCommentVNode, defineComponent, h } from 'vue';
import {
    addClass,
    getScrollBarWidth,
    getScrollContainer,
    getStyle,
    hasClass,
    isHtmlElement,
    isInContainer,
    isScroll,
    removeClass,
} from '../dom';
import download from '../download';
import scrollTo from '../scrollTo';
import { createKey } from '../createKey';
import { getPrefixStorage, getStorage } from '../storage';
import {
    flatten,
    getFirstValidNode,
    getSlot,
    isComment,
    isFragment,
    isTemplate,
    isText,
    isValidElementNode,
} from '../vnode';
import { withInstall, withNoopInstall } from '../withInstall';

describe('_util dom', () => {
    let el;

    beforeEach(() => {
        el = document.createElement('div');
        document.body.appendChild(el);
    });

    afterEach(() => {
        el.remove();
    });

    test('hasClass', () => {
        el.className = 'a b';
        expect(hasClass(el, 'a')).toBe(true);
        expect(hasClass(el, 'c')).toBe(false);
        // 边界：空节点/空类名/带空格类名
        expect(hasClass(null, 'a')).toBe(false);
        expect(hasClass(el, '')).toBe(false);
        expect(() => hasClass(el, 'a b')).toThrow(
            'className should not contain space.',
        );
    });

    test('addClass', () => {
        addClass(el, 'x y');
        expect(el.classList.contains('x')).toBe(true);
        expect(el.classList.contains('y')).toBe(true);
        addClass(el, '');
        addClass(null);
        expect(el.className).toBe('x y');
    });

    test('removeClass', () => {
        el.className = 'x y';
        removeClass(el, 'x');
        expect(el.classList.contains('x')).toBe(false);
        expect(el.classList.contains('y')).toBe(true);
        // 边界
        removeClass(el, '');
        removeClass(null, 'x');
        expect(el.className).toBe('y');
    });

    test('getStyle 优先读内联样式，且驼峰化', () => {
        el.style.backgroundColor = 'red';
        expect(getStyle(el, 'background-color')).toBe('red');
        // 无内联样式时读计算样式
        expect(getStyle(el, 'color')).toBeDefined();
        // 边界
        expect(getStyle(null, 'color')).toBe('');
        expect(getStyle(el, '')).toBe('');
    });

    test('getScrollBarWidth 返回非负数且缓存', () => {
        const width = getScrollBarWidth();
        expect(width).toBeGreaterThanOrEqual(0);
        expect(getScrollBarWidth()).toBe(width);
    });

    test('isHtmlElement', () => {
        expect(isHtmlElement(el)).toBe(true);
        expect(isHtmlElement(document.createTextNode(''))).toBe(false);
        expect(isHtmlElement(null)).toBeFalsy();
    });

    test('isScroll', () => {
        el.style.overflow = 'auto';
        expect(isScroll(el)).toBeTruthy();
        el.style.overflowY = 'scroll';
        expect(isScroll(el, true)).toBeTruthy();
        el.style.overflowX = 'hidden';
        el.style.overflowY = '';
        el.style.overflow = '';
        expect(isScroll(el, true)).toBeFalsy();
    });

    test('getScrollContainer', () => {
        const inner = document.createElement('div');
        el.appendChild(inner);
        // 无可滚动祖先时最终返回 window
        expect(getScrollContainer(inner)).toBe(window);
        // 自身可滚动时返回自身
        el.style.overflow = 'auto';
        expect(getScrollContainer(inner)).toBe(el);
    });

    test('isInContainer', () => {
        const inner = document.createElement('div');
        el.appendChild(inner);
        // setup 中 getBoundingClientRect mock 为 100x100 (top 0, bottom 100)
        expect(isInContainer(inner, el)).toBe(true);
        expect(isInContainer(null, el)).toBe(false);
        expect(isInContainer(inner, null)).toBe(false);
        // container 非 Element 时用 window 视口
        expect(isInContainer(inner, {})).toBe(true);
    });
});

describe('_util download', () => {
    test('创建链接并点击下载', async () => {
        const removeChildSpy = vi.spyOn(document.body, 'removeChild');
        const appendSpy = vi.spyOn(document.body, 'append');
        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click');
        download({ href: 'https://example.com/file.zip', name: 'file.zip' });
        expect(appendSpy).toHaveBeenCalledTimes(1);
        const a = appendSpy.mock.calls[0][0];
        expect(a.tagName).toBe('A');
        expect(a.download).toBe('file.zip');
        expect(a.href).toBe('https://example.com/file.zip');
        expect(a.target).toBe('_blank');
        expect(a.style.display).toBe('none');
        expect(clickSpy).toHaveBeenCalledTimes(1);
        // setTimeout 后移除节点
        await new Promise((resolve) => {
            setTimeout(resolve, 10);
        });
        expect(removeChildSpy).toHaveBeenCalledWith(a);
    });

    test('未提供 name 时使用时间戳命名', () => {
        const appendSpy = vi.spyOn(document.body, 'append');
        const before = Date.now();
        download({ href: 'https://example.com/data' });
        const calls = appendSpy.mock.calls;
        const a = calls[calls.length - 1][0];
        // download 内部取 Date.now()，允许与断言时刻有毫秒级漂移
        expect(Number(a.download)).toBeGreaterThanOrEqual(before);
        expect(Number(a.download)).toBeLessThanOrEqual(Date.now());
        appendSpy.mockRestore();
    });
});

describe('_util scrollTo', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    test('duration <= 0 时直接设置 scrollTop', () => {
        const el = document.createElement('div');
        el.scrollTop = 100;
        scrollTo(el, 200, 0);
        expect(el.scrollTop).toBe(200);
        scrollTo(el, 50, -1);
        expect(el.scrollTop).toBe(50);
    });

    test('duration > 0 时通过 rAF 逐步滚动到目标', () => {
        const el = document.createElement('div');
        el.scrollTop = 0;
        scrollTo(el, 100, 100);
        // 每帧 perTick = (100 / 100) * 10 = 10
        for (let i = 0; i < 20; i++) {
            vi.advanceTimersByTime(20);
        }
        expect(el.scrollTop).toBe(100);
    });
});

describe('_util createKey', () => {
    test('组合前缀与后缀', () => {
        expect(createKey('fes', 'default')).toBe('fes');
        expect(createKey('fes', 'info')).toBe('fesInfo');
        expect(createKey('button', 'loading')).toBe('buttonLoading');
        expect(createKey('a', 'x')).toBe('aX');
    });
});

describe('_util storage', () => {
    test('getPrefixStorage', () => {
        expect(getPrefixStorage('float-pane')).toBe('__fesd-storage-float-pane');
        expect(getPrefixStorage('')).toBe('__fesd-storage');
    });

    test('getStorage', () => {
        expect(getStorage('local')).toBe(localStorage);
        expect(getStorage('session')).toBe(sessionStorage);
    });
});

describe('_util vnode', () => {
    test('isFragment/isText/isComment/isTemplate', () => {
        expect(isFragment(h(Fragment))).toBe(true);
        expect(isFragment(h('div'))).toBe(false);
        expect(isText(h(Text, 'text'))).toBe(true);
        expect(isComment(h(Comment))).toBe(true);
        const vnode = createCommentVNode('v-if');
        expect(isComment(vnode)).toBe(true);
        expect(isTemplate({ type: 'template' })).toBe(true);
        expect(isTemplate({ type: 'div' })).toBe(false);
    });

    test('isValidElementNode', () => {
        expect(isValidElementNode(h('div'))).toBe(true);
        expect(isValidElementNode(h(Fragment))).toBe(false);
        expect(isValidElementNode(h(Comment))).toBe(false);
    });

    test('flatten', () => {
        expect(flatten([h('div', 'a')])).toHaveLength(1);
        expect(flatten([null, 'str', 123])).toHaveLength(2);
        expect(flatten([h(Fragment, [h('span'), h('i')])])).toHaveLength(2);
        // fragment children 为 null
        expect(flatten([h(Fragment, { children: null })])).toHaveLength(0);
        // comment 节点被剔除
        expect(flatten([h(Comment)])).toHaveLength(0);
        // 嵌套数组
        expect(flatten([[h('div'), [h('span')]]])).toHaveLength(2);
    });

    test('getFirstValidNode', () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        expect(getFirstValidNode([h('div', 'only')])).toBeTruthy();
        expect(getFirstValidNode([])).toBe(null);
        expect(getFirstValidNode([h('div'), h('span')])).toBe(null);
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    test('getSlot', () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const slots = {
            default: () => h('div', 'default'),
            custom: (props) => h('span', `hello ${props.name}`),
        };
        // slot 返回单个 vnode
        expect(getSlot(slots).children).toBe('default');
        expect(getSlot(slots, 'custom', { name: 'fes' }).children).toBe(
            'hello fes',
        );
        // 缺失 slot 时警告并返回 null
        expect(getSlot(slots, 'missing')).toBe(null);
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });
});

describe('_util withInstall', () => {
    test('withInstall 注册组件', () => {
        const comp = defineComponent({ name: 'FCompA' });
        const extra = defineComponent({ name: 'FCompB' });
        const directive = { name: 'v-test', mounted: () => {} };
        const plugin = withInstall(comp, { FCompB: extra }, [directive]);

        const components = {};
        const directives = {};
        const app = {
            component: (name, c) => {
                components[name] = c;
            },
            directive: (name, d) => {
                directives[name] = d;
            },
        };
        expect(plugin).toHaveProperty('install');
        plugin.install(app);
        expect(components.FCompA).toBe(comp);
        expect(components.FCompB).toBe(extra);
        expect(directives['v-test']).toBe(directive);
        // extra 被挂载到主组件上
        expect(plugin.FCompB).toBe(extra);
    });

    test('withInstall 不传 extra/directives', () => {
        const comp = defineComponent({ name: 'FCompC' });
        const plugin = withInstall(comp);
        const components = {};
        plugin.install({
            component: (name, c) => {
                components[name] = c;
            },
            directive: () => {},
        });
        expect(components.FCompC).toBe(comp);
    });

    test('withNoopInstall', () => {
        const comp = defineComponent({ name: 'FCompD' });
        const plugin = withNoopInstall(comp);
        expect(typeof plugin.install).toBe('function');
        expect(() => plugin.install({})).not.toThrow();
    });
});
