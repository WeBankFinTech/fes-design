import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import getPrefixCls from '../../_util/getPrefixCls';
import DatePicker from '../datePicker.vue';
import { sleep } from '../../_util/__tests__/helpers';

const inputPrefixCls = getPrefixCls('input-inner');
const calendarPrefixCls = getPrefixCls('date-picker-calendar');
const calendarsPrefixCls = getPrefixCls('date-picker-calendars');

const findInput = (wrapper) => wrapper.find('input');
const findDayCells = (wrapper) =>
    wrapper
        .findAll(`.${calendarPrefixCls}-days .${calendarPrefixCls}-date`)
        .filter(
            (item) => !item.classes().includes(`${calendarPrefixCls}-date-out`),
        );
const findDay = (wrapper, day) =>
    findDayCells(wrapper).find((item) => item.text() === String(day));

// jsdom 下 FPopper 内部响应式循环会触发 Maximum recursive updates，
// 与 select/cascader 等组件测试一致：stub 掉 Popper，直接渲染面板内容。
// 注意：stub 后面板常驻（无开合生命周期），面板显示当前月份。
const popperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const mountDatePicker = (props = {}) =>
    mount(DatePicker, {
        props,
        global: {
            stubs: { Popper: popperStub },
        },
    });

describe('DatePicker v-model 回显', () => {
    test('type date displays yyyy-MM-dd by default', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        expect(findInput(wrapper).element.value).toBe('2021-05-15');
    });

    test('type datetime displays yyyy-MM-dd HH:mm:ss', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15, 10, 20, 30).getTime(),
            type: 'datetime',
        });
        expect(findInput(wrapper).element.value).toBe('2021-05-15 10:20:30');
    });

    test('type year displays yyyy', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            type: 'year',
        });
        expect(findInput(wrapper).element.value).toBe('2021');
    });

    test('type month displays yyyy-MM', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            type: 'month',
        });
        expect(findInput(wrapper).element.value).toBe('2021-05');
    });

    test('empty modelValue displays nothing', () => {
        const wrapper = mountDatePicker();
        expect(findInput(wrapper).element.value).toBe('');
    });

    test('typing a valid date emits change and update:modelValue', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        await findInput(wrapper).setValue('2021-06-20');
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(2021, 5, 20).getTime(),
        );
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(
            new Date(2021, 5, 20).getTime(),
        );
        expect(findInput(wrapper).element.value).toBe('2021-06-20');
    });

    test('blur restores the last valid input', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        await findInput(wrapper).setValue('abc');
        expect(findInput(wrapper).element.value).toBe('abc');
        await findInput(wrapper).trigger('blur');
        expect(findInput(wrapper).element.value).toBe('2021-05-15');
        expect(wrapper.emitted('blur').length).toBe(1);
    });
});

describe('DatePicker 面板 type 分支', () => {
    test('type date renders 6 rows of day cells', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        const cells = wrapper.findAll(
            `.${calendarPrefixCls}-days .${calendarPrefixCls}-date`,
        );
        expect(cells.length).toBe(42);
        // 当月天数格子（非补位）
        const now = new Date();
        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
        ).getDate();
        expect(findDayCells(wrapper).length).toBe(daysInMonth);
    });

    test('type date does not render months panel', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        expect(wrapper.find(`.${calendarPrefixCls}-months`).exists()).toBe(
            false,
        );
    });

    test('type datetime renders days panel with visible footer', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15, 10, 20, 30).getTime(),
            type: 'datetime',
        });
        expect(wrapper.find(`.${calendarPrefixCls}-days`).exists()).toBe(
            true,
        );
        // hasTime 分支下 footer 可见
        expect(
            wrapper.find(`.${calendarsPrefixCls}-footer`).exists(),
        ).toBe(true);
    });

    test('type month renders months panel and selects a month', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            type: 'month',
        });
        const months = wrapper.findAll(
            `.${calendarPrefixCls}-months .${calendarPrefixCls}-date`,
        );
        expect(months.length).toBe(12);
        expect(months[0].text()).toBe('一月');

        await months[8].trigger('click');
        await sleep();
        // 面板显示当前年（stub 常驻，visible 未触发锚定）
        const now = new Date();
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(now.getFullYear(), 8, 1).getTime(),
        );
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(
            new Date(now.getFullYear(), 8, 1).getTime(),
        );
    });

    test('type year renders years panel and selects a year', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            type: 'year',
        });
        const years = wrapper.findAll(
            `.${calendarPrefixCls}-years .${calendarPrefixCls}-date`,
        );
        expect(years.length).toBe(16);

        // 年份面板为 yearStart..yearStart+15，yearStart 为 16 的倍数
        const now = new Date();
        const yearStart = now.getFullYear() - (now.getFullYear() % 16);
        const target = years.find(
            (item) => item.text() === String(yearStart + 3),
        );
        await target.trigger('click');
        await sleep();
        // type year 只按年解析，change 为该年 1 月 1 日
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(yearStart + 3, 0, 1).getTime(),
        );
    });

    test('type quarter renders quarters panel and selects a quarter', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            type: 'quarter',
        });
        const quarters = wrapper.findAll(
            `.${calendarPrefixCls}-quarters .${calendarPrefixCls}-date`,
        );
        expect(quarters.length).toBe(4);
        expect(quarters.map((item) => item.text())).toEqual([
            'Q1',
            'Q2',
            'Q3',
            'Q4',
        ]);

        await quarters[2].trigger('click');
        await sleep();
        const now = new Date();
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(now.getFullYear(), 6, 1).getTime(),
        );
    });
});

describe('DatePicker 面板选择日期', () => {
    test('select a day emits change, update:modelValue and echoes input', async () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
        });

        const day20 = findDay(wrapper, 20);
        expect(day20).toBeTruthy();
        await day20.trigger('click');
        await sleep();

        const expected = new Date(
            now.getFullYear(),
            now.getMonth(),
            20,
        ).getTime();
        expect(wrapper.emitted('change')[0][0]).toBe(expected);
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(expected);
        // 输入框回显新选择的日期
        expect(findInput(wrapper).element.value).toBe(
            `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-20`,
        );
    });

    test('clicking the same day twice emits change only once', async () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
        });

        await findDay(wrapper, 20).trigger('click');
        await sleep();
        expect(wrapper.emitted('change').length).toBe(1);

        // 同一日期再次点击不重复触发 change（值等价去重）
        await findDay(wrapper, 20).trigger('click');
        await sleep();
        expect(wrapper.emitted('change').length).toBe(1);
    });

    test('daterange displays two inputs and renders two calendars', () => {
        const wrapper = mountDatePicker({
            modelValue: [
                new Date(2021, 4, 15).getTime(),
                new Date(2021, 5, 20).getTime(),
            ],
            type: 'daterange',
        });
        const inputs = wrapper.findAll('input');
        expect(inputs.length).toBe(2);
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(inputs[1].element.value).toBe('2021-06-20');

        expect(
            wrapper.find(`.${calendarsPrefixCls}-daterange`).exists(),
        ).toBe(true);
    });
});

describe('DatePicker disabledDate', () => {
    test('disabled cell cannot be selected', async () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
            disabledDate: (date: Date) => date.getDate() === 20,
        });

        const day20 = findDay(wrapper, 20);
        expect(day20.classes()).toContain(
            `${calendarPrefixCls}-date-disabled`,
        );

        await day20.trigger('click');
        await sleep();
        expect(wrapper.emitted('change')).toBeUndefined();

        // 未禁用的日期仍可选择
        const day21 = findDay(wrapper, 21);
        expect(
            day21.classes().includes(`${calendarPrefixCls}-date-disabled`),
        ).toBe(false);
        await day21.trigger('click');
        await sleep();
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(now.getFullYear(), now.getMonth(), 21).getTime(),
        );
    });

    test('dates beyond maxDate are disabled', async () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
            maxDate: new Date(now.getFullYear(), now.getMonth(), 18).getTime(),
        });

        const day19 = findDay(wrapper, 19);
        const day18 = findDay(wrapper, 18);
        expect(day19.classes()).toContain(
            `${calendarPrefixCls}-date-disabled`,
        );
        expect(
            day18.classes().includes(`${calendarPrefixCls}-date-disabled`),
        ).toBe(false);

        await day19.trigger('click');
        await sleep();
        expect(wrapper.emitted('change')).toBeUndefined();
    });

    test('dates before minDate are disabled', () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
            minDate: new Date(now.getFullYear(), now.getMonth(), 10).getTime(),
        });

        const day9 = findDay(wrapper, 9);
        const day10 = findDay(wrapper, 10);
        expect(day9.classes()).toContain(`${calendarPrefixCls}-date-disabled`);
        expect(
            day10.classes().includes(`${calendarPrefixCls}-date-disabled`),
        ).toBe(false);
    });
});

describe('DatePicker placeholder', () => {
    test.each([
        ['date', '选择日期'],
        ['datetime', '请选择日期时间'],
        ['year', '选择年份'],
        ['month', '选择月份'],
        ['quarter', '选择季度'],
    ])('type %s has default placeholder', (type, placeholder) => {
        const wrapper = mountDatePicker({ type });
        expect(findInput(wrapper).attributes('placeholder')).toBe(
            placeholder,
        );
    });

    test('custom placeholder overrides the default', () => {
        const wrapper = mountDatePicker({
            placeholder: '自定义占位',
        });
        expect(findInput(wrapper).attributes('placeholder')).toBe('自定义占位');
    });

    test('daterange placeholders apply to both inputs', () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
        });
        const inputs = wrapper.findAll('input');
        expect(inputs[0].attributes('placeholder')).toBe('起始日期');
        expect(inputs[1].attributes('placeholder')).toBe('结束日期');
    });
});

describe('DatePicker disabled', () => {
    test('input is disabled', () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            disabled: true,
        });
        expect(findInput(wrapper).attributes('disabled')).toBeDefined();
        // 禁用态输入框带禁用样式类
        expect(
            wrapper
                .find(`.${inputPrefixCls}`)
                .classes()
                .includes(`${inputPrefixCls}-disabled`),
        ).toBe(true);
    });

    test('disabled input rejects typing', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            disabled: true,
        });
        await findInput(wrapper).setValue('2021-06-20');
        // disabled input 不触发 input 事件，值不解析
        expect(wrapper.emitted('change')).toBeUndefined();
    });
});

describe('DatePicker clearable', () => {
    test('hover shows clear icon and click clears the value', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
            clearable: true,
        });
        expect(wrapper.find(`.${inputPrefixCls}-icon`).exists()).toBe(false);

        await wrapper.find(`.${inputPrefixCls}`).trigger('mouseenter');
        expect(wrapper.find(`.${inputPrefixCls}-icon`).exists()).toBe(true);

        await wrapper.find(`.${inputPrefixCls}-icon`).trigger('click');
        await sleep();

        expect(wrapper.emitted('clear').length).toBe(1);
        expect(wrapper.emitted('change')[0][0]).toBe(null);
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe(null);
        expect(findInput(wrapper).element.value).toBe('');
    });

    test('no clear icon without clearable', async () => {
        const wrapper = mountDatePicker({
            modelValue: new Date(2021, 4, 15).getTime(),
        });
        await wrapper.find(`.${inputPrefixCls}`).trigger('mouseenter');
        expect(wrapper.find(`.${inputPrefixCls}-icon`).exists()).toBe(false);
    });
});

describe('DatePicker control 模式', () => {
    test('control mode defers change until confirm clicked', async () => {
        const now = new Date();
        const wrapper = mountDatePicker({
            modelValue: new Date(
                now.getFullYear(),
                now.getMonth(),
                15,
            ).getTime(),
            control: true,
        });

        const confirmBtn = wrapper
            .findAll('button')
            .find((item) => item.text() === '确认');
        expect(confirmBtn).toBeTruthy();

        // 直接点确认：值未变，不触发 change
        await confirmBtn.trigger('click');
        await sleep();
        expect(wrapper.emitted('change')).toBeUndefined();

        // 选择日期后确认
        await findDay(wrapper, 20).trigger('click');
        await sleep();
        expect(wrapper.emitted('change')).toBeUndefined();

        await confirmBtn.trigger('click');
        await sleep();
        expect(wrapper.emitted('change')[0][0]).toBe(
            new Date(now.getFullYear(), now.getMonth(), 20).getTime(),
        );
    });
});

describe('DatePicker shortcuts 受控值端到端', () => {
    // 技能 4A-5 模式：ref + onUpdateValue 模拟真实受控用法，
    // 面板交互 → 断言业务值（而非仅 emitted）
    test('点击数值 shortcut 受控值变为该时间戳', async () => {
        const stamp = new Date(2025, 0, 15).getTime();
        const test = ref<number>(0);
        const wrapper = mountDatePicker({
            'type': 'date',
            'modelValue': test.value,
            'onUpdate:modelValue': (v: number) => {
                test.value = v;
            },
            'shortcuts': {
                前年: stamp,
            },
        });
        const shortcut = wrapper.find(`.${calendarsPrefixCls}-shortcuts li`);
        expect(shortcut.exists()).toBe(true);
        expect(shortcut.text()).toBe('前年');
        await shortcut.trigger('click');
        await sleep();
        expect(test.value).toBe(stamp);
        wrapper.unmount();
    });

    test('点击函数 shortcut 受控值取函数返回值', async () => {
        const stamp = new Date(2025, 5, 1).getTime();
        const test = ref<number>(0);
        const wrapper = mountDatePicker({
            'type': 'date',
            'modelValue': test.value,
            'onUpdate:modelValue': (v: number) => {
                test.value = v;
            },
            'shortcuts': {
                今天: () => stamp,
            },
        });
        await wrapper.find(`.${calendarsPrefixCls}-shortcuts li`).trigger('click');
        await sleep();
        expect(test.value).toBe(stamp);
        wrapper.unmount();
    });

    test('daterange 数组 shortcut 一次性设置区间两端', async () => {
        const start = new Date(2025, 0, 1).getTime();
        const end = new Date(2025, 0, 31).getTime();
        const test = ref<[number, number]>([0, 0]);
        const wrapper = mountDatePicker({
            'type': 'daterange',
            'modelValue': test.value,
            'onUpdate:modelValue': (v: [number, number]) => {
                test.value = v;
            },
            'shortcuts': {
                一月: [start, end],
            },
        });
        await wrapper.find(`.${calendarsPrefixCls}-shortcuts li`).trigger('click');
        await sleep();
        expect(test.value).toEqual([start, end]);
        wrapper.unmount();
    });
});
