import { mount } from '@vue/test-utils';
import { h } from 'vue';
import Button from '../button';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('btn');

describe('FButton 属性', () => {
    test('htmlType 渲染到原生 button type', () => {
        const wrapper = mount(Button, { props: { htmlType: 'submit' } });
        expect(wrapper.find('button').attributes('type')).toBe('submit');
        wrapper.unmount();
    });

    test('size=small/large 渲染对应类名', () => {
        const small = mount(Button, { props: { size: 'small' } });
        expect(small.find(`.${prefixCls}-small`).exists()).toBe(true);
        const large = mount(Button, { props: { size: 'large' } });
        expect(large.find(`.${prefixCls}-large`).exists()).toBe(true);
        // middle 为默认，无 size 类名
        const middle = mount(Button, { props: { size: 'middle' } });
        expect(middle.find(`.${prefixCls}-middle`).exists()).toBe(false);
        small.unmount();
        large.unmount();
        middle.unmount();
    });

    test('iconPlacement=right 图标渲染在右侧', () => {
        const wrapper = mount(Button, {
            props: { iconPlacement: 'right' },
            slots: { icon: () => h('i', { class: 'my-icon' }), default: () => '按钮' },
        });
        const icon = wrapper.find(`.${prefixCls}-icon`);
        expect(icon.exists()).toBe(true);
        expect(icon.classes()).toContain('is-right');
        // 右侧图标在文本之后
        expect(wrapper.text()).toContain('按钮');
        wrapper.unmount();
    });

    test('iconPlacement=left（默认）图标渲染在左侧', () => {
        const wrapper = mount(Button, {
            slots: { icon: () => h('i', { class: 'my-icon' }), default: () => '按钮' },
        });
        const icon = wrapper.find(`.${prefixCls}-icon`);
        expect(icon.exists()).toBe(true);
        expect(icon.classes()).not.toContain('is-right');
        wrapper.unmount();
    });

    test('loading 时不渲染 icon slot', () => {
        const wrapper = mount(Button, {
            props: { loading: true },
            slots: { icon: () => h('i', { class: 'my-icon' }), default: () => '按钮' },
        });
        expect(wrapper.find('.my-icon').exists()).toBe(false);
        // 有 loading 图标
        expect(wrapper.find(`.${prefixCls}-loading-icon`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('disabled=true 阻止 click 事件', async () => {
        const wrapper = mount(Button, { props: { disabled: true } });
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
        expect(wrapper.find('button').attributes('disabled')).toBeDefined();
        wrapper.unmount();
    });

    test('disabled=null 回退表单禁用态（无表单时不禁用）', async () => {
        const wrapper = mount(Button, { props: { disabled: null } });
        expect(wrapper.find('button').attributes('disabled')).toBeUndefined();
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toBeTruthy();
        wrapper.unmount();
    });

    test('loading=true 阻止 click 事件', async () => {
        const wrapper = mount(Button, { props: { loading: true } });
        await wrapper.find('button').trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
        expect(wrapper.find('button').classes()).toContain('is-loading');
        wrapper.unmount();
    });
});
