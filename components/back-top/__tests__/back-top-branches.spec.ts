import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import BackTop from '../backTop';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('back-top');

// jsdom 不支持真实滚动，用可读写 scrollTop 模拟
function mockScrollTop(el: HTMLElement, initial = 0) {
    let value = initial;
    Object.defineProperty(el, 'scrollTop', {
        configurable: true,
        get: () => value,
        set: (val: number) => {
            value = val;
        },
    });
    return {
        get: () => value,
        set: (val: number) => {
            value = val;
        },
    };
}

const wrappers: any[] = [];
const _mount = (props: Record<string, unknown> = {}) => {
    const wrapper = mount(BackTop, { props, attachTo: document.body });
    wrappers.push(wrapper);
    return wrapper;
};

// 不可达分支说明（useBackTop.ts）：
// 1) L17 `if (container.value)` else：init() 总是先给 container 赋值再调用 handleScroll，
//    scroll 监听器也仅在 init 之后挂载，handleScroll 执行期 container 恒非空 → else 不可达。
// 2) L62 `if (visible)` else：visible 是 Ref 对象（ref(false)），`if (visible)` 恒真 →
//    else 不可达；zIndex 递增的真分支由显隐切换用例覆盖。
// 上述均为防御性代码，无法通过真实交互触达，故不硬造用例。
describe('BackTop 分支补全', () => {
    let docScroll: { get: () => number; set: (n: number) => void };

    beforeEach(() => {
        docScroll = mockScrollTop(document.documentElement);
    });

    afterEach(() => {
        while (wrappers.length) {
            wrappers.pop().unmount();
        }
    });

    test('target 变化时重新 init：切换滚动容器、重建监听并重算显隐', async () => {
        docScroll.set(0);
        const wrapper = _mount();
        await nextTick();
        // 默认监听 document，scrollTop=0 → 隐藏
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);

        const target = document.createElement('div');
        document.body.appendChild(target);
        const targetScroll = mockScrollTop(target, 50);
        target.scrollTo = vi.fn();

        // watch(() => props.target) → init()：改监听 target 容器
        await wrapper.setProps({ target });
        await nextTick();
        // init 按新容器 scrollTop=50 < 200 计算 → 仍隐藏
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);

        // 滚动 target 容器触发监听（新容器上的 scroll 监听）
        targetScroll.set(250);
        target.dispatchEvent(new Event('scroll'));
        await vi.waitFor(() => {
            expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        });

        // 点击回顶滚动到 target 容器
        await wrapper.find(`.${prefixCls}`).trigger('click');
        expect(target.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        expect(wrapper.emitted('click')).toHaveLength(1);
        target.remove();
    });

    test('target 非 HTMLElement 时回退 document：target 变化监听不抛错', async () => {
        docScroll.set(250);
        const wrapper = _mount();
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        // 传入非元素 target → instanceof 守卫不生效，保持 document 容器
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        await wrapper.setProps({ target: {} as any });
        await nextTick();
        expect(warnSpy).not.toHaveBeenCalled();
        // 仍监听 document：滚动 document 触发显隐
        docScroll.set(0);
        document.dispatchEvent(new Event('scroll'));
        await vi.waitFor(() => {
            expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        });
        warnSpy.mockRestore();
    });
});
