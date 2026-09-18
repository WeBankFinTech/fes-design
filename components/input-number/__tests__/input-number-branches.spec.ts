import { mount } from '@vue/test-utils';
import { nextTick, ref } from 'vue';
import inputNumber from '../input-number.vue';

const prefixCls = 'fes-input-number';
const innerPrefixCls = 'fes-input-inner';

describe('input-number 分支补全：插槽与显隐', () => {
    test('prefix 插槽渲染前缀容器', () => {
        const wrapper = mount(inputNumber, {
            slots: { prefix: () => '￥' },
        });
        const prefix = wrapper.find(`.${innerPrefixCls}-prefix`);
        expect(prefix.exists()).toBe(true);
        expect(prefix.text()).toBe('￥');
        wrapper.unmount();
    });

    test('suffix 插槽渲染且步进按钮带 actions-suffix 类', () => {
        const wrapper = mount(inputNumber, {
            slots: { suffix: () => '%' },
        });
        const suffix = wrapper.find(`.${innerPrefixCls}-suffix`);
        expect(suffix.exists()).toBe(true);
        expect(suffix.text()).toContain('%');
        const actions = wrapper.find(`.${prefixCls}-actions`);
        expect(actions.exists()).toBe(true);
        expect(actions.classes()).toContain(`${prefixCls}-actions-suffix`);
        wrapper.unmount();
    });

    test('showStepAction=false 时不渲染步进按钮', () => {
        const wrapper = mount(inputNumber, {
            props: { showStepAction: false, placeholder: '只输入数字' },
        });
        expect(wrapper.find(`.${prefixCls}-actions`).exists()).toBe(false);
        expect(
            wrapper.find('input').attributes('placeholder'),
        ).toBe('只输入数字');
        wrapper.unmount();
    });
});

describe('input-number 分支补全：按钮步进与钳制', () => {
    test('无初始值时点增加从 0 起步并回传', async () => {
        const wrapper = mount(inputNumber);
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '',
        );
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(1);
        const change = wrapper.emitted('change');
        expect(change).toBeTruthy();
        expect(change![change!.length - 1][0]).toBe(1);
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '1',
        );
        wrapper.unmount();
    });

    test('模型值触顶后增加按钮禁用且点击不生效', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 10, max: 10 },
        });
        const increase = wrapper.find(`.${prefixCls}-actions-increase`);
        expect(increase.classes()).toContain('is-disabled');
        await increase.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '10',
        );
        wrapper.unmount();
    });

    test('模型值触底后减少按钮禁用且点击不生效', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 0, min: 0 },
        });
        const decrease = wrapper.find(`.${prefixCls}-actions-decrease`);
        expect(decrease.classes()).toContain('is-disabled');
        await decrease.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '0',
        );
        wrapper.unmount();
    });

    test('步进按钮按 step 增减并触发 change(newVal, oldVal)', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1, step: 2 },
        });
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        const change = wrapper.emitted('change');
        expect(change).toBeTruthy();
        expect(change![change!.length - 1]).toEqual([3, 1]);
        await wrapper.find(`.${prefixCls}-actions-decrease`).trigger('click');
        await nextTick();
        const change2 = wrapper.emitted('change');
        expect(change2![change2!.length - 1]).toEqual([1, 3]);
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '1',
        );
        wrapper.unmount();
    });

    test('小数步长与精度：按钮步进保留小数位', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1.5, step: 0.1, precision: 1 },
        });
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(1.6);
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '1.6',
        );
        wrapper.unmount();
    });

    test('精度小于 step 小数位时 console.warn 提示', () => {
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = mount(inputNumber, {
            props: { step: 0.5, precision: 0 },
        });
        expect(warnSpy).toHaveBeenCalledTimes(1);
        expect(warnSpy.mock.calls[0][0]).toContain(
            'precision should not be less than',
        );
        warnSpy.mockRestore();
        wrapper.unmount();
    });

    test('autofocus 自动聚焦到输入框', async () => {
        const wrapper = mount(inputNumber, {
            props: { autofocus: true },
            attachTo: document.body,
        });
        await nextTick();
        expect(document.activeElement).toBe(wrapper.find('input').element);
        wrapper.unmount();
    });
});

describe('input-number 分支补全：输入回退与受控', () => {
    test('输入非法字符暂存不提交，失焦回退到模型值', async () => {
        const wrapper = mount(inputNumber, { props: { modelValue: 3 } });
        const input = wrapper.find('input');
        await input.setValue('abc');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('abc');
        await input.trigger('blur');
        await nextTick();
        expect((input.element as HTMLInputElement).value).toBe('3');
        wrapper.unmount();
    });

    test('输入小数点结尾时暂存，失焦回退', async () => {
        const wrapper = mount(inputNumber, { props: { modelValue: 2 } });
        const input = wrapper.find('input');
        await input.setValue('2.');
        await nextTick();
        expect((input.element as HTMLInputElement).value).toBe('2.');
        await input.trigger('blur');
        await nextTick();
        expect((input.element as HTMLInputElement).value).toBe('2');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('输入空串清空为 null 并回传', async () => {
        const wrapper = mount(inputNumber, { props: { modelValue: 2 } });
        const input = wrapper.find('input');
        await input.setValue('');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBeNull();
        expect((input.element as HTMLInputElement).value).toBe('');
        wrapper.unmount();
    });

    test('currentValue 大于 min 时失焦不钳制', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 5, min: -1 },
        });
        const input = wrapper.find('input');
        await input.trigger('blur');
        await nextTick();
        expect(wrapper.emitted('blur')).toBeTruthy();
        expect((input.element as HTMLInputElement).value).toBe('5');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('输入与当前值相同时不重复更新', async () => {
        const wrapper = mount(inputNumber, { props: { modelValue: 2 } });
        const input = wrapper.find('input');
        await input.setValue('2');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('2');
        wrapper.unmount();
    });

    test('受控 modelValue：外部回写与步进回传', async () => {
        const value = ref(1);
        const wrapper = mount(inputNumber, {
            props: {
                'modelValue': value.value,
                'onUpdate:modelValue': (v: number) => {
                    value.value = v;
                },
            },
        });
        await wrapper.setProps({ modelValue: 7 });
        await nextTick();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '7',
        );
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        expect(value.value).toBe(8);
        wrapper.unmount();
    });

    test('disabled 时点击步进不生效', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 2, disabled: true },
        });
        expect(wrapper.find('input[disabled]').exists()).toBe(true);
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '2',
        );
        wrapper.unmount();
    });

    test('非数值模型值走保护分支后点增加恢复为 0+step', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: Number.NaN },
        });
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(1);
        wrapper.unmount();
    });

    test('字符串模型值触发 _calculationNum 保护分支，点增加清空为 null', async () => {
        // lodash isNumber(NaN) 为 true，非数值走保护分支需字符串等非数字类型
        // （如父组件绑定字符串），此时步进按 tempValue 兜底返回并清空
        const warnSpy = vi
            .spyOn(console, 'warn')
            .mockImplementation(() => {});
        const wrapper = mount(inputNumber, {
            props: { modelValue: '5' as unknown as number },
        });
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '5',
        );
        await wrapper.find(`.${prefixCls}-actions-increase`).trigger('click');
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBeNull();
        expect((wrapper.find('input').element as HTMLInputElement).value).toBe(
            '',
        );
        warnSpy.mockRestore();
        wrapper.unmount();
    });
});

describe('input-number 分支补全：#1039 键盘/滚轮步进', () => {
    test('键盘 ArrowUp +1 / ArrowDown -1 并触发 change(newVal, oldVal)', async () => {
        const wrapper = mount(inputNumber, { props: { modelValue: 1 } });
        const input = wrapper.find('input');
        await input.trigger('keydown', { key: 'ArrowUp' });
        await nextTick();
        let updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(2);
        let change = wrapper.emitted('change');
        expect(change![change!.length - 1]).toEqual([2, 1]);
        expect((input.element as HTMLInputElement).value).toBe('2');
        await input.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(1);
        change = wrapper.emitted('change');
        expect(change![change!.length - 1]).toEqual([1, 2]);
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });

    test('键盘步进触顶/触底钳制到 min/max 并回传边界值', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 9, min: 0, max: 10 },
        });
        const input = wrapper.find('input');
        await input.trigger('keydown', { key: 'ArrowUp' });
        await nextTick();
        let updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(10);
        const change = wrapper.emitted('change');
        expect(change![change!.length - 1]).toEqual([10, 9]);
        expect((input.element as HTMLInputElement).value).toBe('10');
        // 已触顶再按 ↑：不越界，钳制回传边界值
        await input.trigger('keydown', { key: 'ArrowUp' });
        await nextTick();
        updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(10);
        expect((input.element as HTMLInputElement).value).toBe('10');
        // 一路按 ↓ 到 0 再按：钳制到 min 不回传负值
        for (let i = 0; i < 11; i++) {
            await input.trigger('keydown', { key: 'ArrowDown' });
        }
        await nextTick();
        updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(0);
        expect((input.element as HTMLInputElement).value).toBe('0');
        wrapper.unmount();
    });

    test('聚焦时滚轮上滚 +1 / 下滚 -1', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1 },
            attachTo: document.body,
        });
        const input = wrapper.find('input');
        await input.element.focus();
        await nextTick();
        expect(document.activeElement).toBe(input.element);
        await input.trigger('wheel', { deltaY: -200 });
        await nextTick();
        let updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(2);
        expect((input.element as HTMLInputElement).value).toBe('2');
        await input.trigger('wheel', { deltaY: 200 });
        await nextTick();
        updates = wrapper.emitted('update:modelValue');
        expect(updates![updates!.length - 1][0]).toBe(1);
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });

    test('非聚焦（activeElement 非输入框）时滚轮不劫持不步进', async () => {
        const dummy = document.createElement('button');
        document.body.appendChild(dummy);
        dummy.focus();
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1 },
            attachTo: document.body,
        });
        const input = wrapper.find('input');
        expect(document.activeElement).not.toBe(input.element);
        await input.trigger('wheel', { deltaY: -200 });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
        dummy.remove();
    });

    test('keyboard=false 时键盘步进不生效', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1, keyboard: false },
        });
        const input = wrapper.find('input');
        await input.trigger('keydown', { key: 'ArrowUp' });
        await input.trigger('keydown', { key: 'ArrowDown' });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });

    test('wheel=false 时聚焦滚轮不步进', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1, wheel: false },
            attachTo: document.body,
        });
        const input = wrapper.find('input');
        await input.element.focus();
        await nextTick();
        expect(document.activeElement).toBe(input.element);
        await input.trigger('wheel', { deltaY: -200 });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });

    test('键盘步进保留精度：step=0.1 precision=2 连按 ↑ 三次得 0.3', async () => {
        const wrapper = mount(inputNumber, {
            props: { step: 0.1, precision: 2 },
        });
        const input = wrapper.find('input');
        for (let i = 0; i < 3; i++) {
            await input.trigger('keydown', { key: 'ArrowUp' });
        }
        await nextTick();
        const updates = wrapper.emitted('update:modelValue');
        expect(updates).toBeTruthy();
        expect(updates![updates!.length - 1][0]).toBe(0.3);
        expect((input.element as HTMLInputElement).value).toBe('0.3');
        wrapper.unmount();
    });

    test('disabled 时键盘与滚轮均不步进', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1, disabled: true },
            attachTo: document.body,
        });
        const input = wrapper.find('input');
        await input.element.focus();
        await input.trigger('keydown', { key: 'ArrowUp' });
        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('wheel', { deltaY: -200 });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });

    test('readonly 时键盘与滚轮均不步进且输入框只读', async () => {
        const wrapper = mount(inputNumber, {
            props: { modelValue: 1, readonly: true },
            attachTo: document.body,
        });
        const input = wrapper.find('input');
        expect(input.attributes('readonly')).toBeDefined();
        await input.element.focus();
        await input.trigger('keydown', { key: 'ArrowUp' });
        await input.trigger('keydown', { key: 'ArrowDown' });
        await input.trigger('wheel', { deltaY: -200 });
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect((input.element as HTMLInputElement).value).toBe('1');
        wrapper.unmount();
    });
});
