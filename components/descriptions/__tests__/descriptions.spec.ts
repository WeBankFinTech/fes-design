import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Descriptions from '../descriptions';
import DescriptionsItem from '../descriptionsItem';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-descriptions';
const itemPrefixCls = 'fes-descriptions-item';

const mountDescriptions = (
    props: Record<string, unknown>,
    itemProps: Record<string, unknown> = {},
    slots: Record<string, any> = {},
) =>
    mount(
        {
            render() {
                return h(
                    Descriptions,
                    props,
                    {
                        default: () => [
                            h(
                                DescriptionsItem,
                                { label: '名称', ...itemProps },
                                slots.itemDefault
                                    ? slots
                                    : { default: () => '张三' },
                            ),
                            h(
                                DescriptionsItem,
                                { label: '年龄', ...itemProps },
                                { default: () => '20' },
                            ),
                        ],
                    },
                );
            },
        },
        { attachTo: document.body },
    );

describe('FDescriptions / FDescriptionsItem', () => {
    test('基础渲染 label 与内容', async () => {
        const wrapper = mountDescriptions({ title: '基本信息' });
        await nextTick();
        await wait(30);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.text()).toContain('基本信息');
        expect(wrapper.text()).toContain('名称');
        expect(wrapper.text()).toContain('张三');
        wrapper.unmount();
    });

    test('header slot 优先于 title', async () => {
        const wrapper = mount(
            {
                render() {
                    return h(Descriptions, { title: 'prop标题' }, {
                        header: () => h('div', 'slot标题'),
                        default: () => h(DescriptionsItem, { label: 'l' }, { default: () => 'v' }),
                    });
                },
            },
        );
        await nextTick();
        expect(wrapper.text()).toContain('slot标题');
        expect(wrapper.text()).not.toContain('prop标题');
        wrapper.unmount();
    });

    test('column 影响 grid 列数', async () => {
        const wrapper = mountDescriptions({ column: 2 });
        await nextTick();
        await wait(30);
        const body = wrapper.find(`.${prefixCls}-body`);
        expect(body.attributes('style')).toContain('repeat(2');
        wrapper.unmount();
    });

    test('bordered 类名', async () => {
        const wrapper = mountDescriptions({ bordered: true });
        await nextTick();
        await wait(30);
        expect(
            wrapper.find(`.${prefixCls}-body`).classes().includes('is-bordered'),
        ).toBe(true);
        wrapper.unmount();
    });

    test('labelPlacement top 分支', async () => {
        const wrapper = mountDescriptions({ labelPlacement: 'top' });
        await nextTick();
        await wait(30);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('item separator 与 label 渲染', async () => {
        const wrapper = mountDescriptions(
            {},
            {},
            { default: () => '内容值' },
        );
        await nextTick();
        await wait(30);
        expect(wrapper.find(`.${itemPrefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('size 类名分支', async () => {
        const wrapper = mountDescriptions({ size: 'small' });
        await nextTick();
        await wait(30);
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('small')),
        ).toBe(true);
        wrapper.unmount();
    });
});
