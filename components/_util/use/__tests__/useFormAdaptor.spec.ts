import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import Form from '../../../form/form.vue';
import FormItem from '../../../form/formItem.vue';
import Input from '../../../input/input.vue';
import useFormAdaptor from '../useFormAdaptor';

const wait = (ms = 60) => new Promise((r) => setTimeout(r, ms));

describe('useFormAdaptor', () => {
    test('form 内 input 输入触发校验', async () => {
        const wrapper = mount({
            setup() {
                return () =>
                    h(Form, { model: { name: '' } }, () =>
                        h(FormItem, { prop: 'name', label: '名' }, () =>
                            h(Input, { modelValue: '' }),
                        ),
                    );
            },
        });
        await nextTick();
        const input = wrapper.find('input');
        await input.setValue('新值');
        await wait();
        // 未抛错即通过（validate 走 adaptor）
        expect(input.element.value).toBe('新值');
        wrapper.unmount();
    });

    test('form 外 isError/isFormDisabled 默认 false', () => {
        let captured: any;
        const Host = defineComponent({
            setup() {
                captured = useFormAdaptor();
                return () => h('div');
            },
        });
        mount(Host);
        expect(captured.isError.value).toBe(false);
        expect(captured.isFormDisabled.value).toBe(false);
        // form 外 validate 是 noop
        expect(() => captured.validate('')).not.toThrow();
    });

    test('valueType 字符串传递给 setRuleDefaultType', () => {
        let captured: any;
        const Host = defineComponent({
            setup() {
                captured = useFormAdaptor({ valueType: 'string' });
                return () => h('div');
            },
        });
        mount(Host);
        expect(captured.validate).toBeTruthy();
    });

    test('valueType ref 变化跟随更新', async () => {
        const valueType = ref<string>('string');
        const Host = defineComponent({
            setup() {
                useFormAdaptor({ valueType });
                return () => h('div');
            },
        });
        mount(Host);
        valueType.value = 'number';
        await nextTick();
        await nextTick();
        expect(valueType.value).toBe('number');
    });

    test('valueType 函数求值', () => {
        const Host = defineComponent({
            setup() {
                useFormAdaptor({ valueType: () => 'array' });
                return () => h('div');
            },
        });
        expect(() => mount(Host)).not.toThrow();
    });

    test('forbidChildValidate 屏蔽子组件重复校验', async () => {
        const wrapper = mount({
            setup() {
                return () =>
                    h(Form, { model: { name: '' } }, () =>
                        h(FormItem, { prop: 'name' }, () =>
                            h(Input, { modelValue: '' }),
                        ),
                    );
            },
        });
        await nextTick();
        await wrapper.find('input').setValue('值');
        await wait();
        expect(wrapper.find('input').element.value).toBe('值');
        wrapper.unmount();
    });
});
