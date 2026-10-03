/**
 * Issue #1022 [Bug] TimePicker isRange 死属性 回归测试
 *
 * 修复内容（time-picker.vue）：
 * 1. isRange=true 时 DEV 环境输出 console.warn（import.meta.env?.DEV 守卫），
 *    文案明确「该属性暂未实现，将按单值模式渲染」；
 * 2. 模板移除 InputInner 上的 v-if="!isRange"——开启 isRange 时回退为
 *    单值输入框渲染，不再出现触发器区域完全空白；
 * 3. displayValue 移除返回数组的 isRange 分支（回退单值后按字符串展示）。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimePicker from '../../time-picker/time-picker.vue';

const mountPicker = (props: Record<string, unknown> = {}) =>
    mount(TimePicker, {
        props: { modelValue: '09:00:00', ...props },
        global: {
            // 与 time-picker 既有用例一致：平铺 trigger + content，
            // 避免 jsdom 下 Popper 的 Teleport/Transition stub 链路吞掉插槽
            stubs: {
                Popper: {
                    template: '<div><slot name="trigger" /><slot /></div>',
                },
            },
        },
    });

describe('#1022 TimePicker isRange 死属性（回归）', () => {
    let warnings: string[] = [];
    let spy: ReturnType<typeof vi.spyOn> | null = null;

    beforeEach(() => {
        warnings = [];
        spy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
            warnings.push(args.map(String).join(' '));
        });
    });

    afterEach(() => {
        spy?.mockRestore();
    });

    test('isRange: false（默认）正常渲染且无 isRange 告警', async () => {
        const wrapper = mountPicker({ isRange: false });
        await nextTick();
        // 单值模式：输入框渲染并回显 modelValue
        expect(wrapper.find('input').exists()).toBe(true);
        expect(
            (wrapper.find('input').element as HTMLInputElement).value,
        ).toBe('09:00:00');
        // 默认模式不应触发 isRange 告警
        expect(
            warnings.filter((w) => w.includes('isRange')),
        ).toHaveLength(0);
        wrapper.unmount();
    });

    test('isRange: true 时 DEV 告警且回退渲染单值输入框（不再空白）', async () => {
        const wrapper = mountPicker({ isRange: true });
        await nextTick();

        // 修复点 1：开发模式告警，文案说明暂未实现 + 按单值渲染
        expect(warnings.some((w) => w.includes('isRange'))).toBe(true);
        expect(warnings.some((w) => w.includes('暂未实现'))).toBe(true);
        expect(warnings.some((w) => w.includes('单值'))).toBe(true);

        // 修复点 2：回退为单值渲染——输入框必须存在（原来是空注释节点）
        expect(wrapper.find('input').exists()).toBe(true);
        // 输入框回显单值 modelValue（不再走返回数组的 displayValue 分支）
        expect(
            (wrapper.find('input').element as HTMLInputElement).value,
        ).toBe('09:00:00');
        // displayValue 为字符串而非数组
        expect(typeof (wrapper.vm as any).displayValue).toBe('string');
        wrapper.unmount();
    });

    test('运行时切换 isRange false → true 再次告警', async () => {
        const wrapper = mountPicker({ isRange: false });
        await nextTick();
        expect(warnings.filter((w) => w.includes('isRange'))).toHaveLength(0);

        await wrapper.setProps({ isRange: true });
        await nextTick();
        // watch 捕获运行时开启
        expect(warnings.some((w) => w.includes('isRange'))).toBe(true);
        // 切换后输入框仍在（回退单值）
        expect(wrapper.find('input').exists()).toBe(true);
        wrapper.unmount();
    });
});
