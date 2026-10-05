import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FCollapse from '../collapse.vue';
import FCollapseItem from '../collapseItem.vue';

const prefixCls = 'fes-collapse';
const itemCls = `${prefixCls}-item`;

interface MountOptions {
    collapseProps?: Record<string, unknown>;
    disabledNames?: string[];
    initialModel?: string | number | (string | number)[] | null;
}

const mountCollapse = ({
    collapseProps = {},
    disabledNames = [],
    initialModel = null,
}: MountOptions = {}) => mount(
    {
        components: {
            FCollapse,
            FCollapseItem,
        },
        props: {
            collapseProps: {
                type: Object,
                default: () => ({}),
            },
            disabledNames: {
                type: Array,
                default: () => [],
            },
            initialModel: {
                type: null,
                default: null,
            },
        },
        data() {
            return {
                activeNames: this.initialModel,
            };
        },
        template: `
            <FCollapse v-model="activeNames" v-bind="collapseProps">
                <FCollapseItem
                    v-for="item in items"
                    :key="item.name"
                    :name="item.name"
                    :title="item.title"
                    :disabled="disabledNames.includes(item.name)"
                >
                    {{ item.title }}的内容
                </FCollapseItem>
            </FCollapse>
        `,
        computed: {
            items() {
                return [
                    { name: 'a', title: '标题一' },
                    { name: 'b', title: '标题二' },
                    { name: 'c', title: '标题三' },
                ];
            },
        },
    },
    {
        props: {
            collapseProps,
            disabledNames,
            initialModel,
        } as never,
    },
);

const findHeaders = (wrapper: any) => wrapper.findAll(`.${itemCls}__header`);

describe('FCollapse', () => {
    test('渲染所有 item 与标题', () => {
        const wrapper = mountCollapse();

        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.findAll(`.${itemCls}`).length).toBe(3);
        expect(findHeaders(wrapper)[0].text()).toContain('标题一');
        expect(wrapper.text()).toContain('标题一的内容');
    });

    test('非手风琴模式默认可展开多个', async () => {
        const wrapper = mountCollapse();

        await findHeaders(wrapper)[0].trigger('click');
        await findHeaders(wrapper)[1].trigger('click');

        const items = wrapper.findAll(`.${itemCls}`);
        expect(items[0].classes()).toContain('is-active');
        expect(items[1].classes()).toContain('is-active');
        expect(items[2].classes()).not.toContain('is-active');

        const events = wrapper
            .findComponent(FCollapse)
            .emitted('update:modelValue');
        expect(events).toHaveLength(2);
        expect(events[0]).toEqual([['a']]);
        expect(events[1]).toEqual([['a', 'b']]);
    });

    test('点击已展开的 item 收起', async () => {
        const wrapper = mountCollapse({
            initialModel: ['a'],
        });

        expect(wrapper.findAll(`.${itemCls}`)[0].classes()).toContain(
            'is-active',
        );

        await findHeaders(wrapper)[0].trigger('click');

        expect(wrapper.findAll(`.${itemCls}`)[0].classes()).not.toContain(
            'is-active',
        );
        const events = wrapper
            .findComponent(FCollapse)
            .emitted('update:modelValue');
        expect(events[0]).toEqual([[]]);
    });

    test('accordion 手风琴模式同时只展开一个', async () => {
        const wrapper = mountCollapse({
            initialModel: 'a',
            collapseProps: { accordion: true },
        });

        const items = wrapper.findAll(`.${itemCls}`);
        expect(items[0].classes()).toContain('is-active');
        expect(items[1].classes()).not.toContain('is-active');

        // 展开第二个时自动收起第一个
        await findHeaders(wrapper)[1].trigger('click');

        expect(items[0].classes()).not.toContain('is-active');
        expect(items[1].classes()).toContain('is-active');

        const events = wrapper
            .findComponent(FCollapse)
            .emitted('update:modelValue');
        expect(events[0]).toEqual(['b']);

        // 再点一次收起全部
        await findHeaders(wrapper)[1].trigger('click');
        expect(events[1]).toEqual([undefined]);
    });

    test('accordion 手风琴模式 modelValue 传数组时警告并视为空', () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
        });
        const wrapper = mountCollapse({
            initialModel: ['a'],
            collapseProps: { accordion: true },
        });
        const items = wrapper.findAll(`.${itemCls}`);

        expect(items[0].classes()).not.toContain('is-active');
        expect(warnSpy).toHaveBeenCalled();
        warnSpy.mockRestore();
    });

    test('disabled 的 item 点击无效', async () => {
        const wrapper = mountCollapse({
            disabledNames: ['a'],
        });

        const items = wrapper.findAll(`.${itemCls}`);
        expect(items[0].classes()).toContain('is-disabled');

        await findHeaders(wrapper)[0].trigger('click');
        expect(items[0].classes()).not.toContain('is-active');
        expect(
            wrapper.findComponent(FCollapse).emitted('update:modelValue'),
        ).toBeUndefined();

        // 非 disabled 项仍可正常展开
        await findHeaders(wrapper)[1].trigger('click');
        expect(items[1].classes()).toContain('is-active');
    });

    test('arrow 位置默认在右侧', () => {
        const wrapper = mountCollapse();

        expect(wrapper.find(`.${itemCls}__arrow`).exists()).toBe(true);
        expect(wrapper.find(`.${itemCls}__arrow-left`).exists()).toBe(false);
    });

    test('arrow 设置为 left 时箭头渲染在左侧', () => {
        const wrapper = mountCollapse({
            collapseProps: { arrow: 'left' },
        });

        expect(wrapper.find(`.${itemCls}__arrow-left`).exists()).toBe(true);
    });

    test('arrow 响应式切换', async () => {
        const wrapper = mountCollapse({
            collapseProps: { arrow: 'right' },
        });
        await nextTick();

        expect(wrapper.find(`.${itemCls}__arrow-left`).exists()).toBe(false);

        await wrapper.setProps({
            collapseProps: { arrow: 'left' },
        });
        await nextTick();

        expect(wrapper.find(`.${itemCls}__arrow-left`).exists()).toBe(true);
    });

    test('title 插槽代替标题文案', () => {
        const wrapper = mount({
            components: { FCollapse, FCollapseItem },
            template: `
                <FCollapse>
                    <FCollapseItem name="a" title="默认标题">
                        <template #title>
                            <span class="slot-title">插槽标题</span>
                        </template>
                        内容
                    </FCollapseItem>
                </FCollapse>
            `,
        });

        expect(wrapper.find(`.${itemCls}__header .slot-title`).text()).toBe(
            '插槽标题',
        );
        expect(findHeaders(wrapper)[0].text()).not.toContain('默认标题');
    });

    test('键盘 enter/space 也可切换展开', async () => {
        const wrapper = mountCollapse();

        await findHeaders(wrapper)[0].trigger('keypress', {
            key: 'enter',
        });

        expect(wrapper.findAll(`.${itemCls}`)[0].classes()).toContain(
            'is-active',
        );
        expect(
            wrapper.findComponent(FCollapse).emitted('update:modelValue'),
        ).toHaveLength(1);
    });

    test('embedded=false 时内容不带 is-embedded 类', () => {
        const wrapper = mountCollapse({
            collapseProps: { embedded: false },
        });

        expect(wrapper.find(`.${itemCls}__wrap`).classes()).not.toContain(
            'is-embedded',
        );
    });

    test('embedded 默认为 true 时内容带 is-embedded 类', () => {
        const wrapper = mountCollapse();

        expect(wrapper.find(`.${itemCls}__wrap`).classes()).toContain(
            'is-embedded',
        );
    });
});
