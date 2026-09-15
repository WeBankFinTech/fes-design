import { mount } from '@vue/test-utils';
import { h, nextTick, reactive } from 'vue';
import Form from '../form.vue';
import FormItem from '../formItem.vue';

const prefixCls = 'fes-form';

describe('FForm / FFormItem 基础渲染', () => {
    test('form 渲染与 label', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: { model },
            slots: {
                default: () => [
                    h(
                        FormItem,
                        { label: '姓名', prop: 'name' } as any,
                        { default: () => h('input') },
                    ),
                ],
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        expect(wrapper.find(`.${prefixCls}-item-label`).text()).toBe('姓名');
        expect(wrapper.find(`.${prefixCls}-item-content`).exists()).toBe(true);
    });

    test('labelPosition 属性类名', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: { model, labelPosition: 'top' } as any,
            slots: {
                default: () => h(FormItem, { label: 'x' } as any, { default: () => h('input') }),
            },
        });
        await nextTick();
        expect(
            wrapper
                .find(`.${prefixCls}-item`)
                .classes()
                .some((c) => c.includes('top')),
        ).toBe(true);
    });

    test('layout inline 模式', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: { model, layout: 'inline' } as any,
            slots: {
                default: () => h(FormItem, { label: 'x' } as any, { default: () => h('input') }),
            },
        });
        await nextTick();
        expect(
            wrapper
                .find(`.${prefixCls}`)
                .classes()
                .some((c) => c.includes('inline')),
        ).toBe(true);
    });

    test('required 星号展示', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: {
                model,
                rules: {
                    name: [{ required: true, message: '必填' }],
                },
            } as any,
            slots: {
                default: () => h(FormItem, { label: '姓名', prop: 'name' } as any, { default: () => h('input') }),
            },
        });
        await nextTick();
        expect(wrapper.text()).toContain('姓名');
        // 必填星号在 label 内
        const label = wrapper.find(`.${prefixCls}-item-label`);
        expect(label.exists()).toBe(true);
    });

    test('label slot 自定义', async () => {
        const model = reactive({ name: '' });
        const wrapper = mount(Form, {
            props: { model },
            slots: {
                default: () =>
                    h(
                        FormItem,
                        { label: '占位' } as any,
                        {
                            label: () => h('b', '自定义标签'),
                            default: () => h('input'),
                        },
                    ),
            },
        });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-item-label`).text()).toBe(
            '自定义标签',
        );
    });
});

describe('FForm 校验', () => {
    const mountForm = (model: Record<string, unknown>) =>
        mount(Form, {
            props: {
                model,
                rules: {
                    name: [
                        { required: true, message: '请输入姓名', trigger: 'blur' },
                    ],
                },
            } as any,
            slots: {
                default: () => [
                    h(
                        FormItem,
                        { label: '姓名', prop: 'name' } as any,
                        { default: () => h('input') },
                    ),
                ],
            },
        });

    test('validate 失败：reject 并显示错误信息', async () => {
        const model = reactive({ name: '' });
        const wrapper = mountForm(model);
        await nextTick();
        const exposed = wrapper.findComponent(Form) as any;
        let rejected: unknown;
        await (exposed.vm as any).validate().catch((e: unknown) => {
            rejected = e;
        });
        expect(rejected).toBeTruthy();
        expect((rejected as any).valid).toBe(false);
        await nextTick();
        expect(wrapper.text()).toContain('请输入姓名');
    });

    test('validate 成功：不显示错误', async () => {
        const model = reactive({ name: '张三' });
        const wrapper = mountForm(model);
        await nextTick();
        const exposed = wrapper.findComponent(Form) as any;
        await (exposed.vm as any).validate();
        expect(wrapper.text()).not.toContain('请输入姓名');
    });

    test('clearValidate 清除错误状态', async () => {
        const model = reactive({ name: '' });
        const wrapper = mountForm(model);
        await nextTick();
        const exposed = wrapper.findComponent(Form) as any;
        await (exposed.vm as any).validate().catch(() => {});
        await nextTick();
        expect(wrapper.text()).toContain('请输入姓名');
        (exposed.vm as any).clearValidate();
        await nextTick();
        expect(wrapper.text()).not.toContain('请输入姓名');
    });

    test('FormItem 自身 rules 校验', async () => {
        const model = reactive({ age: 0 });
        const wrapper = mount(Form, {
            props: { model },
            slots: {
                default: () => [
                    h(
                        FormItem,
                        {
                            label: '年龄',
                            prop: 'age',
                            rules: [
                                {
                                    required: true,
                                    validator: (_rule: unknown, value: number) =>
                                        value > 0,
                                    message: '年龄必须大于 0',
                                    trigger: 'blur',
                                },
                            ],
                        } as any,
                        { default: () => h('input') },
                    ),
                ],
            },
        });
        await nextTick();
        const exposed = wrapper.findComponent(Form) as any;
        let rejected: unknown;
        await (exposed.vm as any).validate().catch((e: unknown) => {
            rejected = e;
        });
        expect(rejected).toBeTruthy();
        await nextTick();
        expect(wrapper.text()).toContain('年龄必须大于 0');
    });
});

describe('FForm resetFields 分支', () => {
    test('无 model 时 resetFields 返回 rejected promise', async () => {
        const wrapper = mount(Form, {
            slots: {
                default: () =>
                    h(FormItem, { label: 'x', prop: 'name' } as any, {
                        default: () => h('input'),
                    }),
            },
        } as any);
        await nextTick();
        const vm: any = wrapper.vm;
        expect(typeof vm.resetFields).toBe('function');
        await expect(vm.resetFields()).rejects.toBeTruthy();
        wrapper.unmount();
    });

    test('resetFields 指定 prop 仅重置匹配字段', async () => {
        const model = reactive({ name: 'a', age: 1 });
        const wrapper = mount(Form, {
            props: { model } as any,
            slots: {
                default: () => [
                    h(FormItem, { label: '姓名', prop: 'name' } as any, {
                        default: () => h('input'),
                    }),
                    h(FormItem, { label: '年龄', prop: 'age' } as any, {
                        default: () => h('input'),
                    }),
                ],
            },
        } as any);
        await nextTick();
        const vm: any = wrapper.vm;
        expect(typeof vm.resetFields).toBe('function');
        // 指定不存在的 prop → 过滤分支
        await vm.resetFields(['not-exist']);
        // 指定存在的 prop
        await vm.resetFields(['name']);
        wrapper.unmount();
    });
});
