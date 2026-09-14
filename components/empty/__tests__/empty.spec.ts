import { mount } from '@vue/test-utils';
import { h } from 'vue';
import FEmpty from '../empty.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('empty');

describe('Empty', () => {
    test('default render with default image and description', () => {
        const wrapper = mount(FEmpty);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        // 默认渲染内置 svg 图片
        expect(wrapper.find(`.${prefixCls}-image .empty-svg`).exists()).toBe(
            true,
        );
        // 默认描述文案
        expect(wrapper.find(`.${prefixCls}-description`).text()).toBe(
            '暂无数据',
        );
        // 没有 bottom 插槽时不渲染 bottom 节点
        expect(wrapper.find(`.${prefixCls}-bottom`).exists()).toBe(false);
    });

    test('description prop', () => {
        const wrapper = mount(FEmpty, {
            props: {
                description: '自定义描述',
            },
        });
        expect(wrapper.find(`.${prefixCls}-description`).text()).toBe(
            '自定义描述',
        );
    });

    test('description slot overrides description prop', () => {
        const wrapper = mount(FEmpty, {
            props: {
                description: '自定义描述',
            },
            slots: {
                description: () => '插槽描述',
            },
        });
        expect(wrapper.find(`.${prefixCls}-description`).text()).toBe(
            '插槽描述',
        );
    });

    test('image slot', () => {
        const wrapper = mount(FEmpty, {
            slots: {
                image: () => h('img', { class: 'custom-image', alt: '自定义图片' }),
            },
        });
        expect(wrapper.find(`.${prefixCls}-image .custom-image`).exists()).toBe(
            true,
        );
        // 插槽存在时不渲染默认图片
        expect(wrapper.find(`.${prefixCls}-image .empty-svg`).exists()).toBe(
            false,
        );
    });

    test('imageSrc prop', () => {
        const wrapper = mount(FEmpty, {
            props: {
                imageSrc: 'https://example.com/empty.png',
            },
        });
        const img = wrapper.find(`.${prefixCls}-image img.empty-img`);
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe('https://example.com/empty.png');
    });

    test('default slot renders into bottom', () => {
        const wrapper = mount(FEmpty, {
            slots: {
                default: () => h('button', '重新加载'),
            },
        });
        const bottom = wrapper.find(`.${prefixCls}-bottom`);
        expect(bottom.exists()).toBe(true);
        expect(bottom.find('button').text()).toBe('重新加载');
    });

    test('imageStyle prop', () => {
        const wrapper = mount(FEmpty, {
            props: {
                imageStyle: { width: '120px', height: '120px' },
            },
        });
        const style = wrapper.find(`.${prefixCls}-image`).attributes('style');
        expect(style).toContain('width: 120px;');
        expect(style).toContain('height: 120px;');
    });
});
