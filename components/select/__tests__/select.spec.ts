import { h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { FOption, FSelect, FSelectGroupOption } from '../index';
import getPrefixCls from '../../_util/getPrefixCls';
import { sleep } from '../../_util/utils';

const prefixCls = getPrefixCls('select');
const triggerCls = `.${prefixCls}-trigger`;
const optionCls = `.${prefixCls}-option`;
const groupOptionCls = `.${prefixCls}-group-option`;
const popperContentCls = `.${prefixCls}-popper`;
const tagItemCls = `.${prefixCls}-trigger-label-item`;
// 选择后弹层收起存在动画，需要等待动画结束才隐藏
const HIDE_ANIMATION_DURATION = 300;

const OPTIONS = [
    { value: 'bj', label: '北京' },
    { value: 'sh', label: '上海' },
    { value: 'gz', label: '广州' },
    { value: 'sz', label: '深圳' },
];

// popper 弹层默认挂 body，测试内统一 appendToContainer=false 便于 wrapper 查询
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

describe('FSelect', () => {
    test('options 渲染与默认 placeholder', async () => {
        const wrapper = _mount();
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-placeholder`).text(),
        ).toBe('请选择');
        await openDropdown(wrapper);
        expect(wrapper.find(`.${prefixCls}-dropdown`).exists()).toBe(true);
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(4);
        expect(options[0].text()).toBe('北京');
        expect(options[3].text()).toBe('深圳');
        expect(wrapper.emitted('visibleChange')[0][0]).toBe(true);
        wrapper.unmount();
    });

    test('自定义 placeholder', () => {
        const wrapper = _mount({ placeholder: '选择城市' });
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-placeholder`).text(),
        ).toBe('选择城市');
        wrapper.unmount();
    });

    test('单选：点击 option 更新 v-model 并触发 change，选择后收起弹层', async () => {
        const wrapper = _mount();
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('sh');
        expect(wrapper.emitted('change')[0][0]).toBe('sh');
        expect(wrapper.emitted('visibleChange')[1][0]).toBe(false);
        await sleep(HIDE_ANIMATION_DURATION);
        // 弹层保持挂载，仅靠 v-show 隐藏，用 style 断言避免 isVisible 缓存误判
        expect(wrapper.find(popperContentCls).attributes('style')).toContain(
            'display: none',
        );
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-placeholder`).exists(),
        ).toBe(false);
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '上海',
        );
        wrapper.unmount();
    });

    test('单选：modelValue 回显与选中高亮', async () => {
        const wrapper = _mount({ modelValue: 'sh' });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '上海',
        );
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[1].classes('is-checked')).toBe(true);
        expect(
            options[1]
                .find(`.${prefixCls}-option-checked-icon`)
                .classes('is-selected'),
        ).toBe(true);
        expect(options[0].classes('is-checked')).toBe(false);
        wrapper.unmount();
    });

    test('option disabled：禁用项不可选中', async () => {
        const wrapper = _mount({
            options: [
                { value: 'a', label: '选项A' },
                { value: 'b', label: '选项B', disabled: true },
            ],
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[1].classes('is-disabled')).toBe(true);
        await options[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('clearable：hover 显示清空图标，点击清空并触发 clear', async () => {
        const wrapper = _mount({ modelValue: 'sh', clearable: true });
        await nextTick();
        const iconCls = `.${prefixCls}-trigger-icon`;
        const icons = wrapper.findAll(iconCls);
        // 未 hover 时清空图标 v-show 隐藏（Up/Down/CloseCircle 三个图标常驻 DOM）
        expect(icons[2].attributes('style')).toContain('display: none');
        await wrapper.find(triggerCls).trigger('mouseenter');
        const iconsOnHover = wrapper.findAll(iconCls);
        expect(iconsOnHover[2].attributes('style')).not.toContain(
            'display: none',
        );
        await iconsOnHover[2].trigger('click');
        expect(wrapper.emitted('clear').length).toBe(1);
        expect(wrapper.emitted('update:modelValue')[0][0]).toBeNull();
        expect(wrapper.emitted('change')[0][0]).toBeNull();
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-placeholder`).text(),
        ).toBe('请选择');
        wrapper.unmount();
    });

    test('disabled：整体禁用不可交互', async () => {
        const wrapper = _mount({
            disabled: true,
            modelValue: 'sh',
            clearable: true,
        });
        await nextTick();
        expect(wrapper.find(triggerCls).classes('is-disabled')).toBe(true);
        await wrapper.find(triggerCls).trigger('click');
        expect(wrapper.find(`.${prefixCls}-dropdown`).exists()).toBe(false);
        expect(wrapper.emitted('visibleChange')).toBeUndefined();
        // 禁用时 hover 也不显示清空图标
        await wrapper.find(triggerCls).trigger('mouseenter');
        const icons = wrapper.findAll(`.${prefixCls}-trigger-icon`);
        expect(icons[2].attributes('style')).toContain('display: none');
        wrapper.unmount();
    });

    test('filterable：输入过滤选项，无匹配展示空文案，blur 恢复', async () => {
        const wrapper = _mount({ filterable: true });
        await openDropdown(wrapper);
        const input = wrapper.find(`.${prefixCls}-trigger-label-input`);
        expect(input.exists()).toBe(true);
        await input.setValue('北');
        expect(wrapper.emitted('filter')[0][0]).toBe('北');
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].text()).toBe('北京');
        // 无匹配时展示默认空文案
        await input.setValue('不存在');
        expect(wrapper.findAll(optionCls).length).toBe(0);
        expect(wrapper.find(`.${prefixCls}-null`).text()).toBe('暂无数据');
        // 触发根节点 focusout（blur 事件）自动清空过滤关键字，选项恢复
        await input.setValue('');
        await nextTick();
        expect(wrapper.findAll(optionCls).length).toBe(4);
        wrapper.unmount();
    });

    test('filter：自定义过滤函数', async () => {
        const wrapper = _mount({
            filterable: true,
            filter: (pattern, option) =>
                String(option.value).indexOf(pattern) !== -1,
        });
        await openDropdown(wrapper);
        await wrapper.find(`.${prefixCls}-trigger-label-input`).setValue('gz');
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].text()).toBe('广州');
        wrapper.unmount();
    });

    test('分组 option：FSelectGroupOption 渲染分组标题与子选项', async () => {
        const wrapper = _mount({ options: [] }, {
            default: () =>
                h(FSelectGroupOption, { label: '分组一' }, {
                    default: () => [
                        h(FOption, { value: 'a', label: '选项A' }),
                        h(FOption, { value: 'b', label: '选项B' }),
                    ],
                }),
        });
        await openDropdown(wrapper);
        expect(wrapper.find(groupOptionCls).text()).toBe('分组一');
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(2);
        expect(options[0].text()).toBe('选项A');
        await options[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toBe('a');
        expect(wrapper.emitted('change')[0][0]).toBe('a');
        wrapper.unmount();
    });

    test('分组 disabled：子选项继承禁用状态', async () => {
        const wrapper = _mount({ options: [] }, {
            default: () =>
                h(FSelectGroupOption, { label: '分组一', disabled: true }, {
                    default: () => [h(FOption, { value: 'a', label: '选项A' })],
                }),
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-disabled')).toBe(true);
        await options[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('多选：v-model 为数组，tag 渲染与选中高亮', async () => {
        const wrapper = _mount({ multiple: true, modelValue: [] });
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['bj']);
        await wrapper.findAll(optionCls)[1].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[1][0]).toEqual(['bj', 'sh']);
        const tags = wrapper.findAll(tagItemCls);
        expect(tags.length).toBe(2);
        expect(tags[0].text()).toBe('北京');
        expect(tags[1].text()).toBe('上海');
        expect(wrapper.findAll(optionCls)[0].classes('is-checked')).toBe(true);
        wrapper.unmount();
    });

    test('多选：点击 tag 关闭按钮移除选项并触发 removeTag', async () => {
        const wrapper = _mount({ multiple: true, modelValue: ['bj', 'sh'] });
        await nextTick();
        let tags = wrapper.findAll(tagItemCls);
        expect(tags.length).toBe(2);
        await tags[0].find('.fes-tag__close .outlined').trigger('click');
        await nextTick();
        expect(wrapper.emitted('removeTag')[0][0]).toBe('bj');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(['sh']);
        tags = wrapper.findAll(tagItemCls);
        expect(tags.length).toBe(1);
        expect(tags[0].text()).toBe('上海');
        wrapper.unmount();
    });

    test('多选：再次点击已选项可取消选中', async () => {
        const wrapper = _mount({ multiple: true, modelValue: ['bj'] });
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([]);
        expect(wrapper.emitted('removeTag')[0][0]).toBe('bj');
        wrapper.unmount();
    });

    test('多选 multipleLimit：达到上限后不能再选，取消不受限', async () => {
        const wrapper = _mount({
            multiple: true,
            modelValue: ['bj'],
            multipleLimit: 1,
        });
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[1].classes('is-disabled')).toBe(true);
        await options[1].trigger('click');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        // 取消已选项不受上限限制
        await options[0].trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual([]);
        wrapper.unmount();
    });
});
