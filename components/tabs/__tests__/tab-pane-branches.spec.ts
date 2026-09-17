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
        // 当前行为：setup 返回 console.error 的返回值（undefined），模板拿不到
        // prefixCls → 类名退化为 undefined-tab-pane（潜在源码缺陷，见回报，未改源码）
        expect(wrapper.find('.undefined-tab-pane').exists()).toBe(true);
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
});
