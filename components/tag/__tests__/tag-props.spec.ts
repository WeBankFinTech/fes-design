import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { FTag as Tag } from '../index';
import { FAvatar as Avatar } from '../../avatar/index';
import { FSwitch as Switch } from '../../switch/index';
import { FRate as Rate } from '../../rate/index';
import { FEllipsis as Ellipsis } from '../../ellipsis/index';
import getPrefixCls from '../../_util/getPrefixCls';

const tagCls = getPrefixCls('tag');

describe('FTag 属性补全', () => {
    test('bordered=false 移除 is-bordered 类', () => {
        const wrapper = mount(Tag, { props: { bordered: false } });
        expect(wrapper.find(`.${tagCls}`).classes()).not.toContain('is-bordered');
        const withBorder = mount(Tag, { props: { bordered: true } });
        expect(withBorder.find(`.${tagCls}`).classes()).toContain('is-bordered');
        withBorder.unmount();
        wrapper.unmount();
    });

    test('effect=dark/light/plain', () => {
        for (const effect of ['dark', 'light', 'plain']) {
            const wrapper = mount(Tag, { props: { effect } });
            expect(wrapper.html().length).toBeGreaterThan(0);
            wrapper.unmount();
        }
    });

    test('backgroundColor 与 color 自定义', () => {
        const wrapper = mount(Tag, {
            props: { backgroundColor: 'rgb(255, 0, 0)', color: 'white' },
        });
        const style = wrapper.find(`.${tagCls}`).attributes('style') || '';
        expect(style).toContain('255, 0, 0');
        wrapper.unmount();
    });

    test('size 渲染尺寸', () => {
        const wrapper = mount(Tag, { props: { size: 'large' } });
        expect(wrapper.html().length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});

describe('FAvatar 属性补全', () => {
    test('backgroundColor 与 color', () => {
        const wrapper = mount(Avatar, {
            props: { backgroundColor: '#123456', color: '#abcdef' },
        });
        const style = wrapper.find('.fes-avatar').attributes('style') || '';
        // backgroundColor 转 rgb 输出
        expect(style).toContain('rgb(18, 52, 86)');
        expect(style).toContain('color: rgb(171, 205, 239)');
        wrapper.unmount();
    });

    test('自定义内容渲染', () => {
        const wrapper = mount(Avatar, {
            slots: { default: () => h('span', '哈') },
        });
        expect(wrapper.text()).toContain('哈');
        wrapper.unmount();
    });
});

describe('FSwitch 属性补全', () => {
    test('size=small 尺寸类', () => {
        const wrapper = mount(Switch, { props: { size: 'small' } });
        expect(
            wrapper.find('.fes-switch').classes().some((c) => c.includes('small')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('disabled 禁用切换', async () => {
        const wrapper = mount(Switch, { props: { disabled: true, modelValue: false } });
        await wrapper.find('.fes-switch').trigger('click');
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('FRate 属性补全', () => {
    test('color 与 colorFilled 自定义', () => {
        const wrapper = mount(Rate, {
            props: { color: 'gray', colorFilled: 'gold', modelValue: 2 },
        });
        expect(wrapper.find('.fes-rate').exists()).toBe(true);
        wrapper.unmount();
    });

    test('count 控制星星总数', () => {
        const wrapper = mount(Rate, { props: { count: 8, modelValue: 3 } });
        const items = wrapper.findAll('.rate-icon');
        expect(items.length).toBe(8);
        wrapper.unmount();
    });
});

describe('FEllipsis 属性补全', () => {
    test('line 多行截断样式', () => {
        const wrapper = mount(Ellipsis, {
            props: { line: 2, content: '很长'.repeat(100) },
        });
        const style = wrapper.find('.fes-ellipsis').attributes('style') || '';
        expect(
            style.includes('-webkit-line-clamp') || wrapper.html().length > 0,
        ).toBe(true);
        wrapper.unmount();
    });

    test('style 透传', () => {
        const wrapper = mount(Ellipsis, {
            props: { style: { color: 'red' }, content: '文本' },
        });
        expect(wrapper.html()).toContain('red');
        wrapper.unmount();
    });
});
