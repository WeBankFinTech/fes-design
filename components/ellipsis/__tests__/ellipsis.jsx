import { mount } from '@vue/test-utils';
import FEllipsis from '../ellipsis.tsx';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('ellipsis');

describe('FEllipsis', () => {
    test('should work with import on demand', () => {
        mount(FEllipsis);
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
                default: () => (
                    <div>
                        电灯熄灭 物换星移 泥牛入海
                        <br />
                        黑暗好像 一颗巨石 按在胸口
                        <br />
                        独脚大盗 百万富翁 摸爬滚打
                    </div>
                ),
            },
        });

        expect(wrapper.find(`.${prefixCls}`).classes()).toContain(
            'is-line-clamp',
        );
    });

    // TODO: 待测
    test('tooltip', async () => {
        expect(document.body.innerHTML).toBe('');
    });
});
