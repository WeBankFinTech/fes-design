import { defineComponent, h, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import useWeekNames from '../useWeekNames';
import type { CalendarMode } from '../props';
import FCalendar from '../calendar';

/** useWeekNames 依赖 useLocale（inject），必须在组件 setup 内调用 */
const mountWeekNames = (startDay: number, mode: CalendarMode) => {
    const state: { weekNames?: ReturnType<typeof useWeekNames>['weekNames'] } = {};
    const wrapper = mount(
        defineComponent({
            setup() {
                const { weekNames } = useWeekNames(ref(startDay), ref(mode));
                state.weekNames = weekNames;
                return () => h('div');
            },
        }),
    );
    return { wrapper, state };
};

describe('useWeekNames month 模式分支', () => {
    test('mode=month 时 weekNames 返回空数组（真实 hook 调用）', () => {
        const { state, wrapper } = mountWeekNames(1, 'month');
        expect(state.weekNames!.value).toEqual([]);
        wrapper.unmount();
    });

    test('startDay 位移切片并经由 locale 翻译星期名（date 模式对照）', () => {
        // startDay=1（周一）起连续 7 天：mon..sun → 一二三四五六日
        const { state, wrapper } = mountWeekNames(1, 'date');
        expect(state.weekNames!.value.length).toBe(7);
        expect(state.weekNames!.value[0]).toBe('一');
        expect(state.weekNames!.value[6]).toBe('日');
        wrapper.unmount();
    });

    test('FCalendar month 模式不渲染星期栏（真实组件对照）', () => {
        const wrapper = mount(FCalendar, { props: { mode: 'month' } });
        expect(
            wrapper.find('.fes-calendar-week-name-header').exists(),
        ).toBe(false);
        expect(wrapper.find('.fes-calendar-month-panel').exists()).toBe(true);
        wrapper.unmount();
    });
});

// 说明：useWeekNames 的 `mode === 'month'` 分支在组件内为懒计算 —
// month 模式渲染路径不会访问 weekNames（renderWeekNameHeader 先短路），
// 因此以直接调用 hook 的方式覆盖（任务允许纯 hook 直接 import 调用）。
