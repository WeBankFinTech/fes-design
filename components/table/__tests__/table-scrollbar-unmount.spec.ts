/**
 * Issue #1021：Table scrollbarRef 卸载不置空
 *
 * bodyTable 的 Scrollbar ref 回调原先带 if (el) 守卫，卸载时 Vue 以 null
 * 调用被挡 → scrollbarRef/bodyWrapperRef 永不置空 → useTableStyle 的
 * watch 中「scrollState.x && !containerRef → 清空」分支永不触发，
 * 且组件持续持有已卸载的 Scrollbar 实例与 DOM。
 *
 * 修复后 ref 回调无条件赋值（el || null），本文件验证：
 * - 挂载滚动表格（足够多行 + height）→ is-scrolling-x-* 状态类出现；
 * - setProps 去掉 height → Scrollbar 卸载 → scrollbarRef/bodyWrapperRef
 *   置空 → 滚动阴影类 is-scrolling-x-* 被重置。
 */
import { mount } from '@vue/test-utils';
import { defineComponent, h, inject, nextTick } from 'vue';
import type { ResizeObserver } from '@juggle/resize-observer';
import Table from '../table';
import { provideKey } from '../const';
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

const COLUMNS = [
    { prop: 'id', label: 'ID', width: 120 },
    { prop: 'name', label: '名称', width: 150 },
    { prop: 'addr', label: '地址', width: 200 },
];

const makeRows = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
        id: index,
        name: `行-${index}`,
        addr: `地址-${index}`,
    }));

// 注入探针：读取 useTableStyle 暴露在 provide 上下文中的 ref 值，
// 并以 data-* 属性回写 DOM，规避 test-utils 版本对 expose 的差异。
// bodyWrapperRef 记录其 id（元素无 id 时回退 kind 标记），
// 用于断言卸载后不再指向已卸载 Scrollbar 的旧 $el
const Probe = defineComponent({
    name: 'RefProbe',
    setup() {
        const ctx = inject(provideKey, null);
        const scrollbarState = () => {
            const v = ctx?.scrollbarRef?.value;
            if (v === null) {
                return 'null';
            }
            return v ? 'instance' : 'other';
        };
        const bodyWrapperId = () => {
            const v = ctx?.bodyWrapperRef?.value as HTMLElement | null;
            if (v === null) {
                return 'null';
            }
            return v ? `${v.tagName}:${v.className.split(' ')[0]}` : 'other';
        };
        return () =>
            h('div', {
                class: 'ref-probe',
                'data-scrollbar': scrollbarState(),
                'data-body-wrapper': bodyWrapperId(),
            });
    },
});

const stubWidths = (wrapper: any) => {
    // wrapper 宽度 100 < bodyMinWidth(470) → isScrollX=true → 渲染 Scrollbar
    const wrapperEl = wrapper.find(`.${prefixCls}`).element;
    Object.defineProperty(wrapperEl, 'offsetWidth', { value: 100, configurable: true });
    const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
    Object.defineProperty(bodyTable, 'offsetWidth', { value: 900, configurable: true });
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    if (bodyWrapper.exists()) {
        Object.defineProperty(bodyWrapper.element, 'offsetHeight', { value: 100 });
    }
};

const scrollBodyTo = async (wrapper: any, scrollLeft: number) => {
    const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
    const container = bodyWrapper.find('.fes-scrollbar-container');
    if (container.exists()) {
        Object.defineProperty(container.element, 'scrollLeft', { value: scrollLeft, configurable: true, writable: true });
        Object.defineProperty(container.element, 'offsetWidth', { value: 300, configurable: true });
        Object.defineProperty(container.element, 'scrollWidth', { value: 900, configurable: true });
        await container.trigger('scroll');
        await wait(80);
    }
    return container.exists();
};

describe('FTable Scrollbar 卸载后滚动状态重置（#1021）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('去掉 height 触发 Scrollbar 卸载 → ref 置空 → is-scrolling-x-* 移除', async () => {
        const wrapper = mount(Table, {
            props: {
                columns: COLUMNS as any,
                data: makeRows(50),
                height: 300,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        stubWidths(wrapper);
        // 触发重算 → isScrollX=true → Scrollbar 挂载
        await wrapper.setProps({ columns: COLUMNS.map((c) => ({ ...c })) });
        await wait(80);

        // 滚动到中部 → scrollState.x = 'middle'
        expect(await scrollBodyTo(wrapper, 300)).toBe(true);
        const bodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
        expect(
            bodyWrapper.classes().some((c) => c.startsWith('is-scrolling-x-')),
        ).toBe(true);

        // 去掉 height：isScrollX/isScrollY 变 false → Scrollbar 卸载换成普通 div
        // 修复前 scrollbarRef 持有已卸载实例 → scrollState.x 残留
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 50, configurable: true });
        await wrapper.setProps({ height: undefined, layout: 'auto' });
        await wait(120);

        // Scrollbar 卸载 → scrollbarRef 置空 → scrollState.x 清空
        const newBodyWrapper = wrapper.find(`.${prefixCls}-body-wrapper`);
        expect(newBodyWrapper.exists()).toBe(true);
        expect(
            newBodyWrapper.classes().some((c) => c.startsWith('is-scrolling-x-')),
        ).toBe(false);
        wrapper.unmount();
    });

    test('Scrollbar 卸载时 scrollbarRef/bodyWrapperRef 显式置空', async () => {
        const wrapper = mount(Table, {
            props: {
                columns: COLUMNS as any,
                data: makeRows(50),
                height: 300,
            } as any,
            attachTo: document.body,
            slots: { default: () => h(Probe) },
        });
        await nextTick();
        await wait(80);
        const probe = wrapper.find('.ref-probe');
        expect(probe.exists()).toBe(true);
        stubWidths(wrapper);
        await wrapper.setProps({ columns: COLUMNS.map((c) => ({ ...c })) });
        await nextTick();
        await wait(80);
        // Scrollbar 挂载 → scrollbarRef 为实例、bodyWrapperRef 为其 $el（fes-scrollbar）
        expect(probe.attributes('data-scrollbar')).toBe('instance');
        expect(probe.attributes('data-body-wrapper')).toContain('fes-scrollbar');

        // 卸载 Scrollbar → 修复后 scrollbarRef 显式置为 null；
        // bodyWrapperRef 被后续普通 div 的 ref 回调覆盖，不再指向旧 $el
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 50, configurable: true });
        await wrapper.setProps({ height: undefined, layout: 'auto' });
        await nextTick();
        await wait(120);
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(false);
        expect(probe.attributes('data-scrollbar')).toBe('null');
        const bodyWrapperDesc = probe.attributes('data-body-wrapper');
        expect(
            bodyWrapperDesc === 'null'
            || bodyWrapperDesc!.includes('fes-table-body-wrapper'),
        ).toBe(true);
        wrapper.unmount();
    });

    test('Scrollbar 卸载后再次挂载恢复正常', async () => {
        const wrapper = mount(Table, {
            props: {
                columns: COLUMNS as any,
                data: makeRows(50),
                height: 300,
            } as any,
            attachTo: document.body,
        });
        await nextTick();
        await wait(80);
        stubWidths(wrapper);
        await wrapper.setProps({ columns: COLUMNS.map((c) => ({ ...c })) });
        await wait(80);
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(true);

        // 卸载 Scrollbar
        const bodyTable = wrapper.find(`table.${prefixCls}-body`).element;
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 50, configurable: true });
        await wrapper.setProps({ height: undefined, layout: 'auto' });
        await wait(120);
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(false);

        // 重新设置 height → Scrollbar 重新挂载（ref 非空）
        Object.defineProperty(bodyTable, 'offsetWidth', { value: 900, configurable: true });
        const wrapperEl = wrapper.find(`.${prefixCls}`).element;
        Object.defineProperty(wrapperEl, 'offsetWidth', { value: 100, configurable: true });
        await wrapper.setProps({ height: 300, layout: 'fixed' });
        await wait(120);
        expect(wrapper.find('.fes-scrollbar-container').exists()).toBe(true);
        wrapper.unmount();
    });
});
