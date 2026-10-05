import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { FSelect } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import { sleep } from '../../_util/utils';

const prefixCls = getPrefixCls('select');
const triggerCls = `.${prefixCls}-trigger`;
const optionCls = `.${prefixCls}-option`;
const popperContentCls = `.${prefixCls}-popper`;
const tagItemCls = `.${prefixCls}-trigger-label-item`;
const HIDE_ANIMATION_DURATION = 300;

const OPTIONS = [
    { value: 'bj', label: '北京' },
    { value: 'sh', label: '上海' },
    { value: 'gz', label: '广州' },
    { value: 'sz', label: '深圳' },
];

// 自定义字段名选项（valueField/labelField）
const FIELD_OPTIONS = [
    { key: 'k1', name: '选项一' },
    { key: 'k2', name: '选项二' },
];

const _mount = (props = {}, slots = {}) =>
    mount(FSelect, {
        props: {
            options: OPTIONS,
            appendToContainer: false,
            ...props,
        },
        slots,
        attachTo: 'body',
    });

const openDropdown = async (wrapper) => {
    await wrapper.find(triggerCls).trigger('click');
    await nextTick();
};

describe('FSelect 属性补全', () => {
    test('emptyText 自定义空文案', async () => {
        const wrapper = _mount({ options: [], emptyText: '暂无城市' });
        await openDropdown(wrapper);
        expect(wrapper.text()).toContain('暂无城市');
        wrapper.unmount();
    });

    test('默认空文案为 暂无数据', async () => {
        const wrapper = _mount({ options: [] });
        await openDropdown(wrapper);
        expect(wrapper.text()).toContain('暂无数据');
        wrapper.unmount();
    });

    test('valueField/labelField 自定义字段名', async () => {
        const wrapper = _mount({
            options: FIELD_OPTIONS,
            valueField: 'key',
            labelField: 'name',
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].text()).toContain('选项一');
        await options[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('k2');
        wrapper.unmount();
    });

    test('multiple + multipleLimit 限制选择数量', async () => {
        const wrapper = _mount({
            multiple: true,
            multipleLimit: 2,
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        await options[0].trigger('click');
        await options[1].trigger('click');
        await nextTick();
        // 达到上限后 isLimit 阻止继续选择
        await options[2].trigger('click');
        await nextTick();
        const events = wrapper.emitted('update:modelValue');
        const last = events[events.length - 1][0];
        expect(last).toEqual(['bj', 'sh']);
        wrapper.unmount();
    });

    test('collapseTags 折叠多选标签', async () => {
        const wrapper = _mount({
            multiple: true,
            collapseTags: true,
            collapseTagsLimit: 1,
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        await options[0].trigger('click');
        await options[1].trigger('click');
        await nextTick();
        const tags = wrapper.findAll(tagItemCls);
        expect(tags.length).toBeLessThanOrEqual(2);
        expect(wrapper.text()).toContain('北京');
        wrapper.unmount();
    });

    test('tagBordered 多选标签带边框', async () => {
        const wrapper = _mount({
            multiple: true,
            tagBordered: true,
        });
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(wrapper.findAll(tagItemCls).length).toBe(1);
        wrapper.unmount();
    });

    test('filterTextHighlight 过滤高亮', async () => {
        const wrapper = _mount({ filterable: true });
        await openDropdown(wrapper);
        const input = wrapper.find('input');
        await input.setValue('北');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        // 过滤后只剩 北京
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('北');
        wrapper.unmount();
    });

    test('filter 自定义过滤函数', async () => {
        const wrapper = _mount({
            filterable: true,
            filter: (pattern, option) =>
                (option.value || '').toString().includes(pattern),
        });
        await openDropdown(wrapper);
        const input = wrapper.find('input');
        await input.setValue('sz');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('深圳');
        wrapper.unmount();
    });

    test('virtualScroll 开启虚拟滚动渲染', async () => {
        const manyOptions = Array.from({ length: 100 }, (_, i) => ({
            value: `v${i}`,
            label: `选项${i}`,
        }));
        const wrapper = _mount({ options: manyOptions, virtualScroll: true });
        await openDropdown(wrapper);
        await nextTick();
        expect(wrapper.find(popperContentCls).exists()).toBe(true);
        wrapper.unmount();
    });

    test('remote 模式不本地过滤', async () => {
        const wrapper = _mount({ filterable: true, remote: true });
        await openDropdown(wrapper);
        const input = wrapper.find('input');
        await input.setValue('北');
        await nextTick();
        // remote 开启时输入不触发本地过滤隐藏
        expect(wrapper.findAll(optionCls).length).toBe(4);
        wrapper.unmount();
    });

    test('clearable 单选可清空', async () => {
        const wrapper = _mount({ clearable: true, modelValue: 'bj' });
        await nextTick();
        // hover 触发清空按钮显示（v-show 由 hasClearRef 控制，class 为 fes-select-trigger-icon）
        await wrapper.find(triggerCls).trigger('mouseenter');
        await nextTick();
        const icons = wrapper.findAll(`.${prefixCls}-trigger-icon`);
        // 有值的清空图标（第二个图标，第一个是下拉箭头）
        expect(icons.length).toBeGreaterThanOrEqual(2);
        const clearBtn = icons[icons.length - 1];
        await clearBtn.trigger('click');
        await nextTick();
        expect(wrapper.emitted('clear')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0][0]).toBeNull();
        wrapper.unmount();
    });

    test('disabled 禁用选择', async () => {
        const wrapper = _mount({ disabled: true });
        await wrapper.find(triggerCls).trigger('click');
        await nextTick();
        expect(wrapper.emitted('visibleChange')).toBeUndefined();
        wrapper.unmount();
    });

    test('modelValue 无匹配回显原始值', async () => {
        const wrapper = _mount({ modelValue: 'unknown-key' });
        await nextTick();
        expect(wrapper.find(triggerCls).text()).toContain('unknown-key');
        wrapper.unmount();
    });

    test('tag slot 自定义标签渲染', async () => {
        const wrapper = _mount(
            { multiple: true },
            {
                tag: ({ option, handleClose }: any) =>
                    h(
                        'span',
                        { class: 'select-tag-custom', onClick: handleClose },
                        `S:${option?.label}`,
                    ),
            },
        );
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(wrapper.find('.select-tag-custom').exists()).toBe(true);
        expect(wrapper.text()).toContain('S:北京');
        wrapper.unmount();
    });

    test('选择后再次打开保持选中高亮（sleep 收起动画）', async () => {
        const wrapper = _mount();
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await sleep(HIDE_ANIMATION_DURATION);
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-checked')).toBe(true);
        wrapper.unmount();
    });
});
