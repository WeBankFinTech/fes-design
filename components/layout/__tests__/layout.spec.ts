import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FAside, FFooter, FHeader, FLayout, FMain } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('layout');

describe('Layout', () => {
    test('default render with header / main / footer', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(
                        FLayout,
                        {},
                        {
                            default: () => [
                                h(FHeader, () => '头部内容'),
                                h(FMain, () => '主体内容'),
                                h(FFooter, () => '底部内容'),
                            ],
                        },
                    ),
                ],
            },
        });
        await nextTick();
        // 根节点
        expect(wrapper.classes()).toStrictEqual([prefixCls, 'is-root']);
        // 容器
        expect(wrapper.find(`.${prefixCls}-container`).exists()).toBe(true);
        // header / main / footer
        const header = wrapper.find(`.${prefixCls}-header`);
        const main = wrapper.find(`.${prefixCls}-main`);
        const footer = wrapper.find(`.${prefixCls}-footer`);
        expect(header.exists()).toBe(true);
        expect(header.text()).toBe('头部内容');
        expect(main.exists()).toBe(true);
        expect(main.text()).toBe('主体内容');
        expect(footer.exists()).toBe(true);
        expect(footer.text()).toBe('底部内容');
    });

    test('aside makes root layout horizontal and nested layout not root', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FAside, () => '侧边栏'),
                    h(FLayout, { default: () => [h(FMain, () => '主体内容')] }),
                ],
            },
        });
        await nextTick();
        // 存在 aside 子节点时，根 layout 变为水平方向
        expect(wrapper.classes()).toContain('is-horizontal');
        // 嵌套的 layout 不是 root
        const nested = wrapper.find(`.${prefixCls}-container > .${prefixCls}`);
        expect(nested.exists()).toBe(true);
        expect(nested.classes()).toStrictEqual([prefixCls]);
        // aside 默认 placement left，宽度默认 200px
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.classes()).toContain('is-placement-left');
        expect(aside.attributes('style')).toContain('width: 200px;');

        // aside 放在后面时 placement 为 right
        const wrapper2 = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FLayout, { default: () => [h(FMain, () => '主体内容')] }),
                    h(FAside, () => '侧边栏'),
                ],
            },
        });
        await nextTick();
        expect(wrapper2.find(`.${prefixCls}-aside`).classes()).toContain(
            'is-placement-right',
        );
    });

    test('header fixed class', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [h(FHeader, { fixed: true }, () => '头部内容')],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-header`).classes()).toContain(
            'is-fixed',
        );
    });

    test('header without fixed has no is-fixed class', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [h(FHeader, () => '头部内容')],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-header`).classes()).not.toContain(
            'is-fixed',
        );
    });

    test('header inverted / bordered classes', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(
                        FHeader,
                        { inverted: true, bordered: true },
                        () => '头部内容',
                    ),
                ],
            },
        });
        await nextTick();
        const classes = wrapper.find(`.${prefixCls}-header`).classes();
        expect(classes).toContain('is-inverted');
        expect(classes).toContain('is-bordered');
    });

    test('aside fixed class and custom width', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FAside, { fixed: true, width: '300px' }, () => '侧边栏'),
                ],
            },
        });
        await nextTick();
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.classes()).toContain('is-fixed');
        expect(aside.attributes('style')).toContain('width: 300px;');
    });

    test('aside without fixed has no is-fixed class', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [h(FAside, () => '侧边栏')],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-aside`).classes()).not.toContain(
            'is-fixed',
        );
    });

    test('footer fixed class', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [h(FFooter, { fixed: true }, () => '底部内容')],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-footer`).classes()).toContain(
            'is-fixed',
        );
    });

    test('layout fixed class', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            props: {
                fixed: true,
            },
            slots: {
                default: () => [h(FMain, () => '主体内容')],
            },
        });
        await nextTick();
        expect(wrapper.classes()).toContain('is-fixed');
    });
});
