import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SelectTrigger from '../selectTrigger.vue';
import { wait } from '../../_util/__tests__/helpers';
import getPrefixCls from '../../_util/getPrefixCls';

const PopperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const mountTrigger = (props: Record<string, unknown>, slots: any = {}) =>
    mount(SelectTrigger, {
        props: {
            selectedOptions: [
                { value: 'a', label: '选项A' },
                { value: 'b', label: '选项B' },
            ],
            ...props,
        },
        slots,
        global: { stubs: { Popper: PopperStub } },
    });

describe('FSelectTrigger', () => {
    test('single 模式显示选中项 label', async () => {
        const wrapper = mountTrigger({ multiple: false });
        await nextTick();
        await wait(40);
        expect(wrapper.text()).toContain('选项A');
        wrapper.unmount();
    });

    test('multiple 模式渲染 tags', async () => {
        const wrapper = mountTrigger({ multiple: true });
        await nextTick();
        await wait(40);
        expect(wrapper.text()).toContain('选项A');
        expect(wrapper.text()).toContain('选项B');
        wrapper.unmount();
    });

    test('clearable 悬停后显示清空并可触发', async () => {
        const wrapper = mountTrigger({ clearable: true, multiple: false });
        await nextTick();
        await wait(40);
        // hover 后 clearable 图标可点击（v-show 由 hover 状态控制）
        const root = wrapper.find('.fes-select-trigger');
        await root.trigger('mouseenter');
        await nextTick();
        await wait(40);
        const icons = wrapper.findAll('.fes-select-trigger-icons span');
        expect(icons.length).toBeGreaterThan(0);
        wrapper.unmount();
    });
    ;

    test('renderTag 自定义 multiple 标签并触发 remove', async () => {
        const wrapper = mount(SelectTrigger, {
            props: {
                selectedOptions: [
                    { value: 'a', label: '选项A' },
                    { value: 'b', label: '选项B' },
                ],
                multiple: true,
                renderTag: ({ option, handleClose }: any) =>
                    h(
                        'span',
                        { class: 'my-tag', onClick: handleClose },
                        `T:${option?.label}`,
                    ),
            },
        });
        await nextTick();
        await wait(40);
        expect(wrapper.find('.my-tag').exists()).toBe(true);
        expect(wrapper.text()).toContain('T:选项A');
        await wrapper.find('.my-tag').trigger('click');
        expect(wrapper.emitted('remove')).toBeTruthy();
        wrapper.unmount();
    });

    test('collapseTags 折叠超出数量的标签', async () => {
        const wrapper = mountTrigger({
            multiple: true,
            collapseTags: true,
            collapseTagsLimit: 1,
            selectedOptions: [
                { value: 'a', label: '选项A' },
                { value: 'b', label: '选项B' },
            ],
        });
        await nextTick();
        await wait(40);
        expect(wrapper.text()).toContain('选项A');
        expect(wrapper.text()).toMatch(/\+\s*1/);
        wrapper.unmount();
    });

    test('placeholder 透传', async () => {
        const wrapper = mountTrigger({
            placeholder: '请选择项目',
            selectedOptions: [],
        });
        await nextTick();
        await wait(40);
        expect(wrapper.text()).toContain('请选择项目');
        wrapper.unmount();
    });

    test('disabled 态样式', async () => {
        const wrapper = mountTrigger({ disabled: true });
        await nextTick();
        await wait(40);
        expect(
            wrapper.find('.fes-select-trigger').classes().some((c) => c.includes('disabled')),
        ).toBe(true);
        wrapper.unmount();
    });
});

describe('FSelectTrigger 输入法组合（composition）链路', () => {
    const mountFilterable = (props: Record<string, unknown> = {}) =>
        mountTrigger({ filterable: true, isOpened: true, ...props });

    test('组合期间 input 事件被抑制（isComposing 守卫）', async () => {
        const wrapper = mountFilterable();
        await nextTick();
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
        // 模拟拼音输入：compositionstart 后，input 事件不应 emit
        await input.trigger('compositionstart');
        await input.setValue('zhong');
        await input.trigger('input');
        expect(wrapper.emitted('input')).toBeUndefined();
        wrapper.unmount();
    });

    test('compositionend 后统一 emit 最终输入值', async () => {
        const wrapper = mountFilterable();
        await nextTick();
        const input = wrapper.find('input');
        await input.trigger('compositionstart');
        await input.setValue('中');
        await input.trigger('compositionupdate');
        await input.trigger('compositionend');
        // 组合结束：handleInput 被补调，filterText 更新为最终值
        const emitted = wrapper.emitted('input');
        expect(emitted).toBeTruthy();
        expect(emitted!.pop()![0]).toBe('中');
        wrapper.unmount();
    });

    test('非组合态 input 直接 emit', async () => {
        const wrapper = mountFilterable();
        await nextTick();
        const input = wrapper.find('input');
        await input.setValue('abc');
        await input.trigger('input');
        const emitted = wrapper.emitted('input');
        expect(emitted).toBeTruthy();
        expect(emitted!.pop()![0]).toBe('abc');
        wrapper.unmount();
    });
});

describe('FSelectTrigger 焦点与鼠标事件', () => {
    test('focusin/focusout 透传 focus/blur 事件', async () => {
        const wrapper = mountTrigger({ filterable: true });
        await nextTick();
        await wrapper.find('input').trigger('focusin');
        expect(wrapper.emitted('focus')).toBeTruthy();
        await wrapper.find('input').trigger('focusout');
        expect(wrapper.emitted('blur')).toBeTruthy();
        wrapper.unmount();
    });

    test('mousedown 触发事件（含默认参数透传）', async () => {
        const wrapper = mountTrigger({});
        await nextTick();
        await wrapper.find(`.${getPrefixCls('select-trigger')}`).trigger('mousedown');
        expect(wrapper.emitted('mousedown')).toBeTruthy();
        wrapper.unmount();
    });
});
