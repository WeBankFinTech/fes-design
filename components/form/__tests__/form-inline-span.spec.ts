import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import Form from '../form.vue';
import FormItem from '../formItem.vue';
import Input from '../../input';

const createForm = (formProps, itemSpans) => {
    const wrapper = mount({
        setup() {
            return () =>
                h(
                    Form,
                    { model: { name: 'a', desc: 'b' }, ...formProps },
                    {
                        default: () =>
                            itemSpans.map((span, i) =>
                                h(
                                    FormItem,
                                    { prop: i === 0 ? 'name' : 'desc', span },
                                    { default: () => h(Input, { modelValue: 'x' }) },
                                ),
                            ),
                    },
                );
        },
    });
    return wrapper;
};

describe('Form inline 布局 span（#958）', () => {
    test('formItem span=12 时应生成 fes-form-item-span-12 类名', async () => {
        const wrapper = createForm(
            { layout: 'inline' },
            [12, 12],
        );
        await nextTick();
        const items = wrapper.findAll('.fes-form-item');
        expect(items.length).toBe(2);
        expect(items[0].classes()).toContain('fes-form-item-span-12');
        expect(items[1].classes()).toContain('fes-form-item-span-12');
        wrapper.unmount();
    });

    test('不传 span 时使用 Form 的默认 span（6）', async () => {
        const wrapper = createForm({ layout: 'inline' }, [undefined, undefined]);
        await nextTick();
        const items = wrapper.findAll('.fes-form-item');
        expect(items[0].classes()).toContain('fes-form-item-span-6');
        wrapper.unmount();
    });

    test('formItem span 优先于 Form span', async () => {
        const wrapper = createForm({ layout: 'inline', span: 8 }, [16, undefined]);
        await nextTick();
        const items = wrapper.findAll('.fes-form-item');
        expect(items[0].classes()).toContain('fes-form-item-span-16');
        expect(items[1].classes()).toContain('fes-form-item-span-8');
        wrapper.unmount();
    });

    test('非 inline 布局不生成 span 类名', async () => {
        const wrapper = createForm({ layout: 'horizontal' }, [12, 12]);
        await nextTick();
        const items = wrapper.findAll('.fes-form-item');
        expect(items[0].classes().some((c) => c.includes('-span-'))).toBe(false);
        wrapper.unmount();
    });
});
