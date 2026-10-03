/**
 * Issue #1024 [Bug] Tabs：只配置 name 的 TabPane 关闭时 close 事件 payload 为空
 *
 * 修复内容（tab.tsx handleCloseClick / props.ts tabProps.value）：
 * 1. handleCloseClick 改为 handleClose(props.value ?? props.name)——
 *    value 未配置时回退 name；
 * 2. tabProps.value 去掉 required，允许只配 name 的合法用法。
 * 配置了 value 的 tab 行为不变。
 */
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FTabPane, FTabs } from '../../tabs/index';
import { wait } from '../../_util/__tests__/helpers';

describe('#1024 TabPane 只配 name 时 close payload 回退 name（回归）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('type=card closable，点击只配 name 的 tab 关闭按钮 → close payload 为 name', async () => {
        const wrapper = mount(FTabs, {
            props: {
                type: 'card',
                closable: true,
                modelValue: 'x',
            },
            slots: {
                default: () => [
                    h(FTabPane, { key: 1, name: 't1', label: '标签1' }, () => '内容1'),
                    h(FTabPane, { key: 2, value: 'b', label: '标签2' }, () => '内容2'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();

        // 找到关闭按钮（现有测试选择器：.fes-tabs-tab-close）
        const closeIcons = wrapper.findAll('.fes-tabs-tab-close');
        expect(closeIcons.length).toBeGreaterThan(0);

        // 点击第一个 tab（只配 name: 't1'，未配 value）的关闭图标
        await closeIcons[0].find('svg').trigger('click');
        await nextTick();
        await wait();

        const closeEvents = wrapper.emitted('close');
        expect(closeEvents).toBeTruthy();
        // 修复后：payload 回退为 name 't1'（修复前为 undefined/null）
        expect(closeEvents![0][0]).toBe('t1');

        wrapper.unmount();
    });

    test('同时配置 value 与 name 时优先 value', async () => {
        const wrapper = mount(FTabs, {
            props: {
                type: 'card',
                closable: true,
                modelValue: 'x',
            },
            slots: {
                default: () => [
                    h(
                        FTabPane,
                        { key: 1, value: 'v1', name: 'n1', label: '标签1' },
                        () => '内容1',
                    ),
                    h(FTabPane, { key: 2, value: 'b', label: '标签2' }, () => '内容2'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();

        const closeIcons = wrapper.findAll('.fes-tabs-tab-close');
        await closeIcons[0].find('svg').trigger('click');
        await nextTick();

        const closeEvents = wrapper.emitted('close');
        expect(closeEvents).toBeTruthy();
        // value 优先级高于 name，行为不变
        expect(closeEvents![0][0]).toBe('v1');

        wrapper.unmount();
    });

    test('对照组：只配置 value 的 tab 关闭 payload 正常为 value', async () => {
        const wrapper = mount(FTabs, {
            props: {
                type: 'card',
                closable: true,
                modelValue: 'x',
            },
            slots: {
                default: () => [
                    h(FTabPane, { key: 1, value: 'a', label: '标签1' }, () => '内容1'),
                    h(FTabPane, { key: 2, value: 'b', label: '标签2' }, () => '内容2'),
                ],
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait();

        const closeIcons = wrapper.findAll('.fes-tabs-tab-close');
        await closeIcons[0].find('svg').trigger('click');
        await nextTick();

        const closeEvents = wrapper.emitted('close');
        expect(closeEvents).toBeTruthy();
        expect(closeEvents![0][0]).toBe('a');

        wrapper.unmount();
    });
});
