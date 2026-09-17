import { mount } from '@vue/test-utils';
import FTimeline from '../timeline';
import { prefixCls } from '../const';

const cls = (className: string) => `${prefixCls}-${className}`;

describe('FTimeline 分支补全（descPosition opposite / desc 插槽）', () => {
    test('column + opposite：标题与描述分居轴线两侧，titleWidth 生成偏移样式', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '节点一', desc: '描述一' },
                    { title: '节点二', desc: '描述二' },
                ],
                descPosition: 'opposite',
            },
        });

        const items = wrapper.findAll(`.${cls('item')}`);
        // 每个 item 拆成两个 content-wrapper：标题一侧、描述跨轴另一侧
        const item0Wrappers = items[0].findAll(
            `.${cls('item-content-wrapper')}`,
        );
        expect(item0Wrappers.length).toBe(2);

        const titleWrapper = item0Wrappers[0];
        expect(titleWrapper.classes()).toContain(
            cls('item-content-wrapper-end'),
        );
        // column + opposite + titleWidth → 标题容器带 width 定宽样式
        expect(titleWrapper.attributes('style')).toContain('width: 50%');
        // 标题容器内只有标题，描述被移到对面
        expect(titleWrapper.text()).toBe('节点一');
        expect(titleWrapper.find(`.${cls('item-desc')}`).exists()).toBe(false);

        const descWrapper = item0Wrappers[1];
        expect(descWrapper.classes()).toContain(
            cls('item-content-wrapper-start'),
        );
        expect(descWrapper.text()).toBe('描述一');

        // tail 与轴点图标同样按 titleWidth 偏移
        const tail = items[0].find(`.${cls('item-tail')}`);
        expect(tail.attributes('style')).toContain('left: 50%');
        const icon = items[0].find(`.${cls('item-icon')}`);
        expect(icon.attributes('style')).toContain('left: 50%');
        wrapper.unmount();
    });

    test('opposite 且节点无 desc：只渲染标题容器，不渲染对面描述容器', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '节点一' }],
                descPosition: 'opposite',
            },
        });

        const item = wrapper.find(`.${cls('item')}`);
        const wrappers = item.findAll(`.${cls('item-content-wrapper')}`);
        // 无 desc 时 descElement 为空，对面容器整体不渲染
        expect(wrappers.length).toBe(1);
        expect(wrappers[0].classes()).toContain(
            cls('item-content-wrapper-end'),
        );
        expect(wrappers[0].text()).toBe('节点一');
        expect(wrapper.findAll(`.${cls('item-desc')}`).length).toBe(0);
        wrapper.unmount();
    });

    test('row + opposite：横向布局不应用 titleWidth 偏移，但仍分侧', () => {
        const wrapper = mount(FTimeline, {
            props: {
                direction: 'row',
                data: [{ title: '节点一', desc: '描述一' }],
                descPosition: 'opposite',
            },
        });

        const item = wrapper.find(`.${cls('item')}`);
        const wrappers = item.findAll(`.${cls('item-content-wrapper')}`);
        expect(wrappers.length).toBe(2);
        expect(wrappers[1].classes()).toContain(
            cls('item-content-wrapper-start'),
        );

        const tail = item.find(`.${cls('item-tail')}`);
        expect(tail.attributes('style') ?? '').not.toContain('left');
        const titleWrapper = wrappers[0];
        expect(titleWrapper.attributes('style') ?? '').not.toContain('width');
        const icon = item.find(`.${cls('item-icon')}`);
        expect(icon.attributes('style') ?? '').not.toContain('left');
        wrapper.unmount();
    });

    test('titleWidth 为空串：column + opposite 不生成偏移样式', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '节点一', desc: '描述一' }],
                descPosition: 'opposite',
                titleWidth: '',
            },
        });

        const item = wrapper.find(`.${cls('item')}`);
        const tail = item.find(`.${cls('item-tail')}`);
        expect(tail.attributes('style') ?? '').not.toContain('left');
        const titleWrapper = item.findAll(`.${cls('item-content-wrapper')}`)[0];
        expect(titleWrapper.attributes('style') ?? '').not.toContain('width');
        wrapper.unmount();
    });

    test('#desc 插槽优先于数据 desc，并接收 index 与 item', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [
                    { title: '一', desc: '数据描述' },
                    { title: '二' },
                ],
            },
            slots: {
                desc: ({ index, item }) => `插槽描述-${item.title}-${index}`,
            },
        });

        const descs = wrapper.findAll(`.${cls('item-desc')}`);
        expect(descs.length).toBe(2);
        expect(descs[0].text()).toBe('插槽描述-一-0');
        expect(descs[1].text()).toBe('插槽描述-二-1');
        // 插槽生效时，数据中的 desc 文本不再渲染
        expect(wrapper.text()).not.toContain('数据描述');
        wrapper.unmount();
    });

    test('opposite + titlePosition start：描述容器位于 start 的对面', () => {
        const wrapper = mount(FTimeline, {
            props: {
                data: [{ title: '节点一', desc: '描述一' }],
                titlePosition: 'start',
                descPosition: 'opposite',
            },
        });

        const wrappers = wrapper.findAll(`.${cls('item-content-wrapper')}`);
        expect(wrappers.length).toBe(2);
        expect(wrappers[0].classes()).toContain(
            cls('item-content-wrapper-start'),
        );
        expect(wrappers[1].classes()).toContain(
            cls('item-content-wrapper-end'),
        );
        // DOM 顺序：标题容器在前，对面描述容器在后
        expect(wrappers[0].text()).toBe('节点一');
        expect(wrappers[1].text()).toBe('描述一');
        wrapper.unmount();
    });
});
