import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import FRate from '../rate';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('rate');

const findAllIcons = (wrapper) => wrapper.findAll('.rate-icon');

describe('Rate', () => {
    test('default render', () => {
        const wrapper = mount(FRate);
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        // 默认 count 为 5
        expect(findAllIcons(wrapper).length).toBe(5);
        // 默认值为 0，全部是空星
        expect(wrapper.findAll('.rate-icon.empty-icon').length).toBe(5);
        expect(wrapper.classes()).toContain(`${prefixCls}-size-medium`);
    });

    test('modelValue renders full stars', () => {
        const wrapper = mount(FRate, {
            props: { modelValue: 3 },
        });
        expect(wrapper.findAll('.rate-icon.full-icon').length).toBe(3);
        expect(wrapper.findAll('.rate-icon.empty-icon').length).toBe(2);
    });

    test('update:modelValue on click', async () => {
        const wrapper = mount(FRate);
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        await items[3].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([4]);
        // 内部值已更新，视图直接变为 4 颗满星
        expect(wrapper.findAll('.rate-icon.full-icon').length).toBe(4);
        await wrapper.setProps({ modelValue: 4 });
        expect(wrapper.findAll('.rate-icon.full-icon').length).toBe(4);
    });

    test('change event on click', async () => {
        const wrapper = mount(FRate, { props: { modelValue: 0 } });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        await items[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('change')[0]).toEqual([2]);
        // 点击相同值不重复触发 change
        await items[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('change')).toHaveLength(1);
    });

    test('count', async () => {
        const wrapper = mount(FRate, { props: { count: 8 } });
        expect(findAllIcons(wrapper).length).toBe(8);
        await wrapper.setProps({ count: 3 });
        await nextTick();
        expect(findAllIcons(wrapper).length).toBe(3);
    });

    test('allowHalf renders half star', async () => {
        const wrapper = mount(FRate, {
            props: { modelValue: 2.5, allowHalf: true },
        });
        expect(wrapper.findAll('.rate-icon.full-icon').length).toBe(3);
        // 2.5 时第 3 颗星是半星
        const halfIcon = wrapper.find('.rate-icon.full-icon .half-icon');
        expect(halfIcon.exists()).toBe(true);
        expect(wrapper.findAll('.rate-icon.empty-icon').length).toBe(2);
    });

    test('allowHalf click left side emits 0.5 step value', async () => {
        const wrapper = mount(FRate, { props: { allowHalf: true } });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        // setup mock 的 offsetWidth 是 0，前半段 offsetX(0) <= halfWidth(0) 命中左半
        await items[2].dispatchEvent(new MouseEvent('click', { bubbles: true, offsetX: 0 }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([2.5]);
        expect(wrapper.emitted('change')[0]).toEqual([2.5]);
    });

    test('disabled behavior via readonly blocks interaction', async () => {
        const wrapper = mount(FRate, {
            props: { readonly: true, modelValue: 2 },
        });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        await items[3].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        // 只读样式
        expect(findAllIcons(wrapper)[0].attributes('style')).toContain(
            'cursor: auto',
        );
        // 视图维持 2 颗满星
        expect(wrapper.findAll('.rate-icon.full-icon').length).toBe(2);
    });

    test('clearable click current value clears to 0', async () => {
        const wrapper = mount(FRate, {
            props: { modelValue: 3, clearable: true },
        });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        // 点击当前值（第 3 颗，index 2）对应的图标，清空为 0
        await items[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([0]);
        expect(wrapper.emitted('change')[0]).toEqual([0]);
        expect(wrapper.emitted('clear')).toHaveLength(1);
        await wrapper.setProps({ modelValue: 0 });
        expect(wrapper.findAll('.rate-icon.empty-icon').length).toBe(5);
    });

    test('without clearable click current value does not clear', async () => {
        const wrapper = mount(FRate, {
            props: { modelValue: 3 },
        });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        await items[2].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        expect(wrapper.emitted('clear')).toBeUndefined();
    });

    test('clearable half star click left side clears half value', async () => {
        const wrapper = mount(FRate, {
            props: { modelValue: 1.5, clearable: true, allowHalf: true },
        });
        const items = wrapper.find(`.${prefixCls}-container`).element.children;
        // 1.5 时点击第 2 颗（index 1）左半边可取消
        await items[1].dispatchEvent(new MouseEvent('click', { bubbles: true, offsetX: 0 }));
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0]).toEqual([0]);
        expect(wrapper.emitted('clear')).toHaveLength(1);
    });

    test('size class', () => {
        const wrapper = mount(FRate, { props: { size: 'small' } });
        expect(wrapper.classes()).toContain(`${prefixCls}-size-small`);
    });

    test('showText renders text by value', async () => {
        const wrapper = mount(FRate, {
            props: {
                showText: true,
                modelValue: 2,
                texts: ['很差', '较差', '一般', '较好', '很好'],
            },
        });
        expect(wrapper.find(`.${prefixCls}-text`).text()).toBe('较差');
        await wrapper.setProps({ modelValue: 4 });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-text`).text()).toBe('较好');
    });
});
