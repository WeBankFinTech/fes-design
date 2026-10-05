import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FTabPane from '../tab-pane.vue';
import FTabs from '../tabs';

describe('FTabPane 父组件约束（!FTab 分支）', () => {
    test('脱离 FTabs 独立挂载：console.error 提示必须搭配 FTabs', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const wrapper = mount(FTabPane, { props: { name: 'p1', label: '标签1' } });
        expect(errSpy).toHaveBeenCalledWith(
            expect.stringContaining('FTabPane'),
        );
        // #1032 彻底修复后：孤儿挂载熔断为 () => null 空渲染，
        // 不再退化为 undefined-tab-pane 脏类名（此断言原锁定缺陷行为）
        expect(wrapper.find('.undefined-tab-pane').exists()).toBe(false);
        wrapper.unmount();
        errSpy.mockRestore();
    });

    test('作为 FTabs 子面板正常渲染（真实父子链路）', async () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const wrapper = mount(FTabs, {
            slots: {
                default: () =>
                    h(
                        FTabPane,
                        { name: 'p1', label: '标签1' },
                        () => h('div', '面板内容1'),
                    ),
            },
        });
        await nextTick();
        expect(errSpy).not.toHaveBeenCalled();
        expect(wrapper.find('.fes-tabs-tab-pane').exists()).toBe(true);
        expect(wrapper.text()).toContain('面板内容1');
        wrapper.unmount();
        errSpy.mockRestore();
    });

    test('FTabPane 独立挂载：console.error 一次 + 空渲染', () => {
        const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        const wrapper = mount(FTabPane, {
            props: { name: 'p1', label: '标签1' },
        });
        // #1032 彻底修复：if (!FTab) 分支先告警再熔断 return () => null，
        // 恰好告警一次；不再退化为 undefined-tab-pane 脏类名
        expect(errSpy).toHaveBeenCalledTimes(1);
        expect(wrapper.find('.undefined-tab-pane').exists()).toBe(false);
        // 空渲染：Vue 对 () => null 的结果是注释占位 <!---->，无真实面板 DOM
        expect(wrapper.find('.fes-tabs-tab-pane').exists()).toBe(false);
        expect(wrapper.html()).toBe('<!---->');
        // ws 无子 DOM（注释节点无任何子结构）
        expect(wrapper.element.childNodes.length).toBe(0);
        wrapper.unmount();
        errSpy.mockRestore();
    });
});
