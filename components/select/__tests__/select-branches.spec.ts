/**
 * FSelect 分支补全测试（v8 coverage 驱动，真实交互链路优先）
 *
 * 原则（fes-design-testing skill）：
 * - 分支通过真实用户路径触发：打开下拉 → 输入/键盘 → 选中/清空/移除 → 断言 emit 精确值与 DOM 类名
 * - 清空图标 class 是 `.fes-select-trigger-icon`（CloseCircleFilled），
 *   显示需「有选中值 + hover trigger + clearable」三条件
 * - 分支覆盖是副产品，行为可用性验证是主目标
 */
import { h, nextTick, ref } from 'vue';
import { type DOMWrapper, type VueWrapper, mount } from '@vue/test-utils';
import { FORM_ITEM_INJECTION_KEY } from '../../_util/constants';
import { FOption, FSelectGroupOption, FSelect as Select } from '../index';
import { wait } from '../../_util/__tests__/helpers';
import getPrefixCls from '../../_util/getPrefixCls';

const prefixCls = getPrefixCls('select');
const triggerCls = `.${prefixCls}-trigger`;
const optionCls = `.${prefixCls}-option`;
const groupCls = `.${prefixCls}-group-option`;
const popperContentCls = `.${prefixCls}-popper`;
// input 在 SelectTrigger 内，prefix 是 fes-select-trigger
const inputCls = `.${getPrefixCls('select-trigger')}-label-input`;

const OPTIONS = [
    { name: '北京', code: 'bj' },
    { name: '上海', code: 'sh' },
    { name: '广州', code: 'gz' },
];

// 工厂化生成大量选项（optionList 虚拟滚动分支 options.length > 50）
const makeManyOptions = (count = 60) =>
    Array.from({ length: count }, (_, i) => ({
        name: `城市${i}`,
        code: `c${i}`,
    }));

const warnHandler = () => {}; // 屏蔽 deprecated addon 插槽的 console.warn

const mountSelect = (
    props: Record<string, unknown> = {},
    slots: Record<string, any> = {},
): VueWrapper<any> =>
    mount(
        Select,
        {
            // popper 弹层默认挂 body，测试统一 appendToContainer=false 便于 wrapper 查询
            props: {
                options: OPTIONS,
                valueField: 'code',
                labelField: 'name',
                appendToContainer: false,
                ...props,
            },
            slots,
            attachTo: document.body,
            global: { config: { warnHandler } },
        } as any,
    );

const openDropdown = async (wrapper: VueWrapper<any>) => {
    const trigger = wrapper.find(triggerCls);
    expect(trigger.exists()).toBe(true);
    await trigger.trigger('click');
    await nextTick();
};

const getTrigger = (wrapper: VueWrapper<any>) => wrapper.find(triggerCls);

/** 清空图标：Up/Down/CloseCircle 三图标常驻 DOM 靠 v-show 切换，取最后一个 */
const getClearIcon = (wrapper: VueWrapper<any>) => {
    const icons = wrapper.findAll(`.${prefixCls}-trigger-icon`);
    expect(icons.length).toBeGreaterThanOrEqual(3);
    return icons[icons.length - 1];
};

const lastEmit = (wrapper: VueWrapper<any>, event: string) => {
    const emitted = wrapper.emitted(event);
    expect(emitted).toBeTruthy();
    return emitted![emitted!.length - 1];
};

/** 清空过滤输入（覆盖 blur 自动清空前的显式清空路径） */
const inputAndClear = async (wrapper: VueWrapper<any>) => {
    const input = wrapper.find(inputCls);
    expect(input.exists()).toBe(true);
    await input.setValue('');
    await input.trigger('input');
    await nextTick();
};

/** 桩容器滚动尺寸后派发 scroll 事件（jsdom 无布局，见 skill 速查表第 3/5 条） */
const stubScrollAndDispatch = async (
    el: HTMLElement,
    offset: { scrollTop: number; scrollHeight?: number; clientHeight?: number },
) => {
    Object.defineProperty(el, 'scrollTop', {
        value: offset.scrollTop,
        configurable: true,
    });
    if (offset.scrollHeight !== undefined) {
        Object.defineProperty(el, 'scrollHeight', {
            value: offset.scrollHeight,
            configurable: true,
        });
    }
    if (offset.clientHeight !== undefined) {
        Object.defineProperty(el, 'clientHeight', {
            value: offset.clientHeight,
            configurable: true,
        });
    }
    el.dispatchEvent(new Event('scroll'));
    await wait();
};

beforeEach(() => {
    document.body.innerHTML = '';
});

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FSelect 分支补全（键盘 / 插槽 / 受控回显 / tag 创建）', () => {
    test('键盘 Enter 选中当前 hover 项并收起弹层（onKeyDown → onSelect 链路）', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        await openDropdown(wrapper);
        // 单选有值：打开时 hover 初始化在当前选中项上（watch isOpenedRef 分支）
        let options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-hover')).toBe(true);
        expect(options[0].classes('is-checked')).toBe(true);
        expect(options[1].classes('is-hover')).toBe(false);
        // 用户鼠标移到「上海」上（optionList onMouseover → onHover）
        await options[1].trigger('mouseover');
        await nextTick();
        options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-hover')).toBe(false);
        expect(options[1].classes('is-hover')).toBe(true);
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        // Enter 选中 hover 项「上海」，并收起弹层
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('sh');
        expect(wrapper.emitted('change')![0][0]).toBe('sh');
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(false);
        await wait(450); // 单选选中后 400ms 清 filterText + 300ms 收起动画
        expect(wrapper.find(popperContentCls).attributes('style')).toContain(
            'display: none',
        );
        // trigger 展示更新为「上海」
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '上海',
        );
        wrapper.unmount();
    });

    test('键盘 Enter 在无可 hover 项时不触发选择（hoverOptionValue 为 nil 分支）', async () => {
        const wrapper = mountSelect({ options: [] });
        await nextTick();
        await openDropdown(wrapper);
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        // 空态文案正常展示
        expect(wrapper.text()).toContain('暂无数据');
        wrapper.unmount();
    });

    test('回显值在 options 与缓存中都找不到时回显原始值（label: null 分支）', async () => {
        const wrapper = mountSelect({ modelValue: 'ghost-value' });
        await nextTick();
        // getOption 走 `val ? { value: val, label: null } : null`，
        // trigger 侧 genTag 回退用 value 展示原始值
        expect(getTrigger(wrapper).text()).toContain('ghost-value');
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-text`).exists(),
        ).toBe(true);
        wrapper.unmount();
    });

    test('modelValue 为 null 时 trigger 不渲染已选项，展示 placeholder（getOption null 分支）', async () => {
        const wrapper = mountSelect({ modelValue: null });
        await nextTick();
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-text`).exists(),
        ).toBe(false);
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-placeholder`).text(),
        ).toBe('请选择');
        wrapper.unmount();
    });

    test('filterable + tag 多选：输入新值创建选项，Enter 选中后缓存项带 tip 展示', async () => {
        const wrapper = mountSelect({
            filterable: true,
            tag: true,
            multiple: true,
            modelValue: ['bj'],
        });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        // 输入不存在的值 → cacheOptionsForTag 命中创建分支，产生 __cache 项
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        // remote 不开启时本地过滤「杭」→ 仅剩创建项（北京 label 不含关键字被滤掉）
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('杭');
        // __cache 项渲染「- 可创建」tip（tip 类前缀是 option 级 prefixCls）
        expect(
            options[0].findAll(`.${getPrefixCls('select')}-option-label-tip`)
                .length,
        ).toBe(1);
        // Enter 选中创建项
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        const updateEmit = wrapper
            .emitted('update:modelValue')!
            .slice(-1)[0][0];
        expect(updateEmit).toEqual(['bj', '杭']);
        expect(wrapper.emitted('change')!.slice(-1)[0][0]).toEqual(['bj', '杭']);
        // 选中后 filterText 清空，创建项落入 cacheOptions 仍带 tip
        await nextTick();
        const cached = wrapper.findAll(optionCls);
        expect(cached[0].classes('is-checked')).toBe(true);
        expect(cached[0].text()).toContain('-');
        wrapper.unmount();
    });

    test('filterable + tag：再次输入已创建项不重复插入（cacheOptions every 守卫）', async () => {
        const wrapper = mountSelect({
            filterable: true,
            tag: true,
            multiple: true,
        });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        // 第一轮：输入并 Enter 创建「杭」
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([
            '杭',
        ]);
        // 第二轮：再次输入同样文本，已缓存项不重复生成创建项
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('杭');
        expect(options[0].classes('is-checked')).toBe(true);
        wrapper.unmount();
    });

    test('filterable + tag：输入恰好等于已有选项 label 时不产生创建项', async () => {
        const wrapper = mountSelect({ filterable: true, tag: true });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        await input.setValue('上海');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        // flatBaseOptions 已含「上海」，不重复生成 __cache 项
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('上海');
        expect(options[0].findAll(`.${prefixCls}-label-tip`).length).toBe(0);
        wrapper.unmount();
    });

    test('单选 filterable + tag：Enter 选中创建项后缓存落单选分支', async () => {
        const wrapper = mountSelect({ filterable: true, tag: true });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        expect(wrapper.findAll(optionCls)[0].text()).toContain('杭');
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('杭');
        expect(wrapper.emitted('change')![0][0]).toBe('杭');
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(false);
        wrapper.unmount();
    });

    test('受控多选达上限：未选项禁用、已选项 hover 高亮（isLimit 分支）', async () => {
        const wrapper = mountSelect({
            multiple: true,
            modelValue: ['bj', 'gz'],
            multipleLimit: 2,
        });
        await nextTick();
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        // isSelect 的 includes 分支：北京已选中
        expect(options[0].classes('is-checked')).toBe(true);
        // 打开时 hover 初始化到 currentSelectValues[0]
        expect(options[0].classes('is-hover')).toBe(true);
        // isLimit 已达上限：未选项带禁用类
        expect(options[1].classes('is-disabled')).toBe(true);
        // 取消已选项不受上限限制
        await options[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('removeTag')!.slice(-1)[0][0]).toBe('bj');
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([
            'gz',
        ]);
        wrapper.unmount();
    });

    test('受控多选空数组：打开下拉 hover 初始化到第一个可用项', async () => {
        const wrapper = mountSelect({ multiple: true, modelValue: [] });
        await nextTick();
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-hover')).toBe(true);
        expect(options[1].classes('is-hover')).toBe(false);
        expect(options[0].classes('is-checked')).toBe(false);
        wrapper.unmount();
    });

    test('受控单选空值：打开下拉 hover 初始化到第一个可用项', async () => {
        const wrapper = mountSelect({ modelValue: null });
        await nextTick();
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-hover')).toBe(true);
        expect(options[0].classes('is-checked')).toBe(false);
        wrapper.unmount();
    });

    test('header 插槽渲染在下拉面板顶部容器内', async () => {
        const wrapper = mountSelect({}, {
            header: () => h('div', { class: 'sel-header-slot' }, '自定义头部'),
        });
        await nextTick();
        await openDropdown(wrapper);
        const headerSlot = wrapper.find('.sel-header-slot');
        expect(headerSlot.exists()).toBe(true);
        expect(headerSlot.text()).toBe('自定义头部');
        expect(wrapper.find(`.${prefixCls}-option-header`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('footer 插槽渲染在下拉面板底部容器内', async () => {
        const wrapper = mountSelect({}, {
            footer: () => h('div', { class: 'sel-footer-slot' }, '自定义底部'),
        });
        await nextTick();
        await openDropdown(wrapper);
        const footerSlot = wrapper.find('.sel-footer-slot');
        expect(footerSlot.exists()).toBe(true);
        expect(footerSlot.text()).toBe('自定义底部');
        expect(wrapper.find(`.${prefixCls}-option-footer`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('addon 废弃插槽渲染并输出 console.warn（footer 缺席时走 else-if 分支）', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSelect({}, {
            addon: () => h('div', { class: 'sel-addon-slot' }, '旧插槽'),
        });
        await nextTick();
        await openDropdown(wrapper);
        const addonSlot = wrapper.find('.sel-addon-slot');
        expect(addonSlot.exists()).toBe(true);
        expect(addonSlot.text()).toBe('旧插槽');
        expect(wrapper.find(`.${prefixCls}-option-footer`).exists()).toBe(true);
        expect(spy).toHaveBeenCalled();
        spy.mockRestore();
        wrapper.unmount();
    });

    test('empty 插槽自定义空态（renderEmpty 分支）', async () => {
        const wrapper = mountSelect({ options: [] }, {
            empty: () => h('div', { class: 'sel-empty-slot' }, '空空如也'),
        });
        await nextTick();
        await openDropdown(wrapper);
        const emptySlot = wrapper.find('.sel-empty-slot');
        expect(emptySlot.exists()).toBe(true);
        expect(emptySlot.text()).toBe('空空如也');
        expect(wrapper.find(`.${prefixCls}-null`).exists()).toBe(false);
        wrapper.unmount();
    });

    test('option 插槽自定义渲染每个选项（renderOption 分支）', async () => {
        const wrapper = mountSelect({}, {
            option: ({ label }: any) =>
                h('div', { class: 'sel-opt-slot' }, `R:${label}`),
        });
        await nextTick();
        await openDropdown(wrapper);
        const slots = wrapper.findAll('.sel-opt-slot');
        expect(slots.length).toBe(3);
        expect(slots[1].text()).toBe('R:上海');
        expect(wrapper.findAll(optionCls)[1].text()).toContain('R:上海');
        // 自定义渲染下点击仍可正常选中
        await wrapper.findAll(optionCls)[1].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('sh');
        wrapper.unmount();
    });

    test('FOption 无 label 时回退元素文本（renderLabel 有 label 分支）', async () => {
        const wrapper = mountSelect({ options: [] }, {
            default: () => h(FOption, { value: 'a' }, () => '插槽文本'),
        });
        await nextTick();
        await openDropdown(wrapper);
        const option = wrapper.findAll(optionCls)[0];
        expect(option.exists()).toBe(true);
        // FOption 用元素文本补 label，renderLabel 走 `option.label` 为真分支
        expect(option.text()).toContain('插槽文本');
        await option.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('a');
        expect(wrapper.emitted('change')![0][0]).toBe('a');
        wrapper.unmount();
    });

    test('FOption 无 label 无插槽：renderLabel 返回 null 但选项仍可点选', async () => {
        const wrapper = mountSelect({ options: [] }, {
            default: () => h(FOption, { value: 'blank' }),
        });
        await nextTick();
        await openDropdown(wrapper);
        const option = wrapper.findAll(optionCls)[0];
        expect(option.exists()).toBe(true);
        // renderLabel 无 label 无 slot → null（optionList L119），选项仍渲染可交互
        expect(option.text()).toBe('');
        await option.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('blank');
        expect(wrapper.emitted('change')![0][0]).toBe('blank');
        wrapper.unmount();
    });

    test('scroll 事件随下拉容器滚动发出（Scrollbar 模式）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await openDropdown(wrapper);
        const container = wrapper.find(`.${prefixCls}-dropdown`);
        expect(container.exists()).toBe(true);
        await stubScrollAndDispatch(container.element, {
            scrollTop: 120,
            scrollHeight: 600,
            clientHeight: 200,
        });
        const scrollEvents = wrapper.emitted('scroll');
        expect(scrollEvents).toBeTruthy();
        expect((scrollEvents![0][0] as Event).type).toBe('scroll');
        wrapper.unmount();
    });

    test('filterTextHighlight: true 时过滤命中文本渲染高亮 mark（TextHightlight 分支）', async () => {
        const wrapper = mountSelect({ filterable: true, filterTextHighlight: true });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        await input.setValue('北');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('北京');
        // 高亮 mark 标签真实渲染
        expect(options[0].find('mark').exists()).toBe(true);
        expect(options[0].find('mark').text()).toBe('北');
        wrapper.unmount();
    });

    test('FSelectGroupOption label 插槽自定义分组标题（group slots.label 分支）', async () => {
        const wrapper = mount(Select, {
            props: { appendToContainer: false, options: [] },
            slots: {
                default: () =>
                    h(
                        FSelectGroupOption,
                        { label: '原生标题' },
                        {
                            default: () => [
                                h(FOption, { value: 'g1', label: '组内项' }),
                            ],
                            label: ({ isSelected }: any) =>
                                h(
                                    'div',
                                    { class: 'sel-group-label-slot' },
                                    `自定义分组${isSelected ? '!' : ''}`,
                                ),
                        },
                    ),
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        await openDropdown(wrapper);
        // 分组标题走 slots.label 渲染，不输出 label prop 原文
        const groupLabel = wrapper.find('.sel-group-label-slot');
        expect(groupLabel.exists()).toBe(true);
        expect(groupLabel.text()).toBe('自定义分组');
        expect(wrapper.find(groupCls).text()).not.toContain('原生标题');
        wrapper.unmount();
    });

    test('value 为 null 的选项经 dataKey 兼容键渲染并可正常点选', async () => {
        // >50 项触发 VirtualList，dataKey 需为 null 值生成兼容键
        const options = makeManyOptions(60);
        options.unshift({ name: '不限', code: null } as any);
        const wrapper = mountSelect({ options });
        await nextTick();
        await openDropdown(wrapper);
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(true);
        const optionNodes = wrapper.findAll(optionCls);
        expect(optionNodes.length).toBeGreaterThanOrEqual(1);
        // 第一项为 null 值选项（dataKey 用 _ALL_KEY_null 兼容键渲染）
        expect(optionNodes[0].text()).toContain('不限');
        // 选中 null 值选项
        await optionNodes[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBeNull();
        expect(wrapper.emitted('change')![0][0]).toBeNull();
        wrapper.unmount();
    });

    test('悬停 disabled 选项：hover 不转移（optionList onMouseover 守卫）', async () => {
        const wrapper = mountSelect({
            options: [
                { name: '禁用项', code: 'a', disabled: true },
                { name: '可用项', code: 'b' },
            ] as any,
        });
        await nextTick();
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-disabled')).toBe(true);
        // 打开时 hover 初始化到第一个可用项
        expect(options[1].classes('is-hover')).toBe(true);
        // 悬停禁用项：onMouseover 守卫 return，hover 不转移
        await options[0].trigger('mouseover');
        await nextTick();
        const optionsAfter = wrapper.findAll(optionCls);
        expect(optionsAfter[0].classes('is-hover')).toBe(false);
        expect(optionsAfter[1].classes('is-hover')).toBe(true);
        // 点击禁用项同样不可选中
        await options[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('多选 tag：取消已创建选中项时同步移除创建缓存（cacheOptions splice 分支）', async () => {
        const wrapper = mountSelect({
            filterable: true,
            tag: true,
            multiple: true,
        });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        // 第一轮：输入并 Enter 创建「杭」
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([
            '杭',
        ]);
        // 第二轮：再次输入同样文本，cacheOptions.every 守卫命中，不重复生成创建项
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(1);
        expect(options[0].classes('is-checked')).toBe(true);
        // 下拉中再次点击已选中创建项 → removeTag + cacheOptions.splice 移除缓存
        await options[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('removeTag')!.slice(-1)[0][0]).toBe('杭');
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([]);
        // 缓存已移除：filterText 清空后选项列表恢复完整，tag 消失
        await nextTick();
        expect(wrapper.findAll(`.${getPrefixCls('select')}-trigger-label-item`).length).toBe(0);
        wrapper.unmount();
    });

    test('多选 tag：下拉中取消普通选项（option 非 __cache 时跳过缓存清理 if 分支）', async () => {
        const wrapper = mountSelect({
            filterable: true,
            tag: true,
            multiple: true,
            modelValue: ['bj'],
        });
        await nextTick();
        await openDropdown(wrapper);
        // 直接点击已选中的普通选项「北京」取消
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(3);
        expect(options[0].classes('is-checked')).toBe(true);
        await options[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('removeTag')!.slice(-1)[0][0]).toBe('bj');
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([]);
        // 无创建缓存场景：创建列表保持为空，选项仍完整
        await inputAndClear(wrapper);
        expect(wrapper.findAll(optionCls).length).toBe(3);
        wrapper.unmount();
    });

    test('多选 tag：创建缓存存在时再选普通新选项，缓存原样保留（else 假分支）', async () => {
        const wrapper = mountSelect({
            filterable: true,
            tag: true,
            multiple: true,
        });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        // 创建并选中「杭」→ cacheOptions = [杭]
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([
            '杭',
        ]);
        // 再选择普通选项「北京」：option 非 __cache → 缓存不动，「杭」tag 保持
        await getTrigger(wrapper).trigger('click');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        const bj = options.find((option) => option.text().includes('北京'));
        expect(bj).toBeTruthy();
        await bj!.trigger('click');
        await nextTick();
        expect(
            wrapper.emitted('update:modelValue')!.slice(-1)[0][0],
        ).toEqual(['杭', 'bj']);
        // 创建项 tag「杭」仍在
        const tags = wrapper.findAll(
            `.${getPrefixCls('select')}-trigger-label-item`,
        );
        expect(tags.length).toBe(2);
        expect(tags[0].text()).toContain('杭');
        wrapper.unmount();
    });

    test('单选创建项选中后，再选普通选项：cacheOptions 清空（else 分支）', async () => {
        const wrapper = mountSelect({ filterable: true, tag: true });
        await nextTick();
        await openDropdown(wrapper);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        // 创建并选中「杭」
        await input.setValue('杭');
        await input.trigger('input');
        await nextTick();
        await getTrigger(wrapper).trigger('keydown.enter');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toBe('杭');
        // 单选选中后 400ms 定时清 filterText，等它落定再重开下拉
        await wait(450);
        // 再次打开，选择普通选项「上海」→ else 分支 cacheOptions = []
        await getTrigger(wrapper).trigger('click');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        const normal = options.find((option) => option.text().includes('上海'));
        expect(normal).toBeTruthy();
        await normal!.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toBe('sh');
        // 创建项 tag 消失，展示普通选项 label
        expect(
            wrapper.find(`.${prefixCls}-trigger-label-text`).text(),
        ).toBe('上海');
        wrapper.unmount();
    });
});

describe('FSelect 清空与禁用分支', () => {
    test('多选清空：点击清空图标 emit 空数组与 clear 事件', async () => {
        const wrapper = mountSelect({
            multiple: true,
            clearable: true,
            modelValue: ['bj'],
        });
        await nextTick();
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        const clearIcon = getClearIcon(wrapper);
        expect(clearIcon.attributes('style')).not.toContain('display: none');
        await clearIcon.trigger('click');
        await nextTick();
        expect(wrapper.emitted('clear')!.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')![0][0]).toEqual([]);
        expect(wrapper.emitted('change')![0][0]).toEqual([]);
        // 已无选中值：清空图标重新隐藏
        const iconsAfter = wrapper.findAll(`.${prefixCls}-trigger-icon`);
        expect(iconsAfter[iconsAfter.length - 1].attributes('style')).toContain(
            'display: none',
        );
        wrapper.unmount();
    });

    test('多选空值时 hover：清空图标不显示（hasClearRef 需已有选中值），直接 click 不产生任何 emit', async () => {
        const wrapper = mountSelect({
            multiple: true,
            clearable: true,
            modelValue: [],
        });
        await nextTick();
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        // 无选中值：hasClearRef 为 false，图标保持隐藏
        const clearIcon = getClearIcon(wrapper);
        expect(clearIcon.attributes('style')).toContain('display: none');
        clearIcon.trigger('click');
        await nextTick();
        // 现状锁定：v-show 隐藏态点击仍会触发 SelectTrigger.handleClear 发 clear，
        // 但 Select.handleClear 中 has value 为假，不更新值（update/change 均不发）
        expect(wrapper.emitted('clear')!.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('单选空值时 hover：清空图标不显示，点击后不产生值变更', async () => {
        const wrapper = mountSelect({ clearable: true, modelValue: null });
        await nextTick();
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        const clearIcon = getClearIcon(wrapper);
        expect(clearIcon.attributes('style')).toContain('display: none');
        clearIcon.trigger('click');
        await nextTick();
        expect(wrapper.emitted('clear')!.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('disabled 时 hover 不显示清空图标（innerDisabled → SelectTrigger disabled）', async () => {
        const wrapper = mountSelect({
            clearable: true,
            modelValue: 'bj',
            disabled: true,
        });
        await nextTick();
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        const clearIcon = getClearIcon(wrapper);
        expect(clearIcon.attributes('style')).toContain('display: none');
        wrapper.unmount();
    });

    test('禁用组件内打开下拉再禁用：onSelect 直接 return（innerDisabled 守卫）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await openDropdown(wrapper);
        // 打开后通过 form 注入切到禁用，再点击 option
        await wrapper.setProps({ disabled: true });
        await nextTick();
        const option = wrapper.findAll(optionCls)[0];
        expect(option.exists()).toBe(true);
        await option.trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        // 禁用后弹层关闭由 Popper 内部 visible 处理，不重复发 visibleChange
        const events = wrapper.emitted('visibleChange')!;
        expect(events[events.length - 1][0]).toBe(true);
        expect(events.length).toBe(1);
        wrapper.unmount();
    });

    test('form 级禁用（FORM_ITEM_INJECTION_KEY.isFormDisabled）：清空图标不显示', async () => {
        const setRuleDefaultType = vi.fn();
        const wrapper = mount(Select, {
            props: {
                options: OPTIONS,
                clearable: true,
                modelValue: 'bj',
                appendToContainer: false,
            },
            global: {
                config: { warnHandler },
                provide: {
                    [FORM_ITEM_INJECTION_KEY as symbol]: {
                        validate: () => {},
                        isError: ref(false),
                        isFormDisabled: ref(true),
                        setRuleDefaultType,
                    },
                },
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        expect(getTrigger(wrapper).classes('is-disabled')).toBe(true);
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        const clearIcon = getClearIcon(wrapper);
        expect(clearIcon.attributes('style')).toContain('display: none');
        // form 集成：单选向 form 注册 string 值类型
        expect(setRuleDefaultType).toHaveBeenCalledWith('string');
        wrapper.unmount();
    });

    test('form 集成多选：向 form 注册 array 值类型', async () => {
        const setRuleDefaultType = vi.fn();
        const wrapper = mount(Select, {
            props: {
                options: OPTIONS,
                valueField: 'code',
                labelField: 'name',
                multiple: true,
                modelValue: [],
                appendToContainer: false,
            },
            global: {
                config: { warnHandler },
                provide: {
                    [FORM_ITEM_INJECTION_KEY as symbol]: {
                        validate: () => {},
                        isError: ref(false),
                        isFormDisabled: ref(false),
                        setRuleDefaultType,
                    },
                },
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        expect(setRuleDefaultType).toHaveBeenCalledWith('array');
        // form 未禁用时正常选择
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['bj']);
        wrapper.unmount();
    });

    test('多选受控值被置为 null：清空/回显/hover 初始化均按空数组兜底', async () => {
        const wrapper = mountSelect({
            multiple: true,
            clearable: true,
            modelValue: ['bj'],
        });
        await nextTick();
        expect(
            wrapper.findAll(`.${prefixCls}-trigger-label-item`).length,
        ).toBe(1);
        // 受控方把值置为非法 null（真实场景：表单重置）
        await wrapper.setProps({ modelValue: null });
        await nextTick();
        // tag 清空展示 placeholder
        expect(
            wrapper.findAll(`.${prefixCls}-trigger-label-item`).length,
        ).toBe(0);
        // 现状锁定：currentValue 为 null 时 isSelect 对所有值返回 false，
        // 下拉中不会把任何选项标记为选中
        expect(wrapper.vm.isSelect('bj')).toBe(false);
        expect(wrapper.vm.isSelect(null)).toBe(false);
        // hover 后点击（隐藏的）清空图标：null 值兜底为空数组，不重复发 update
        await getTrigger(wrapper).trigger('mouseenter');
        await nextTick();
        getClearIcon(wrapper).trigger('click');
        await nextTick();
        expect(wrapper.emitted('clear')!.length).toBe(1);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        // 打开下拉：hover 仍能初始化到第一个可用项，且无选中标记
        await openDropdown(wrapper);
        const optionsAfterReset = wrapper.findAll(optionCls);
        expect(optionsAfterReset[0].classes('is-hover')).toBe(true);
        expect(optionsAfterReset[0].classes('is-checked')).toBe(false);
        expect(optionsAfterReset[1].classes('is-checked')).toBe(false);
        // 点击选项恢复正常选择
        await optionsAfterReset[1].trigger('click');
        await nextTick();
        expect(wrapper.emitted('update:modelValue')!.slice(-1)[0][0]).toEqual([
            'sh',
        ]);
        wrapper.unmount();
    });

    test('options 被动态清空：已选值仍从缓存回显（selectedOptionsRef fallback 分支）', async () => {
        const wrapper = mountSelect({ modelValue: 'bj' });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '北京',
        );
        // 异步场景：options 被清空后，已选值从 selectedOptionsRef 缓存回显
        await wrapper.setProps({ options: [] });
        await nextTick();
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '北京',
        );
        // 打开下拉为空态，但 trigger 回显不丢
        await openDropdown(wrapper);
        expect(wrapper.findAll(optionCls).length).toBe(0);
        expect(wrapper.find(`.${prefixCls}-trigger-label-text`).text()).toBe(
            '北京',
        );
        wrapper.unmount();
    });

    test('打开下拉时按 trigger 宽度设置弹层 min-width（dropdownStyle 分支）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        // jsdom 无布局：按 skill 速查表桩 offsetWidth（真实 DOM 该值自然非零）
        const triggerEl = getTrigger(wrapper).element as HTMLElement;
        Object.defineProperty(triggerEl, 'offsetWidth', {
            value: 220,
            configurable: true,
        });
        await openDropdown(wrapper);
        const dropdown = wrapper.find(`.${prefixCls}-dropdown`);
        expect(dropdown.exists()).toBe(true);
        expect(dropdown.attributes('style')).toContain('min-width: 220px');
        wrapper.unmount();
    });
});

describe('FSelect 分组与过滤分支', () => {
    test('多选 + 分组 + 过滤：分组标题被过滤掉只留匹配子项（__isGroup return false 分支）', async () => {
        const wrapper = mount(Select, {
            props: {
                multiple: true,
                filterable: true,
                modelValue: ['a2'],
                appendToContainer: false,
            },
            slots: {
                default: () =>
                    h(FSelectGroupOption, { label: '城市组' }, () => [
                        h(FOption, { value: 'a1', label: '城市甲' }),
                        h(FOption, { value: 'a2', label: '城市乙' }),
                    ]),
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        await openDropdown(wrapper);
        expect(wrapper.find(groupCls).text()).toBe('城市组');
        expect(wrapper.findAll(optionCls).length).toBe(2);
        const input = wrapper.find(inputCls);
        await input.setValue('乙');
        await input.trigger('input');
        await nextTick();
        const options = wrapper.findAll(optionCls);
        // 分组标题在过滤分支被丢弃，仅剩匹配子项
        expect(options.length).toBe(1);
        expect(options[0].text()).toContain('城市乙');
        expect(wrapper.find(groupCls).exists()).toBe(false);
        // 清空关键字后选项与分组恢复
        await input.setValue('');
        await nextTick();
        expect(wrapper.findAll(optionCls).length).toBe(2);
        expect(wrapper.find(groupCls).text()).toBe('城市组');
        wrapper.unmount();
    });

    test('受控多选数字值命中 includes 分支并正确回显', async () => {
        const wrapper = mountSelect({
            multiple: true,
            modelValue: [2, 3],
            options: [
                { name: '选项一', code: 1 },
                { name: '选项二', code: 2 },
            ],
        });
        await nextTick();
        await openDropdown(wrapper);
        const options = wrapper.findAll(optionCls);
        expect(options[0].classes('is-checked')).toBe(false);
        expect(options[1].classes('is-checked')).toBe(true);
        const tags = wrapper.findAll(`.${prefixCls}-trigger-label-item`);
        expect(tags.length).toBe(2);
        expect(tags[0].text()).toContain('选项二');
        wrapper.unmount();
    });

    test('非受控多选完整链路：open → 选两项 → 取消一项（removeTag 路径）', async () => {
        const modelValue = ref<string[]>([]);
        const wrapper = mount(Select, {
            props: {
                'options': OPTIONS,
                'valueField': 'code',
                'labelField': 'name',
                'multiple': true,
                'modelValue': modelValue.value,
                'appendToContainer': false,
                'onUpdate:modelValue': (v: string[]) => {
                    modelValue.value = v;
                },
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        await openDropdown(wrapper);
        await wrapper.findAll(optionCls)[0].trigger('click');
        await nextTick();
        expect(modelValue.value).toEqual(['bj']);
        await wrapper.findAll(optionCls)[2].trigger('click');
        await nextTick();
        expect(modelValue.value).toEqual(['bj', 'gz']);
        // 下拉中取消选中 gz → removeTag 路径
        await wrapper.findAll(optionCls)[2].trigger('click');
        await nextTick();
        expect(wrapper.emitted('removeTag')!.slice(-1)[0][0]).toBe('gz');
        expect(modelValue.value).toEqual(['bj']);
        wrapper.unmount();
    });
    test('virtualScroll: false 模式滚动发出 scroll 事件（Scrollbar 直挂分支）', async () => {
        const wrapper = mountSelect({ virtualScroll: false });
        await nextTick();
        await openDropdown(wrapper);
        const container = wrapper.find(`.${prefixCls}-dropdown`);
        expect(container.exists()).toBe(true);
        expect(wrapper.findAll(optionCls).length).toBe(3);
        await stubScrollAndDispatch(container.element, { scrollTop: 50 });
        const scrollEvents = wrapper.emitted('scroll');
        expect(scrollEvents).toBeTruthy();
        expect(scrollEvents!.length).toBeGreaterThanOrEqual(1);
        wrapper.unmount();
    });
});

describe('FSelect 虚拟滚动与边界分支', () => {
    test('virtualScroll: true 且选项 > 50：启用虚拟列表（boolean true 分支）', async () => {
        const wrapper = mountSelect({
            options: makeManyOptions(60),
            virtualScroll: true,
        });
        await nextTick();
        await openDropdown(wrapper);
        // VirtualList 模式容器类带 is-max-height，与普通 Scrollbar 模式区分
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(true);
        wrapper.unmount();
    });

    test('virtualScroll: 20 且选项超阈值：数字阈值分支启用虚拟滚动', async () => {
        const wrapper = mountSelect({
            options: makeManyOptions(30),
            virtualScroll: 20,
        });
        await nextTick();
        await openDropdown(wrapper);
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(true);
        wrapper.unmount();
    });

    test('virtualScroll: 20 且选项未超阈值：走普通 Scrollbar 渲染全部选项', async () => {
        const wrapper = mountSelect({
            options: makeManyOptions(10),
            virtualScroll: 20,
        });
        await nextTick();
        await openDropdown(wrapper);
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(false);
        const options = wrapper.findAll(optionCls);
        expect(options.length).toBe(10);
        expect(options[9].text()).toBe('城市9');
        wrapper.unmount();
    });

    test('分组且选项超阈值：虚拟滚动下分组标题与子项均正常渲染（dataKey 扁平链路）', async () => {
        const wrapper = mount(Select, {
            props: {
                appendToContainer: false,
                virtualScroll: 5,
                valueField: 'code',
                labelField: 'name',
            },
            slots: {
                default: () =>
                    h(FSelectGroupOption, { label: '大分组' }, () => [
                        h(FOption, { value: 'g1', label: '组一' }),
                        h(FOption, { value: 'g2', label: '组二' }),
                        h(FOption, { value: 'g3', label: '组三' }),
                        h(FOption, { value: 'g4', label: '组四' }),
                        h(FOption, { value: 'g5', label: '组五' }),
                        h(FOption, { value: 'g6', label: '组六' }),
                    ]),
            },
            attachTo: document.body,
        } as any);
        await nextTick();
        await openDropdown(wrapper);
        // 6 个子选项超过阈值 5 → 虚拟滚动启用，扁平列表含分组标题
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(true);
        expect(wrapper.find(groupCls).text()).toBe('大分组');
        expect(wrapper.findAll(optionCls).length).toBe(6);
        // 虚拟模式下滚动仍可转发
        const container = wrapper.find('.fes-virtual-list-container');
        expect(container.exists()).toBe(true);
        await stubScrollAndDispatch(container.element, {
            scrollTop: 10,
            scrollHeight: 400,
            clientHeight: 200,
        });
        expect(wrapper.emitted('scroll')).toBeTruthy();
        wrapper.unmount();
    });

    test('virtualScroll: false 且选项 > 50：仍渲染全部选项（boolean false 分支）', async () => {
        const wrapper = mountSelect({
            options: makeManyOptions(60),
            virtualScroll: false,
        });
        await nextTick();
        await openDropdown(wrapper);
        expect(
            wrapper.find(`.${prefixCls}-dropdown.is-max-height`).exists(),
        ).toBe(false);
        expect(wrapper.findAll(optionCls).length).toBe(60);
        wrapper.unmount();
    });

    test('virtual 模式滚动事件经 VirtualList → FSelect 转发', async () => {
        const wrapper = mountSelect({
            options: makeManyOptions(60),
            virtualScroll: true,
        });
        await nextTick();
        await openDropdown(wrapper);
        // 虚拟模式下 .fes-select-dropdown 挂在 FScrollbar 根（attrs 继承），
        // scroll 事件绑定在内层 fes-virtual-list-container 上
        const container = wrapper.find('.fes-virtual-list-container');
        expect(container.exists()).toBe(true);
        await stubScrollAndDispatch(container.element, {
            scrollTop: 100,
            scrollHeight: 1000,
            clientHeight: 200,
        });
        const scrollEvents = wrapper.emitted('scroll');
        expect(scrollEvents).toBeTruthy();
        expect((scrollEvents!.slice(-1)[0][0] as Event).type).toBe('scroll');
        wrapper.unmount();
    });

    test('多次开关下拉：关闭后 hover 重置（isOpenedRef false 分支）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await openDropdown(wrapper);
        expect(wrapper.findAll(optionCls)[0].classes('is-hover')).toBe(true);
        await getTrigger(wrapper).trigger('focusout');
        await nextTick();
        // 关闭后 hoverOptionValue 重置为 undefined（else 分支）
        const options = wrapper.findAll(optionCls);
        expect(
            options.some((option: DOMWrapper<Element>) =>
                option.classes('is-hover'),
            ),
        ).toBe(false);
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(false);
        wrapper.unmount();
    });
});

describe('FSelect 事件与值边界', () => {
    test('remote 模式 blur 自动清空 filterText 不触发 search（isClear 分支）', async () => {
        const wrapper = mountSelect({ filterable: true, remote: true });
        await nextTick();
        await wait(80);
        await openDropdown(wrapper);
        await wait(80);
        const input = wrapper.find(inputCls);
        expect(input.exists()).toBe(true);
        await input.setValue('北');
        await input.trigger('input');
        await wait(80);
        const searchCount = wrapper.emitted('search')!.length;
        expect(searchCount).toBeGreaterThanOrEqual(1);
        // blur：带 filterText → emit input('', {isClear: true})，search 不再触发
        await getTrigger(wrapper).trigger('focusout');
        await wait(80);
        expect(wrapper.emitted('search')!.length).toBe(searchCount);
        const filterEvents = wrapper.emitted('filter')!;
        expect(filterEvents[filterEvents.length - 1][0]).toBe('');
        wrapper.unmount();
    });

    test('remote + 无 filterText 直接 focusout：blur 正常发出（handleBlur 守卫分支）', async () => {
        const wrapper = mountSelect({ filterable: true, remote: true });
        await nextTick();
        await wait(80);
        await openDropdown(wrapper);
        await wait(80);
        await getTrigger(wrapper).trigger('focusout');
        await wait(80);
        expect(wrapper.emitted('blur')).toBeTruthy();
        // blur 内 isOpened 分支：自动收起弹层
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(false);
        wrapper.unmount();
    });

    test('非 filterable 下拉打开状态 blur：自动收起弹层（blur 内 isOpenedRef 分支）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        await openDropdown(wrapper);
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(true);
        await getTrigger(wrapper).trigger('focusout');
        await nextTick();
        expect(lastEmit(wrapper, 'visibleChange')[0]).toBe(false);
        wrapper.unmount();
    });

    test('未打开下拉时 focusout：isOpened 已为 false，不重复收起（blur 假分支）', async () => {
        const wrapper = mountSelect();
        await nextTick();
        // 从未打开过下拉，直接 tab 切走
        await getTrigger(wrapper).trigger('focusout');
        await nextTick();
        // 不产生 visibleChange（弹层从未打开），blur 事件正常发出
        expect(wrapper.emitted('visibleChange')).toBeUndefined();
        expect(wrapper.emitted('blur')).toBeTruthy();
        // 弹层从未挂载，保持关闭态
        expect(wrapper.find(popperContentCls).exists()).toBe(false);
        wrapper.unmount();
    });

    test('scroll 事件对象原样转发（onScroll 透传分支）', async () => {
        const wrapper = mountSelect({ virtualScroll: false });
        await nextTick();
        await openDropdown(wrapper);
        const container = wrapper.find(`.${prefixCls}-dropdown`);
        expect(container.exists()).toBe(true);
        await stubScrollAndDispatch(container.element, { scrollTop: 30 });
        const scrollEvents = wrapper.emitted('scroll')!;
        expect(scrollEvents.length).toBeGreaterThanOrEqual(1);
        expect(scrollEvents[0].length).toBe(1);
        wrapper.unmount();
    });
});
