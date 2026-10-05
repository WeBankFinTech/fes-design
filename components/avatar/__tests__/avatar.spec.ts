import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import FAvatar from '../avatar';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('avatar');

describe('FAvatar', () => {
    test('默认渲染圆形头像与插槽内容', async () => {
        const wrapper = mount(FAvatar, {
            slots: {
                default: () => h('span', { class: 'avatar-text' }, 'FES'),
            },
        });
        await nextTick();
        const avatar = wrapper.find(`.${prefixCls}`);
        expect(avatar.exists()).toBe(true);
        expect(avatar.classes()).toContain(`${prefixCls}-shape-circle`);
        expect(wrapper.find(`.${prefixCls}-content`).text()).toBe('FES');
        // 默认 size 为 middle，对应 32px
        expect(avatar.element.style.width).toBe('32px');
        expect(avatar.element.style.height).toBe('32px');
        expect(wrapper.find('img').exists()).toBe(false);
    });

    test('src 渲染 img 并应用 fit', async () => {
        const wrapper = mount(FAvatar, {
            props: {
                src: 'https://example.com/a.png',
                fit: 'cover',
            },
        });
        await nextTick();
        const img = wrapper.find('img');
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe('https://example.com/a.png');
        expect(img.element.style.objectFit).toBe('cover');
    });

    test('shape 为 square 时应用方形 class', async () => {
        const wrapper = mount(FAvatar, {
            props: { shape: 'square' },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).classes()).toContain(
            `${prefixCls}-shape-square`,
        );
    });

    test('size 为 number 时应用宽高', async () => {
        const wrapper = mount(FAvatar, {
            props: { size: 100 },
        });
        await nextTick();
        const avatar = wrapper.find(`.${prefixCls}`);
        expect(avatar.element.style.width).toBe('100px');
        expect(avatar.element.style.height).toBe('100px');
    });

    test('size 为 string 时按预设映射宽高', async () => {
        const wrapper = mount(FAvatar, {
            props: { size: 'large' },
        });
        await nextTick();
        const avatar = wrapper.find(`.${prefixCls}`);
        expect(avatar.element.style.width).toBe('40px');
        expect(avatar.element.style.height).toBe('40px');
    });

    test('图片加载失败触发 error 并展示字符兜底', async () => {
        const wrapper = mount(FAvatar, {
            props: { src: 'https://example.com/broken.png' },
            slots: {
                default: () => h('span', null, 'FES'),
            },
        });
        await nextTick();
        await wrapper.find('img').trigger('error');
        expect(wrapper.emitted('error')).toBeTruthy();
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.find(`.${prefixCls}-content`).text()).toBe('FES');
        expect(wrapper.find('.fes-design-icon').exists()).toBe(true);
    });

    test('配置 fallbackSrc 时加载失败替换图片地址', async () => {
        const wrapper = mount(FAvatar, {
            props: {
                src: 'https://example.com/broken.png',
                fallbackSrc: 'https://example.com/fallback.png',
            },
        });
        await nextTick();
        await wrapper.find('img').trigger('error');
        expect(wrapper.find('img').attributes('src')).toBe(
            'https://example.com/fallback.png',
        );
        // 兜底图再失败时展示失败图标
        await wrapper.find('img').trigger('error');
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.find('.fes-design-icon').exists()).toBe(true);
    });
});
