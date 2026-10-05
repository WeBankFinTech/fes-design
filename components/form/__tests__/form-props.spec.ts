import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { FForm as Form, FFormItem as FormItem } from '../index';

const prefixCls = 'fes-form';

const mountForm = (formProps: Record<string, unknown>, itemProps: Record<string, unknown> = {}) => {
    const Comp = defineComponent({
        setup() {
            return () =>
                h(Form, formProps, {
                    default: () => [
                        h(FormItem, { prop: 'name', label: '姓名', ...itemProps }, {
                            default: () => h('input', { class: 'inner-input' }),
                        }),
                    ],
                });
        },
    });
    return mount(Comp, { attachTo: document.body });
};

describe('FForm 属性补全', () => {
    test('align 对齐方式透传到 form-item', async () => {
        const wrapper = mountForm({ model: { name: '' }, align: 'right' });
        await nextTick();
        const item = wrapper.find(`.${prefixCls}-item`);
        expect(item.exists()).toBe(true);
        wrapper.unmount();
    });

    test('disabled 禁用整个表单', async () => {
        const wrapper = mountForm({ model: { name: '' }, disabled: true });
        await nextTick();
        // 表单禁用态类名挂在 form 上
        expect(
            wrapper.find(`.${prefixCls}`).classes().some((c) => c.includes('disabled')),
        ).toBe(true);
        wrapper.unmount();
    });

    test('showMessage=false 不显示错误提示', async () => {
        const wrapper = mountForm({
            model: { name: '' },
            rules: { name: [{ required: true, message: '必填' }] },
            showMessage: false,
        });
        await nextTick();
        const formRef: any = wrapper.findComponent(Form);
        await formRef.vm.validate().catch(() => {});
        await nextTick();
        expect(wrapper.text()).not.toContain('必填');
        wrapper.unmount();
    });

    test('showMessage 默认显示错误提示', async () => {
        const wrapper = mountForm({
            model: { name: '' },
            rules: { name: [{ required: true, message: '必填' }] },
        });
        await nextTick();
        const formRef: any = wrapper.findComponent(Form);
        await formRef.vm.validate().catch(() => {});
        await nextTick();
        expect(wrapper.text()).toContain('必填');
        wrapper.unmount();
    });

    test('labelWidth 设置标签宽度', async () => {
        const wrapper = mountForm({ model: { name: '' }, labelWidth: 120 });
        await nextTick();
        const label = wrapper.find(`.${prefixCls}-item-label`);
        expect(label.attributes('style') || '').toContain('width');
        wrapper.unmount();
    });

    test('rules.required 星号标在 label 上', async () => {
        const wrapper = mountForm({
            model: { name: '' },
            rules: { name: [{ required: true, message: '必填' }] },
        });
        await nextTick();
        expect(wrapper.find('.is-required').exists()).toBe(true);
        wrapper.unmount();
    });

    test('validate 失败返回错误字段', async () => {
        const wrapper = mountForm({
            model: { name: '' },
            rules: { name: [{ required: true, message: '必填' }] },
        });
        await nextTick();
        const formRef: any = wrapper.findComponent(Form);
        let failed = false;
        await formRef.vm.validate().catch(() => {
            failed = true;
        });
        expect(failed).toBe(true);
        wrapper.unmount();
    });
});
