import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import BackTop from '../backTop';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('back-top');

// jsdom 不支持真实滚动，用可读写的 scrollTop 模拟
function mockScrollTop(el) {
    let value = 0;
    Object.defineProperty(el, 'scrollTop', {
        configurable: true,
        get: () => value,
        set: (val) => {
            value = val;
        },
    });
    return {
        get: () => value,
        set: (val) => {
            value = val;
        },
    };
}

const wrappers = [];
const _mount = (props = {}, slots = {}) => {
    const wrapper = mount(BackTop, {
        props,
        slots,
        attachTo: document.body,
    });
    wrappers.push(wrapper);
    return wrapper;
};

describe('BackTop', () => {
    let docScroll;

    beforeEach(() => {
        docScroll = mockScrollTop(document.documentElement);
    });

    afterEach(() => {
        while (wrappers.length) {
            wrappers.pop().unmount();
        }
    });

    test('初始滚动高度小于阈值时不显示', async () => {
        docScroll.set(0);
        const wrapper = _mount();
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
    });

    test('滚动高度达到默认阈值 200 时显示', async () => {
        docScroll.set(250);
        const wrapper = _mount();
        await nextTick();
        const btn = wrapper.find(`.${prefixCls}`);
        expect(btn.exists()).toBe(true);
        expect(btn.attributes('style')).toContain('right: 40px');
        expect(btn.attributes('style')).toContain('bottom: 40px');
        expect(wrapper.find(`.${prefixCls}-icon`).exists()).toBe(true);
    });

    test('visibilityHeight 阈值分支', async () => {
        docScroll.set(250);
        const wrapper = _mount({ visibilityHeight: 300 });
        await nextTick();
        // 250 < 300 不显示
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        wrapper.unmount();

        docScroll.set(350);
        const wrapper2 = _mount({ visibilityHeight: 300 });
        await nextTick();
        // 350 >= 300 显示
        expect(wrapper2.find(`.${prefixCls}`).exists()).toBe(true);
    });

    test('监听 scroll 事件切换显隐', async () => {
        docScroll.set(0);
        const wrapper = _mount();
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);

        docScroll.set(250);
        document.dispatchEvent(new Event('scroll'));
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);

        // 滚回顶部，scroll 处理函数被节流，需等待节流触发
        docScroll.set(0);
        document.dispatchEvent(new Event('scroll'));
        // 节流后隐藏：waitFor 轮询（比盲等 350ms 更快）
        await vi.waitFor(() => {
            expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        });
    });

    test('点击回到顶部并触发 click 事件', async () => {
        docScroll.set(250);
        const scrollToSpy = vi.fn();
        document.documentElement.scrollTo = scrollToSpy;
        const wrapper = _mount();
        await nextTick();

        await wrapper.find(`.${prefixCls}`).trigger('click');
        expect(scrollToSpy).toHaveBeenCalledTimes(1);
        expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(wrapper.emitted('click')).toHaveLength(1);
    });

    test('target 指定容器时跟随容器滚动', async () => {
        const target = document.createElement('div');
        document.body.appendChild(target);
        const targetScroll = mockScrollTop(target);
        targetScroll.set(250);
        const targetScrollTo = vi.fn();
        target.scrollTo = targetScrollTo;

        const wrapper = _mount({ target });
        await nextTick();
        // 初始化时按容器 scrollTop 计算可见性
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);

        await wrapper.find(`.${prefixCls}`).trigger('click');
        expect(targetScrollTo).toHaveBeenCalledWith({
            top: 0,
            behavior: 'smooth',
        });

        // 容器滚回顶部后隐藏
        targetScroll.set(0);
        target.dispatchEvent(new Event('scroll'));
        await wait(350);
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);

        target.remove();
    });

    test('default slot 自定义内容', async () => {
        docScroll.set(250);
        const wrapper = _mount({}, { default: () => h('span', 'to top') });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).text()).toContain('to top');
    });
});
