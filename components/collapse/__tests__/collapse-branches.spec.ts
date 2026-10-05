import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import FCollapse from '../collapse.vue';
import FCollapseItem from '../collapseItem.vue';

const prefixCls = 'fes-collapse';
const itemCls = `${prefixCls}-item`;

const wait = (ms = 80) => new Promise((r) => setTimeout(r, ms));

// 键盘可达性链路（useCollapseItem.ts:17-25）：focus 后 50ms 判定 isClick，
// 「无点击」→ focusing=true；「点击过」→ 重置 isClick，不进拖影态
describe('FCollapseItem 分支补全（focus 状态与禁用交互）', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('键盘 Tab 聚焦（未点击）：50ms 后 header 进入 focusing 态，blur 退出', async () => {
        const wrapper = mount(
            {
                components: { FCollapse, FCollapseItem },
                template: `
                    <FCollapse>
                        <FCollapseItem name="a" title="标题一">内容一</FCollapseItem>
                    </FCollapse>
                `,
            },
            { attachTo: document.body },
        );
        const header = wrapper.find(`.${itemCls}__header`);
        expect(header.exists()).toBe(true);
        expect(header.classes()).not.toContain('focusing');

        // 模拟键盘聚焦（未经过点击，isClick=false 路径，useCollapseItem.ts:19）
        await header.trigger('focus');
        await wait(80);
        const focused = wrapper.find(`.${itemCls}__header`);
        expect(focused.classes()).toContain('focusing');

        // 失焦立即退出 focusing
        await focused.trigger('blur');
        await nextTick();
        expect(wrapper.find(`.${itemCls}__header`).classes()).not.toContain(
            'focusing',
        );
        wrapper.unmount();
    });

    test('点击后紧跟 focus：50ms 内不进 focusing（isClick 重置路径，useCollapseItem.ts:21）', async () => {
        const wrapper = mount(
            {
                components: { FCollapse, FCollapseItem },
                template: `
                    <FCollapse>
                        <FCollapseItem name="a" title="标题一">内容一</FCollapseItem>
                    </FCollapse>
                `,
            },
            { attachTo: document.body },
        );
        const header = wrapper.find(`.${itemCls}__header`);
        // 点击展开：handleHeaderClick 置 isClick=true
        await header.trigger('click');
        await nextTick();
        expect(wrapper.findAll(`.${itemCls}`)[0].classes()).toContain(
            'is-active',
        );

        // 点击触发的 focus 在 50ms 窗口内应被 isClick 吞掉
        await header.trigger('focus');
        await wait(30);
        expect(wrapper.find(`.${itemCls}__header`).classes()).not.toContain(
            'focusing',
        );
        // 等过 50ms 定时器后仍不应出现 focusing（isClick 分支只重置标记）
        await wait(60);
        expect(wrapper.find(`.${itemCls}__header`).classes()).not.toContain(
            'focusing',
        );
        wrapper.unmount();
    });

    test('disabled 项：键盘 enter/space 仍可切换（不经 disabled 守卫），height 过渡状态正常', async () => {
        const wrapper = mount(
            {
                components: { FCollapse, FCollapseItem },
                template: `
                    <FCollapse>
                        <FCollapseItem name="a" title="禁用项" disabled>内容一</FCollapseItem>
                    </FCollapse>
                `,
            },
            { attachTo: document.body },
        );
        const items = () => wrapper.findAll(`.${itemCls}`);
        expect(items()[0].classes()).toContain('is-disabled');

        // disabled 守卫只拦 headerClick；enter/space 走 handleEnterClick 仍可切换
        await wrapper.find(`.${itemCls}__header`).trigger('keypress', {
            key: 'enter',
        });
        await nextTick();
        expect(items()[0].classes()).toContain('is-active');

        // height 过渡状态：展开后内容容器可见，max-height 由过渡钩子清空
        const wrap = wrapper.find(`.${itemCls}__wrap`);
        expect(wrap.exists()).toBe(true);
        await nextTick();
        await wait(50);
        const wrapAfter = wrapper.find(`.${itemCls}__wrap`);
        expect(wrapAfter.exists()).toBe(true);
        expect(wrapAfter.attributes('style') || '').not.toContain(
            'display: none',
        );
        expect(wrapAfter.attributes('style') || '').not.toContain('max-height');
        expect(wrapper.text()).toContain('内容一');

        // 收起：容器 v-show 隐藏
        await wrapper.find(`.${itemCls}__header`).trigger('keypress', {
            key: 'enter',
        });
        await nextTick();
        await wait(50);
        const wrapClosed = wrapper.find(`.${itemCls}__wrap`);
        expect(wrapClosed.exists()).toBe(true);
        expect(wrapClosed.attributes('style') || '').toContain('display: none');
        wrapper.unmount();
    });

    test('disabled 项聚焦 50ms 后 focusing ref 置位，但类名被 disabled 抑制', async () => {
        const wrapper = mount(
            {
                components: { FCollapse, FCollapseItem },
                template: `
                    <FCollapse>
                        <FCollapseItem name="a" title="禁用项" disabled>内容一</FCollapseItem>
                    </FCollapse>
                `,
            },
            { attachTo: document.body },
        );
        const header = wrapper.find(`.${itemCls}__header`);
        // disabled 项 tabindex=-1，但 focus 事件仍可编程触发（无障碍兜底）
        await header.trigger('focus');
        await wait(80);
        // focusing=true && !disabled=false → 不渲染 focusing 类（line 68 第二操作数 false 路径）
        expect(wrapper.find(`.${itemCls}__header`).classes()).not.toContain(
            'focusing',
        );
        wrapper.unmount();
    });
});
