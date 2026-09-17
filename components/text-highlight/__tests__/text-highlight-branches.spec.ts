import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import FTextHighlight from '../text-highlight';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('text-highlight');

// text-highlight.tsx 不可达分支说明（不改源码前提下，保留未覆盖）：
// - L39（renderHighLight 内 JSX 插件注入的 `_isSlot(part) ? part : ...` consequent）：
//   part 恒为 split() 产生的字符串，`typeof part === 'function'` 恒 false → 直接透传无入口。
// - L101 `else if (isObject(NodeType))` 的 else 分支：NodeType 为 VNodeTypes（Text 符号 |
//   字符串 | 组件对象），前两分支排除后 isObject 恒为 true，不存在剩余类型。
// - L109（ChildComponent 三元 `_isSlot(childSlots.map(renderNode))` consequent）：
//   map 恒返回数组，`_isSlot([])` 恒 false → 直接透传无入口。
// - L12（`_isSlot` helper 的 `&& !isVNode(s)` 第三操作数）：仅当 createVNode 的 children
//   为普通对象时求值 —— 「插槽对象形态 children」用例覆盖。

describe('FTextHighlight 分支补全', () => {
    test('无默认插槽：渲染空容器', () => {
        const wrapper = mount(FTextHighlight);
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.text()).toBe('');
        expect(wrapper.findAll('mark')).toHaveLength(0);
    });

    test('数组子节点含非字符串/非 VNode 元素：直通渲染不崩溃', () => {
        const wrapper = mount(FTextHighlight, {
            props: { searchValues: ['词'] },
            slots: {
                default: () => h('p', null, [h('b', '加粗词'), 123]),
            },
        });
        const p = wrapper.find('p');
        expect(p.exists()).toBe(true);
        expect(p.text()).toBe('加粗词123');
        // 字符串部分仍正常高亮
        expect(p.findAll('mark')).toHaveLength(1);
        expect(p.find('mark').text()).toBe('词');
        wrapper.unmount();
    });

    test('字符串标签节点 children 为插槽对象：直接透传渲染（_isSlot 第三操作数）', () => {
        // h() 创建 VNode 时会立即规范化对象 children（调用 default() 后替换为数组），
        // 因此需在创建后手工写入 raw 对象 children，模拟编译产物中未经规范化的
        // children 表达式的真实形态（_isSlot 收到对象时第三操作数 !isVNode(s) 才会求值）。
        const child = h('div');
        (child as any).children = { default: () => ['插槽对象-透传'] };
        const wrapper = mount(FTextHighlight, {
            props: { searchValues: ['透传'] },
            slots: {
                default: () => [child],
            },
        });
        const div = wrapper.find('div');
        expect(div.exists()).toBe(true);
        expect(div.text()).toContain('插槽对象-透传');
        wrapper.unmount();
    });

    test('组件对象节点无 children：childSlots 回退空数组', () => {
        const Empty = defineComponent({
            name: 'EmptyChild',
            setup(_, { slots }) {
                return () => {
                    const content = slots.default?.() || [];
                    // 父级 childSlots=[] → 插槽内只有一个空 VNode（children 为空数组）
                    // → 无真实内容 → 渲染自身兜底文案
                    const hasReal = content.some(
                        (c: any) => c && c.children && c.children.length,
                    );
                    return h(
                        'section',
                        { class: 'empty-child' },
                        hasReal ? content : '自身内容',
                    );
                };
            },
        });
        const wrapper = mount(FTextHighlight, {
            props: { searchValues: ['词'] },
            slots: {
                default: () => h(Empty),
            },
        });
        const section = wrapper.find('.empty-child');
        expect(section.exists()).toBe(true);
        expect(section.text()).toBe('自身内容');
        wrapper.unmount();
    });

    test('自定义 markTextStyle 作用于高亮片段（样式类名组合）', () => {
        const wrapper = mount(FTextHighlight, {
            props: {
                searchValues: ['样式'],
                markTextStyle: { color: 'red', fontWeight: 'bold' },
            },
            slots: {
                default: () => '带样式的文本',
            },
        });
        const mark = wrapper.find('mark.highlight');
        expect(mark.exists()).toBe(true);
        expect(mark.attributes('style')).toContain('red');
        expect(mark.attributes('style')).toContain('bold');
        wrapper.unmount();
    });
});
