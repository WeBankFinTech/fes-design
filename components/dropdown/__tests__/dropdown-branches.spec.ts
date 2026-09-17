import { h } from 'vue';
import { mount } from '@vue/test-utils';
import Dropdown from '../dropdown';
import getPrefixCls from '../../_util/getPrefixCls';
import { sleep } from '../../_util/__tests__/helpers';

const dropdownCls = getPrefixCls('dropdown');
const OPTION_CLS = `.${dropdownCls}-option`;
const TRIGGER_CLS = '.test-trigger';

afterEach(() => {
    document.body.innerHTML = '';
});

const _mount = (props = {}, options = {}) =>
    mount(Dropdown, {
        props: {
            appendToContainer: false,
            ...props,
        },
        slots: {
            default: () => h('div', { class: 'test-trigger' }, '下拉菜单'),
        },
        attachTo: 'body',
        ...options,
    });

describe('Dropdown 分支补全', () => {
    test('带 icon 的选项渲染图标与 wrapper has-icon 类', async () => {
        const wrapper = _mount({
            options: [
                {
                    value: '1',
                    label: '删除',
                    icon: () => h('i', { class: 'custom-option-icon' }),
                },
            ],
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        // B2/B3：hasIcon 计算 + containerClass 'has-icon' 臂
        const optionWrapper = wrapper.find(`.${dropdownCls}-option-wrapper`);
        expect(optionWrapper.exists()).toBe(true);
        expect(optionWrapper.classes()).toContain('has-icon');
        // B7：option.icon 渲染图标 span（含自定义内容）
        expect(
            wrapper.find(`.${dropdownCls}-option-icon`).exists(),
        ).toBe(true);
        expect(wrapper.find('.custom-option-icon').exists()).toBe(true);
        wrapper.unmount();
    });

    test('label 为函数时按 option 渲染（B8 true 臂）', async () => {
        const wrapper = _mount({
            options: [
                {
                    value: '7',
                    label: (option) =>
                        h('b', { class: 'fn-label' }, `动态-${option.value}`),
                },
            ],
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        const fnLabel = wrapper.find('.fn-label');
        expect(fnLabel.exists()).toBe(true);
        expect(fnLabel.text()).toBe('动态-7');
        // 点击函数 label 的菜单项 → emit click 原始值
        await wrapper.find(OPTION_CLS).trigger('click');
        expect(wrapper.emitted('click')![0][0]).toBe('7');
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('7');
        wrapper.unmount();
    });

    test('点击外部关闭下拉并触发 visibleChange(false)', async () => {
        const wrapper = _mount({
            options: [
                { value: '1', label: '删除' },
                { value: '2', label: '修改' },
            ],
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        });
        expect(wrapper.emitted('visibleChange')![0][0]).toBe(true);
        // useClickOutSide 监听 window click（捕获），点击 body 外部区域关闭
        document.body.dispatchEvent(
            new MouseEvent('click', { bubbles: true }),
        );
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        expect(wrapper.emitted('visibleChange')!.pop()![0]).toBe(false);
        wrapper.unmount();
    });

    test('展开后点击可见的菜单项提交选择并收起（完整交互链）', async () => {
        const wrapper = _mount({
            options: [
                { value: 'a', label: '甲' },
                { value: 'b', label: '乙' },
            ],
            modelValue: 'a',
            showSelectedOption: true,
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        });
        // 选中高亮 + 选择另一项
        expect(wrapper.findAll(OPTION_CLS)[0].classes()).toContain(
            'is-selected',
        );
        await wrapper.findAll(OPTION_CLS)[1].trigger('click');
        expect(wrapper.emitted('click')![0][0]).toBe('b');
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('b');
        expect(wrapper.emitted('change')![0][0]).toBe('b');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(false);
        });
        // 收起后重新展开，仍可再选（状态机复位）
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        });
        await wrapper.findAll(OPTION_CLS)[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')!.pop()![0]).toBe('a');
        await sleep(2);
        wrapper.unmount();
    });

    test('选项容器滚动转发 scroll 事件（L51 onScroll 臂）', async () => {
        const wrapper = _mount({
            options: [
                { value: '1', label: '删除' },
                { value: '2', label: '修改' },
            ],
        });
        await wrapper.find(TRIGGER_CLS).trigger('mouseenter');
        await vi.waitFor(() => {
            expect(wrapper.find(OPTION_CLS).isVisible()).toBe(true);
        });
        // Scrollbar 容器 @scroll → handleScroll → emit('scroll') → dropdown 转发
        await wrapper
            .find(`.${dropdownCls}-option-wrapper`)
            .trigger('scroll');
        expect(wrapper.emitted('scroll')).toBeTruthy();
        expect(wrapper.emitted('scroll')![0][0]).toBeInstanceOf(Event);
        wrapper.unmount();
    });
});
