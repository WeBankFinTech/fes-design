/**
 * #1021 验证：bodyTable.tsx 的 Scrollbar 函数 ref 带 if (el) 守卫，
 * 卸载时不把 scrollbarRef 置空 —— issue 猜测 useTableStyle 的 watcher
 * else-if（清空 scrollState.x）不可达。
 * 实际：watch 的是 scrollbarRef.value?.containerRef；containerRef 是
 * Scrollbar 组件自身的模板字符串 ref，Vue 卸载时会将其置 null
 * （runtime-core setRef isUnmount=true → setupState 代理 → ref.value=null），
 * 依赖链仍失效 → else-if 可达，滚动状态能正常清空。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import Table from '../../table/table';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('table');

vi.mock('@juggle/resize-observer', () => ({
    ResizeObserver: class {
        constructor(private cb: ResizeObserverCallback) {}
        observe(el: HTMLElement) {
            this.cb(
                [
                    {
                        contentRect: {
                            width: el.offsetWidth || 800,
                            height: el.offsetHeight || 300,
                        } as DOMRectReadOnly,
                    } as ResizeObserverEntry,
                ],
                this as unknown as ResizeObserver,
            );
        }

        unobserve() {}
        disconnect() {}
    },
}));

// fixed 列会被排在首尾（handleFixedColumns）
const FIXED_COLS = [
    { prop: 'name', label: '名称', fixed: 'left', width: 120 },
    { prop: 'age', label: '年龄' },
    { prop: 'addr', label: '地址', fixed: 'right', width: 120 },
];

const ROWS = [
    { id: 1, name: '一', age: 10, addr: '甲地' },
    { id: 2, name: '二', age: 20, addr: '乙地' },
];

const mountTable = (props = {}) =>
    mount(Table, {
        props: { columns: FIXED_COLS as any, data: ROWS, ...props } as any,
        attachTo: document.body,
    });

const stubWidths = (wrapper: any) => {
    // 固定高度 → bodyMinWidth(340) > wrapperWidth(100) → isScrollX=true
    const wrapperEl = wrapper.find(`.${prefixCls}`).element;
    Object.defineProperty(wrapperEl, 'offsetWidth', { value: 100, configurable: true });
    const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
    Object.defineProperty(bodyTable, 'offsetWidth', { value: 900, configurable: true });
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    if (bodyWrapper.exists()) {
        Object.defineProperty(bodyWrapper.element, 'offsetHeight', { value: 100 });
    }
};

const stubScroll = (el: HTMLElement, scrollLeft: number, offsetWidth = 300, scrollWidth = 900) => {
    Object.defineProperty(el, 'scrollLeft', { value: scrollLeft, configurable: true, writable: true });
    Object.defineProperty(el, 'offsetWidth', { value: offsetWidth, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: scrollWidth, configurable: true });
};

const scrollBodyTo = async (wrapper: any, scrollLeft: number) => {
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    const container = bodyWrapper.find('.fes-scrollbar-container');
    if (container.exists()) {
        stubScroll(container.element, scrollLeft);
        await container.trigger('scroll');
        await wait(80);
    }
    return container.exists();
};

describe('#1021 FTable Scrollbar 卸载后滚动状态重置验证', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('移除 height → Scrollbar 卸载 → is-scrolling-x-* 清空（watcher else-if 实际可达）', async () => {
        const wrapper = mountTable({ height: 200 });
        await nextTick();
        await wait(80);
        stubWidths(wrapper);
        // 触发重算 → isScrollX=true → Scrollbar 挂载，watcher if 分支置 scrollState.x
        await wrapper.setProps({ columns: FIXED_COLS.map((c) => ({ ...c })) });
        await wait(80);

        // 前置：横向滚动态成立（Scrollbar 容器存在 + is-scrolling-x-* 状态类存在）
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(true);
        const bodyWrapperBefore = wrapper.find(`.${prefixCls}-body-wrapper`);
        expect(bodyWrapperBefore.exists()).toBe(true);
        expect(bodyWrapperBefore.classes().join(' ')).toContain('is-scrolling-x-');
        // 滚到中间：scrollState.x 有确定非空值
        expect(await scrollBodyTo(wrapper, 300)).toBe(true);
        expect(
            wrapper.find(`.${prefixCls}-body-wrapper`).classes().join(' '),
        ).toContain('is-scrolling-x-');

        // 变更：内容变窄 + 移除 height → isScrollX=false → Scrollbar 卸载。
        // bodyTable.tsx 的函数 ref 守卫 if (el) 不会置空 scrollbarRef，
        // 但 Vue 会把 Scrollbar 内部模板 ref containerRef 置 null → watcher else-if 触发
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 50, configurable: true });
        await wrapper.setProps({ height: undefined, layout: 'auto' });
        await wait(80);

        // Scrollbar 已卸载（函数 ref 守卫使其外层 ref 残留旧实例，但 DOM 已移除）
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(false);
        // 滚动状态被清空（若 else-if 真不可达，这里会残留 is-scrolling-x-*）
        const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
        const cls = bodyWrapper.exists() ? bodyWrapper.classes() : [];
        expect((cls as string[]).some((c) => c.startsWith('is-scrolling-x-'))).toBe(false);
        const rootCls = wrapper.find(`.${prefixCls}`).classes() as string[];
        expect(rootCls.some((c) => c.startsWith('is-scrolling-x-'))).toBe(false);
        wrapper.unmount();
    });
});
