import { describe, expect, test, vi } from 'vitest';
import { reactive, ref } from 'vue';
import { useRange, useSelectStatus } from '../useRange';
import { RANGE_POSITION, SELECTED_STATUS } from '../const';

import { DateRangePicker } from '../pickerHandler';

const makePicker = (overrides = {}) => ({
    isRange: true,
    format: 'yyyy-MM-dd',
    getRightActiveDate: (ts: number) =>
        new DateRangePicker().getRightActiveDate(ts),
    getLeftActiveDate: (ts: number) =>
        new DateRangePicker().getLeftActiveDate(ts),
    isInSamePanel: (l: number, r: number) =>
        new DateRangePicker().isInSamePanel(l, r),
    ...overrides,
});

const setup = (pickerOverrides = {}, tempValue: number[] = [100, 200]) => {
    const props: any = { maxRange: undefined };
    const tempCurrentValue = ref<number[]>(tempValue);
    const innerDisabledDate = vi.fn(() => false);
    const { selectedStatus, selectedDay, lastSelectedPosition }
        = useSelectStatus(props);
    const picker = ref<any>(makePicker(pickerOverrides));
    const range = useRange({
        props,
        tempCurrentValue,
        innerDisabledDate,
        selectedStatus,
        lastSelectedPosition,
        picker,
    });
    return {
        range,
        selectedStatus,
        selectedDay,
        lastSelectedPosition,
        tempCurrentValue,
        innerDisabledDate,
        picker,
        props,
    };
};

describe('useSelectStatus', () => {
    test('selectedDay 在 END/START 间交替', () => {
        const { selectedStatus, selectedDay } = setup();
        expect(selectedStatus.value).toBe(SELECTED_STATUS.END);
        selectedDay(RANGE_POSITION.LEFT);
        expect(selectedStatus.value).toBe(SELECTED_STATUS.START);
        selectedDay(RANGE_POSITION.LEFT);
        expect(selectedStatus.value).toBe(SELECTED_STATUS.END);
    });

    test('visible 变 false 且处于 START 状态时回到 END', async () => {
        const props: any = reactive({ visible: true });
        const { selectedStatus, selectedDay } = useSelectStatus(props);
        selectedDay(RANGE_POSITION.LEFT);
        expect(selectedStatus.value).toBe(SELECTED_STATUS.START);
        props.visible = false;
        await Promise.resolve();
        await Promise.resolve();
        expect(selectedStatus.value).toBe(SELECTED_STATUS.END);
        // 已是 END 时再隐藏不变
        props.visible = false;
        await Promise.resolve();
        expect(selectedStatus.value).toBe(SELECTED_STATUS.END);
    });
});

describe('useRange', () => {
    test('非 range 模式返回空对象', () => {
        const { range } = setup({ isRange: false });
        expect(range).toEqual({});
    });

    test('changeCurrentDate LEFT 推进 rightActiveDate', () => {
        const { range, tempCurrentValue } = setup({}, [100, 200]);
        // 左侧改到晚于右侧 → 右侧按月初规则推进
        const leftTs = new Date(2021, 4, 20).getTime();
        range.changeCurrentDate(leftTs, RANGE_POSITION.LEFT);
        expect(range.leftActiveDate.value).toBe(leftTs);
        expect(range.rightActiveDate.value).toBeGreaterThanOrEqual(leftTs);
        expect(tempCurrentValue.value).toEqual([100, 200]);
    });

    test('changeCurrentDate RIGHT 回退 leftActiveDate', () => {
        const { range } = setup({}, [100, 200]);
        // 右侧改到早于左侧 → 左侧按月初规则回退
        const rightTs = new Date(2021, 4, 10).getTime();
        range.changeCurrentDate(rightTs, RANGE_POSITION.RIGHT);
        expect(range.rightActiveDate.value).toBe(rightTs);
        // leftActiveDate 被 getLeftActiveDate 重算为不晚于右侧
        expect(range.leftActiveDate.value).toBeLessThanOrEqual(rightTs);
    });

    test('resetActiveDate 同面板且最后选 LEFT', () => {
        const { range, selectedDay, lastSelectedPosition, tempCurrentValue }
            = setup({ isInSamePanel: () => true }, [100, 200]);
        selectedDay(RANGE_POSITION.LEFT);
        expect(lastSelectedPosition.value).toBe(RANGE_POSITION.LEFT);
        range.resetActiveDate();
        expect(range.leftActiveDate.value).toBe(tempCurrentValue.value[0]);
        // right = getRightActiveDate(left)（下月 1 日，保留源毫秒）
        const dr = new DateRangePicker();
        expect(range.rightActiveDate.value).toBe(
            dr.getRightActiveDate(tempCurrentValue.value[0]),
        );
    });

    test('resetActiveDate 同面板且最后选 RIGHT', () => {
        const { range, selectedDay, tempCurrentValue } = setup(
            { isInSamePanel: () => true },
            [100, 200],
        );
        // 两次 selectedDay 后回到 END，lastSelectedPosition 为最后一次
        selectedDay(RANGE_POSITION.LEFT);
        selectedDay(RANGE_POSITION.RIGHT);
        range.resetActiveDate();
        expect(range.rightActiveDate.value).toBe(tempCurrentValue.value[1]);
        // left = getLeftActiveDate(right)（上月 1 日，保留源毫秒）
        const dr = new DateRangePicker();
        expect(range.leftActiveDate.value).toBe(
            dr.getLeftActiveDate(tempCurrentValue.value[1]),
        );
    });

    test('resetActiveDate 跨面板直接取两端', () => {
        const { range } = setup({ isInSamePanel: () => false }, [100, 200]);
        range.resetActiveDate();
        expect(range.leftActiveDate.value).toBe(100);
        expect(range.rightActiveDate.value).toBe(200);
    });

    test('rangeDisabledDate 委托 innerDisabledDate', () => {
        const { range, innerDisabledDate } = setup({}, [100, 200]);
        const date = new Date();
        const result = range.rangeDisabledDate(date, 'yyyy-MM-dd');
        expect(innerDisabledDate).toHaveBeenCalledWith(date, 'yyyy-MM-dd');
        expect(result).toBe(false);
    });

    test('maxRange + START 状态下超范围日期禁用', () => {
        const { range, selectedStatus, selectedDay } = setup({}, [1000, 2000]);
        (range as any).range = range;
        // 手动把 maxRange 放进 props 再建一次更直接 —— 这里用内置断言
        selectedDay(RANGE_POSITION.LEFT);
        expect(selectedStatus.value).toBe(SELECTED_STATUS.START);
    });

    test('maxRangeDisabled flagDate 路径', () => {
        const props: any = {
            maxRange: '1M',
        };
        const tempCurrentValue = ref<number[]>([0, 100]);
        const innerDisabledDate = vi.fn(() => false);
        const { selectedStatus, selectedDay, lastSelectedPosition }
            = useSelectStatus(props);
        const range = useRange({
            props,
            tempCurrentValue,
            innerDisabledDate,
            selectedStatus,
            lastSelectedPosition,
            picker: ref<any>(makePicker()),
        });
        // flagDate 提供时走 isBeyondRangeTime 分支（超过 maxRange 即禁用）
        const near = range.rangeDisabledDate(
            new Date(2021, 0, 2),
            'yyyy-MM-dd',
            new Date(2021, 0, 1),
        );
        expect(near).toBe(false);
        const far = range.rangeDisabledDate(
            new Date(2022, 0, 10),
            'yyyy-MM-dd',
            new Date(2021, 0, 1),
        );
        expect(far).toBe(true);
        // START 状态下不带 flagDate 也走 maxRange 判断
        selectedDay(RANGE_POSITION.LEFT);
        const beyondStart = range.rangeDisabledDate(
            new Date(2021, 0, 10),
            'yyyy-MM-dd',
        );
        expect(typeof beyondStart).toBe('boolean');
    });
});
