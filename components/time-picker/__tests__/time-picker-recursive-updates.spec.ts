import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../time-picker.vue';

// #1029 回归锁定：Vue 3.5 下 FTimePicker 曾因「模板 ref + 动态插槽 +
// Popper flip 重建」的组合陷入 Maximum recursive updates exceeded（以
// unhandledRejection 形式抛出，console.error 捕获不到）。
//
// 修复点（见组件内注释）：
// 1. time-picker.vue 移除模板 ref（决定性断环），clear 改由
//    TimeSelect 内部 watch(modelValue) 的 reset 分支完成重置
// 2. addon 区抽为独立子组件 FTimePickerAddon 稳定插槽
// 3. time-select.vue watch(timeString) 增加判等守卫
// 4. usePopper flip 时不再翻转 cacheVisible（消除无谓的子树重建）
//
// 本文件用进程级 unhandledRejection 监听锁定行为：修复后应为 0。

describe('TimePicker 递归更新回归（#1029）', () => {
    test('open: true + disabledHours 不触发 Maximum recursive updates', async () => {
        const rejections: string[] = [];
        const handler = (reason: unknown) => {
            rejections.push(String(reason));
        };
        process.on('unhandledRejection', handler);
        try {
            const wrapper = mount(TimePicker, {
                props: {
                    modelValue: '22:22:22',
                    disabledHours: (hour: number) => hour === 1,
                    appendToContainer: false,
                    open: true,
                    control: false,
                },
            });
            // 等待多个宏/微任务周期，覆盖 Popper computePosition 的
            // 异步 promise 链与 nextTick 调度（历史上递归在这些周期内爆发）
            await new Promise((resolve) => setTimeout(resolve, 150));
            wrapper.unmount();
        } finally {
            process.off('unhandledRejection', handler);
        }
        const recursive = rejections.filter((r) =>
            r.includes('Maximum recursive updates'),
        );
        expect(recursive).toEqual([]);
        expect(rejections).toEqual([]);
    });

    test('打开面板连续点击选项，值正确传递（重建吞状态回归）', async () => {
        const wrapper = mount(TimePicker, {
            props: {
                modelValue: '22:22:22',
                appendToContainer: false,
                open: true,
                control: false,
            },
            global: {
                // 不 stub 内置 Transition：VTU 的 transition-stub 会在
                // 每次重渲染时整体替换弹层子树（旧 DOM 残留），与真实
                // Transition 行为不一致
                stubs: { transition: false },
            },
        });
        await nextTick();
        await nextTick();

        const hour01 = wrapper.findAll('li[data-key="01"]');
        expect(hour01.length).toBe(3);
        await hour01[0].trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(wrapper.vm.displayValue).toEqual('01:22:22');

        const minute02 = wrapper.findAll('li[data-key="02"]');
        await minute02[1].trigger('click');
        await new Promise((resolve) => setTimeout(resolve, 50));
        expect(wrapper.vm.displayValue).toEqual('01:02:22');

        wrapper.unmount();
    });
});
