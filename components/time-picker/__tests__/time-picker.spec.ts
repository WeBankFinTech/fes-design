import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../time-picker.vue';
import getPrefixCls from '../../_util/getPrefixCls';

const inputPrefixCls = getPrefixCls('input');
const prefixCls = getPrefixCls('time-picker');

// ---------------- TimePicker disabled -------------------
describe('TimePicker disabled', () => {
    test('disabled', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                disabled: true,
            },
        });
        await wrapper.find('input[type="text"]').setValue('11:11:11');
        expect(wrapper.vm.displayValue).toEqual('22:22:22');
    });

    // #1029 已修复（fix/time-picker-recursive-updates）：
    // 根因不是 disabled* 回调读取 selectedTime（那是干扰项），而是模板
    // ref="timeSelectRef" 与动态插槽渲染压力叠加，导致 TimeSelect 子树
    // 被反复销毁重建（实测 52 次 mount），每次重建 watch(modelValue,
    // {immediate}) 首跑重放 parseTime，selectedTime 被反复从 null 重写，
    // 驱动 "Maximum recursive updates exceeded in component <FTimePicker>"。
    // 修复：移除模板 ref（clear 改由 modelValue='' 的 watch reset 分支
    // 完成重置）、addon 区抽为独立子组件稳定插槽、time-select 的
    // watch(timeString) 增加判等守卫。回归锁定见
    // __tests__/time-picker-recursive-updates.spec.ts。
    test('disable hours', async () => {
        // transition: false —— 不 stub 内置 Transition（VTU 默认 stub 会
        // 在每次重渲染时整体替换 Popper 弹层子树，导致点击后旧 DOM 残留、
        // 交互命中已游离的旧实例；真实 Transition 无此行为）
        const wrapper = mount(TimePicker, {
            global: { stubs: { transition: false } },
            props: {
                modelValue: '22:22:22',
                disabledHours(hour) {
                    return hour === 1;
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        await wrapper.find('li[data-key="01"]').trigger('click');
        // 隐藏 popper
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('22:22:22');
    });

    test('disable minutes', async () => {
        // transition: false —— 不 stub 内置 Transition（VTU 默认 stub 会
        // 在每次重渲染时整体替换 Popper 弹层子树，导致点击后旧 DOM 残留、
        // 交互命中已游离的旧实例；真实 Transition 无此行为）
        const wrapper = mount(TimePicker, {
            global: { stubs: { transition: false } },
            props: {
                modelValue: '22:22:22',
                disabledMinutes(hour, minute) {
                    return hour === 1 && minute === 1;
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        // 注：点击会触发 activeTime 更新与 Popper 方向计算，content 可能
        // 重建，因此每次点击前重新查询 DOM（DOMWrapper 引用会失效）
        const allTarget01 = wrapper.findAll('li[data-key="01"]');

        await allTarget01[0].trigger('click');
        // 等待 Popper 重新定位（computePosition 为异步 promise 链）与
        // content diff 完成，再进行下一次交互
        await new Promise((r) => setTimeout(r, 50));
        const allTarget02 = wrapper.findAll('li[data-key="02"]');
        await allTarget02[1].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:02:22');

        await wrapper.setProps({ open: true });
        await nextTick();
        const allTarget01Again = wrapper.findAll('li[data-key="01"]');
        await allTarget01Again[1].trigger('click');
        // 隐藏 popper
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:02:22');
    });

    test('disable seconds', async () => {
        // transition: false —— 不 stub 内置 Transition（VTU 默认 stub 会
        // 在每次重渲染时整体替换 Popper 弹层子树，导致点击后旧 DOM 残留、
        // 交互命中已游离的旧实例；真实 Transition 无此行为）
        const wrapper = mount(TimePicker, {
            global: { stubs: { transition: false } },
            props: {
                modelValue: '22:22:22',
                disabledSeconds(hour, minute, second) {
                    return hour === 1 && minute === 1 && second === 1;
                },
                appendToContainer: false,
                open: true,
                control: false,
            },
        });
        // 改变值
        const allTarget01 = wrapper.findAll('li[data-key="01"]');
        const allTarget02 = wrapper.findAll('li[data-key="02"]');

        await allTarget01[0].trigger('click');
        await allTarget01[1].trigger('click');
        await allTarget02[2].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:01:02');

        await wrapper.setProps({ open: true });
        await allTarget01[2].trigger('click');
        await wrapper.setProps({ open: false });
        expect(wrapper.vm.displayValue).toEqual('01:01:02');
    });
});

describe('TimePicker clearable', () => {
    test('focus to clearable', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                // #1029 修复后 clear 不再直调 timeSelectRef.resetTime()，
                // 重置由 TimeSelect 内部 watch(modelValue) 的 reset 分支
                // 完成；open: true 保持原有测试路径不变。
                appendToContainer: false,
                open: true,
                control: false,
            },
            global: {
                stubs: {
                    Popper: {
                        template: '<div><slot name="trigger" /><slot /></div>',
                    },
                },
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        await wrapper.find('input[type="text"]').trigger('focus');
        await wrapper.find(`.${inputPrefixCls}-inner-icon`).trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 30));
        expect(wrapper.vm.displayValue).toEqual('');
    });

    test('not focus to clearable', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
            },
        });
        expect(wrapper.find(`.${inputPrefixCls}-inner-icon`).exists()).toBe(false);
    });
});

describe('TimePicker format', () => {
    test('format: HH:mm', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22',
                format: 'HH:mm',
                appendToContainer: false,
                open: true,
            },
            // jsdom 下 FPopper 的 Teleport+Transition 会与 Vue 3.5 调度器
            // 互相驱动触发递归更新，stub 掉 Popper 仅保留插槽内容
            global: {
                stubs: {
                    Popper: {
                        template: '<div><slot name="trigger" /><slot /></div>',
                    },
                },
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        const allTarget01 = wrapper.findAll('li[data-key="01"]');
        expect(allTarget01.length).toBe(2);

        const hoursLi = wrapper
            .find(`.${prefixCls}-content-item`)
            .findAll('li');
        expect(hoursLi.length).toBe(24);
    });
});

describe('TimePicker step', () => {
    test('hourStep minuteStep secondStep', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                appendToContainer: false,
                hourStep: 2,
                minuteStep: 2,
                secondStep: 4,
                open: true,
            },
            global: {
                stubs: {
                    Popper: {
                        template: '<div><slot name="trigger" /><slot /></div>',
                    },
                },
            },
        });
        await new Promise((resolve) => setTimeout(resolve, 30));
        const allItem = wrapper.findAll(`.${prefixCls}-content-item`);
        const hoursLi = allItem[0].findAll('li');
        const minuteLi = allItem[1].findAll('li');
        const secondLi = allItem[2].findAll('li');
        expect(hoursLi.length).toBe(12);
        expect(minuteLi.length).toBe(30);
        expect(secondLi.length).toBe(15);
    });
});

describe('TimePicker 输入校验（validateTime 边界穷举）', () => {
    // handleInput → validateTime 是用户手输防线：非法值不得进入 modelValue
    const mountTP = (format = 'HH:mm:ss') =>
        mount(TimePicker, {
            props: { modelValue: '', format },
            global: {
                stubs: {
                    Popper: {
                        template: '<div><slot name="trigger" /><slot /></div>',
                    },
                },
            },
        });

    test.each([
        ['合法完整时间', '11:22:33', true],
        ['小时 23 边界', '23:59:59', true],
        ['小时 24 越界', '24:00:00', false],
        ['分钟 60 越界', '11:60:00', false],
        ['秒 60 越界', '11:11:60', false],
        ['非数字', 'aa:22:33', false],
        ['段数不足', '11:22', false],
        ['段数过多', '11:22:33:44', false],
        ['超长数字段', '111:22:33', false],
    ])('输入 %s(%s) %s', async (label, input, shouldAccept) => {
        const wrapper = mountTP();
        const inputEl = wrapper.find('input[type="text"]');
        await inputEl.setValue(input);
        await nextTick();
        if (shouldAccept) {
            expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(input);
        } else {
            // 非法值不进 modelValue（validator 拒绝）
            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        }
        wrapper.unmount();
    });

    test('HH:mm 格式下三段输入被拒', async () => {
        const wrapper = mountTP('HH:mm');
        await wrapper.find('input[type="text"]').setValue('11:22:33');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });
});
