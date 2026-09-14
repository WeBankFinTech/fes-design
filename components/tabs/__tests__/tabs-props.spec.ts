import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FTabPane, FTabs } from '../index';

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const mountTabs = (props: Record<string, unknown> = {}, panes = 2) =>
    mount(FTabs, {
        props,
        slots: {
            default: () =>
                Array.from({ length: panes }, (_, i) =>
                    h(FTabPane, { key: i, value: `t${i}`, label: `标签${i}` }, () => `内容${i}`),
                ),
        },
        attachTo: document.body,
    });

describe('FTabs 属性补全', () => {
    test('type=card 卡片风格', async () => {
        const wrapper = mountTabs({ type: 'card' });
        await nextTick();
        await wait();
        expect(
            wrapper.find('.fes-tabs').classes().some((c) => c.includes('card')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('position=left 左侧标签', async () => {
        const wrapper = mountTabs({ position: 'left' });
        await nextTick();
        await wait();
        expect(
            wrapper.find('.fes-tabs').classes().some((c) => c.includes('left')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('closable 显示关闭按钮并可关闭', async () => {
        const wrapper = mountTabs({ type: 'card', closable: true, modelValue: 't0' }, 2);
        await nextTick();
        await wait();
        const closeIcons = wrapper.findAll('.fes-tabs-tab-close');
        expect(closeIcons.length).toBeGreaterThan(0);
        await closeIcons[1].find('svg').trigger('click');
        await nextTick();
        expect(wrapper.emitted('close')).toBeTruthy();
        wrapper.unmount();
    });

    test('addable 显示新增按钮', async () => {
        const wrapper = mountTabs({ type: 'card', addable: true });
        await nextTick();
        await wait();
        const addBtn = wrapper.find('.fes-tabs-tab.addable');
        expect(addBtn.exists()).toBe(true);
        await addBtn.trigger('click');
        await nextTick();
        expect(wrapper.emitted('add')).toBeTruthy();
        wrapper.unmount();
    });

    test('transition=false 直接渲染无动画', async () => {
        const wrapper = mountTabs({ transition: false, modelValue: 't0' });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('内容0');
        wrapper.unmount();
    });

    test('panes 数组渲染标签页', async () => {
        const wrapper = mount(FTabs, {
            props: {
                panes: [
                    { value: 'p1', label: '面板1', render: () => '内容1' },
                    { value: 'p2', label: '面板2', render: () => '内容2' },
                ],
                modelValue: 'p1',
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();
        // 激活 pane 渲染内容
        expect(wrapper.text()).toContain('内容1');
        // panes 模式 label 走 renderTab 定制，此处不强制断言 label
        wrapper.unmount();
    });

    test('tab-click 事件', async () => {
        const wrapper = mountTabs({ modelValue: 't0' });
        await nextTick();
        await wait();
        await wrapper.findAll('.fes-tabs-tab')[1].trigger('click');
        await nextTick();
        expect(wrapper.emitted('tabClick') || wrapper.emitted('click')).toBeTruthy();
        wrapper.unmount();
    });
});
