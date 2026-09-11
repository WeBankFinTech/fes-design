import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import Carousel from '../carousel';
import CarouselItem from '../carousel-item';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('carousel');

const wrappers: VueWrapper<any>[] = [];

const unmountAll = () => {
    let wrapper = wrappers.pop();
    while (wrapper) {
        wrapper.unmount();
        wrapper = wrappers.pop();
    }
};

// 挂载 FCarousel + N 个 FCarouselItem
const mountCarousel = (props: Record<string, unknown> = {}, itemCount = 3) => {
    const items = Array.from({ length: itemCount }, (_, index) =>
        h(
            CarouselItem,
            { itemkey: `item-${index}` },
            { default: () => `content-${index}` },
        ));
    const wrapper = mount(Carousel, {
        props,
        slots: { default: () => items },
    });
    wrappers.push(wrapper);
    return wrapper;
};

// 激活流程：mounted 的 nextTick 回调里设置 activeIndex，再由 watch 触发
// 子项 translateItem，因此连续两个 nextTick 保证渲染完成
const flush = async () => {
    await nextTick();
    await nextTick();
};

const getItems = (wrapper: VueWrapper<any>) =>
    wrapper.findAll(`.${prefixCls}-item`);

afterEach(() => {
    unmountAll();
});

// ---------------- 基础渲染 ----------------

describe('基础渲染', () => {
    test('容器结构、item 数量、类名与内容', () => {
        const wrapper = mountCarousel({ autoplay: false, height: '240px' });
        expect(wrapper.classes(prefixCls)).toBe(true);
        expect(wrapper.classes(`${prefixCls}-horizontal`)).toBe(true);
        expect(wrapper.find(`.${prefixCls}-slides`).exists()).toBe(true);
        const list = wrapper.find(`.${prefixCls}-list`);
        expect(list.exists()).toBe(true);
        // jsdom 无真实布局，只断言 height 透传到 list 的行内样式
        expect(list.attributes('style')).toContain('240px');
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers.length).toBe(3);
        itemWrappers.forEach((item, index) => {
            expect(item.text()).toBe(`content-${index}`);
        });
    });

    test('挂载后激活首项：item 由隐藏变为可见并带 is-active', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        // 激活前 itemReady=false，v-show 注入 display:none
        // 注：此处只能断言 style 属性，不能调用 isVisible()/getComputedStyle()
        // （jsdom 的计算样式缓存不会随后续行内样式移除而失效）
        getItems(wrapper).forEach((item) => {
            expect(item.attributes('style')).toContain('display: none');
        });
        await flush();
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers[0].classes('is-active')).toBe(true);
        expect(itemWrappers[1].classes('is-active')).toBe(false);
        itemWrappers.forEach((item) => {
            expect(item.attributes('style')).not.toContain('display: none');
        });
    });

    test('initialIndex 指定初始激活项', async () => {
        const wrapper = mountCarousel({ autoplay: false, initialIndex: 2 });
        await flush();
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers[2].classes('is-active')).toBe(true);
        expect(itemWrappers[0].classes('is-active')).toBe(false);
        // 对应指示器同步激活
        const indicators = wrapper.findAll(`.${prefixCls}-indicator`);
        expect(indicators[2].classes('is-active')).toBe(true);
    });

    test('initialIndex 越界时保持未激活', async () => {
        const wrapper = mountCarousel({ autoplay: false, initialIndex: 5 });
        await flush();
        getItems(wrapper).forEach((item) => {
            expect(item.classes('is-active')).toBe(false);
            // 从未激活过，itemReady 仍为 false，v-show 保持 display:none
            expect(item.attributes('style')).toContain('display: none');
        });
        expect(wrapper.emitted('change')).toBeUndefined();
    });

    test('初始激活不触发 change，暴露的 next() 切换并触发 change', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        expect(wrapper.emitted('change')).toBeUndefined();
        (wrapper.vm as any).next();
        await flush();
        // change payload: [current, prev]
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
    });

    test('切换时新旧两项带 is-animating', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        (wrapper.vm as any).next();
        await flush();
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers[0].classes('is-animating')).toBe(true);
        expect(itemWrappers[1].classes('is-animating')).toBe(true);
        expect(itemWrappers[2].classes('is-animating')).toBe(false);
    });
});

// ---------------- indicator 指示器 ----------------

describe('indicator 指示器', () => {
    test('数量、激活态与点击切换', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        let indicators = wrapper.findAll(`.${prefixCls}-indicator`);
        expect(indicators.length).toBe(3);
        expect(indicators[0].classes('is-active')).toBe(true);
        expect(wrapper.find(`.${prefixCls}-indicators`).exists()).toBe(true);
        expect(
            wrapper.find(`.${prefixCls}-indicators-bottom`).exists(),
        ).toBe(true);

        await indicators[2].trigger('click');
        await flush();
        expect(wrapper.emitted('change')).toEqual([[2, 0]]);
        indicators = wrapper.findAll(`.${prefixCls}-indicator`);
        expect(indicators[2].classes('is-active')).toBe(true);
        expect(indicators[0].classes('is-active')).toBe(false);
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
    });

    test('indicatorType：默认 linear，dot 时类名切换', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        expect(wrapper.find(`.${prefixCls}-indicator-linear`).exists())
            .toBe(true);
        expect(wrapper.find(`.${prefixCls}-indicator-dot`).exists()).toBe(
            false,
        );

        const dotWrapper = mountCarousel({
            autoplay: false,
            indicatorType: 'dot',
        });
        await flush();
        expect(dotWrapper.find(`.${prefixCls}-indicator-dot`).exists())
            .toBe(true);
        expect(dotWrapper.find(`.${prefixCls}-indicator-linear`).exists())
            .toBe(false);
    });

    test('indicatorPlacement 决定指示器位置类名与整体方向', async () => {
        const topWrapper = mountCarousel({
            autoplay: false,
            indicatorPlacement: 'top',
        });
        await flush();
        expect(topWrapper.classes(`${prefixCls}-horizontal`)).toBe(true);
        expect(topWrapper.find(`.${prefixCls}-indicators-top`).exists())
            .toBe(true);

        const leftWrapper = mountCarousel({
            autoplay: false,
            indicatorPlacement: 'left',
        });
        await flush();
        expect(leftWrapper.classes(`${prefixCls}-vertical`)).toBe(true);
        expect(leftWrapper.find(`.${prefixCls}-indicators-left`).exists())
            .toBe(true);
    });

    test('indicatorPosition=outside 与 type=card 追加 outside 类名', async () => {
        const outsideWrapper = mountCarousel({
            autoplay: false,
            indicatorPosition: 'outside',
        });
        await flush();
        expect(
            outsideWrapper.find(`.${prefixCls}-indicators-outside`).exists(),
        ).toBe(true);

        const cardWrapper = mountCarousel({
            autoplay: false,
            type: 'card',
        });
        await flush();
        expect(
            cardWrapper.find(`.${prefixCls}-indicators-outside`).exists(),
        ).toBe(true);

        const normalWrapper = mountCarousel({ autoplay: false });
        await flush();
        expect(
            normalWrapper.find(`.${prefixCls}-indicators-outside`).exists(),
        ).toBe(false);
    });

    test('trigger=hover 时 mouseenter 切换', async () => {
        const wrapper = mountCarousel({ autoplay: false, trigger: 'hover' });
        await flush();
        await wrapper.findAll(`.${prefixCls}-indicator`)[2]
            .trigger('mouseenter');
        await flush();
        // throttle 首次立即执行
        expect(wrapper.emitted('change')).toEqual([[2, 0]]);
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
    });

    test('默认 trigger=click 时 mouseenter 不切换', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        await wrapper.findAll(`.${prefixCls}-indicator`)[2]
            .trigger('mouseenter');
        await flush();
        expect(wrapper.emitted('change')).toBeUndefined();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
    });
});

// ---------------- arrow 箭头 ----------------

describe('arrow 箭头', () => {
    test('showArrow=always 常显，点击右箭头切换', async () => {
        const wrapper = mountCarousel({
            autoplay: false,
            showArrow: 'always',
        });
        await flush();
        const right = wrapper.find(`.${prefixCls}-arrow-right`);
        expect(wrapper.find(`.${prefixCls}-arrow-left`).isVisible()).toBe(true);
        expect(right.isVisible()).toBe(true);
        await right.trigger('click');
        await flush();
        // throttle leading 首次立即触发
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
    });

    test('showArrow=always 时点击左箭头回退', async () => {
        const wrapper = mountCarousel({
            autoplay: false,
            showArrow: 'always',
        });
        await flush();
        (wrapper.vm as any).next();
        await flush();
        await wrapper.find(`.${prefixCls}-arrow-left`).trigger('click');
        await flush();
        expect(wrapper.emitted('change')).toEqual([[1, 0], [0, 1]]);
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
    });

    test('默认 showArrow=hover：隐藏，mouseenter 后显示', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        expect(wrapper.find(`.${prefixCls}-arrow-right`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-arrow-right`).isVisible()).toBe(
            false,
        );
        expect(wrapper.find(`.${prefixCls}-arrow-left`).isVisible()).toBe(
            false,
        );
        await wrapper.trigger('mouseenter');
        await flush();
        expect(wrapper.find(`.${prefixCls}-arrow-right`).isVisible()).toBe(
            true,
        );
        expect(wrapper.find(`.${prefixCls}-arrow-left`).isVisible()).toBe(true);
    });

    test('showArrow=never 不渲染箭头', async () => {
        const wrapper = mountCarousel({
            autoplay: false,
            showArrow: 'never',
        });
        await flush();
        expect(wrapper.find(`.${prefixCls}-arrow-right`).exists()).toBe(false);
        expect(wrapper.find(`.${prefixCls}-arrow-left`).exists()).toBe(false);
    });

    test('竖直方向（indicatorPlacement=left）不渲染箭头', async () => {
        const wrapper = mountCarousel({
            autoplay: false,
            showArrow: 'always',
            indicatorPlacement: 'left',
        });
        await flush();
        expect(wrapper.find(`.${prefixCls}-arrow-right`).exists()).toBe(false);
        expect(wrapper.find(`.${prefixCls}-arrow-left`).exists()).toBe(false);
    });

    test('loop=false 边界：首项隐藏左箭头，末项隐藏右箭头', async () => {
        vi.useFakeTimers();
        const wrapper = mountCarousel({
            autoplay: false,
            showArrow: 'always',
            loop: false,
        });
        await flush();
        expect(wrapper.find(`.${prefixCls}-arrow-left`).isVisible()).toBe(
            false,
        );
        // 两次点击间隔需大于 throttle 的 300ms
        await wrapper.find(`.${prefixCls}-arrow-right`).trigger('click');
        await vi.advanceTimersByTimeAsync(300);
        await flush();
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
        expect(wrapper.find(`.${prefixCls}-arrow-left`).isVisible()).toBe(true);
        await wrapper.find(`.${prefixCls}-arrow-right`).trigger('click');
        await vi.advanceTimersByTimeAsync(300);
        await flush();
        expect(wrapper.emitted('change')).toEqual([[1, 0], [2, 1]]);
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
        expect(wrapper.find(`.${prefixCls}-arrow-right`).isVisible()).toBe(
            false,
        );
        unmountAll();
        vi.useRealTimers();
    });
});

// ---------------- autoplay 自动播放 ----------------

describe('autoplay 自动播放', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        unmountAll();
        vi.useRealTimers();
    });

    test('interval 到时自动切换，末尾回绕到第一项（loop）', async () => {
        const wrapper = mountCarousel({ autoplay: true, interval: 1000 });
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);

        await vi.advanceTimersByTimeAsync(1000);
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
        // 初始激活（-1 -> 0）不触发 change
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);

        await vi.advanceTimersByTimeAsync(1000);
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);

        await vi.advanceTimersByTimeAsync(1000);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0], [2, 1], [0, 2]]);
    });

    test('loop=false 时播放到最后一项后停止', async () => {
        const wrapper = mountCarousel({
            autoplay: true,
            interval: 1000,
            loop: false,
        });
        await flush();
        await vi.advanceTimersByTimeAsync(1000);
        await flush();
        await vi.advanceTimersByTimeAsync(1000);
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0], [2, 1]]);

        // 继续推进不再切换
        await vi.advanceTimersByTimeAsync(3000);
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0], [2, 1]]);
    });

    test('autoplay 动态开启与暂停', async () => {
        const wrapper = mountCarousel({ autoplay: false, interval: 500 });
        await flush();
        await vi.advanceTimersByTimeAsync(2000);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);

        await wrapper.setProps({ autoplay: true });
        await vi.advanceTimersByTimeAsync(500);
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);

        await wrapper.setProps({ autoplay: false });
        await vi.advanceTimersByTimeAsync(2000);
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
    });

    test('interval<=0 时不自动播放', async () => {
        const wrapper = mountCarousel({ autoplay: true, interval: 0 });
        await flush();
        await vi.advanceTimersByTimeAsync(5000);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toBeUndefined();
    });

    test('默认 pauseOnHover：hover 暂停、离开恢复', async () => {
        const wrapper = mountCarousel({ autoplay: true, interval: 100 });
        await flush();
        await wrapper.trigger('mouseenter');
        await vi.advanceTimersByTimeAsync(500);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toBeUndefined();

        await wrapper.trigger('mouseleave');
        await vi.advanceTimersByTimeAsync(100);
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
    });

    test('pauseOnHover=false 时 hover 不暂停', async () => {
        const wrapper = mountCarousel({
            autoplay: true,
            interval: 100,
            pauseOnHover: false,
        });
        await flush();
        await wrapper.trigger('mouseenter');
        await vi.advanceTimersByTimeAsync(100);
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
    });
});

// ---------------- loop 与边界 ----------------

describe('loop 与边界', () => {
    test('setActiveItem 越界：loop=true 回绕', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        (wrapper.vm as any).setActiveItem(-1);
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);

        (wrapper.vm as any).setActiveItem(3);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[2, 0], [0, 2]]);
    });

    test('setActiveItem 越界：loop=false 收敛到边界', async () => {
        const wrapper = mountCarousel({ autoplay: false, loop: false });
        await flush();
        (wrapper.vm as any).setActiveItem(-1);
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);

        (wrapper.vm as any).setActiveItem(3);
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
    });

    test('暴露的 prev/next 在 loop=true 下循环切换', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        (wrapper.vm as any).next();
        await flush();
        (wrapper.vm as any).next();
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);

        (wrapper.vm as any).next();
        await flush();
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);

        (wrapper.vm as any).prev();
        await flush();
        expect(getItems(wrapper)[2].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([
            [1, 0],
            [2, 1],
            [0, 2],
            [2, 0],
        ]);
    });

    test('setActiveItem 非法输入告警且不生效，字符串数字可用', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountCarousel({ autoplay: false });
        await flush();

        (wrapper.vm as any).setActiveItem(1.5);
        (wrapper.vm as any).setActiveItem('abc');
        await flush();
        expect(warnSpy).toHaveBeenCalledTimes(2);
        expect(getItems(wrapper)[0].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toBeUndefined();

        (wrapper.vm as any).setActiveItem('1');
        await flush();
        expect(getItems(wrapper)[1].classes('is-active')).toBe(true);
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
        warnSpy.mockRestore();
    });
});

// ---------------- card 模式 ----------------

describe('card 模式', () => {
    test('wrapper/item 类名、遮罩与 outside 指示器', async () => {
        const wrapper = mountCarousel({ autoplay: false, type: 'card' });
        await flush();
        expect(wrapper.classes(`${prefixCls}-card`)).toBe(true);
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers[0].classes(`${prefixCls}-item-card`)).toBe(true);
        expect(itemWrappers[0].classes('is-active')).toBe(true);
        expect(itemWrappers[0].classes('is-in-stage')).toBe(true);
        // 非激活项遮罩可见，激活项遮罩隐藏
        expect(itemWrappers[1].find(`.${prefixCls}-item-mask`).isVisible())
            .toBe(true);
        expect(itemWrappers[0].find(`.${prefixCls}-item-mask`).isVisible())
            .toBe(false);
    });

    test('点击卡片切换激活项并触发 change', async () => {
        const wrapper = mountCarousel({ autoplay: false, type: 'card' });
        await flush();
        await getItems(wrapper)[1].trigger('click');
        await flush();
        const itemWrappers = getItems(wrapper);
        expect(itemWrappers[1].classes('is-active')).toBe(true);
        expect(itemWrappers[0].classes('is-active')).toBe(false);
        expect(wrapper.emitted('change')).toEqual([[1, 0]]);
    });

    test('card 模式 + 竖直方向输出告警', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        mountCarousel({
            autoplay: false,
            type: 'card',
            indicatorPlacement: 'left',
        });
        await flush();
        expect(warnSpy.mock.calls.some((args) =>
            String(args[0]).includes('vertical direction is not supported'),
        )).toBe(true);
        warnSpy.mockRestore();
    });
});
