import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import getPrefixCls from '../../_util/getPrefixCls';
import RangeInput from '../rangeInput.vue';
import { sleep } from '../../_util/__tests__/helpers';

const prefixCls = getPrefixCls('range-input');

const START = new Date(2021, 4, 15, 0, 0, 0).getTime();
const END = new Date(2021, 4, 20, 0, 0, 0).getTime();
const FORMAT = 'yyyy-MM-dd';

// 组合默认 options 的挂载工厂：默认带插槽，保证插槽分支被渲染
const mountRangeInput = (props = {}, slots = {}) =>
    mount(RangeInput, {
        props: {
            format: FORMAT,
            ...props,
        },
        slots: {
            separator: () => '~',
            suffix: () => 'S',
            ...slots,
        },
        attachTo: document.body,
    });

const findRoot = (wrapper) => wrapper.find(`.${prefixCls}`);
const findInputs = (wrapper) => wrapper.findAll('input');

describe('RangeInput 分支覆盖', () => {
    let wrapper;

    afterEach(async () => {
        if (wrapper) {
            wrapper.unmount();
            wrapper = null;
        }
        await nextTick();
        document.body.innerHTML = '';
    });

    test('disabled + innerIsError + innerIsFocus 组合类名与 tabindex', async () => {
        wrapper = mountRangeInput({
            disabled: true,
            innerIsError: true,
            innerIsFocus: true,
            selectedDates: [START, END],
        });
        const root = findRoot(wrapper);
        expect(root.exists()).toBe(true);
        // 三类状态类名同时出现（覆盖各状态类名分支的为真侧）
        expect(root.classes()).toContain('is-disabled');
        expect(root.classes()).toContain('is-error');
        expect(root.classes()).toContain('is-focused');
        // disabled 时 tabindex 为 null（不写入属性），输入框禁用且回显
        expect(root.attributes('tabindex')).toBeUndefined();
        const inputs = findInputs(wrapper);
        expect(inputs[0].attributes('disabled')).toBeDefined();
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(inputs[1].element.value).toBe('2021-05-20');

        // 解除 disabled/错误态后类名与 tabindex 恢复
        await wrapper.setProps({ disabled: false, innerIsError: false });
        expect(findRoot(wrapper).classes()).not.toContain('is-disabled');
        expect(findRoot(wrapper).classes()).not.toContain('is-error');
        expect(findRoot(wrapper).attributes('tabindex')).toBe('0');
        expect(findInputs(wrapper)[0].attributes('disabled')).toBeUndefined();

        // innerIsFocus 变化触发 watch：true 侧与 false 侧类名随之切换
        await wrapper.setProps({ innerIsFocus: false });
        expect(findRoot(wrapper).classes()).not.toContain('is-focused');
        await wrapper.setProps({ innerIsFocus: true });
        expect(findRoot(wrapper).classes()).toContain('is-focused');
    });

    test('expose focus/blur：disabled 跳过聚焦，启用后聚焦根节点', async () => {
        wrapper = mountRangeInput({ disabled: true });
        // disabled 时 expose 的 focus() 直接返回，不聚焦
        expect(() => wrapper.vm.focus()).not.toThrow();
        const root = findRoot(wrapper);
        expect(root.exists()).toBe(true);
        expect(document.activeElement).not.toBe(root.element);

        await wrapper.setProps({ disabled: false });
        wrapper.vm.focus();
        await nextTick();
        expect(document.activeElement).toBe(findRoot(wrapper).element);
        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('focus').length).toBe(1);

        wrapper.vm.blur();
        await sleep();
        expect(wrapper.emitted('blur')).toBeTruthy();
        expect(wrapper.emitted('blur').length).toBe(1);
        expect(document.activeElement).not.toBe(root.element);
    });

    test('根节点 focus/blur 触发 focus/blur emit（blur 延迟生效）', async () => {
        wrapper = mountRangeInput();
        const root = findRoot(wrapper);
        expect(root.exists()).toBe(true);
        expect(wrapper.emitted('focus')).toBeUndefined();

        root.element.focus();
        expect(wrapper.emitted('focus')).toBeTruthy();
        expect(wrapper.emitted('focus').length).toBe(1);

        root.element.blur();
        // blur 延迟到 nextTick 之后才 emit
        expect(wrapper.emitted('blur')).toBeUndefined();
        await sleep();
        expect(wrapper.emitted('blur').length).toBe(1);

        // blur 完成后再聚焦 → 新一轮 focus/blur
        root.element.focus();
        expect(wrapper.emitted('focus').length).toBe(2);
        root.element.blur();
        await sleep();
        expect(wrapper.emitted('blur').length).toBe(2);
    });

    test('mouseenter/mouseleave 控制 clearable 清空图标显隐并 emit', async () => {
        wrapper = mountRangeInput({
            clearable: true,
            selectedDates: [START, END],
        });
        const root = findRoot(wrapper);
        expect(root.exists()).toBe(true);
        const suffix = () => root.find(`.${prefixCls}-suffix`);
        // 未 hover：显示 suffix 插槽，无清空图标
        expect(suffix().text()).toBe('S');
        expect(suffix().findAll('svg').length).toBe(0);

        await root.trigger('mouseenter');
        expect(wrapper.emitted('mouseenter').length).toBe(1);
        // hover + 有值 + clearable → 清空图标出现（suffix 插槽被替换）
        expect(suffix().findAll('svg').length).toBe(1);
        expect(suffix().text()).toBe('');

        await suffix().find('svg').trigger('click');
        expect(wrapper.emitted('clear')).toBeTruthy();
        expect(wrapper.emitted('clear').length).toBe(1);

        // suffix 上 mousedown 阻止默认行为（.prevent 内联处理器），不额外触发 clear
        await suffix().trigger('mousedown');
        expect(suffix().findAll('svg').length).toBe(1);
        expect(wrapper.emitted('clear').length).toBe(1);

        await root.trigger('mouseleave');
        expect(wrapper.emitted('mouseleave').length).toBe(1);
        expect(suffix().findAll('svg').length).toBe(0);
        expect(suffix().text()).toBe('S');
        // 分隔符插槽内容独立渲染
        expect(root.find(`.${prefixCls}-separator`).text()).toBe('~');
    });

    test('左输入非法文本：不提交且失焦恢复原值', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            changeSelectedDates,
        });
        const inputs = findInputs(wrapper);
        expect(inputs[0].exists()).toBe(true);
        // 未聚焦直接 blur：输入文本被重置，但不 emit blur
        await inputs[0].setValue('junk');
        expect(changeSelectedDates).not.toHaveBeenCalled();
        await inputs[0].trigger('blur');
        await sleep();
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(wrapper.emitted('blur')).toBeUndefined();

        // 聚焦后输入非法文本：strictParse 失败不提交，失焦恢复
        inputs[0].element.focus();
        expect(wrapper.emitted('focus').length).toBe(1);
        await inputs[0].setValue('not-a-date');
        expect(changeSelectedDates).not.toHaveBeenCalled();
        inputs[0].element.blur();
        await sleep();
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(changeSelectedDates).not.toHaveBeenCalled();
        expect(wrapper.emitted('blur').length).toBe(1);
    });

    test('左输入合法文本更新起点并携带另一端日期', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            changeSelectedDates,
        });
        const inputs = findInputs(wrapper);
        expect(inputs[0].exists()).toBe(true);
        expect(inputs[0].element.value).toBe('2021-05-15');

        inputs[0].element.focus();
        await inputs[0].setValue('2021-05-16');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        const arg = changeSelectedDates.mock.calls[0][0];
        expect(arg[0]).toBe(new Date(2021, 4, 16, 0, 0, 0).getTime());
        // 另一端（right）原值被带上
        expect(arg[1]).toBe(END);

        inputs[0].element.blur();
        await sleep();
        // props 未消费提交值 → 失焦回显原值
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(wrapper.emitted('blur').length).toBe(1);
    });

    test('selectedDates 为空数组时提交单元素数组（另一端短路分支）', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({ selectedDates: [], changeSelectedDates });
        const inputs = findInputs(wrapper);
        expect(inputs[0].element.value).toBe('');
        expect(inputs[0].attributes('placeholder')).toBeUndefined();

        // 另一端日期不存在 → flagDate 短路，合法日期直接提交
        await inputs[0].setValue('2021-06-01');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        expect(changeSelectedDates.mock.calls[0][0]).toEqual([
            new Date(2021, 5, 1, 0, 0, 0).getTime(),
        ]);
    });

    test('maxRange 范围外的合法日期被拒绝，范围内可提交', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            changeSelectedDates,
            maxRange: '3D',
        });
        const inputs = findInputs(wrapper);
        expect(inputs[0].exists()).toBe(true);
        // 合法日期但距另一端超出 maxRange → 不提交
        await inputs[0].setValue('2021-06-14');
        expect(changeSelectedDates).not.toHaveBeenCalled();

        // 范围内日期正常提交
        inputs[0].element.focus();
        await inputs[0].setValue('2021-05-18');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        expect(changeSelectedDates.mock.calls[0][0][0]).toBe(
            new Date(2021, 4, 18, 0, 0, 0).getTime(),
        );

        inputs[0].element.blur();
        await sleep();
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(wrapper.emitted('blur').length).toBe(1);
    });

    test('右输入更新终点：数组与字符串 placeholder 两种形态', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            changeSelectedDates,
            placeholder: ['开始日期', '结束日期'],
        });
        const root = findRoot(wrapper);
        const inputs = findInputs(wrapper);
        expect(inputs.length).toBe(2);
        // 数组 placeholder 逐段生效
        expect(inputs[0].attributes('placeholder')).toBe('开始日期');
        expect(inputs[1].attributes('placeholder')).toBe('结束日期');
        expect(root.find(`.${prefixCls}-separator`).text()).toBe('~');

        inputs[1].element.focus();
        await inputs[1].setValue('2021-05-21');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        const arg = changeSelectedDates.mock.calls[0][0];
        expect(arg[0]).toBe(START);
        expect(arg[1]).toBe(new Date(2021, 4, 21, 0, 0, 0).getTime());

        inputs[1].element.blur();
        await sleep();
        expect(wrapper.emitted('blur').length).toBe(1);

        // 字符串 placeholder → 两段同值（覆盖非数组分支）
        await wrapper.setProps({ placeholder: '请选择日期' });
        expect(inputs[0].attributes('placeholder')).toBe('请选择日期');
        expect(inputs[1].attributes('placeholder')).toBe('请选择日期');
    });

    test('composition 输入：start 期间不提交，end 提交左右两段', async () => {
        const changeSelectedDates = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            changeSelectedDates,
        });
        const inputs = findInputs(wrapper);
        expect(inputs.length).toBe(2);

        // 左段：compositionstart 后输入被忽略
        await inputs[0].trigger('compositionstart');
        await inputs[0].setValue('2021-05-16');
        expect(changeSelectedDates).not.toHaveBeenCalled();
        await inputs[0].trigger('compositionend');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        expect(changeSelectedDates.mock.calls[0][0][0]).toBe(
            new Date(2021, 4, 16, 0, 0, 0).getTime(),
        );

        // 右段：同样的 composition 流程
        await inputs[1].trigger('compositionstart');
        await inputs[1].setValue('2021-05-22');
        expect(changeSelectedDates).toHaveBeenCalledTimes(1);
        await inputs[1].trigger('compositionend');
        expect(changeSelectedDates).toHaveBeenCalledTimes(2);
        expect(changeSelectedDates.mock.calls[1][0][1]).toBe(
            new Date(2021, 4, 22, 0, 0, 0).getTime(),
        );
    });

    test('焦点在两段输入间转移：blur 延迟且不重复 emit', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        wrapper = mountRangeInput({
            selectedDates: [START, END],
            onFocus,
            onBlur,
        });
        const inputs = findInputs(wrapper);
        expect(inputs.length).toBe(2);

        // 第一段聚焦 → focus emit 一次
        inputs[0].element.focus();
        expect(onFocus).toHaveBeenCalledTimes(1);

        // 直接切到第二段：内部 againFocusFlag 使 blur 再延迟一轮
        inputs[0].element.blur();
        inputs[1].element.focus();
        expect(onFocus).toHaveBeenCalledTimes(1);
        expect(onBlur).not.toHaveBeenCalled();
        await sleep();
        // 焦点转移后延迟 blur 只 emit 一次（againFocusFlag 分支）
        expect(onBlur).toHaveBeenCalledTimes(1);

        // 组件现状：转移的延迟 blur 已重置 isFocus，input1 再失焦不重复 emit
        inputs[1].element.blur();
        await sleep();
        expect(onBlur).toHaveBeenCalledTimes(1);
        expect(onFocus).toHaveBeenCalledTimes(1);
    });
});
