import { h } from 'vue';
import { mount } from '@vue/test-utils';
import Dropdown from '../dropdown';
import getPrefixCls from '../../_util/getPrefixCls';

const dropdownCls = getPrefixCls('dropdown');
const OPTION_CLS = `.${dropdownCls}-option`;
const TRIGGER_CLS = '.test-trigger';

const OPTIONS = [
    { value: '1', label: '删除' },
    { value: '2', label: '修改' },
    { value: '3', label: '添加', disabled: true },
];

// dropdown 基于 popper，默认懒渲染：首次 trigger 才渲染弹层；
// appendToContainer 默认 true 挂 body，测试内统一 false 便于 wrapper 查询。
const _mount = (props = {}) =>
    mount(Dropdown, {
        props: {
            options: OPTIONS,
            appendToContainer: false,
            ...props,
        },
        slots: {
            default: () => h('div', { class: 'test-trigger' }, '下拉菜单'),
        },
        attachTo: 'body',
    });

describe('Dropdown', () => {
    test('FDropdown 默认不渲染弹层', () => {
        const wrapper = _mount();
        expect(wrapper.find(OPTION_CLS).exists()).toBe(false);
        wrapper.unmount();
    });

    test('FDropdown hover 触发展示与隐藏', async () => {
        const wrapper = _mount();
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        expect(wrapper.findAll(OPTION_CLS).length).toBe(3);
        await wrapper.find(TRIGGER_CLS).trigger('mouseleave');
        // 消失时存在动画；vi.waitFor 轮询至隐藏（替代盲等动画时长，更快更稳）
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('FDropdown option 点击选择 v-model', async () => {
        let modelValue;
        const wrapper = _mount({
            modelValue,
            'onUpdate:modelValue': (val) => {
                modelValue = val;
            },
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        const options = wrapper.findAll(OPTION_CLS);
        await options[1].trigger('click');
        expect(modelValue).toBe('2');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('2');
        expect(wrapper.emitted('change')[0][0]).toBe('2');
        expect(wrapper.emitted('click')[0][0]).toBe('2');
        // 选择后收起（弹层保持挂载，仅 v-show 隐藏）：vi.waitFor 轮询至隐藏
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('FDropdown showSelectedOption 选中高亮', async () => {
        const wrapper = _mount({
            modelValue: '1',
            showSelectedOption: true,
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        const options = wrapper.findAll(OPTION_CLS);
        expect(options[0].classes('is-selected')).toBe(true);
        expect(options[1].classes('is-selected')).toBe(false);
        await options[1].trigger('click');
        await wrapper.setProps({ modelValue: '2' });
        expect(wrapper.findAll(OPTION_CLS)[1].classes('is-selected')).toBe(
            true,
        );
        wrapper.unmount();
    });

    test('FDropdown 单个 option disabled', async () => {
        const wrapper = _mount();
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        const options = wrapper.findAll(OPTION_CLS);
        expect(options[2].classes('is-disabled')).toBe(true);
        await options[2].trigger('click');
        expect(wrapper.emitted('click')).toBeUndefined();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('FDropdown 整体 disabled', async () => {
        const wrapper = _mount({ disabled: true });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        expect(wrapper.find(OPTION_CLS).exists()).toBe(false);
        wrapper.unmount();
    });

    test('FDropdown trigger=click', async () => {
        const wrapper = _mount({ trigger: 'click' });
        await wrapper.find(TRIGGER_CLS).trigger('click');
        expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        await wrapper.find(TRIGGER_CLS).trigger('click');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('FDropdown trigger=focus', async () => {
        const wrapper = _mount({ trigger: 'focus' });
        await wrapper.find(TRIGGER_CLS).trigger('focus');
        expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        await wrapper.find(TRIGGER_CLS).trigger('blur');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        wrapper.unmount();
    });

    test('FDropdown trigger=contextmenu', async () => {
        const wrapper = _mount({ trigger: 'contextmenu' });
        await wrapper.find(TRIGGER_CLS).trigger('contextmenu');
        expect(wrapper.find(OPTION_CLS).exists()).toBe(true);
        wrapper.unmount();
    });

    test('FDropdown appendToContainer 默认挂 body', async () => {
        const wrapper = _mount({ appendToContainer: true });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        expect(wrapper.find(`.${dropdownCls}-popper`).exists()).toBe(false);
        expect(document.body.querySelector(`.${dropdownCls}-popper`)).toBeTruthy();
        wrapper.unmount();
        // 卸载后清理 body 上的弹层
        expect(
            document.body.querySelector(`.${dropdownCls}-popper-wrapper`),
        ).toBeNull();
    });

    test('FDropdown valueField labelField', async () => {
        const wrapper = _mount({
            options: [
                { v: 'a', t: '甲' },
                { v: 'b', t: '乙' },
            ],
            valueField: 'v',
            labelField: 't',
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        const options = wrapper.findAll(OPTION_CLS);
        expect(options[0].text()).toBe('甲');
        await options[1].trigger('click');
        expect(wrapper.emitted('click')[0][0]).toBe('b');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('b');
        wrapper.unmount();
    });

    test('FDropdown visibleChange 事件', async () => {
        const wrapper = _mount();
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        expect(wrapper.emitted('visibleChange')[0][0]).toBe(true);
        await wrapper.find(TRIGGER_CLS).trigger('mouseleave');
        await vi.waitFor(() => {
            expect(wrapper.emitted('visibleChange')[1][0]).toBe(false);
        });
        wrapper.unmount();
    });
});
