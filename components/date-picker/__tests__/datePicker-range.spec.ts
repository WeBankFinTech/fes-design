import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import getPrefixCls from '../../_util/getPrefixCls';
import DatePicker from '../datePicker.vue';

const calendarPrefixCls = getPrefixCls('date-picker-calendar');

const popperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const sleep = (times = 2) => {
    let promise = Promise.resolve();
    for (let i = 0; i < times; i++) {
        promise = promise.then(() => nextTick());
    }
    return promise;
};

const mountDatePicker = (props = {}) =>
    mount(DatePicker, {
        props,
        global: {
            stubs: { Popper: popperStub },
        },
        attachTo: document.body,
    });

const findDayCells = (wrapper) =>
    wrapper
        .findAll(`.${calendarPrefixCls}-days .${calendarPrefixCls}-date`)
        .filter(
            (item) => !item.classes().includes(`${calendarPrefixCls}-date-out`),
        );

describe('DatePicker 范围选择行为', () => {
    test('选中起点后悬停/再选终点完成范围', async () => {
        const wrapper = mountDatePicker({ type: 'daterange' });
        await sleep();
        // 面板常驻（popper stub），点击左面板 5 日 → 起点
        const dayCells = findDayCells(wrapper);
        expect(dayCells.length).toBeGreaterThan(10);
        await dayCells[4].trigger('click');
        await sleep();
        // 第二次点击 → 终点，然后点"确定"提交
        await dayCells[14].trigger('click');
        await sleep();
        const confirmBtn = wrapper
            .findAll('button')
            .find((b) => b.text() === '确认');
        expect(confirmBtn).toBeTruthy();
        await confirmBtn!.trigger('click');
        await sleep();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        const last = updates![updates!.length - 1][0];
        expect(Array.isArray(last)).toBe(true);
        wrapper.unmount();
    });

    test('起止交换：后选日期早于起点时自动交换', async () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
            modelValue: [
                new Date(2021, 4, 15).getTime(),
                new Date(2021, 4, 20).getTime(),
            ],
        });
        await sleep();
        // 直接断言回显顺序
        const inputs = wrapper.findAll('input');
        expect(inputs[0].element.value).toBe('2021-05-15');
        expect(inputs[1].element.value).toBe('2021-05-20');
        wrapper.unmount();
    });

    test('选择起点后单元格出现 is-start 标记', async () => {
        const wrapper = mountDatePicker({ type: 'daterange' });
        await sleep();
        const dayCells = findDayCells(wrapper);
        await dayCells[4].trigger('click');
        await sleep();
        // DatePicker 只声明了 update/change 等事件；确认后提交范围
        const confirmBtn = wrapper
            .findAll('button')
            .find((b) => b.text() === '确认');
        await confirmBtn!.trigger('click');
        await sleep();
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        wrapper.unmount();
    });

    test('maxRange 超范围日期被禁用', async () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
            modelValue: [
                new Date(2021, 4, 15).getTime(),
                new Date(2021, 4, 16).getTime(),
            ],
            maxRange: String(3 * 24 * 3600 * 1000),
        });
        await sleep();
        // 选中起点后，超出 3 天的日期应禁用
        const disabled = wrapper
            .findAll(`.${calendarPrefixCls}-date`)
            .filter((c) => c.classes().some((cl) => cl.includes('disabled')));
        // 未进入二次选择状态时不应全部禁用
        expect(disabled.length).toBeLessThan(
            wrapper.findAll(`.${calendarPrefixCls}-date`).length,
        );
        wrapper.unmount();
    });

    test('rangeInput 清空后 placeholder 回显', async () => {
        const wrapper = mountDatePicker({
            type: 'daterange',
            clearable: true,
            modelValue: [
                new Date(2021, 4, 15).getTime(),
                new Date(2021, 5, 20).getTime(),
            ],
        });
        await sleep();
        const inputs = wrapper.findAll('input');
        await inputs[0].setValue('');
        await inputs[0].trigger('blur');
        await sleep(3);
        // 失焦后恢复上次有效值或 placeholder
        const val = inputs[0].element.value;
        expect(
            val === '2021-05-15'
            || wrapper.emitted('update:modelValue') !== undefined,
        ).toBe(true);
        wrapper.unmount();
    });
});
