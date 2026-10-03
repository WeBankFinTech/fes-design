/**
 * Issue #1023 [Bug] TimeSelect modelValue 传数组崩溃 回归测试
 *
 * 修复内容（time-select.vue parseTime）：
 * modelValue 非字符串（数组/数字/对象等）时按空值处理（selectedTime
 * 重置为 null，不进入 split 逻辑），DEV 下 console.warn 提示类型错误；
 * 合法字符串行为与修复前完全一致。
 */
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import TimeSelect from '../../time-picker/time-select.vue';

const mountSelect = (modelValue: unknown) =>
    mount(TimeSelect, {
        props: {
            // @ts-expect-error 故意传非法类型，验证类型防御
            modelValue,
        },
        attachTo: document.body,
    });

describe('#1023 TimeSelect modelValue 非字符串防御（回归）', () => {
    let warnings: string[] = [];
    let warnSpy: ReturnType<typeof vi.spyOn> | null = null;
    let errors: string[] = [];
    let errSpy: ReturnType<typeof vi.spyOn> | null = null;

    beforeEach(() => {
        warnings = [];
        errors = [];
        warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation((...args) => {
                warnings.push(args.map(String).join(' '));
            });
        errSpy = vi
            .spyOn(console, 'error')
            .mockImplementation((...args) => {
                errors.push(args.map(String).join(' '));
            });
    });

    afterEach(() => {
        warnSpy?.mockRestore();
        errSpy?.mockRestore();
        document.body.innerHTML = '';
    });

    test.each([
        ['数组', ['09:00:00', '18:00:00']],
        ['数字', 123],
        ['对象', { hour: 9 }],
    ])('传 %s modelValue 不抛错，组件正常渲染且 DEV 告警', async (label, value) => {
        let wrapper: ReturnType<typeof mount> | null = null;
        // 修复前：mount 阶段 watch immediate 首跑 parseTime 即抛
        // TypeError: props.modelValue.split is not a function
        expect(() => {
            wrapper = mountSelect(value);
        }).not.toThrow();

        await nextTick();
        // 组件正常渲染（三列选择器都在）
        expect(
            wrapper!
                .findAll('.fes-time-picker-content-item')
                .length,
        ).toBe(3);
        // DEV 下有组件自身的类型告警（区分于 Vue 的 prop 校验告警）
        expect(
            warnings.some(
                (w) =>
                    w.includes('[FTimeSelect]:')
                    && w.includes('modelValue')
                    && w.includes('字符串'),
            ),
        ).toBe(true);
        // 无未捕获错误
        expect(errors).toHaveLength(0);
        wrapper!.unmount();
    });

    test('空值（null/undefined/空数组）静默按空处理，不告警', async () => {
        // 注：传 null/[] 时 Vue 自身会发 prop 类型校验告警
        // （[Vue warn]: Invalid prop ...），这里只断言组件自身的
        // 类型防御告警（[FTimeSelect]: 前缀）不触发
        for (const empty of [null, undefined, []]) {
            warnings = [];
            let wrapper: ReturnType<typeof mount> | null = null;
            expect(() => {
                wrapper = mountSelect(empty);
            }).not.toThrow();
            await nextTick();
            expect(
                warnings.filter((w) => w.includes('FTimeSelect')),
            ).toHaveLength(0);
            wrapper!.unmount();
        }
    });

    test('运行时从合法值切到数组不抛错并重置选中态', async () => {
        const wrapper = mountSelect('01:02:03');
        await nextTick();
        const hourCol = wrapper.findAll(
            '.fes-time-picker-content-item',
        )[0];
        expect(hourCol.find('.is-active').attributes('data-key')).toBe(
            '01',
        );

        // 修复前：setProps 触发 watch → parseTime 对数组 split 直接抛错
        expect(() => wrapper.setProps({ modelValue: ['09:00:00'] })).not.toThrow();
        await nextTick();
        await nextTick();
        // 选中态被重置为空（is-active 消失）
        expect(
            wrapper.findAll('.fes-time-picker-content-item')[0]
                .find('.is-active')
                .exists(),
        ).toBe(false);
        wrapper.unmount();
    });

    test('合法字符串行为不变（选中态/事件）', async () => {
        const wrapper = mountSelect('01:02:03');
        await nextTick();
        const cols = wrapper.findAll('.fes-time-picker-content-item');
        expect(cols[0].find('.is-active').attributes('data-key')).toBe('01');
        expect(cols[1].find('.is-active').attributes('data-key')).toBe('02');
        expect(cols[2].find('.is-active').attributes('data-key')).toBe('03');
        // 无组件自身的类型告警
        expect(
            warnings.filter((w) => w.includes('FTimeSelect')),
        ).toHaveLength(0);

        // 点击交互照常
        await cols[0].findAll('li[data-key="05"]')[0].trigger('click');
        await nextTick();
        const updated = wrapper.emitted('update:modelValue');
        expect(updated).toBeTruthy();
        expect(updated![updated!.length - 1][0]).toBe('05:02:03');
        wrapper.unmount();
    });
});
