import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FEllipsis from '../ellipsis.tsx';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('ellipsis');

describe('FEllipsis', () => {
    test('should work with import on demand', () => {
        const wrapper = mount(FEllipsis);
        expect(wrapper.exists()).toBe(true);
    });

    test('should work with base', async () => {
        const wrapper = mount(FEllipsis, {
            props: { style: { 'max-width': '240px' } },
            slots: {
                default: () =>
                    '住在我心里孤独的 孤独的海怪 痛苦之王 开始厌倦 深海的光 停滞的海浪',
            },
        });

        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}`).attributes('style')).toContain(
            'text-overflow: ellipsis;',
        );
    });

    test('should work with `line-clamp` prop', async () => {
        const wrapper = mount(FEllipsis, {
            props: { line: 2 },
            slots: {
                default: () =>
                    h('div', [
                        '电灯熄灭 物换星移 泥牛入海',
                        h('br'),
                        '黑暗好像 一颗巨石 按在胸口',
                        h('br'),
                        '独脚大盗 百万富翁 摸爬滚打',
                    ]),
            },
        });

        const style = wrapper.find(`.${prefixCls}`).attributes('style');
        expect(style).toContain('-webkit-line-clamp');
    });

    test('tooltip=false 不包裹 Tooltip（纯文本渲染）', async () => {
        const wrapper = mount(FEllipsis, {
            props: { content: '短文本', tooltip: false },
        });
        await nextTick();
        // tooltip=false → renderTrigger 直出（ellipsis.tsx:136-137 分支）
        expect(wrapper.text()).toBe('短文本');
        // 不应出现 tooltip 弹层结构
        expect(document.body.querySelector('.fes-tooltip')).toBeNull();
        wrapper.unmount();
    });

    test('tooltip=true（默认）包裹 Tooltip 组件', async () => {
        const wrapper = mount(FEllipsis, {
            props: { content: '一段可能溢出的文本内容' },
        });
        await nextTick();
        // 默认 tooltip=true → 外层是 FTooltip（组件树可寻）
        const tooltip = wrapper.findComponent({ name: 'FTooltip' });
        expect(tooltip.exists()).toBe(true);
        wrapper.unmount();
    });
});
