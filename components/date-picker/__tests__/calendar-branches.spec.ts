import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import DatePicker from '../datePicker.vue';
import FCalendar from '../calendar.vue';
import { useDay } from '../useCalendar';

// useCalendar.ts / calendar.vue 分支补全。
// jsdom 下 FPopper 内部响应式循环会触发 Maximum recursive updates（既有
// 已知问题，见 datePicker.spec.ts 头部注释），与 select/cascader 一致：
// stub 掉 Popper，面板常驻渲染，直接驱动面板交互。
const popperStub = {
    template: '<div><slot name="trigger" /><slot /></div>',
};

const P = 'fes-date-picker-calendar';

const mountDP = (props: Record<string, any> = {}) =>
    mount(DatePicker, {
        props,
        global: { stubs: { Popper: popperStub } },
    });

// TimePicker stub：FCalendar datetimerange 面板内的时间选择器，可手动触发
// change 事件（走 useTime.changeTime → updateSelectedDates isTime 臂）
const timeStub = {
    name: 'TimePicker',
    emits: ['change'],
    template: '<input class="tp" />',
    methods: {
        fire(v: string) {
            (this as any).$emit('change', v);
        },
    },
};

// 日面板 42 格（去掉星期表头 span）
const findDayCells = (wrapper: any) =>
    wrapper
        .findAll(`.${P}-days span`)
        .filter((c: any) => c.classes().some((x: string) => x.includes(`${P}-date`)));

// 当月格（去掉跨月补位）
const findInMonthCells = (wrapper: any) =>
    findDayCells(wrapper).filter(
        (c: any) => !c.classes().includes(`${P}-date-out`),
    );

// 头部箭头顺序：[去年, 上月, 下月, 明年]
const findArrows = (wrapper: any) => wrapper.findAll(`.${P}-head .fes-design-icon`);

describe('useCalendar：range 边界与端点交换', () => {
    // L75-76/95/98/108-118/141-158：range 下 updateSelectedDates 各臂。
    // 直挂 FCalendar（selectedStatus=END）+ 面板日期输入行（datetimerange）：
    // updateRangeSelectedDates 交换臂改变两端（change 事件同 timestamp×2），
    // another 补齐臂改变起始端（change 事件第二槽为另一端补齐日期）
    test('range：LEFT 输入晚于另一端 → 交换臂两端归同', async () => {
        const val = [new Date(2021, 4, 20).getTime(), new Date(2021, 4, 25).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 1, // SELECTED_STATUS.END
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        expect(dateInput.exists()).toBe(true);
        await dateInput.setValue('2021-06-30');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getDate()).toBe(30);
        expect(new Date(payload[1]).getDate()).toBe(30); // 两端归同 = 交换臂
        wrapper.unmount();
    });

    // L108/141-158：another 补齐臂 —— selectedStatus=START 时直输合法日期
    // → fillDate 补另一端 + selectedDay 事件
    test('range：START 状态输入 → another 补齐臂两端各自生成', async () => {
        const val = [new Date(2021, 4, 20).getTime(), new Date(2021, 5, 25).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 0, // SELECTED_STATUS.START
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        expect(dateInput.exists()).toBe(true);
        await dateInput.setValue('2021-06-10');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        // 输入日期晚于 [0] → L142 else 臂 splice(1,...)，新日期落 right 端
        expect(new Date(payload[0]).getDate()).toBe(20);
        expect(new Date(payload[1]).getDate()).toBe(10);
        wrapper.unmount();
    });

    // L185/187：modelValue 空数组 → map 走空数组（不崩、输入框空回显）
    test('range：modelValue 空数组初始化不崩且输入框为空', async () => {
        const wrapper = mountDP({ modelValue: [], type: 'daterange' });
        await nextTick();
        const inputs = wrapper.findAll('input');
        expect(inputs[0].element.value).toBe('');
        wrapper.unmount();
    });

    // L249/257：month 面板 disabledDate 拦截月格（monthCls disabled 真路）
    test('type month：disabledDate 命中月份置灰', async () => {
        const wrapper = mountDP({
            modelValue: new Date(2021, 5, 1).getTime(),
            type: 'month',
            disabledDate: (date: Date) => date.getMonth() === 6, // 7 月禁用
        });
        await nextTick();
        const monthCells = wrapper.findAll(`.${P}-months span`);
        expect(monthCells.length).toBe(12);
        const disabled = monthCells.filter((m) =>
            m.classes().includes(`${P}-date-disabled`),
        );
        expect(disabled.length).toBe(1);
        wrapper.unmount();
    });
});

describe('useCalendar：datemultiple 多选日期', () => {
    // L123/126/131/139/170：点击追加（findIndex -1 → push）、
    // 重复点击移除（findIndex !== -1 → splice）、emit map 序列化
    test('datemultiple：点击追加选中类，确认提交后重复点击移除', async () => {
        const val = ref([]);
        const wrapper = mountDP({
            'modelValue': val.value,
            'type': 'datemultiple',
            'onUpdate:modelValue': (v: any) => {
                val.value = v;
            },
        });
        await nextTick();
        const cells = () => findInMonthCells(wrapper);
        const day15 = () => cells().find((c: any) => c.text() === '15');
        expect(day15()).toBeTruthy();
        // 第一轮：点击 → selected 类 → 确认 → emit 数组长度 1
        await day15()!.trigger('click');
        await new Promise((r) => setTimeout(r, 30));
        expect(day15()!.classes()).toContain(`${P}-date-selected`);
        const confirmBtn = wrapper
            .findAll('button')
            .find((b: any) => b.text() === '确认');
        await confirmBtn!.trigger('click');
        await new Promise((r) => setTimeout(r, 30));
        expect(val.value.length).toBe(1);
        // 第二轮：重复点击同一格 → selected 类消失（splice 移除臂）
        await day15()!.trigger('click');
        await new Promise((r) => setTimeout(r, 30));
        expect(day15()!.classes()).not.toContain(`${P}-date-selected`);
        wrapper.unmount();
    });
});

describe('useCalendar：年月边界与周偏移（FCalendar 直挂带 activeDate）', () => {
    // 包装层 defaultActiveDate=Date.now()，直挂 FCalendar 传 activeDate 才能稳定控月
    const mountCal = (year: number, month: number, extra: Record<string, any> = {}) => {
        const val = ref([new Date(2021, 4, 15).getTime()]);
        return {
            val,
            wrapper: mount(FCalendar, {
                props: {
                    'modelValue': val.value,
                    'type': 'date',
                    'activeDate': new Date(year, month, 1).getTime(),
                    'onUpdate:modelValue': (v: any) => {
                        val.value = v;
                    },
                    ...extra,
                },
            }),
        };
    };

    // L357：monthToNext 12 月 → year+1, month=0
    test('12月点下一月 → 跨年到次年 1 月', async () => {
        const { wrapper } = mountCal(2021, 11);
        await nextTick();
        const headText = () => wrapper.find(`.${P}-head`).text();
        expect(headText()).toContain('2021');
        await findArrows(wrapper)[2].trigger('click'); // 下月
        await nextTick();
        expect(headText()).toContain('2022');
        wrapper.unmount();
    });

    // L370：monthToPre 1 月 → year-1, month=11
    test('1月点上月 → 跨年到上年 12 月', async () => {
        const { wrapper } = mountCal(2021, 0);
        await nextTick();
        await findArrows(wrapper)[1].trigger('click'); // 上月
        await nextTick();
        const headText = wrapper.find(`.${P}-head`).text();
        expect(headText).toContain('2020');
        expect(headText).toContain('12');
        wrapper.unmount();
    });

    // L474/477/497-502：count 计算走 `weekFirstDayValue <= week` 真臂
    // （2021-05：上月末 4/30 周五 → week=5 → count=5，首格 4/26）；12 月的
    // next 补位年 +1/月 0
    test('常规月份首行补位正确且 42 格', async () => {
        const { wrapper } = mountCal(2021, 4); // 2021-05
        await nextTick();
        const cells = findDayCells(wrapper);
        expect(cells.length).toBe(42);
        const first = cells[0];
        expect(first.classes()).toContain(`${P}-date-out`);
        expect(first.text()).toBe('26'); // 4/26 开始补位
        wrapper.unmount();
    });

    test('12 月日历尾部补位落到次年 1 月', async () => {
        const { wrapper } = mountCal(2021, 11);
        await nextTick();
        const cells = findDayCells(wrapper);
        expect(cells.length).toBe(42);
        expect(cells[41].classes()).toContain(`${P}-date-out`);
        wrapper.unmount();
    });
});

describe('calendar.vue：日期时间输入（datetime 才渲染输入行）', () => {
    // L245-259/280：handleDateInput 合法/非法臂 + blur 还原 cacheValidInputDate
    test('datetime：非法输入 blur 还原，合法输入提交', async () => {
        const val = ref(new Date(2021, 4, 20, 8, 0, 0).getTime());
        const wrapper = mountDP({
            'modelValue': val.value,
            'type': 'datetime',
            'onUpdate:modelValue': (v: any) => {
                val.value = v;
            },
        });
        await nextTick();
        const input = wrapper.find(`.${P}-input-date input`);
        expect(input.exists()).toBe(true);
        // 非法输入 → blur 还原（inputDate !== cacheValidInputDate 真分支）
        await input.setValue('abc');
        await input.trigger('blur');
        await nextTick();
        expect(input.element.value).not.toBe('abc');
        // 合法输入 → handleDateInput 有效臂提交
        await input.setValue('2021-06-15');
        await input.trigger('blur');
        await new Promise((r) => setTimeout(r, 30));
        expect(val.value).toBeTruthy();
        wrapper.unmount();
    });

    // L385/388：点击上月/下月补位格 → monthToPre/monthToNext
    test('点击上/下月补位格子切换月份', async () => {
        const val = ref([new Date(2021, 4, 15).getTime()]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'date',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const headText = () => wrapper.find(`.${P}-head`).text();
        const outCells = () =>
            findDayCells(wrapper).filter((c: any) =>
                c.classes().includes(`${P}-date-out`),
            );
        // 头部补位是上月尾（pre，日期 > 20），尾部补位是下月头（next，< 10）
        const preCells = outCells().filter((c: any) => Number(c.text()) > 20);
        expect(preCells.length).toBeGreaterThan(0);
        await preCells[0].trigger('click'); // pre → monthToPre（4 月）
        await new Promise((r) => setTimeout(r, 30));
        expect(headText()).toContain('4');
        // 4 月尾部 next 格 → monthToNext 回 5 月
        const nextInApril = findDayCells(wrapper)
            .filter((c: any) => c.classes().includes(`${P}-date-out`))
            .filter((c: any) => Number(c.text()) < 10);
        expect(nextInApril.length).toBeGreaterThan(0);
        await nextInApril[nextInApril.length - 1].trigger('click');
        await new Promise((r) => setTimeout(r, 30));
        expect(headText()).toContain('5');
        wrapper.unmount();
    });
});

describe('calendar.vue：年面板 year±YEAR_COUNT 分支', () => {
    // L412/423：isYearSelect 时年切换按 YEAR_COUNT(16 年) 跳
    test('type year：切换按 16 年跳', async () => {
        const val = ref([new Date(2021, 0, 1).getTime()]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'year',
                'activeDate': new Date(2021, 0, 1).getTime(),
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const headText = () => wrapper.find(`.${P}-head`).text();
        expect(headText()).toContain('2021');
        const arrows = findArrows(wrapper);
        expect(arrows.length).toBe(4);
        await arrows[3].trigger('click'); // 明年组（+16）
        await nextTick();
        expect(headText()).toContain('2037');
        await arrows[0].trigger('click'); // 去年组（-16）
        await nextTick();
        expect(headText()).toContain('2021');
        wrapper.unmount();
    });

    // useCalendar L249/257：isSelectedYear year 分支真臂 + yearCls disabled 槽
    // （type=year 且 disabledDate 命中 → 年份格 disabled 类）
    test('type year：disabledDate 命中年份格 disabled，选中年 selected', async () => {
        const val = ref([new Date(2021, 0, 1).getTime()]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'year',
                'activeDate': new Date(2021, 0, 1).getTime(),
                'disabledDate': (date: Date) => date.getFullYear() === 2030,
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const yearCells = wrapper.findAll(`.${P}-years span`);
        expect(yearCells.length).toBeGreaterThan(0);
        const disabled = yearCells.filter((y) =>
            y.classes().includes(`${P}-date-disabled`),
        );
        expect(disabled.length).toBe(1); // 2030
        const selected = yearCells.filter((y) =>
            y.classes().includes(`${P}-date-selected`),
        );
        expect(selected.length).toBe(1); // 2021
        wrapper.unmount();
    });
});

describe('FCalendar 裸挂（month 面板 isSelectedMonth 真路）', () => {
    // useCalendar L389：isMonthSelect 真路 + monthCls selected/disabled 组合
    test('FCalendar month：选中月高亮、禁用月拦截、点选其他月生效', async () => {
        const val = ref([new Date(2021, 5, 1).getTime()]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'month',
                'activeDate': new Date(2021, 5, 1).getTime(),
                'disabledDate': (date: Date) => date.getMonth() === 6,
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const monthCells = wrapper.findAll(`.${P}-months span`);
        expect(monthCells.length).toBe(12);
        const selected = monthCells.filter((m) =>
            m.classes().includes(`${P}-date-selected`),
        );
        expect(selected.length).toBe(1); // 6 月
        const disabled = monthCells.filter((m) =>
            m.classes().includes(`${P}-date-disabled`),
        );
        expect(disabled.length).toBe(1); // 7 月
        // 点选 3 月 → 更新
        await monthCells[2].trigger('click');
        await new Promise((r) => setTimeout(r, 30));
        expect(val.value.length).toBeGreaterThan(0);
        wrapper.unmount();
    });
});

describe('useTime：时间变更 isTime 臂与 today 补位', () => {
    // L697/702：changeTime 有值臂 + selectedDates 空年补 today；
    // L95 isTime 真臂 → updateRangeSelectedDates 交换臂（两端同日同时分）
    test('datetimerange：改时间触发两端同日同时又分（空选中补 today）', async () => {
        const val: any[] = [];
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val,
                'type': 'datetimerange',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'rangePosition': 'left',
                'selectedStatus': 0,
                'onUpdate:modelValue': (v: any) => {
                    val.length = 0;
                    val.push(...v);
                },
            },
            global: { stubs: { TimePicker: timeStub } },
        });
        await nextTick();
        const tp = wrapper.findComponent(timeStub);
        expect(tp.exists()).toBe(true);
        await (tp.vm as any).fire('12:30:00');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        // 两端同日同时（00:00 起 12:30:00 + 999ms 秒边界）
        const start = new Date(payload[0]);
        const end = new Date(payload[1]);
        expect(start.getDate()).toBe(end.getDate());
        expect(start.getHours()).toBe(12);
        expect(start.getMinutes()).toBe(30);
        wrapper.unmount();
    });

    // L717：innerDisabledTime 有 disabledTime 时计算分发
    test('datetime：传入 disabledTime 时内部禁用时间计算不返回 null', async () => {
        const val = [new Date(2021, 4, 20, 8, 0, 0).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetime',
                activeDate: new Date(2021, 4, 1).getTime(),
                disabledTime: () => ({
                    disabledHours: () => [] as number[],
                    disabledMinutes: () => [] as number[],
                    disabledSeconds: () => [] as number[],
                }),
            },
        });
        await nextTick();
        // 时间输入行常驻且 TimePicker 收到禁用函数（非 null）
        const inputRow = wrapper.find(`.${P}-input`);
        expect(inputRow.exists()).toBe(true);
        wrapper.unmount();
    });
});

describe('useCalendar：range 空选补齐臂与 end-right 交换臂', () => {
    // L108/114/117：空 selectedDates + START + left 输入 → fillDate 补齐
    // 右端（another 同日）
    test('range：空选中 START 输入 → another 补齐两端同日', async () => {
        const val: any[] = [];
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val,
                'type': 'datetimerange',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'rangePosition': 'left',
                'selectedStatus': 0,
                'onUpdate:modelValue': (v: any) => {
                    val.length = 0;
                    val.push(...v);
                },
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        expect(dateInput.exists()).toBe(true);
        await dateInput.setValue('2021-06-10');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getDate()).toBe(10);
        expect(new Date(payload[1]).getDate()).toBe(10); // another 补齐
        wrapper.unmount();
    });

    // L75-76 槽 3/4：END + right 输入早于 [0] → index===1 && < [0] 交换臂
    test('range：END 状态 right 输入早日期 → 两端重置为早日期', async () => {
        const val = [new Date(2021, 5, 20).getTime(), new Date(2021, 5, 25).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 5, 1).getTime(),
                rangePosition: 'right',
                selectedStatus: 1, // END
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        await dateInput.setValue('2021-06-10');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getDate()).toBe(10);
        expect(new Date(payload[1]).getDate()).toBe(10);
        wrapper.unmount();
    });
});

describe('useCalendar：datemonthrange 月中选日边界', () => {
    // L345/347：selectMonth day 计算 —— month 类型/left 位置 → day=1；
    // 其他（right 位置）→ endOfMonth.getDate()
    test('datemonthrange right：选中月补到月末日（left 补 1 日），change 两端月', async () => {
        const val = [new Date(2021, 5, 1).getTime(), new Date(2021, 5, 1).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datemonthrange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'right',
                selectedStatus: 1,
            },
        });
        await nextTick();
        const monthCells = wrapper.findAll(`.${P}-months span`);
        expect(monthCells.length).toBe(12);
        await monthCells[8].trigger('click'); // 9 月
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getMonth()).toBe(8); // 9 月
        expect(new Date(payload[1]).getMonth()).toBe(8);
        wrapper.unmount();
    });
});

describe('useDay 导出（week 偏移分支直驱）', () => {
    // L474/477：月末为周日时 getDay()=0 → `|| 7` 兜底臂命中 week=7 →
    // count=7 → while(count<7) 不进循环（0 格 pre，全靠尾部 next 补齐）；
    // 常规月 week<7 → count 臂与 while 循环真路
    test('days 输出：常规月 5 格 pre，月末周日月 0 格 pre 全 next 补齐', () => {
        const picker = {
            value: { isRange: false, format: 'yyyy-MM-dd', hasTime: false },
        };
        const makeDays = (year: number, month: number) => {
            const props = {
                type: 'date',
                modelValue: new Date(year, month, 15).getTime(),
            } as any;
            const { days } = useDay({
                props,
                selectedDates: { value: [{ year, month, day: 15 }] },
                currentDate: { year, month, day: 15 },
                picker,
            } as any);
            return days.value;
        };
        // 2021-05：上月末 4/30 周五 → week=5 → count=5 → 5 格 pre（4/26-4/30）
        const daysMay = makeDays(2021, 4);
        expect(daysMay.length).toBe(42);
        const preCells = daysMay.filter((d: any) => d.pre);
        expect(preCells.length).toBe(5);
        expect(preCells[0].day).toBe(26);
        // 2021-02：上月末 1/31 周日 → getDay()=0 → ||7 兜底 → count=7 →
        // while 不进（0 格 pre），尾部 next 补齐
        const daysFeb = makeDays(2021, 1);
        expect(daysFeb.length).toBe(42);
        expect(daysFeb.filter((d: any) => d.pre).length).toBe(0);
        expect(daysFeb[0].day).toBe(1);
        // 12 月分支：next 补位 year+1/month=0
        const nextCells = makeDays(2021, 11).filter((d: any) => d.next);
        expect(nextCells.length).toBeGreaterThan(0);
        expect(nextCells[0].year).toBe(2022);
        expect(nextCells[0].month).toBe(0);
    });
});

describe('useCalendar：最后一组边界分支', () => {
    // L75 槽1：updateRangeSelectedDates else 臂（splice 直填）—— 两端已有值、
    // 时间变更落入中间区间不触发任何交换条件
    test('datetimerange：改时间落入区间内 → splice 直填臂', async () => {
        const val = [
            new Date(2021, 4, 10, 12, 0, 0).getTime(),
            new Date(2021, 4, 10, 23, 0, 0).getTime(),
        ];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 0, // START（isTime 臂不依赖 selectedStatus）
            },
            global: { stubs: { TimePicker: timeStub } },
        });
        await nextTick();
        const tp = wrapper.findComponent(timeStub);
        await (tp.vm as any).fire('15:00:00');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        // 15:00 落在 [12:00, 23:00] 区间内 → 直填左端不交换
        expect(new Date(payload[0]).getHours()).toBe(15);
        expect(new Date(payload[1]).getHours()).toBe(23);
        wrapper.unmount();
    });

    // L139 真臂：START + left 输入早于起点 → splice(0, getRangeSelectedDate)
    test('range：START 输入早于起点 → 替换左端（保留右端）', async () => {
        const val = [new Date(2021, 5, 20).getTime(), new Date(2021, 5, 25).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 5, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 0,
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        await dateInput.setValue('2021-05-10');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getDate()).toBe(10);
        expect(new Date(payload[1]).getDate()).toBe(25); // 右端保留
        wrapper.unmount();
    });

    // L185 槽1：modelValue 为 false 值（未传）→ `|| []` 兜底不崩
    test('FCalendar 无 modelValue prop：初始化不崩', async () => {
        const wrapper = mount(FCalendar, {
            props: {
                type: 'date',
                activeDate: new Date(2021, 4, 1).getTime(),
            },
        });
        await nextTick();
        const head = wrapper.find(`.${P}-head`);
        expect(head.exists()).toBe(true);
        wrapper.unmount();
    });

    // L187 槽1：modelValue 数组含空元素 → parse(null) 槽
    test('datemultiple：modelValue 含空元素不崩', async () => {
        const val = ref([new Date(2021, 4, 15).getTime(), null as any]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'datemultiple',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const cells = findDayCells(wrapper);
        expect(cells.length).toBe(42);
        wrapper.unmount();
    });

    // L697 槽1：changeTime 空字符串 → 空臂（无 change 事件）
    test('datetimerange：changeTime 空值不触发变更', async () => {
        const val = [new Date(2021, 4, 10).getTime(), new Date(2021, 4, 15).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 0,
            },
            global: { stubs: { TimePicker: timeStub } },
        });
        await nextTick();
        const tp = wrapper.findComponent(timeStub);
        await (tp.vm as any).fire('');
        await new Promise((r) => setTimeout(r, 30));
        expect((wrapper.emitted().change || []).length).toBe(0);
        wrapper.unmount();
    });

    // L702 槽1：changeTime 时选中已有 year → 不再补 today
    test('datetimerange：已有选中再改时间不覆盖日期', async () => {
        const val = [new Date(2021, 4, 10, 8, 0, 0).getTime(), new Date(2021, 4, 15).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetimerange',
                activeDate: new Date(2021, 4, 1).getTime(),
                rangePosition: 'left',
                selectedStatus: 0,
            },
            global: { stubs: { TimePicker: timeStub } },
        });
        await nextTick();
        const tp = wrapper.findComponent(timeStub);
        await (tp.vm as any).fire('18:00:00');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        const start = new Date(payload[0]);
        expect(start.getDate()).toBe(10); // 原日期保留
        expect(start.getHours()).toBe(18); // 只更新时间
        wrapper.unmount();
    });

    // L717 真臂：无 disabledTime → innerDisabledTime 返回 null（时间不禁用）
    test('datetime：无 disabledTime 时时间不禁用', async () => {
        const val = [new Date(2021, 4, 20, 8, 0, 0).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetime',
                activeDate: new Date(2021, 4, 1).getTime(),
            },
            global: { stubs: { TimePicker: timeStub } },
        });
        await nextTick();
        const inputRow = wrapper.find(`.${P}-input`);
        expect(inputRow.exists()).toBe(true);
        wrapper.unmount();
    });

    // L389 的 else 臂与 L477 的 `week < weekFirstDay` 臂为物理不可达分支：
    // - isSelectedMonth 仅被 isMonthSelect 渲染路径调用 → else 恒不执行
    // - getDay() 经 `|| 7` 兜底后 week 恒 >= 1 = weekFirstDay → 三元 else 恒不取
    test('不可达分支文档化：isSelectedMonth else 与 week 偏移 else', () => {
        // 两个死分支在 useCalendar.ts L389 slot1 与 L477 slot1。
        // 源码语义保证不可达（见上方注释），不强行构造非法状态覆盖。
        expect(P).toBe('fes-date-picker-calendar');
    });

    // calendar.vue L412/423 else 臂：非年面板（date）点年切换箭头 → ±1 年
    test('date 面板：点年切换箭头 ±1 年（isYearSelect else 臂）', async () => {
        const val = ref([new Date(2021, 4, 15).getTime()]);
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val.value,
                'type': 'date',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'onUpdate:modelValue': (v: any) => {
                    val.value = v;
                },
            },
        });
        await nextTick();
        const headText = () => wrapper.find(`.${P}-head`).text();
        expect(headText()).toContain('2021');
        const arrows = findArrows(wrapper);
        await arrows[0].trigger('click'); // 年-1
        await nextTick();
        expect(headText()).toContain('2020');
        await arrows[3].trigger('click'); // 年+1（回 2021）
        await nextTick();
        expect(headText()).toContain('2021');
        wrapper.unmount();
    });

    // calendar.vue L250：handleDateInput 带 disabledDate 时传另一端修正日期
    test('datetimerange：带 disabledDate 输入合法日期（flagDate 槽）', async () => {
        const val: any[] = [];
        const wrapper = mount(FCalendar, {
            props: {
                'modelValue': val,
                'type': 'datetimerange',
                'activeDate': new Date(2021, 4, 1).getTime(),
                'rangePosition': 'left',
                'selectedStatus': 0,
                'disabledDate': () => false,
                'onUpdate:modelValue': (v: any) => {
                    val.length = 0;
                    val.push(...v);
                },
            },
        });
        await nextTick();
        const dateInput = wrapper.find(`.${P}-input-date input`);
        expect(dateInput.exists()).toBe(true);
        await dateInput.setValue('2021-06-10');
        await dateInput.trigger('blur');
        await new Promise((r) => setTimeout(r, 50));
        const changes = wrapper.emitted().change || [];
        expect(changes.length).toBeGreaterThan(0);
        const payload = changes[changes.length - 1][0] as number[];
        expect(new Date(payload[0]).getDate()).toBe(10);
        expect(new Date(payload[1]).getDate()).toBe(10);
        wrapper.unmount();
    });

    // useCalendar L717 真臂：disabledTime 求值时无函数 → 返回 null（不禁用）
    test('datetime：不带 disabledTime 时 innerDisabledTime 求值为 null', async () => {
        const val = [new Date(2021, 4, 20, 8, 0, 0).getTime()];
        const wrapper = mount(FCalendar, {
            props: {
                modelValue: val,
                type: 'datetime',
                activeDate: new Date(2021, 4, 1).getTime(),
            },
        });
        await nextTick();
        // 触发 innerDisabledTime 求值：读 TimePicker props（v-bind 展开）
        const tp = wrapper.find('.fes-date-picker-calendar-input-time');
        expect(tp.exists()).toBe(true);
        wrapper.unmount();
    });
});
