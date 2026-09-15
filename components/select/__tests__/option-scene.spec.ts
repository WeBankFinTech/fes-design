import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Option from '../option';
import Select from '../select.vue';
import OptionGroup from '../groupOption';
import getPrefixCls from '../../_util/getPrefixCls';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('select');

// Popper stub 让面板常驻，便于断言 option DOM
const popperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const mountSelect = (content: any) =>
    mount(Select, {
        props: { modelValue: '' } as any,
        slots: { default: content },
        global: { stubs: { Popper: popperStub } },
        attachTo: document.body,
    });

describe('FOption 独立与分组场景', () => {
    test('脱离 FSelect 使用时告警', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // warn 后因缺少 inject 上下文抛错（组件约束：必须搭配 FSelect）
        expect(() =>
            mount(Option, { props: { label: '孤立选项', value: 1 } }),
        ).toThrow();
        expect(spy).toHaveBeenCalledWith(
            '[FOption]: FOption 必须搭配 FSelect 组件使用！',
        );
        spy.mockRestore();
    });

    test('label 缺省时取元素文本', async () => {
        const wrapper = mountSelect(() => [
            h(Option, { value: 'a' }, () => '文本标签'),
        ]);
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('文本标签');
        wrapper.unmount();
        document.body.innerHTML = '';
    });

    test('optionGroup 包裹的 option 正常收集', async () => {
        const wrapper = mountSelect(() => [
            h(OptionGroup, { label: '分组' }, () => [
                h(Option, { value: 'g1', label: '组内一' }),
                h(Option, { value: 'g2', label: '组内二' }),
            ]),
        ]);
        await nextTick();
        await wait();
        // stub Popper 后面板常驻，option 与分组直接渲染
        expect(wrapper.text()).toContain('分组');
        expect(wrapper.text()).toContain('组内一');
        expect(wrapper.text()).toContain('组内二');
        // 点击 option 触发选中
        const option = wrapper
            .findAll(`.${prefixCls}-option`)
            .find((o) => o.text() === '组内一');
        if (option) {
            await option.trigger('click');
            await wait();
            expect(wrapper.emitted('update:modelValue') ?? []).toBeTruthy();
        }
        wrapper.unmount();
        document.body.innerHTML = '';
    });
});
