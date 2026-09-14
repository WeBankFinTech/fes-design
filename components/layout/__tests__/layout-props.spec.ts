import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { FAside, FFooter, FHeader, FLayout, FMain } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('layout');

describe('FLayout 属性补全', () => {
    test('embedded 经 provide 供 footer 消费', async () => {
        const wrapper = mount(FLayout, {
            props: { embedded: true },
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FMain, () => '主体'),
                    h(FFooter, () => '底部'),
                ],
            },
        });
        await nextTick();
        // layout.embedded 通过 provide 传递，footer is-embedded 生效
        expect(
            wrapper.find('[class*="footer"]').classes().some((c) => c.includes('is-embedded')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('fixed 定位布局', async () => {
        const wrapper = mount(FLayout, {
            props: { fixed: true },
            attachTo: document.body,
            slots: { default: () => h(FMain, () => '主体') },
        });
        await nextTick();
        expect(wrapper.classes().some((c) => c.includes('is-fixed'))).toBe(true);
        wrapper.unmount();
    });

    test('aside collapsible+inverted 类名', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FAside, { collapsible: true, inverted: true }, () => '侧栏'),
                    h(FMain, () => '主体'),
                ],
            },
        });
        await nextTick();
        const aside = wrapper.find(`.${prefixCls}-aside`);
        expect(aside.exists()).toBe(true);
        expect(aside.classes().some((c) => c.includes('is-inverted'))).toBe(true);
        wrapper.unmount();
    });

    test('header fixed 固定头部', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FHeader, { fixed: true }, () => '头部'),
                    h(FMain, () => '主体'),
                ],
            },
        });
        await nextTick();
        const header = wrapper.find(`.${prefixCls}-header`);
        expect(header.classes().some((c) => c.includes('is-fixed'))).toBe(true);
        wrapper.unmount();
    });

    test('footer 渲染与类名', async () => {
        const wrapper = mount(FLayout, {
            attachTo: document.body,
            slots: {
                default: () => [
                    h(FMain, () => '主体'),
                    h(FFooter, () => '底部'),
                ],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-footer`).text()).toBe('底部');
        wrapper.unmount();
    });
});
