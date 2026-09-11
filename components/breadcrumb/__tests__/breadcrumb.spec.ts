import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Breadcrumb from '../breadcrumb';
import BreadcrumbItem from '../breadcrumb-item';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('breadcrumb');
const itemPrefixCls = getPrefixCls('breadcrumb-item');

const mountBreadcrumb = (breadcrumbProps = {}, contents: (() => string)[] = []) => mount(Breadcrumb, {
    props: breadcrumbProps,
    slots: {
        default: () => contents.map((content) => h(BreadcrumbItem, null, { default: content })),
    },
});

describe('Breadcrumb', () => {
    test('item 渲染：默认分隔符为 /，每个 item 渲染内容与分隔符', async () => {
        const wrapper = mountBreadcrumb(
            {},
            [() => '首页', () => '列表', () => '详情'],
        );

        expect(wrapper.classes()).toContain(prefixCls);
        // 根节点 fontSize 默认 14
        expect(wrapper.attributes('style')).toContain('font-size: 14px');

        const items = wrapper.findAll(`.${itemPrefixCls}`);
        expect(items.length).toBe(3);
        expect(items[0].text()).toBe('首页/');
        expect(items[2].text()).toBe('详情/');

        // 分隔符是 item 内的独立节点
        const separators = wrapper.findAll(`.${itemPrefixCls}-separator`);
        expect(separators.length).toBe(3);
        expect(separators[0].text()).toBe('/');
    });

    test('separator prop：自定义分隔符', async () => {
        const wrapper = mountBreadcrumb(
            { separator: '-' },
            [() => '首页', () => '列表'],
        );
        await nextTick();

        const separators = wrapper.findAll(`.${itemPrefixCls}-separator`);
        expect(separators.length).toBe(2);
        separators.forEach((separator) => {
            expect(separator.text()).toBe('-');
        });

        // 修改 props 后分隔符同步更新（props 通过 provide 传递）
        await wrapper.setProps({ separator: '>' });
        await nextTick();
        wrapper.findAll(`.${itemPrefixCls}-separator`).forEach((separator) => {
            expect(separator.text()).toBe('>');
        });
    });

    test('separator 为空字符串时分隔符节点不渲染文本', async () => {
        const wrapper = mountBreadcrumb(
            { separator: '' },
            [() => '首页', () => '列表'],
        );
        await nextTick();

        const separators = wrapper.findAll(`.${itemPrefixCls}-separator`);
        expect(separators.length).toBe(2);
        separators.forEach((separator) => {
            expect(separator.text()).toBe('');
        });
        // 内容不受影响
        expect(wrapper.findAll(`.${itemPrefixCls}`)[1].text()).toBe('列表');
    });

    test('点击 item 触发 click 事件', async () => {
        const firstOnClick = vi.fn();
        const secondOnClick = vi.fn();
        const wrapper = mount(Breadcrumb, {
            slots: {
                default: () => [
                    h(BreadcrumbItem, { onClick: firstOnClick }, () => '首页'),
                    h(BreadcrumbItem, { onClick: secondOnClick }, () => '列表'),
                ],
            },
        });
        await nextTick();

        const items = wrapper.findAll(`.${itemPrefixCls}`);
        expect(items.length).toBe(2);

        await items[0].trigger('click');
        expect(firstOnClick).toHaveBeenCalledTimes(1);
        expect(secondOnClick).not.toHaveBeenCalled();

        await items[1].trigger('click');
        expect(secondOnClick).toHaveBeenCalledTimes(1);
    });

    test('href 链接分支：以源码为准，item 根节点为 div，无 a 标签分支；attrs 透传到根节点', async () => {
        const wrapper = mount(Breadcrumb, {
            slots: {
                default: () => [
                    h(BreadcrumbItem, { href: '/home' }, () => '首页'),
                    h(BreadcrumbItem, null, () => '列表'),
                ],
            },
        });
        await nextTick();

        // 源码中 breadcrumb-item 没有基于 href 渲染 <a> 的分支，根节点始终是 div
        const items = wrapper.findAll(`.${itemPrefixCls}`);
        expect(items.length).toBe(2);
        expect(items[0].element.tagName).toBe('DIV');
        expect(wrapper.find('a').exists()).toBe(false);

        // 未声明的 href attr 通过 attrs 透传落在根 div 上
        expect(items[0].attributes('href')).toBe('/home');
        expect(items[1].attributes('href')).toBeUndefined();
    });
});
