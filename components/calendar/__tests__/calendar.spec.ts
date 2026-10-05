import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import getPrefixCls from '../../_util/getPrefixCls';
import FCalendar from '../calendar';

const prefixCls = getPrefixCls('calendar');
const cls = (className: string) => `${prefixCls}-${className}`;

const findCells = (wrapper) => wrapper.findAll(`.${cls('panel-cell')}`);
const findNavigatorDate = (wrapper) =>
    wrapper.find(`.${getPrefixCls('calendar-navigator')}-current-date`);
const findNavBtns = (wrapper) =>
    wrapper.findAll(`.${getPrefixCls('calendar-navigator')}-btn`);

describe('Calendar render', () => {
    test('renders 42 cells in date mode', () => {
        const wrapper = mount(FCalendar);
        expect(findCells(wrapper).length).toBe(42);
        expect(wrapper.find(`.${cls('date-panel')}`).exists()).toBe(true);
    });

    test('renders week name header in date mode', () => {
        const wrapper = mount(FCalendar);
        const weekCells = wrapper.findAll(
            `.${cls('week-name-header-cell')}`,
        );
        expect(weekCells.length).toBe(7);
        // 一周从周一开始
        expect(weekCells.map((item) => item.text())).toEqual([
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
            '日',
        ]);
    });

    test('cell content is day number in date mode', () => {
        const wrapper = mount(FCalendar);
        const cells = findCells(wrapper);
        const currentCells = cells.filter(
            (cell) => !cell.classes().includes(cls('panel-cell-secondary')),
        );
        // 当月格子数等于当月天数，且依次为 1..daysInMonth
        const now = new Date();
        const daysInMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
        ).getDate();
        expect(currentCells.length).toBe(daysInMonth);
        currentCells.forEach((cell, index) => {
            expect(cell.text()).toBe(String(index + 1));
        });
    });

    test('marks today cell', () => {
        const wrapper = mount(FCalendar);
        expect(wrapper.find(`.${cls('panel-cell-today')}`).exists()).toBe(
            true,
        );
    });

    test('marks the cell of modelValue as active', () => {
        const now = new Date();
        const modelValue = new Date(
            now.getFullYear(),
            now.getMonth(),
            15,
        ).getTime();
        const wrapper = mount(FCalendar, {
            props: { modelValue },
        });
        const activeCell = wrapper.find(`.${cls('panel-cell-active')}`);
        expect(activeCell.exists()).toBe(true);
        expect(activeCell.text()).toBe('15');
    });

    test('marks out of month cells as secondary in date mode', () => {
        const wrapper = mount(FCalendar);
        const secondaryCells = wrapper.findAll(
            `.${cls('panel-cell-secondary')}`,
        );
        // 42 格中一定存在非当月的补位格子
        expect(secondaryCells.length).toBeGreaterThan(0);
    });

    test('splitLine false adds without-split-line class', () => {
        const wrapper = mount(FCalendar, {
            props: { splitLine: false },
        });
        expect(wrapper.classes()).toContain(cls('without-split-line'));
    });

    test('splitLine default has no without-split-line class', () => {
        const wrapper = mount(FCalendar);
        expect(wrapper.classes()).not.toContain(cls('without-split-line'));
    });

    test('height accepts number and string', () => {
        const wrapper = mount(FCalendar, {
            props: { height: 400 },
        });
        expect(wrapper.attributes('style')).toContain('400px');
        const wrapper2 = mount(FCalendar, {
            props: { height: '50%' },
        });
        expect(wrapper2.attributes('style')).toContain('50%');
    });

    test('renders cellMain slot content', () => {
        const wrapper = mount(FCalendar, {
            slots: {
                cellMain: ({ date }) =>
                    h('em', { class: 'custom-cell-main' }, String(new Date(date).getDate())),
            },
        });
        const customCells = wrapper.findAll('.custom-cell-main');
        expect(customCells.length).toBe(42);
    });

    test('renders cellAppendant slot content', () => {
        const wrapper = mount(FCalendar, {
            slots: {
                cellAppendant: () =>
                    h('i', { class: 'custom-cell-appendant' }, '+'),
            },
        });
        const customCells = wrapper.findAll('.custom-cell-appendant');
        expect(customCells.length).toBe(42);
    });
});

describe('Calendar month mode', () => {
    test('renders 12 month cells without week header', () => {
        const wrapper = mount(FCalendar, {
            props: { mode: 'month' },
        });
        expect(wrapper.find(`.${cls('month-panel')}`).exists()).toBe(true);
        expect(wrapper.find(`.${cls('week-name-header')}`).exists()).toBe(
            false,
        );
        const cells = findCells(wrapper);
        expect(cells.length).toBe(12);
        expect(cells[0].text()).toBe('1 月');
        expect(cells[11].text()).toBe('12 月');
    });

    test('month cells have no secondary class', () => {
        const wrapper = mount(FCalendar, {
            props: { mode: 'month' },
        });
        expect(wrapper.find(`.${cls('panel-cell-secondary')}`).exists())
            .toBe(false);
    });

    test('marks current month cell as today', () => {
        const wrapper = mount(FCalendar, {
            props: { mode: 'month', modelValue: Date.now() },
        });
        const todayCell = wrapper.find(`.${cls('panel-cell-today')}`);
        expect(todayCell.exists()).toBe(true);
        const now = new Date();
        expect(todayCell.text()).toBe(`${now.getMonth() + 1} 月`);
    });

    test('navigates by year in month mode', async () => {
        const wrapper = mount(FCalendar, {
            props: { mode: 'month' },
        });
        const navBtns = findNavBtns(wrapper);
        // 年视图只有前后两年两个按钮
        expect(navBtns.length).toBe(2);
        const before = findNavigatorDate(wrapper).text();
        const year = new Date().getFullYear();
        expect(before).toBe(`${year} 年`);

        await navBtns[0].trigger('click');
        await nextTick();
        expect(findNavigatorDate(wrapper).text()).toBe(`${year - 1} 年`);

        await navBtns[1].trigger('click');
        await nextTick();
        expect(findNavigatorDate(wrapper).text()).toBe(`${year} 年`);
    });

    test('cellClick emits month mode', async () => {
        const wrapper = mount(FCalendar, {
            props: { mode: 'month' },
        });
        await findCells(wrapper)[5].trigger('click');
        const emitted = wrapper.emitted('cellClick');
        expect(emitted.length).toBe(1);
        expect(emitted[0][0].mode).toBe('month');
        expect(new Date(emitted[0][0].date).getMonth()).toBe(5);
    });
});

describe('Calendar navigator', () => {
    test('displays current year and month', () => {
        const wrapper = mount(FCalendar);
        const now = new Date();
        expect(findNavigatorDate(wrapper).text()).toBe(
            `${now.getFullYear()} 年 ${now.getMonth() + 1} 月`,
        );
    });

    test('has four buttons in date mode', () => {
        const wrapper = mount(FCalendar);
        expect(findNavBtns(wrapper).length).toBe(4);
    });

    test('navigates to previous month', async () => {
        const wrapper = mount(FCalendar);
        // 按钮顺序：上一年、上一月、下一月、下一年
        await findNavBtns(wrapper)[1].trigger('click');
        await nextTick();
        const now = new Date();
        const expectDate
            = now.getMonth() === 0
                ? new Date(now.getFullYear() - 1, 11, 1)
                : new Date(now.getFullYear(), now.getMonth() - 1, 1);
        expect(findNavigatorDate(wrapper).text()).toBe(
            `${expectDate.getFullYear()} 年 ${expectDate.getMonth() + 1} 月`,
        );
    });

    test('navigates to next month', async () => {
        const wrapper = mount(FCalendar);
        await findNavBtns(wrapper)[2].trigger('click');
        await nextTick();
        const now = new Date();
        const expectDate
            = now.getMonth() === 11
                ? new Date(now.getFullYear() + 1, 0, 1)
                : new Date(now.getFullYear(), now.getMonth() + 1, 1);
        expect(findNavigatorDate(wrapper).text()).toBe(
            `${expectDate.getFullYear()} 年 ${expectDate.getMonth() + 1} 月`,
        );
    });

    test('navigates to previous and next year', async () => {
        const wrapper = mount(FCalendar);
        const year = new Date().getFullYear();

        await findNavBtns(wrapper)[0].trigger('click');
        await nextTick();
        expect(findNavigatorDate(wrapper).text()).toContain(
            `${year - 1} 年`,
        );

        // 再回到当前年
        await findNavBtns(wrapper)[3].trigger('click');
        await nextTick();
        expect(findNavigatorDate(wrapper).text()).toContain(`${year} 年`);
    });
});

describe('Calendar cellClick', () => {
    test('emits cellClick with date and mode', async () => {
        const now = new Date();
        const modelValue = new Date(
            now.getFullYear(),
            now.getMonth(),
            10,
            10,
            30,
        ).getTime();
        const wrapper = mount(FCalendar, {
            props: { modelValue },
        });
        // 点击当月的 20 号
        const target = findCells(wrapper)
            .filter((cell) => !cell.classes().includes(cls('panel-cell-secondary')))
            .find((cell) => cell.text() === '20');
        await target.trigger('click');

        const emitted = wrapper.emitted('cellClick');
        expect(emitted.length).toBe(1);
        const payload = emitted[0][0];
        expect(payload.mode).toBe('date');
        const result = new Date(payload.date);
        expect(result.getDate()).toBe(20);
        // 保留 modelValue 中的时分秒
        expect(result.getHours()).toBe(10);
        expect(result.getMinutes()).toBe(30);
    });

    test('updates modelValue on cell click', async () => {
        const wrapper = mount(FCalendar);
        const target = findCells(wrapper)
            .filter((cell) => !cell.classes().includes(cls('panel-cell-secondary')))
            .find((cell) => cell.text() === '15');
        await target.trigger('click');

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted.length).toBe(1);
        expect(new Date(emitted[0][0]).getDate()).toBe(15);
    });

    test('clicks an out of month cell to jump the displayed month', async () => {
        const wrapper = mount(FCalendar);
        const before = findNavigatorDate(wrapper).text();
        const secondaryCell = wrapper.find(`.${cls('panel-cell-secondary')}`);
        expect(secondaryCell.exists()).toBe(true);

        await secondaryCell.trigger('click');
        await nextTick();

        expect(findNavigatorDate(wrapper).text()).not.toBe(before);
    });
});

describe('Calendar shortcuts', () => {
    test('renders shortcut buttons', () => {
        const wrapper = mount(FCalendar, {
            props: {
                shortcuts: [
                    { label: '今天', time: Date.now() },
                    { label: '上月', time: () => new Date(2021, 4, 1).getTime() },
                ],
            },
        });
        const btns = wrapper.findAll(
            `.${cls('action-bar-right')} .${getPrefixCls('btn')}`,
        );
        expect(btns.length).toBe(2);
        expect(btns[0].text()).toBe('今天');
        expect(btns[1].text()).toBe('上月');
    });

    test('clicks a shortcut with number time', async () => {
        const time = new Date(2021, 5, 15).getTime();
        const wrapper = mount(FCalendar, {
            props: {
                shortcuts: [{ label: '固定日期', time }],
            },
        });
        await wrapper
            .findAll(`.${cls('action-bar-right')} .${getPrefixCls('btn')}`)[0]
            .trigger('click');
        await nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted.length).toBe(1);
        expect(emitted[0][0]).toBe(time);
        // 锚定日期跳转到快捷日期
        expect(findNavigatorDate(wrapper).text()).toBe('2021 年 6 月');
    });

    test('clicks a shortcut with function time', async () => {
        const time = new Date(2022, 0, 1).getTime();
        const wrapper = mount(FCalendar, {
            props: {
                shortcuts: [{ label: '函数日期', time: () => time }],
            },
        });
        await wrapper
            .findAll(`.${cls('action-bar-right')} .${getPrefixCls('btn')}`)[0]
            .trigger('click');
        await nextTick();

        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted[0][0]).toBe(time);
        expect(findNavigatorDate(wrapper).text()).toBe('2022 年 1 月');
    });
});
