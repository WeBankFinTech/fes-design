import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FTimeline from '../timeline';
import { prefixCls } from '../const';

const cls = (className: string) => `${prefixCls}-${className}`;

describe('FTimeline', () => {
    const baseData = [
        { title: '节点一' },
        { title: '节点二' },
        { title: '节点三' },
    ];

    test('渲染 data 中的所有节点', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
            },
        });

        expect(wrapper.find('ul').exists()).toBe(true);
        expect(wrapper.findAll(`.${cls('item')}`).length).toBe(3);
        expect(wrapper.findAll(`.${cls('item-title')}`)[0].text()).toBe(
            '节点一',
        );
        expect(wrapper.findAll(`.${cls('item-tail')}`).length).toBe(3);
    });

    test('最后一个节点的连线带 item-tail-last 类', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
            },
        });

        const tails = wrapper.findAll(`.${cls('item-tail')}`);
        expect(tails[0].classes()).not.toContain(cls('item-tail-last'));
        expect(tails[2].classes()).toContain(cls('item-tail-last'));
    });

    test('默认方向和布局类', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
            },
        });

        expect(wrapper.find('ul').classes()).toContain(cls('direction-column'));
        expect(wrapper.find('ul').classes()).toContain(cls('layout-end'));
        expect(wrapper.find('ul').classes()).toContain(cls('desc-under'));
        expect(wrapper.findAll(`.${cls('item')}`)[0].classes()).toContain(
            cls('item-layout-end'),
        );
    });

    test('direction row 横向布局', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
                direction: 'row',
            },
        });

        expect(wrapper.find('ul').classes()).toContain(cls('direction-row'));
    });

    test('titlePosition start 布局', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
                titlePosition: 'start',
            },
        });

        expect(wrapper.find('ul').classes()).toContain(cls('layout-start'));
        expect(wrapper.findAll(`.${cls('item')}`)[0].classes()).toContain(
            cls('item-layout-start'),
        );
    });

    test('titlePosition alternate 交替布局', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: baseData,
                titlePosition: 'alternate',
            },
        });

        const items = wrapper.findAll(`.${cls('item')}`);
        expect(items[0].classes()).toContain(cls('item-layout-start'));
        expect(items[1].classes()).toContain(cls('item-layout-end'));
        expect(items[2].classes()).toContain(cls('item-layout-start'));
    });

    test('alternate 时节点可自定义 titlePosition', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '一', titlePosition: 'end' },
                    { title: '二' },
                    { title: '三' },
                ],
                titlePosition: 'alternate',
            },
        });

        const items = wrapper.findAll(`.${cls('item')}`);
        // 第一个节点显式声明为 end，其余按奇偶交替
        expect(items[0].classes()).toContain(cls('item-layout-end'));
        expect(items[1].classes()).toContain(cls('item-layout-end'));
        expect(items[2].classes()).toContain(cls('item-layout-start'));
    });

    test('desc 文本渲染在标题下方', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '节点一', desc: '描述一' },
                    { title: '节点二', desc: '描述二' },
                ],
            },
        });

        expect(wrapper.findAll(`.${cls('item-desc')}`).length).toBe(2);
        expect(wrapper.findAll(`.${cls('item-desc')}`)[0].text()).toBe(
            '描述一',
        );
    });

    test('desc 为渲染函数时按 item 渲染', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    {
                        title: '节点一',
                        desc: ({ item }) => `函数描述-${item.title}`,
                    },
                ],
            },
        });

        expect(wrapper.find(`.${cls('item-desc')}`).text()).toBe(
            '函数描述-节点一',
        );
    });

    test('title 为渲染函数时按 item 渲染', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    {
                        title: ({ index }) => `标题-${index}`,
                    },
                ],
            },
        });

        expect(wrapper.find(`.${cls('item-title')}`).text()).toBe('标题-0');
    });

    test('预设颜色图标类名', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '一', icon: 'success' },
                    { title: '二', icon: 'error' },
                    { title: '三' },
                ],
            },
        });

        const icons = wrapper.findAll(`.${cls('item-icon')}`);
        expect(icons[0].classes()).toContain(cls('item-icon-success'));
        expect(icons[1].classes()).toContain(cls('item-icon-error'));
        // 未指定 icon 时默认 info
        expect(icons[2].classes()).toContain(cls('item-icon-info'));
    });

    test('自定义颜色作为行内样式渲染', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '一', icon: '#ff6200' }],
            },
        });

        const icon = wrapper.find(`.${cls('item-icon')}`);
        expect(icon.classes()).not.toContain(cls('item-icon-info'));
        expect(icon.attributes('style')).toContain('color: rgb(255, 98, 0)');
        expect(icon.attributes('style')).toContain(
            'border-color: rgb(255, 98, 0)',
        );
    });

    test('icon 渲染函数渲染为自定义图标容器', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    {
                        title: '一',
                        icon: () => '自定义内容',
                    },
                ],
            },
        });

        const icon = wrapper.find(`.${cls('item-icon')}`);
        expect(icon.classes()).toContain(cls('item-icon-custom'));
        expect(icon.text()).toBe('自定义内容');
    });

    test('icon slot 优先级高于 icon 属性', async () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    {
                        title: '一',
                        icon: () => '属性图标',
                    },
                ],
            },
            slots: {
                icon: '<span class="slot-icon">插槽图标</span>',
            },
        });
        await nextTick();

        const icon = wrapper.find(`.${cls('item-icon')}`);
        expect(icon.classes()).toContain(cls('item-icon-custom'));
        expect(icon.find('.slot-icon').exists()).toBe(true);
        expect(icon.text()).toBe('插槽图标');
    });

    test('titleClass、descClass 附加到对应节点', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '一', desc: '描述' }],
                titleClass: 'my-title',
                descClass: 'my-desc',
            },
        });

        expect(wrapper.find(`.${cls('item-title')}.my-title`).exists()).toBe(
            true,
        );
        expect(wrapper.find(`.${cls('item-desc')}.my-desc`).exists()).toBe(
            true,
        );
    });

    test('title 插槽优先级高于数据 title', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '数据标题' }],
            },
            slots: {
                title: ({ item }) => `插槽-${item.title}`,
            },
        });

        expect(wrapper.find(`.${cls('item-title')}`).text()).toBe(
            '插槽-数据标题',
        );
    });
});
