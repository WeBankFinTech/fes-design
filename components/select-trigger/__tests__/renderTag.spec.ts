import { mount } from '@vue/test-utils';
import { h } from 'vue';
import RenderTag from '../renderTag';

describe('select-trigger/renderTag', () => {
    test('renderTag 函数优先渲染', () => {
        const wrapper = mount(RenderTag, {
            props: {
                option: { value: 'a', label: 'A' },
                renderTag: ({ option, handleClose }: any) =>
                    h('button', { class: 'custom-tag', onClick: handleClose }, `自定义${option.label}`),
            },
        });
        expect(wrapper.find('.custom-tag').text()).toBe('自定义A');
        wrapper.find('.custom-tag').trigger('click');
        expect(wrapper.emitted('close')).toBeTruthy();
        wrapper.unmount();
    });

    test('无 renderTag 走 default slot', () => {
        const wrapper = mount(RenderTag, {
            slots: { default: () => h('span', '默认标签') },
        });
        expect(wrapper.text()).toBe('默认标签');
        wrapper.unmount();
    });
});
