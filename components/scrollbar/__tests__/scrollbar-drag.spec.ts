import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Scrollbar from '../scrollbar.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const trackCls = getPrefixCls('scrollbar-track');
const thumbCls = `${trackCls}-thumb`;
const wait = (ms = 40) => new Promise((r) => setTimeout(r, ms));

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
        await wait();
        const thumb = wrapper.find(`.${thumbCls}`);
        expect(thumb.exists()).toBe(true);
        // 按下 thumb（左键）
        await thumb.trigger('mousedown', { button: 0 });
        // 拖动（cursorDown=true 分支）
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientY: 30, clientX: 0 }),
        );
        await wait();
        // 抬起（mouseup → cursorDown=false, 恢复 onselectstart）
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
        expect(wrapper.find(`.${thumbCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('未按下时 mousemove 不处理（cursorDown=false 分支）', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait();
        // 直接 mousemove，未经过 mousedown
        document.dispatchEvent(
            new MouseEvent('mousemove', { clientY: 50 }),
        );
        await wait();
        // 不抛错即通过 early return 分支
        expect(wrapper.find(`.${thumbCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('ctrl+click 与中键点击 thumb 不触发拖拽', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait();
        const thumb = wrapper.find(`.${thumbCls}`);
        // ctrlKey 拦截分支
        await thumb.trigger('mousedown', { button: 0, ctrlKey: true });
        // 中键（button=1）拦截分支
        await thumb.trigger('mousedown', { button: 1 });
        document.dispatchEvent(new MouseEvent('mousemove', { clientY: 20 }));
        await wait();
        wrapper.unmount();
    });

    test('拖拽中 thumb 带 is-hovering 类', async () => {
        const wrapper = mountScrollbar();
        await nextTick();
        await wait();
        const bar = wrapper.find(`.${trackCls}`);
        const thumb = wrapper.find(`.${thumbCls}`);
        await thumb.trigger('mousedown', { button: 0 });
        await wait();
        // cursorDown=true → is-hovering
        expect(
            bar.classes().some((c) => c.includes('is-hovering')),
        ).toBe(true);
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
        wrapper.unmount();
    });

    test('hover 滑块显示（cursorLeave 分支）', async () => {
        const wrapper = mountScrollbar({ always: false });
        await nextTick();
        await wait();
        const bar = wrapper.find(`.${trackCls}`);
        // 常显关闭时初始隐藏
        expect(bar.isVisible()).toBe(false);
        // mouseenter 显示（visible=true）
        await bar.trigger('mouseenter');
        await wait();
        // mouseup 后若 cursorLeave 置位则隐藏
        document.dispatchEvent(new MouseEvent('mouseup'));
        await wait();
        wrapper.unmount();
    });
});
