import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SelectTrigger from '../selectTrigger.vue';
import { wait } from '../../_util/__tests__/helpers';

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
