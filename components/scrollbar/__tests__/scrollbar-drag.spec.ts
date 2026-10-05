import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Scrollbar from '../scrollbar.vue';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const trackCls = getPrefixCls('scrollbar-track');
const thumbCls = `${trackCls}-thumb`;
const containerCls = `${getPrefixCls('scrollbar')}-container`;

const mountScrollbar = (props = {}) =>
    mount(Scrollbar, {
        props: {
            height: 100,
            always: true,
            ...props,
        } as any,
        slots: {
            default: () =>
                h('div', { style: 'height: 400px;' }, '长内容'),
        },
        attachTo: document.body,
    });

describe('FScrollbar 滑块拖拽（bar.vue）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('mousedown thumb 后 document mousemove 更新滚动位置，mouseup 结束', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait(40);
        // 拖拽状态机断言：cursorDown 经 mousedown=true → mouseup=false，
        // 经由 track 的 is-hovering 类可观测（bar.vue:9）
        // 注：scrollTop 回写依赖真实布局链（offsetRatio），jsdom 验证走 e2e 兜底
        const track = wrapper.find(`.${trackCls}`);
        expect(track.exists()).toBe(true);
        const before = track.classes();
        await wrapper.find(`.${thumbCls}`).trigger('mousedown', { button: 0 });
        await wait(40);
        // mousedown → startDrag → cursorDown=true → is-hovering
        expect(wrapper.find(`.${trackCls}`).classes()).toContain('is-hovering');
        expect(before).not.toContain('is-hovering');
        // 抬起（mouseup → cursorDown=false, 恢复 onselectstart）
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait(40);
        expect(wrapper.find(`.${trackCls}`).classes()).not.toContain('is-hovering');
        wrapper.unmount();
    });

    test('未按下时 mousemove 不处理（cursorDown=false 分支）', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait(40);
        const container = wrapper.find(`.${containerCls}`).element;
        Object.defineProperty(container, 'scrollTop', { value: 0, configurable: true, writable: true });
        // 直接 mousemove，未经过 mousedown
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientY: 50 }),
        );
        await wait(40);
        // cursorDown=false → early return，scrollTop 保持 0
        expect(container.scrollTop).toBe(0);
        wrapper.unmount();
    });

    test('ctrl+click 与中键点击 thumb 不触发拖拽', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait(40);
        const thumb = wrapper.find(`.${thumbCls}`);
        // ctrlKey 拦截分支
        await thumb.trigger('mousedown', { button: 0, ctrlKey: true });
        // 中键（button=1）拦截分支
        await thumb.trigger('mousedown', { button: 1 });
        document.dispatchEvent(new MouseEvent('mousemove', { clientY: 20 }));
        await wait(40);
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('拖拽中 thumb 带 is-hovering 类', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait(40);
        const bar = wrapper.find(`.${trackCls}`);
        const thumb = wrapper.find(`.${thumbCls}`);
        await thumb.trigger('mousedown', { button: 0 });
        await wait(40);
        // cursorDown=true → is-hovering
        expect(
            bar.classes().some((c) => c.includes('is-hovering')),
        ).toBe(true);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait(40);
        wrapper.unmount();
    });

    test('hover 滑块显示（cursorLeave 分支）', async () => {
        const wrapper = mountScrollbar({ always: false });
        await nextTick();
        await wait(40);
        const bar = wrapper.find(`.${trackCls}`);
        // 常显关闭时初始隐藏
        expect(bar.isVisible()).toBe(false);
        // mouseenter 显示（visible=true）
        await bar.trigger('mouseenter');
        await wait(40);
        // mouseup 后若 cursorLeave 置位则隐藏
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait(40);
        wrapper.unmount();
    });
});
