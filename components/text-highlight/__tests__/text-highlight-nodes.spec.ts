import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import FTextHighlight from '../text-highlight';

describe('FTextHighlight 自定义渲染分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('默认插槽为 VNode 数组：递归处理子节点', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['高亮'],
            },
            slots: {
                default: () => [
                    h('span', '前置'),
                    h('span', '高亮词'),
                    h('b', '加粗高亮'),
                ],
            },
        });
        const marks = wrapper.findAll('mark');
        expect(marks.length).toBeGreaterThan(0);
        expect(wrapper.text()).toContain('高亮词');
        wrapper.unmount();
    });

    test('searchValues 命中嵌套元素内的文本', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['键'],
            },
            slots: {
                default: () => h('p', [h('i', '关键'), '字尾']),
            },
        });
        expect(wrapper.findAll('mark').length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});

describe('FTextHighlight 节点类型分支', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('字符串标签节点（NodeType 为标签名）', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['词'],
            },
            slots: {
                default: () => h('b', '标签词'),
            },
        });
        expect(wrapper.find('b').exists()).toBe(true);
        expect(wrapper.findAll('mark').length).toBeGreaterThan(0);
        wrapper.unmount();
    });

    test('组件对象节点带 default 插槽', () => {
        const Child = defineComponent({
            name: 'HighlightChild',
            setup(_, { slots }) {
                return () => h('section', slots.default?.());
            },
        });
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['插'],
            },
            slots: {
                default: () =>
                    h(Child, null, // 注意：child.default() 必须返回数组，单 VNode 会触发 childSlots.map 崩溃（已记录 bug）
                        { default: () => [h('em', '插槽内容')] }),
            },
        });
        expect(wrapper.find('section').exists()).toBe(true);
        expect(wrapper.text()).toContain('插槽内容');
        wrapper.unmount();
    });
});
