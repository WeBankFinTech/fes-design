import { mount } from '@vue/test-utils';
import { TransitionGroup, h, nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import FTabPane from '../tab-pane.vue';
import FTabs from '../tabs';
import { wait } from '../../_util/__tests__/helpers';

// 不可达分支说明（不改源码前提下，保留未覆盖）：
// - tabs.tsx:12（compiled `_isSlot` helper 的 `&& !isVNode(s)` 第三操作数）与
//   tabs.tsx:248（TransitionGroup children 三元 `_isSlot(mapTabPane(...))` 的
//   consequent）：tabs.tsx 内所有 JSX children 均为数组（v-slots / 数组子节点），
//   `_isSlot` 对数组恒 false → 直接透传路径无入口。

// jsdom 无 CSS 布局与过渡帧：TransitionGroup 的过渡类不会写入 DOM（Vue 在无
// computed transition 样式时跳过类应用）。因此 transition name 分支断言直接读取
// 渲染后的 TransitionGroup 组件 props.name（真实渲染产物），并关闭 VTU 默认的
// TransitionGroup stub，否则 name 会被 stub 吞掉。
const STUBS_OFF = {
    global: {
        stubs: { 'transition': false, 'transition-group': false },
    },
};

const getContainer = (wrapper: ReturnType<typeof mount>) =>
    wrapper.find('.fes-tabs-nav-scroll .fes-scrollbar-container')
        .element as HTMLElement;

const mountTabs = (
    props: Record<string, unknown> = {},
    panes = 2,
    extra: Record<string, unknown> = {},
) =>
    mount(FTabs, {
        props,
        slots: {
            default: () =>
                Array.from({ length: panes }, (_, i) =>
                    h(
                        FTabPane,
                        { key: i, value: `t${i}`, name: `标签${i}` },
                        () => `内容${i}`,
                    ),
                ),
        },
        ...extra,
        attachTo: document.body,
    });

const getTabs = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('.fes-tabs-tab');

afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('FTabs 真实交互链补全', () => {
    test('切换/关闭/受控 v-model 事件链（change/update:modelValue/close 负载）', async () => {
        const wrapper = mountTabs({
            type: 'card',
            closable: true,
            modelValue: 't0',
        });
        await nextTick();
        await wait();
        // 切换到 t1
        await getTabs(wrapper)[1].trigger('click');
        await nextTick();
        const change = wrapper.emitted('change');
        expect(change).toBeTruthy();
        expect(change![0][0]).toBe('t1');
        const updates = wrapper.emitted('update:modelValue');
        expect(updates![0][0]).toBe('t1');
        // 关闭 t1：close 事件负载为被关闭标签的 value（关闭图标内 svg 承载点击）
        const closeIcons = wrapper.findAll('.fes-tabs-tab-close');
        expect(closeIcons.length).toBe(2);
        await closeIcons[1].find('svg').trigger('click');
        const closes = wrapper.emitted('close');
        expect(closes).toBeTruthy();
        expect(closes![0][0]).toBe('t1');
        wrapper.unmount();
    });

    test('重复点击当前激活标签：不重复触发 change，仍触发 clickTab', async () => {
        const wrapper = mountTabs({ modelValue: 't0' });
        await nextTick();
        await wait();
        await getTabs(wrapper)[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('change')).toBeUndefined();
        const clicks = wrapper.emitted('clickTab');
        expect(clicks).toBeTruthy();
        expect(clicks![0][0]).toBe('t0');
        wrapper.unmount();
    });

    test('prefix/suffix 插槽渲染导航两侧区域', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 't0' },
            slots: {
                default: () => [h(FTabPane, { value: 't0' }, () => '内容0')],
                prefix: () => '前置区',
                suffix: () => '后置区',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const prefix = wrapper.find('.fes-tabs-nav-prefix');
        expect(prefix.exists()).toBe(true);
        expect(prefix.text()).toBe('前置区');
        const suffix = wrapper.find('.fes-tabs-nav-suffix');
        expect(suffix.exists()).toBe(true);
        expect(suffix.text()).toBe('后置区');
        wrapper.unmount();
    });

    test('transition 自定义字符串：TransitionGroup 应用自定义过渡名', async () => {
        const wrapper = mountTabs(
            { transition: 'my-slide', modelValue: 't0' },
            2,
            STUBS_OFF,
        );
        await nextTick();
        await wait();
        const tg = wrapper.findComponent(TransitionGroup);
        expect(tg.exists()).toBe(true);
        expect(tg.props('name')).toBe('my-slide');
        // 切换仍真实可用
        await getTabs(wrapper)[1].trigger('click');
        await nextTick();
        expect(wrapper.text()).toContain('内容1');
        wrapper.unmount();
    });

    test('transition 默认 true：TransitionGroup 应用默认 slide-fade 过渡名', async () => {
        const wrapper = mountTabs({ modelValue: 't0' }, 2, STUBS_OFF);
        await nextTick();
        await wait();
        const tg = wrapper.findComponent(TransitionGroup);
        expect(tg.exists()).toBe(true);
        expect(tg.props('name')).toBe('fes-tabs-slide-fade');
        wrapper.unmount();
    });

    test('transition=false：TransitionGroup 过渡名置空', async () => {
        const wrapper = mountTabs(
            { transition: false, modelValue: 't0' },
            2,
            STUBS_OFF,
        );
        await nextTick();
        await wait();
        const tg = wrapper.findComponent(TransitionGroup);
        expect(tg.exists()).toBe(true);
        expect(tg.props('name')).toBeNull();
        wrapper.unmount();
    });

    test('tab 插槽渲染自定义标签；panes 缺 render 触发警告', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(FTabs, {
            props: {
                modelValue: 'p1',
                panes: [
                    {
                        value: 'p1',
                        name: '面板一',
                        render: () => h('div', '内容一'),
                        renderTab: () => h('span', '自定义标签'),
                    },
                    { value: 'p2', name: '面板二' },
                ] as any,
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // renderTab 自定义标签渲染到导航
        const labels = wrapper.findAll('.fes-tabs-tab-label');
        expect(labels.map((l) => l.text())).toContain('自定义标签');
        expect(wrapper.text()).toContain('内容一');
        // 缺 render 的 panes 触发警告
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('panes 需要提供 render'),
        );
        // 缺 render 的 pane 不渲染内容（仅激活面板 p1 渲染）
        expect(wrapper.findAll('.fes-tabs-tab-pane')).toHaveLength(1);
        wrapper.unmount();
        warnSpy.mockRestore();
    });

    test('FTabPane 提供 #tab 插槽：自定义标签渲染到导航', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 't0' },
            slots: {
                default: () => [
                    h(
                        FTabPane,
                        { value: 't0' },
                        { default: () => '内容0', tab: () => '自定义标签0' },
                    ),
                    h(
                        FTabPane,
                        { value: 't1' },
                        { default: () => '内容1', tab: () => '自定义标签1' },
                    ),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const labels = wrapper.findAll('.fes-tabs-tab-label');
        expect(labels.map((l) => l.text())).toEqual([
            '自定义标签0',
            '自定义标签1',
        ]);
        wrapper.unmount();
    });

    test('TabPane 级 closable 覆盖：显式 false 不渲染关闭按钮', async () => {
        const wrapper = mount(FTabs, {
            props: { type: 'card', closable: true, modelValue: 't0' },
            slots: {
                default: () => [
                    h(FTabPane, { value: 't0', closable: false }, () => '内容0'),
                    h(FTabPane, { value: 't1' }, () => '内容1'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // t0 显式 closable=false 无关闭按钮；t1 走 tabs closableRef 有
        const closes = wrapper.findAll('.fes-tabs-tab-close');
        expect(closes).toHaveLength(1);
        await closes[0].find('svg').trigger('click');
        const closeEvents = wrapper.emitted('close');
        expect(closeEvents).toBeTruthy();
        expect(closeEvents![0][0]).toBe('t1');
        wrapper.unmount();
    });

    test('disabled 面板点击标签不切换、不触发事件', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 't0' },
            slots: {
                default: () => [
                    h(FTabPane, { value: 't0' }, () => '内容0'),
                    h(FTabPane, { value: 't1', disabled: true }, () => '内容1'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const tab1 = getTabs(wrapper)[1];
        expect(tab1.classes()).toContain('fes-tabs-tab-disabled');
        await tab1.trigger('click');
        await nextTick();
        expect(wrapper.emitted('change')).toBeUndefined();
        expect(wrapper.emitted('clickTab')).toBeUndefined();
        expect(wrapper.text()).not.toContain('内容1');
        wrapper.unmount();
    });

    test('displayDirective=show：非激活面板保留 DOM 并 v-show 隐藏', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 't0' },
            slots: {
                default: () => [
                    h(
                        FTabPane,
                        { value: 't0', displayDirective: 'show' },
                        () => '内容0',
                    ),
                    h(
                        FTabPane,
                        { value: 't1', displayDirective: 'show' },
                        () => '内容1',
                    ),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        const panes = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panes).toHaveLength(2);
        expect(panes[0].attributes('style') || '').not.toContain(
            'display: none',
        );
        expect(panes[1].attributes('style') || '').toContain('display: none');
        // 切换后显隐反转
        await getTabs(wrapper)[1].trigger('click');
        await nextTick();
        const after = wrapper.findAll('.fes-tabs-tab-pane');
        expect(after[0].attributes('style') || '').toContain('display: none');
        expect(after[1].attributes('style') || '').not.toContain(
            'display: none',
        );
        wrapper.unmount();
    });

    test('displayDirective=show:lazy：首次激活才挂载并缓存保留', async () => {
        const wrapper = mount(FTabs, {
            props: { modelValue: 't0' },
            slots: {
                default: () => [
                    h(
                        FTabPane,
                        { value: 't0', displayDirective: 'show:lazy' },
                        () => '内容0',
                    ),
                    h(
                        FTabPane,
                        { value: 't1', displayDirective: 'show:lazy' },
                        () => '内容1',
                    ),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 初始仅激活的 t0 挂载
        let panes = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panes).toHaveLength(1);
        expect(panes[0].text()).toBe('内容0');
        // 切到 t1 → 首次挂载并缓存
        await getTabs(wrapper)[1].trigger('click');
        await nextTick();
        panes = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panes).toHaveLength(2);
        expect(panes[1].attributes('style') || '').not.toContain(
            'display: none',
        );
        // 切回 t0 → t1 因缓存保留在 DOM（v-show 隐藏）
        await getTabs(wrapper)[0].trigger('click');
        await nextTick();
        panes = wrapper.findAll('.fes-tabs-tab-pane');
        expect(panes).toHaveLength(2);
        expect(panes[1].attributes('style') || '').toContain('display: none');
        wrapper.unmount();
    });

    describe('自动滚动（autoScrollTab）', () => {
        test('modelValue 指向不存在标签：滚动守卫不崩溃不滚动', async () => {
            const wrapper = mountTabs({ modelValue: 'ghost' });
            await nextTick();
            await wait();
            const container = getContainer(wrapper);
            expect(container).toBeTruthy();
            expect(container.scrollLeft).toBe(0);
            expect(wrapper.findAll('.fes-tabs-tab-pane')).toHaveLength(0);
            wrapper.unmount();
        });

        test('position=top 切换超界标签：自动滚动到目标标签（setScrollLeft）', async () => {
            const wrapper = mountTabs({ modelValue: 't0' }, 3);
            await nextTick();
            await wait();
            const container = getContainer(wrapper);
            Object.defineProperty(container, 'scrollLeft', {
                value: 0,
                configurable: true,
                writable: true,
            });
            Object.defineProperty(container, 'offsetWidth', {
                value: 320,
                configurable: true,
            });
            Object.defineProperty(container, 'offsetHeight', {
                value: 60,
                configurable: true,
            });
            const tab1El = getTabs(wrapper)[1].element as HTMLElement;
            Object.defineProperty(tab1El, 'offsetLeft', {
                value: 400,
                configurable: true,
            });
            Object.defineProperty(tab1El, 'offsetWidth', {
                value: 100,
                configurable: true,
            });
            await getTabs(wrapper)[1].trigger('click');
            await nextTick();
            await nextTick();
            // scrollLeft + offsetWidth < el.offsetLeft + el.offsetWidth →
            // setScrollLeft(el.offsetLeft - offsetWidth + el.offsetWidth, 0)
            expect(container.scrollLeft).toBe(400 - 320 + 100);
            wrapper.unmount();
        });

        test('position=left 纵向超界：自动滚动到目标标签（setScrollTop）', async () => {
            const wrapper = mountTabs({ position: 'left', modelValue: 't0' }, 3);
            await nextTick();
            await wait();
            const container = getContainer(wrapper);
            Object.defineProperty(container, 'scrollTop', {
                value: 0,
                configurable: true,
                writable: true,
            });
            Object.defineProperty(container, 'offsetHeight', {
                value: 200,
                configurable: true,
            });
            const tab1El = getTabs(wrapper)[1].element as HTMLElement;
            Object.defineProperty(tab1El, 'offsetTop', {
                value: 300,
                configurable: true,
            });
            Object.defineProperty(tab1El, 'offsetHeight', {
                value: 100,
                configurable: true,
            });
            await getTabs(wrapper)[1].trigger('click');
            await nextTick();
            await nextTick();
            expect(container.scrollTop).toBe(300 - 200 + 100);
            wrapper.unmount();
        });
    });

    test('动态 panes 受控增删：只有渲染的标签保留，激活项消失不崩溃', async () => {
        const initialPanes = [
            { value: 'p1', name: '面板一', render: () => h('div', '内容一') },
            { value: 'p2', name: '面板二', render: () => h('div', '内容二') },
        ];
        const wrapper = mount(FTabs, {
            props: { modelValue: 'p1', panes: initialPanes },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        expect(getTabs(wrapper)).toHaveLength(2);
        // 受控关闭 p1：移除 pane 后标签减少、内容消失
        await wrapper.setProps({ panes: [initialPanes[1]] });
        await nextTick();
        await wait();
        expect(getTabs(wrapper)).toHaveLength(1);
        expect(wrapper.findAll('.fes-tabs-tab-pane')).toHaveLength(0);
        // 激活值跳到不存在标签 → 自动滚动守卫路径无崩溃
        await wrapper.setProps({ modelValue: 'p1' });
        await nextTick();
        await nextTick();
        expect(wrapper.findAll('.fes-tabs-tab-pane')).toHaveLength(0);
        const container = getContainer(wrapper);
        expect(container.scrollLeft).toBe(0);
        wrapper.unmount();
    });
});
