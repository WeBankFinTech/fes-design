import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FSpin from '../spin';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('spin');

describe('FSpin', () => {
    test('无默认插槽时 show 默认渲染 spin 图标', async () => {
        const wrapper = mount(FSpin);
        await nextTick();
        const spin = wrapper.find(`.${prefixCls}`);
        expect(spin.exists()).toBe(true);
        expect(spin.classes()).toContain('is-size-middle');
        // 默认使用 LoadingOutlined 图标
        expect(spin.find('svg').exists()).toBe(true);
        // 无 default slot 时不渲染容器
        expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(false);
    });

    test('show 为 false 时不渲染', async () => {
        const wrapper = mount(FSpin, { props: { show: false } });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
    });

    test('spinning 开关切换显示', async () => {
        const wrapper = mount(FSpin, { props: { show: true } });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        await wrapper.setProps({ show: false });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        await wrapper.setProps({ show: true });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
    });

    test('delay 延迟展示', async () => {
        vi.useFakeTimers();
        const wrapper = mount(FSpin, { props: { show: false, delay: 300 } });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        await wrapper.setProps({ show: true });
        await nextTick();
        // 延迟时间内仍未渲染
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(false);
        vi.advanceTimersByTime(300);
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        vi.useRealTimers();
    });

    test('有默认插槽时包裹内容并切换 spinning 状态', async () => {
        const wrapper = mount(FSpin, {
            slots: {
                default: () => h('div', { class: 'spin-body' }, '内容'),
            },
        });
        await nextTick();
        expect(wrapper.find('.spin-body').exists()).toBe(true);
        const container = wrapper.find(`.${prefixCls}-container`);
        expect(container.exists()).toBe(true);
        expect(container.classes()).toContain('is-spinning');
        expect(wrapper.find(`.${prefixCls}-wrapper`).exists()).toBe(true);
        await wrapper.setProps({ show: false });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-container`).classes()).not.toContain(
            'is-spinning',
        );
    });

    test('description 展示文本', async () => {
        const wrapper = mount(FSpin, {
            props: { description: '加载中...' },
            slots: {
                default: () => h('div', null, '内容'),
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-description`).text()).toBe(
            '加载中...',
        );
    });

    test('description slot 优先于 description prop', async () => {
        const wrapper = mount(FSpin, {
            props: { description: '加载中...' },
            slots: {
                default: () => h('div', null, '内容'),
                description: () => h('span', null, '插槽描述'),
            },
        });
        await nextTick();
        const desc = wrapper.find(`.${prefixCls}-description`);
        expect(desc.text()).toBe('插槽描述');
    });

    test('icon slot 替换默认图标', async () => {
        const wrapper = mount(FSpin, {
            slots: {
                default: () => h('div', null, '内容'),
                icon: () => h('i', { class: 'custom-icon' }),
            },
        });
        await nextTick();
        expect(wrapper.find('.custom-icon').exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls} svg`).exists()).toBe(false);
    });

    test('stroke 设置图标颜色', async () => {
        const wrapper = mount(FSpin, { props: { stroke: 'rgb(255, 0, 0)' } });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).element.style.color).toBe(
            'rgb(255, 0, 0)',
        );
    });
});
