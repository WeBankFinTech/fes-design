import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import Form from '../../../form/form.vue';
import FormItem from '../../../form/formItem.vue';
import useFormAdaptor from '../useFormAdaptor';

const wait = (ms = 40) => new Promise((r) => setTimeout(r, ms));

// 在 FormItem 内调用 useFormAdaptor（需要真实 inject 的 setRuleDefaultType）
const mountInForm = (makeChild: () => any) => {
    const wrapper = mount({
        setup() {
            return () =>
                h(Form, { model: {} }, () =>
                    h(FormItem, { label: '项' }, makeChild),
                );
        },
    });
    return wrapper;
};

describe('useFormAdaptor 与 FormItem 联动', () => {
    test('valueType 字符串：注册默认校验类型', async () => {
        const Child = defineComponent({
            setup() {
                useFormAdaptor({ valueType: 'number' });
                return () => h('div', 'child');
            },
        });
        const wrapper = mountInForm(() => h(Child));
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('child');
        wrapper.unmount();
    });

    test('valueType ref：变化时跟随注册', async () => {
        const valueType = ref<string>('string');
        const Child = defineComponent({
            setup() {
                useFormAdaptor({ valueType });
                return () => h('div', 'child');
            },
        });
        const wrapper = mountInForm(() => h(Child));
        await nextTick();
        // 变为真值 → setRuleDefaultType 分支
        valueType.value = 'number';
        await nextTick();
        await nextTick();
        // 变为空值 → if (valueType.value) 假分支
        valueType.value = '';
        await nextTick();
        await nextTick();
        wrapper.unmount();
    });

    test('valueType 函数：立即求值注册', async () => {
        const Child = defineComponent({
            setup() {
                useFormAdaptor({ valueType: () => 'array' });
                return () => h('div', 'child');
            },
        });
        const wrapper = mountInForm(() => h(Child));
        await nextTick();
        expect(wrapper.text()).toContain('child');
        wrapper.unmount();
    });

    test('forbidChildValidate 屏蔽孙级重复校验', async () => {
        const GrandChild = defineComponent({
            setup() {
                const { isFormDisabled } = useFormAdaptor();
                return () => h('div', { class: 'gc' }, String(isFormDisabled.value));
            },
        });
        const Child = defineComponent({
            setup() {
                useFormAdaptor({ forbidChildValidate: true });
                return () => h(GrandChild);
            },
        });
        const wrapper = mountInForm(() => h(Child));
        await nextTick();
        await wait();
        expect(wrapper.find('.gc').exists()).toBe(true);
        wrapper.unmount();
    });
});
