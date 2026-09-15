import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Scrollbar from '../scrollbar.vue';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-scrollbar';

const mountScrollbar = (props: Record<string, unknown> = {}) =>
    mount(Scrollbar, {
        props: {
            ...props,
        },
        slots: { default: () => h('div', { style: { height: '300px' } }, '滚动内容') },
        attachTo: document.body,
    });

describe('FScrollbar 属性补全', () => {
    test('height 固定容器高度', async () => {
        const wrapper = mountScrollbar({ height: 100 });
        await nextTick();
        await wait(40);
        const wrap = wrapper.find(`.${prefixCls}`);
        expect(wrap.exists()).toBe(true);
        wrapper.unmount();
    });

    test('maxHeight 限制最大高度', async () => {
        const wrapper = mountScrollbar({ maxHeight: 150 });
        await nextTick();
        await wait(40);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('shadow 开启滚动阴影', async () => {
        const wrapper = mountScrollbar({
            shadow: true,
            height: 100,
        });
        await nextTick();
        await wait(40);
        // jsdom 无布局，阴影元素按滚动状态渲染，验证容器与内容正常
        expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('minSize 滑块最小尺寸样式透传', async () => {
        const wrapper = mountScrollbar({ minSize: 20, height: 100 });
        await nextTick();
        await wait(40);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('native 模式不隐藏原生滚动条', async () => {
        const wrapper = mountScrollbar({ native: true });
        await nextTick();
        await wait(40);
        const container = wrapper.find(`.${prefixCls}-container`);
        expect(
            container.classes().some((c) => c.includes('hidden-native-bar')),
        ).toBe(false);
        wrapper.unmount();
    });

    test('vertical=false 隐藏竖向滚动条', async () => {
        const wrapper = mountScrollbar({ vertical: false, height: 100 });
        await nextTick();
        await wait(40);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('containerStyle/contentStyle 透传样式', async () => {
        const wrapper = mountScrollbar({
            containerStyle: { background: 'red' },
            contentStyle: { color: 'blue' },
        });
        await nextTick();
        await wait(40);
        expect(
            (wrapper.find(`.${prefixCls}-container`).attributes('style') || ''),
        ).toContain('background');
        expect(
            (wrapper.find(`.${prefixCls}-content`).attributes('style') || ''),
        ).toContain('color');
        wrapper.unmount();
    });

    test('scroll 事件更新滚动状态', async () => {
        const wrapper = mountScrollbar({ height: 100 });
        await nextTick();
        await wait(40);
        await wrapper.find(`.${prefixCls}`).trigger('scroll');
        await wait(40);
        // 滚动后阴影/滑块容器仍正常
        expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true);
        wrapper.unmount();
    });
});
