import { mount } from '@vue/test-utils';
import { h, reactive } from 'vue';
import getPrefixCls from '../../_util/getPrefixCls';
import DatePicker from '../datePicker.vue';
import Form from '../../form/form.vue';
import FormItem from '../../form/formItem.vue';
import { sleep } from '../../_util/__tests__/helpers';

const calendarPrefixCls = getPrefixCls('date-picker-calendar');

// jsdom 下 FPopper 内部响应式循环会触发 Maximum recursive updates（与
// datePicker.spec.ts 一致：stub 掉 Popper）。stub 另带 open/close 按钮，
// 直接驱动 v-model（update:modelValue → isOpened 状态机）与
// handlePopperVisible 分支；stub 后面板常驻，日历交互同既有 spec。
const popperStub = {
    emits: ['update:modelValue'],
    template: `
        <div class="popper-stub">
            <slot name="trigger" />
            <button class="stub-open" @click="$emit('update:modelValue', true)" />
            <button class="stub-close" @click="$emit('update:modelValue', false)" />
            <slot />
        </div>
    `,
};

const mountDatePicker = (props = {}, slots = {}) =>
    mount(DatePicker, {
        props,
        slots,
        global: {
            stubs: { Popper: popperStub },
        },
    });

const findInput = (wrapper: any) => wrapper.find('input');

const findDayCells = (wrapper: any) =>
    wrapper
        .findAll(`.${calendarPrefixCls}-days .${calendarPrefixCls}-date`)
        .filter(
            (item: any) =>
                !item.classes().includes(`${calendarPrefixCls}-date-out`),
        );

const START = new Date(2021, 4, 15).getTime();
const END = new Date(2021, 4, 20).getTime();

describe('DatePicker 入口分支补全：插槽', () => {
    test('daterange separator 插槽替换默认 SwapRight 图标', () => {
        const wrapper = mountDatePicker(
            { type: 'daterange', modelValue: [START, END] },
            { separator: () => '～' },
        );
        const inputs = wrapper.findAll('input');
        expect(inputs.length).toBe(2);
        // separator 插槽内容渲染在双输入之间（L35 slot 分支）
        expect(wrapper.find('.fes-range-input-separator').text()).toBe('～');
        wrapper.unmount();
    });

    test('daterange suffixIcon 插槽替换默认日历图标', () => {
        const wrapper = mountDatePicker(
            { type: 'daterange', modelValue: [START, END] },
            { suffixIcon: () => 'S!', separator: () => '~' },
        );
        // RangeInput 非清空态 suffix 槽渲染 suffixIcon（L39 slot 分支）
        expect(wrapper.find('.fes-range-input-suffix').text()).toBe('S!');
        wrapper.unmount();
    });

    test('单选择 suffixIcon 插槽替换默认日历图标', () => {
        const wrapper = mountDatePicker(
            { modelValue: START },
            { suffixIcon: () => 'S?' },
        );
        // InputInner suffix 槽渲染 suffixIcon（L61 slot 分支）
        expect(wrapper.find('.fes-input-inner-suffix').text()).toBe('S?');
        wrapper.unmount();
    });
});

describe('DatePicker 入口分支补全：valueType 表单上下文', () => {
    // L317：useFormAdaptor 的 valueType computed 仅在有 form-item
    // 注入 setRuleDefaultType 时才被读取（惰性 computed）；
    // 单/范围两类分别走 'number' / 'array' 臂
    test.each([
        ['date', 1],
        ['daterange', 2],
    ])('form-item 内挂载 type=%s → inputs=%i', (type, inputCount) => {
        const model = reactive({ date: '' });
        const wrapper = mount(Form, {
            props: { model },
            slots: {
                default: () =>
                    h(
                        FormItem,
                        { label: 'x', prop: 'date' },
                        {
                            default: () =>
                                h(DatePicker as any, {
                                    type,
                                    modelValue:
                                        type === 'daterange'
                                            ? [START, END]
                                            : START,
                                }),
                        },
                    ),
            },
            global: { stubs: { Popper: popperStub } },
        });
        // form-item 渲染 label + 日期输入（valueType 按 range 取 array / number）
        expect(wrapper.find('.fes-form').exists()).toBe(true);
        expect(wrapper.findAll('input').length).toBe(inputCount);
        wrapper.unmount();
    });
});

describe('DatePicker 入口分支补全：面板开关状态机', () => {
    test('open=true 受控打开：daterange 临时选中回显（visibleValue tmp 臂）后确认关闭', async () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
            open: true,
            modelValue: [START, END],
        });
        await sleep();
        const inputs = wrapper.findAll('input');
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(inputs[1].element.value).toBe('2021-05-20');
        // 点击左面板日期 → calendars tmpSelectedDateChange → tmpSelectedDates
        // 生效 → RangeInput selectedDates 取临时值（L335-338 两臂）
        const leftCells = findDayCells(wrapper);
        expect(leftCells.length).toBeGreaterThan(10);
        await leftCells[4].trigger('click');
        await sleep();
        expect(inputs[0].element.value).not.toBe('2021-05-15');
        expect(inputs[0].element.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        // 完成范围并确认 → change + 关闭（updatePopperOpen(false) → update:open false）
        await findDayCells(wrapper)[14].trigger('click');
        await sleep();
        const confirmBtn = wrapper
            .findAll('button')
            .find((b: any) => b.text() === '确认');
        expect(confirmBtn).toBeTruthy();
        await confirmBtn!.trigger('click');
        await sleep();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:open')).toBeTruthy();
        expect(
            wrapper.emitted('update:open')!.some((e: any) => e[0] === false),
        ).toBe(true);
        wrapper.unmount();
    });

    test('stub 驱动 open/close：update:open 随动 + 关闭时 checkBlur 无缓存不误发 blur', async () => {
        const wrapper = mountDatePicker({ modelValue: START });
        await wrapper.find('.stub-open').trigger('click');
        await sleep();
        // handlePopperVisible(true)：val !== false 臂（B28 false）
        expect(
            wrapper.emitted('update:open')!.some((e: any) => e[0] === true),
        ).toBe(true);
        // watcher：isOpened false→... 此处 open 从 false→true，不触发关闭重置
        await wrapper.find('.stub-close').trigger('click');
        await sleep();
        // handlePopperVisible(false) → checkBlur：cacheEvent 为空（未 blur）→
        // !isOpened && cacheEvent 为 false 臂 → 不 emit blur
        expect(
            wrapper.emitted('update:open')!.some((e: any) => e[0] === false),
        ).toBe(true);
        expect(wrapper.emitted('blur')).toBeUndefined();
        wrapper.unmount();
    });
});

describe('DatePicker 入口分支补全：blur/focus 交互', () => {
    test('面板打开时输入失焦：关闭面板并 emit blur（L412-413 臂 + isOpened watcher）', async () => {
        const wrapper = mountDatePicker({
            type: 'date',
            open: true,
            modelValue: START,
        });
        await sleep();
        await findInput(wrapper).trigger('blur');
        await sleep();
        // handleBlur：relatedTarget 不在面板内 + isOpened=true → updatePopperOpen(false)
        expect(
            wrapper.emitted('update:open')!.some((e: any) => e[0] === false),
        ).toBe(true);
        // checkBlur：面板已关 + 有缓存事件 → emit blur + 重置输入
        expect(wrapper.emitted('blur')!.length).toBe(1);
        expect(findInput(wrapper).element.value).toBe('2021-05-15');
        wrapper.unmount();
    });

    test('失焦目标在面板内（relatedTarget）不关闭面板不 emit blur', async () => {
        const wrapper = mountDatePicker({
            type: 'date',
            open: true,
            modelValue: START,
        });
        await sleep();
        const dayCell = findDayCells(wrapper)[12];
        expect(dayCell.exists()).toBe(true);
        await findInput(wrapper).trigger('blur', {
            relatedTarget: dayCell.element,
        });
        await sleep();
        // calendarsRef.$el.contains(relatedTarget) → L411 false 臂：跳过关闭与 checkBlur
        expect(wrapper.emitted('blur')).toBeUndefined();
        expect(wrapper.emitted('update:open')).toBeUndefined();
        wrapper.unmount();
    });

    test('重复 focus 不重复 emit focus（防重复聚焦）', async () => {
        const wrapper = mountDatePicker({ modelValue: START });
        await findInput(wrapper).trigger('focus');
        expect(wrapper.emitted('focus')!.length).toBe(1);
        await findInput(wrapper).trigger('focus');
        // L391 else 臂：inputIsFocus 已 true → 跳过再次 emit
        expect(wrapper.emitted('focus')!.length).toBe(1);
        wrapper.unmount();
    });
});

describe('DatePicker 入口分支补全：输入回退', () => {
    test('无有效缓存输入非法文本，blur 重置为空而非回退（L231 false 臂）', async () => {
        const wrapper = mountDatePicker();
        await findInput(wrapper).setValue('abcdef');
        expect(findInput(wrapper).element.value).toBe('abcdef');
        await findInput(wrapper).trigger('blur');
        await sleep();
        // cacheValidInputDate 为空 → L231 条件为假 → 不还原非法文本；
        // checkBlur 归位 dateText → 空 modelValue 回显为空
        expect(findInput(wrapper).element.value).toBe('');
        expect(wrapper.emitted('blur')!.length).toBe(1);
        wrapper.unmount();
    });

    test('先有效后非法，blur 还原为最后有效值（L231 true 臂完整链路）', async () => {
        const wrapper = mountDatePicker();
        await findInput(wrapper).setValue('2021-06-20');
        await sleep();
        expect(wrapper.emitted('change')![0][0]).toBe(
            new Date(2021, 5, 20).getTime(),
        );
        expect(findInput(wrapper).element.value).toBe('2021-06-20');
        await findInput(wrapper).setValue('2021-06-2x');
        expect(findInput(wrapper).element.value).toBe('2021-06-2x');
        await findInput(wrapper).trigger('blur');
        await sleep();
        // 回到缓存的有效值
        expect(findInput(wrapper).element.value).toBe('2021-06-20');
        wrapper.unmount();
    });
});

describe('DatePicker 入口分支补全：范围清空与 datemultiple', () => {
    test('daterange clearable 清空 → update:modelValue []（L372 [] 臂）', async () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
            clearable: true,
            modelValue: [START, END],
        });
        await sleep();
        const root = wrapper.find('.fes-range-input');
        expect(root.exists()).toBe(true);
        await root.trigger('mouseenter');
        const suffix = root.find('.fes-range-input-suffix');
        expect(suffix.findAll('svg').length).toBe(1);
        await suffix.find('svg').trigger('click');
        await sleep();
        expect(wrapper.emitted('clear')!.length).toBe(1);
        const last = wrapper.emitted('update:modelValue')!.pop()![0];
        expect(last).toEqual([]);
        const inputs = wrapper.findAll('input');
        expect(inputs[0].element.value).toBe('');
        expect(inputs[1].element.value).toBe('');
        wrapper.unmount();
    });

    test('datemultiple：输入框 readonly + 多值回显', () => {
        const wrapper = mountDatePicker({
            type: 'datemultiple',
            modelValue: [START, END],
        });
        const input = findInput(wrapper);
        // canEdit=false（datemultiple）→ readonly
        expect(input.attributes('readonly')).toBeDefined();
        // 多值以 "; " 拼接回显（getFormatDate 数组臂）
        expect(input.element.value).toBe('2021-05-15; 2021-05-20');
        wrapper.unmount();
    });
});
