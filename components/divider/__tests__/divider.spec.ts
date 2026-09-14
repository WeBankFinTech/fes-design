import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FDivider from '../divider';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('divider');

describe('FDivider', () => {
    test('FDivider default render', async () => {
        const wrapper = mount(FDivider);
        await nextTick();
        expect(wrapper.classes()).toContain(prefixCls);
        expect(wrapper.classes()).not.toContain('is-vertical');
        // 默认不垂直，渲染文字容器，默认位置 center
        const text = wrapper.find(`.${prefixCls}-text`);
        expect(text.exists()).toBe(true);
        expect(text.classes()).toContain('is-center');
    });

    test('FDivider default slot', async () => {
        const wrapper = mount(FDivider, {
            slots: {
                default: () => h('span', '分割线标题'),
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-text`).text()).toBe('分割线标题');
    });

    test('FDivider vertical', async () => {
        const wrapper = mount(FDivider, {
            props: {
                vertical: true,
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain('is-vertical');
        // 垂直方向不渲染文字
        expect(wrapper.find(`.${prefixCls}-text`).exists()).toBe(false);
    });

    ['center', 'left', 'right'].forEach((titlePlacement) => {
        test(`FDivider titlePlacement ${titlePlacement}`, async () => {
            const wrapper = mount(FDivider, {
                props: {
                    titlePlacement: titlePlacement as 'center' | 'left' | 'right',
                },
                slots: {
                    default: () => h('span', '标题'),
                },
            });
            await nextTick();
            expect(
                wrapper
                    .find(`.${prefixCls}-text`)
                    .classes(`is-${titlePlacement}`),
            ).toBe(true);
        });
    });
});
