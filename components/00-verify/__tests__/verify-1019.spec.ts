// Issue #1019 [Bug] TextHighlight 子节点为「组件+默认插槽」时
// 渲染崩溃 childSlots.map is not a function
// 只验证，不修源码。复现来自 issue：
//   const Child = defineComponent({ name:'HighlightChild',
//     setup(_,{slots}){ return () => h('section', slots.default?.()); } });
//   mount(FTextHighlight, { props:{ searchValues:['插'] },
//     slots:{ default: () => h(Child, null, { default: () => h('em','插槽内容') }) } });
// 根因（issue 已给）：renderNode() 中 child.default() 可能返回单个 VNode 而非数组，未归一化。
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import FTextHighlight from '../../text-highlight/text-highlight';

describe('Issue #1019 FTextHighlight 组件+默认插槽子节点', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    const Child = defineComponent({
        name: 'HighlightChild',
        setup(_, { slots }) {
            return () => h('section', slots.default?.());
        },
    });

    test('默认插槽为组件且组件 default 插槽返回单个 VNode，不应崩溃', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['插'],
            },
            slots: {
                default: () =>
                    h(Child, null, { default: () => h('em', '插槽内容') }),
            },
        });
        expect(wrapper.find('section').exists()).toBe(true);
        expect(wrapper.text()).toContain('插槽内容');
        wrapper.unmount();
    });
});
