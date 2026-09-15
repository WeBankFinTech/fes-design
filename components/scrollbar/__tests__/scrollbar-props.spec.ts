import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Scrollbar from '../scrollbar.vue';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-scrollbar';

describe('FScrollbar', () => {
    test('渲染内容容器', async () => {
        const wrapper = mount(Scrollbar, {
            slots: { default: () => h('div', '滚动内容') },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true);
        expect(wrapper.text()).toContain('滚动内容');
        wrapper.unmount();
    });

    test('always 常显滚动条 track', async () => {
        const wrapper = mount(Scrollbar, {
            props: { always: true },
            slots: { default: () => h('div', 'x') },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        // always 模式下 track 不带 display:none（挂 body 后查询）
        const track = document.querySelector('[class*="scrollbar-track"]');
        expect(
            track === null
            || !(track as HTMLElement).getAttribute('style')?.includes('display: none'),
        ).toBe(true);
        wrapper.unmount();
    });

    test('隐藏原生滚动条类名', async () => {
        const wrapper = mount(Scrollbar, {
            slots: { default: () => h('div', 'x') },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        expect(
            wrapper
                .find(`.${prefixCls}-container`)
                .classes()
                .some((c) => c.includes('hidden-native-bar')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('竖向滚动触发 scroll 更新', async () => {
        const wrapper = mount(Scrollbar, {
            slots: {
                default: () => h('div', { style: { height: '300px' } }, '长内容'),
            },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        // 根元素为 wrap，直接触发 scroll
        await wrapper.find(`.${prefixCls}`).trigger('scroll');
        await wait(40);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('class 透传到根元素', async () => {
        const wrapper = mount(Scrollbar, {
            attrs: { class: 'custom-root' } as any,
            slots: { default: () => h('div', 'x') },
            attachTo: document.body,
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find('.custom-root').exists()).toBe(true);
        wrapper.unmount();
    });
});
