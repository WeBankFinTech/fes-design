import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimeSelect from '../time-select.vue';

// time-select 分支补全：format 段组合、disabled* 回调链、
// modelValue 变化路径（含 #1029 判等守卫）与 hourStep 起点分支

const mountSelect = (props = {}) =>
    mount(TimeSelect, {
        props: {
            modelValue: '01:02:03',
            ...props,
        } as any,
        attachTo: document.body,
    });

const getItems = (wrapper: ReturnType<typeof mount>) =>
    wrapper.findAll('.fes-time-picker-content-item');

afterEach(() => {
    document.body.innerHTML = '';
});

describe('TimeSelect 分支补全', () => {
    test('format 不含时/分/秒段时对应列为空（canSelect* 返回 null）', () => {
        // 仅秒：H/m 段缺失 → canSelectHours/canSelectMinutes 走 null 分支
        const onlySecond = mountSelect({
            modelValue: ':30',
            format: 'ss',
        });
        expect(getItems(onlySecond)).toHaveLength(1);
        onlySecond.unmount();

        // 仅时分：canSelectSeconds 走 null 分支
        const hm = mountSelect({ modelValue: '01:02', format: 'mm' });
        expect(getItems(hm)).toHaveLength(1);
        hm.unmount();
    });

    test('单段 format（H/m/s 非双字符）补零分支 formatSingleTime', () => {
        // format 'H'：formatSingleTime('HH') 返回 '0'（indexOf -1 分支）
        const singleHour = mountSelect({ modelValue: '', format: 'H' });
        expect(getItems(singleHour)).toHaveLength(1);
        singleHour.unmount();
    });

    test('disabledMinutes/disabledSeconds 回调接收已选时/分', async () => {
        const disabledMinutes = vi.fn((h: number, m: number) => h === 1 && m === 5);
        const disabledSeconds = vi.fn(
            (h: number, m: number, s: number) => h === 1 && m === 2 && s === 5,
        );
        const wrapper = mountSelect({
            modelValue: '01:02:03',
            disabledMinutes,
            disabledSeconds,
        });
        await nextTick();
        // 分钟列：01:05 被禁
        const minuteCol = getItems(wrapper)[1];
        const disabledMinute = minuteCol.findAll('li[data-key="05"]');
        expect(disabledMinute.length).toBeGreaterThan(0);
        expect(
            disabledMinute[0].classes().includes('is-disabled'),
        ).toBe(true);
        // 回调收到已选小时
        expect(disabledMinutes).toHaveBeenCalledWith(1, 5);
        // 秒列：01:02:05 被禁
        const secondCol = getItems(wrapper)[2];
        const disabledSecond = secondCol.findAll('li[data-key="05"]');
        expect(disabledSecond.length).toBeGreaterThan(0);
        expect(
            disabledSecond[0].classes().includes('is-disabled'),
        ).toBe(true);
        expect(disabledSeconds).toHaveBeenCalledWith(1, 2, 5);
        wrapper.unmount();
    });

    test('点击选项触发 update:modelValue 与 change（emit 链）', async () => {
        const wrapper = mountSelect({ modelValue: '01:02:03' });
        await nextTick();
        const hourCol = getItems(wrapper)[0];
        await hourCol.findAll('li[data-key="05"]')[0].trigger('click');
        await nextTick();
        const updated = wrapper.emitted('update:modelValue');
        expect(updated).toBeTruthy();
        expect(updated![0][0]).toBe('05:02:03');
        const changed = wrapper.emitted('change');
        expect(changed).toBeTruthy();
        expect(changed![0][0]).toBe('05:02:03');
        wrapper.unmount();
    });

    test('#1029 判等守卫：外部 modelValue 与内部一致时不回显广播', async () => {
        const wrapper = mountSelect({ modelValue: '01:02:03' });
        await nextTick();
        // 清空 emit 记录（挂载 immediate watch 可能已触发）
        wrapper.clearEmitted?.();
        // 重建场景等价：同值 modelValue 重新赋值
        await wrapper.setProps({ modelValue: '01:02:03' });
        await nextTick();
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('外部 modelValue 变化走 parseTime 重放分支（选中态跟随）', async () => {
        const wrapper = mountSelect({ modelValue: '01:02:03' });
        await nextTick();
        await wrapper.setProps({ modelValue: '08:09:10' });
        await nextTick();
        await nextTick();
        // #1029 守卫：重放后 timeString === modelValue，不回显广播
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        // 但选中态 DOM 已重放为新值（选中类名为 is-active）
        const hourCol = getItems(wrapper)[0];
        const selectedHour = hourCol.find('.is-active');
        expect(selectedHour.exists()).toBe(true);
        expect(selectedHour.attributes('data-key')).toBe('08');
        wrapper.unmount();
    });

    test('hourStep 起/止边界与 format 双字符对齐分支', () => {
        const wrapper = mountSelect({
            modelValue: '01:02:03',
            hourStep: 5,
        });
        const hourCol = getItems(wrapper)[0];
        const keys = hourCol
            .findAll('li')
            .map((li) => li.attributes('data-key'));
        // 小时 total=24、step=5 → 00,05,10,15,20 共 5 项（HH 双字符补零）
        expect(keys).toEqual(['00', '05', '10', '15', '20']);
        wrapper.unmount();
    });

    test('modelValue 段缺失时 parseTime 回退 formatSingleTime 默认值', async () => {
        // '08' 只有小时段：minute/seconds 走 shift() 空回退 →
        // formatSingleTime('mm') 在 HH:mm:ss 下返回 '00'
        const wrapper = mountSelect({ modelValue: '08' });
        await nextTick();
        const minuteCol = getItems(wrapper)[1];
        const selected = minuteCol.find('.is-active');
        expect(selected.exists()).toBe(true);
        expect(selected.attributes('data-key')).toBe('00');
        wrapper.unmount();
    });
});
