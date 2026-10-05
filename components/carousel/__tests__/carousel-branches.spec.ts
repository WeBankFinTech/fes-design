import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { describe, expect, test } from 'vitest';
import Carousel from '../carousel';
import CarouselItem from '../carousel-item';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('carousel');

const wrappers: VueWrapper<any>[] = [];
const mountCarousel = (props: Record<string, unknown> = {}) => {
    const items = Array.from({ length: 3 }, (_, index) =>
        h(CarouselItem, { itemkey: `item-${index}` }, { default: () => `content-${index}` }),
    );
    const wrapper = mount(Carousel, { props, slots: { default: () => items } });
    wrappers.push(wrapper);
    return wrapper;
};

const flush = async () => {
    await nextTick();
    await nextTick();
};

afterEach(() => {
    while (wrappers.length) {
        wrappers.pop()?.unmount();
    }
});

describe('FCarousel 方向分支补全（useCarousel direction）', () => {
    test('indicatorPlacement=right：竖直方向 + 右侧指示器', async () => {
        const wrapper = mountCarousel({ autoplay: false, indicatorPlacement: 'right' });
        await flush();
        expect(wrapper.classes(`${prefixCls}-vertical`)).toBe(true);
        expect(wrapper.classes(`${prefixCls}-horizontal`)).toBe(false);
        expect(wrapper.find(`.${prefixCls}-indicators-right`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-indicators-bottom`).exists()).toBe(false);
        // 右侧指示器仍可点击切换
        const indicators = wrapper.findAll(`.${prefixCls}-indicator`);
        await indicators[2].trigger('click');
        await flush();
        expect(wrapper.emitted('change')).toEqual([[2, 0]]);
    });

    test('非法 indicatorPlacement：方向回退空串（无横竖类名）', async () => {
        const wrapper = mountCarousel({
            autoplay: false,
            indicatorPlacement: 'center' as any,
        });
        await flush();
        expect(wrapper.classes(`${prefixCls}-horizontal`)).toBe(false);
        expect(wrapper.classes(`${prefixCls}-vertical`)).toBe(false);
        // 指示器仍渲染（placement=center → 类名 -center）
        expect(wrapper.find(`.${prefixCls}-indicators`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-indicators-center`).exists()).toBe(true);
    });

    test('默认 indicatorPlacement=bottom：水平方向 + 底部指示器', async () => {
        const wrapper = mountCarousel({ autoplay: false });
        await flush();
        expect(wrapper.classes(`${prefixCls}-horizontal`)).toBe(true);
        expect(wrapper.classes(`${prefixCls}-vertical`)).toBe(false);
        expect(wrapper.find(`.${prefixCls}-indicators-bottom`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-indicators-right`).exists()).toBe(false);
    });
});
