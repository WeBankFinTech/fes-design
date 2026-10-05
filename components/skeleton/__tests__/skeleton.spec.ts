import { h } from 'vue';
import { mount } from '@vue/test-utils';
import { FSkeleton } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('skeleton');

describe('FSkeleton', () => {
    test('基础渲染：默认带 sharp 与 animated class', () => {
        const wrapper = mount(FSkeleton);
        const el = wrapper.find(`.${prefixCls}`);
        expect(el.exists()).toBe(true);
        expect(el.classes()).toContain('is-sharp');
        expect(el.classes()).toContain('is-animated');
        expect(el.classes()).not.toContain('is-text');
        expect(el.classes()).not.toContain('is-circle');
        expect(el.classes()).not.toContain('is-round');
        wrapper.unmount();
    });

    test('修饰 class：text / round / circle / size', () => {
        const wrapper = mount(FSkeleton, {
            props: { text: true, round: true, circle: true, size: 'large' },
        });
        const el = wrapper.find(`.${prefixCls}`);
        expect(el.classes()).toContain('is-text');
        expect(el.classes()).toContain('is-round');
        expect(el.classes()).toContain('is-circle');
        expect(el.classes()).toContain('is-size-large');
        wrapper.unmount();
    });

    test('animated=false / sharp=false 时不带对应 class', () => {
        const wrapper = mount(FSkeleton, {
            props: { animated: false, sharp: false },
        });
        const el = wrapper.find(`.${prefixCls}`);
        expect(el.classes()).not.toContain('is-animated');
        expect(el.classes()).not.toContain('is-sharp');
        wrapper.unmount();
    });

    test('width / height：数字转 px，字符串原样输出', () => {
        const wrapper = mount(FSkeleton, {
            props: { width: 120, height: '50%' },
        });
        const style = wrapper.find(`.${prefixCls}`).attributes('style');
        expect(style).toContain('width: 120px');
        expect(style).toContain('height: 50%');
        wrapper.unmount();
    });

    test('circle：宽高互相兜底（只传 height 时宽取同值）', () => {
        const wrapper = mount(FSkeleton, {
            props: { circle: true, height: 40 },
        });
        const style = wrapper.find(`.${prefixCls}`).attributes('style');
        expect(style).toContain('width: 40px');
        expect(style).toContain('height: 40px');
        wrapper.unmount();
    });

    test('repeat：渲染多个骨架块', () => {
        const wrapper = mount(FSkeleton, {
            props: { repeat: 3 },
        });
        expect(wrapper.findAll(`.${prefixCls}`).length).toBe(3);
        wrapper.unmount();
    });

    test('提供 default slot 时渲染实际内容', () => {
        const wrapper = mount(FSkeleton, {
            slots: {
                default: () =>
                    h('span', { class: 'skeleton-real-content' }, '实际内容'),
            },
        });
        const el = wrapper.find(`.${prefixCls}`);
        expect(el.find('.skeleton-real-content').exists()).toBe(true);
        expect(el.find('.skeleton-real-content').text()).toBe('实际内容');
        wrapper.unmount();
    });

    test('attrs class 透传到根元素', () => {
        const wrapper = mount(FSkeleton, {
            attrs: { class: 'custom-skeleton' },
        });
        const el = wrapper.find(`.${prefixCls}`);
        expect(el.classes()).toContain('custom-skeleton');
        expect(el.classes()).toContain(prefixCls);
        wrapper.unmount();
    });
});
