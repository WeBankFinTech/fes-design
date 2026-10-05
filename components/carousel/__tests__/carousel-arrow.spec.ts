import { mount } from '@vue/test-utils';
import type { VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Carousel from '../carousel';
import CarouselItem from '../carousel-item';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('carousel');
const flush = async () => {
    await nextTick();
    await nextTick();
};

const mountCarousel = (
    props: Record<string, unknown> = {},
    itemCount = 4,
): VueWrapper<any> => {
    const items = Array.from({ length: itemCount }, (_, index) =>
        h(
            CarouselItem,
            { itemkey: `item-${index}` },
            { default: () => `content-${index}` },
        ));
    return mount(Carousel, {
        props: { autoplay: false, ...props },
        slots: { default: () => items },
    });
};

describe('FCarousel 箭头（arrow.tsx）', () => {
    test('showArrow=always 常显双箭头并点击切换', async () => {
        const wrapper = mountCarousel({ showArrow: 'always' });
        await flush();
        const left = wrapper.find(`.${prefixCls}-arrow-left`);
        const right = wrapper.find(`.${prefixCls}-arrow-right`);
        expect(left.exists()).toBe(true);
        expect(right.exists()).toBe(true);
        await right.trigger('click');
        await new Promise((r) => setTimeout(r, 320));
        await flush();
        const active = wrapper.find(`.${prefixCls}-item.is-active`);
        expect(active.text()).toBe('content-1');
        wrapper.unmount();
    });

    test('左箭头点击回退（首项回绕到末尾）', async () => {
        const wrapper = mountCarousel({ showArrow: 'always' });
        await flush();
        await wrapper.find(`.${prefixCls}-arrow-left`).trigger('click');
        await new Promise((r) => setTimeout(r, 320));
        await flush();
        const active = wrapper.find(`.${prefixCls}-item.is-active`);
        expect(active.text()).toBe('content-3');
        wrapper.unmount();
    });

    test('direction=vertical 时箭头正常渲染', async () => {
        const wrapper = mountCarousel({
            showArrow: 'always',
            direction: 'vertical',
            height: '160px',
        });
        await flush();
        expect(
            wrapper.find(`.${prefixCls}-arrow-left`).exists(),
        ).toBe(true);
        // vertical 下 onEnterArrowButton/onLeaveArrowButton 提前返回
        await wrapper.find(`.${prefixCls}-arrow-left`).trigger('mouseenter');
        await wrapper.find(`.${prefixCls}-arrow-left`).trigger('mouseleave');
        await flush();
        wrapper.unmount();
    });

    test('card 模式 hover 箭头联动 inStage 节点', async () => {
        const wrapper = mountCarousel({ showArrow: 'always', type: 'card' });
        await flush();
        // 水平方向：mouseenter 走 slideItemInStage 匹配循环
        await wrapper.find(`.${prefixCls}-arrow-right`).trigger('mouseenter');
        await flush();
        // mouseleave 重置所有节点 hover
        await wrapper.find(`.${prefixCls}-arrow-right`).trigger('mouseleave');
        await flush();
        const hovered = wrapper.findAll(`.${prefixCls}-item.is-hover`);
        expect(hovered.length).toBe(0);
        wrapper.unmount();
    });

    test('showArrow=hover 默认隐藏箭头', async () => {
        const wrapper = mountCarousel({});
        await flush();
        // hover 模式按钮渲染但 v-show 隐藏（display: none）
        const btn = wrapper.find(`.${prefixCls}-arrow-left`);
        expect(btn.exists()).toBe(true);
        expect(btn.element.getAttribute('style')).toContain('display: none');
        wrapper.unmount();
    });
});
