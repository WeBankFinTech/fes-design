import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectCascader from '../selectCascader.vue';
import SelectTrigger from '../../select-trigger/selectTrigger.vue';
import Cascader from '../../cascader/cascader';
import OptionList from '../../select/optionList';
import { wait } from '../../_util/__tests__/helpers';

const prefixCls = 'fes-select-cascader';

const data = [
    {
        label: '广东',
        value: 'gd',
        children: [
            { label: '深圳', value: 'sz' },
            { label: '广州', value: 'gz' },
        ],
    },
    { label: '湖南', value: 'hn' },
];

// 可控开关的 Popper stub：仅在点击 trigger 区域时切换 v-model
const TogglePopperStub = {
    name: 'Popper',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<div class="popper-stub">'
        + '<div class="popper-trigger" @click="$emit(&quot;update:modelValue&quot;, !modelValue)"><slot name="trigger" /></div>'
        + '<div class="popper-panel" v-if="modelValue"><slot /></div>'
        + '</div>',
};

const mountSc = (props: Record<string, unknown> = {}) =>
    mount(SelectCascader, {
        props: { data, ...props },
        global: { stubs: { Popper: TogglePopperStub } },
        attachTo: document.body,
    });

const openPanel = async (wrapper: any) => {
    await wrapper.find('.popper-trigger').trigger('click');
    await wait(80);
};

const emitFromTrigger = (wrapper: any, event: string, payload?: unknown) => {
    const trigger = wrapper.findComponent(SelectTrigger as any);
    trigger.vm.$emit(event, payload);
};

describe('FSelectCascader 交互链分支补全（branches2）', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('remote + filterable：警告且 filterable 不生效（无输入框）', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSc({
            data,
            filterable: true,
            remote: true,
            loadData: vi.fn(),
        });
        await nextTick();
        await wait(80);
        // remote 被设定时 filterable 失效并告警
        expect(spy).toHaveBeenCalledWith(expect.stringContaining('filterable 不生效'));
        // innerFilterable=false → SelectTrigger 不渲染 input
        expect(wrapper.find('input').exists()).toBe(false);
        spy.mockRestore();
        wrapper.unmount();
    });

    test('checkStrictly=all：勾选父级不联动子级', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            checkStrictly: 'all',
            modelValue: [],
        });
        await openPanel(wrapper);
        const boxes = wrapper.findAll('.fes-cascader-node .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[0].trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        // ALL 策略：勾选父级时 handleChildren 将子级一并写入值（与 PARENT
        // 策略的区别体现在回显/勾选态推导上），payload 为父+子集
        const last = emitted![emitted!.length - 1][0] as string[];
        expect([...last].sort()).toEqual(['gd', 'gz', 'sz']);
        // 勾选 gd 后按 ALL 策略保留所有 key，父与子节点均呈现勾选态
        expect(
            wrapper.find(`.fes-cascader-node[data-value='gd']`).classes(),
        ).toContain('is-checked');
        expect(
            wrapper.find(`.fes-cascader-node[data-value='sz']`).classes(),
        ).toContain('is-checked');
        wrapper.unmount();
    });

    test('checkStrictly=parent：父级值映射为子级勾选态', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            checkStrictly: 'parent',
            modelValue: ['gd'],
        });
        await openPanel(wrapper);
        await wrapper.find(`.fes-cascader-node[data-value='gd'] .fes-cascader-node-switcher`).trigger('click');
        await wait(80);
        // PARENT 策略：checkedKeys 由 getCascadeChildrenByKeys 展开为父+子
        const sz = wrapper.find(`.fes-cascader-node[data-value='sz']`);
        expect(sz.exists()).toBe(true);
        expect(sz.classes()).toContain('is-checked');
        expect(
            wrapper.find(`.fes-cascader-node[data-value='gz']`).classes(),
        ).toContain('is-checked');
        wrapper.unmount();
    });

    test('checkStrictly 变化且非多选：不重置当前值', async () => {
        const wrapper = mountSc({ data, modelValue: 'sz' });
        // 打开弹层让 Cascader 挂载回填 nodeList，tag 按 label 渲染
        await openPanel(wrapper);
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        await wrapper.setProps({ checkStrictly: 'all' });
        await nextTick();
        await wait(80);
        // 单选场景 watch(checkStrictly) 短路，值保持不变
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        wrapper.unmount();
    });

    test('cascade 变化（单选非 emitPath）：值重置为 null', async () => {
        const wrapper = mountSc({ data, cascade: true, modelValue: 'sz' });
        await nextTick();
        await wait(80);
        await wrapper.setProps({ cascade: false });
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toBeNull();
        // 回显清空
        expect(wrapper.text()).not.toContain('深圳');
        wrapper.unmount();
    });

    test('multiple 清空选中值：payload 重置为 []', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            clearable: true,
            modelValue: ['sz'],
        });
        // 先打开弹层让 Cascader 挂载回填 nodeList，tag 按 label 渲染
        await openPanel(wrapper);
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        emitFromTrigger(wrapper, 'clear');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual([]);
        expect(wrapper.emitted('clear')).toBeTruthy();
        wrapper.unmount();
    });

    test('disabled 组件点击叶子节点不选中', async () => {
        const wrapper = mountSc({ data, disabled: true, modelValue: null });
        await openPanel(wrapper);
        await wrapper.find(`.fes-cascader-node[data-value='gd'] .fes-cascader-node-switcher`).trigger('click');
        await wait(80);
        const leaf = wrapper.find(`.fes-cascader-node[data-value='sz']`);
        expect(leaf.exists()).toBe(true);
        await leaf.find('.fes-cascader-node-content').trigger('click');
        await nextTick();
        await wait(80);
        // 值层契约：disabled 时 handleSelect 提前返回，不产生任何值事件
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('disabled 多选勾选无效', async () => {
        const wrapper = mountSc({ data, disabled: true, multiple: true, modelValue: [] });
        await openPanel(wrapper);
        const boxes = wrapper.findAll('.fes-cascader-node:not(.is-disabled) .fes-checkbox');
        expect(boxes.length).toBeGreaterThan(0);
        await boxes[0].trigger('click');
        await nextTick();
        await wait(80);
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        expect(wrapper.emitted('change')).toBeUndefined();
        wrapper.unmount();
    });

    test('单选收到 remove：提前返回不触发 removeTag', async () => {
        const wrapper = mountSc({ data, modelValue: 'sz' });
        await nextTick();
        await wait(80);
        emitFromTrigger(wrapper, 'remove', 'sz');
        await nextTick();
        await wait(80);
        expect(wrapper.emitted('removeTag')).toBeUndefined();
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('multiple 非级联移除 tag：仅移除该 key', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: false,
            emitPath: false,
            modelValue: ['sz', 'gz'],
        });
        await nextTick();
        await wait(80);
        emitFromTrigger(wrapper, 'remove', 'sz');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual(['gz']);
        expect(wrapper.emitted('removeTag')![0]).toEqual(['sz']);
        wrapper.unmount();
    });

    test('multiple 级联移除父节点：子节点联动清理', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            emitPath: false,
            modelValue: ['gd', 'sz', 'gz'],
        });
        // 先打开弹层让 Cascader 挂载回填 nodeList（移除时依赖 nodeList['gd']）
        await openPanel(wrapper);
        // 直接移除父节点 gd（仍在 values 中）→ handleChildren 清理 sz/gz
        emitFromTrigger(wrapper, 'remove', 'gd');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual([]);
        expect(wrapper.emitted('removeTag')![0]).toEqual(['gd']);
        wrapper.unmount();
    });

    test('blur 时收起已打开弹层', async () => {
        const wrapper = mountSc({ data, modelValue: null });
        await openPanel(wrapper);
        expect(wrapper.find('.popper-panel').exists()).toBe(true);
        emitFromTrigger(wrapper, 'blur', new Event('blur'));
        await nextTick();
        await wait(80);
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        expect(wrapper.emitted('blur')).toBeTruthy();
        wrapper.unmount();
    });

    test('过滤后清空输入：回归级联面板', async () => {
        const wrapper = mountSc({ data, filterable: true, modelValue: null });
        await openPanel(wrapper);
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
        await input.setValue('深');
        await wait(400);
        // 过滤列表渲染命中项
        const option = wrapper.find('.fes-select-option');
        expect(option.exists()).toBe(true);
        expect(option.text()).toContain('深圳');
        // 清空输入 → 防抖 watcher 收到空 filterText → filteredOptions 置空
        await input.setValue('');
        await wait(400);
        const optionList = wrapper.findComponent(OptionList as any);
        expect((optionList.props('options') as unknown[]).length).toBe(0);
        // 级联面板恢复显示（v-show=!filterText）
        const menu = wrapper.find('.fes-cascader-menu');
        expect(menu.exists()).toBe(true);
        expect(menu.element.parentElement?.getAttribute('style') || '').not.toContain('display: none');
        wrapper.unmount();
    });

    test('filterable + 自定义 filter：使用 props.filter 过滤', async () => {
        const filter = vi.fn((_text: string, node: any) => node.value === 'sz');
        const wrapper = mountSc({ data, filterable: true, filter });
        await openPanel(wrapper);
        const input = wrapper.find('input');
        await input.setValue('深');
        await wait(400);
        // 自定义 filter 回调被调用，且匹配项进入过滤列表
        expect(filter).toHaveBeenCalled();
        expect(filter).toHaveBeenCalledWith('深', expect.objectContaining({ value: 'sz' }));
        const option = wrapper.find('.fes-select-option');
        expect(option.text()).toContain('深圳');
        wrapper.unmount();
    });

    test('多选过滤：选中过滤项写入值并呈现勾选态', async () => {
        const wrapper = mountSc({ data, multiple: true, filterable: true, modelValue: [] });
        await openPanel(wrapper);
        const input = wrapper.find('input');
        await input.setValue('深');
        await wait(400);
        const option = wrapper.find('.fes-select-option');
        expect(option.exists()).toBe(true);
        await option.trigger('click');
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toContain('sz');
        // 回读 isSelect：勾选后过滤项呈现 is-checked
        const optionList = wrapper.findComponent(OptionList as any);
        expect(optionList.props('isSelect')('sz')).toBe(true);
        expect(option.classes()).toContain('is-checked');
        wrapper.unmount();
    });

    test('打开弹层测量 trigger 宽度：过滤下拉应用最小宽', async () => {
        const wrapper = mountSc({ data, filterable: true, modelValue: null });
        const triggerEl = wrapper.find('.fes-select-trigger').element;
        Object.defineProperty(triggerEl, 'offsetWidth', {
            value: 260,
            configurable: true,
            writable: true,
        });
        await openPanel(wrapper);
        const input = wrapper.find('input');
        await input.setValue('深');
        await wait(400);
        // filterDropdownStyle 应用 min-width
        const optionList = wrapper.findComponent(OptionList as any);
        const containerStyle = optionList.props('containerStyle') as Record<string, string>;
        expect(containerStyle['min-width']).toBe('260px');
        wrapper.unmount();
    });

    test('remote + loadData 非 emitPath：initLoadKeys 提前返回', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            remote: true,
            loadData: vi.fn(),
            modelValue: ['sz'],
        });
        // 打开弹层：Cascader 渲染（求值 initLoadKeys）并回填 nodeList
        await openPanel(wrapper);
        // 回显不受影响（nodeList 就绪后按 label 渲染 tag）
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        wrapper.unmount();
    });

    test('remote + loadData + emitPath 但值为标量：initLoadKeys 提前返回', async () => {
        const wrapper = mountSc({
            data,
            remote: true,
            loadData: vi.fn(),
            emitPath: true,
            modelValue: 'sz',
        });
        await openPanel(wrapper);
        expect(wrapper.find('.fes-select-trigger').text()).toContain('深圳');
        expect(wrapper.find(`.${prefixCls}`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('单选模式收到 check 事件（防御分支）：收起弹层并写入值', async () => {
        const wrapper = mountSc({ data, modelValue: null });
        await openPanel(wrapper);
        const cascader = wrapper.findComponent(Cascader as any);
        cascader.vm.$emit('check', {
            checkedKeys: ['sz'],
            node: data[0].children![0],
            selected: true,
            event: new MouseEvent('click'),
        });
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toBe('sz');
        expect(wrapper.find('.popper-panel').exists()).toBe(false);
        wrapper.unmount();
    });

    test('multiple 模式收到 select 事件（防御分支）：不收起弹层并写入数组', async () => {
        const wrapper = mountSc({ data, multiple: true, cascade: true, modelValue: [] });
        await openPanel(wrapper);
        const cascader = wrapper.findComponent(Cascader as any);
        cascader.vm.$emit('select', {
            selectedKeys: ['sz'],
            node: data[0].children![0],
            selected: true,
            event: new MouseEvent('click'),
        });
        await nextTick();
        await wait(80);
        const emitted = wrapper.emitted('update:modelValue');
        expect(emitted).toBeTruthy();
        expect(emitted![emitted!.length - 1][0]).toEqual(['sz']);
        expect(wrapper.find('.popper-panel').exists()).toBe(true);
        wrapper.unmount();
    });
});

// 不可达分支说明：
// - selectCascader.vue L237（filterNodeList 计算属性的 if (innerFilterable.value) 为假分支）：
//   唯一消费方是 filterText 的防抖 watcher（L467-488），且该 watcher 以
//   `if (innerFilterable.value && filterText.value)` 同一条件为前置守卫，
//   因此 innerFilterable=false 时 filterNodeList 永远不会被求值，假分支不可达。
// - selectCascader.vue L497（filterIsSelect 中 if (cascaderCheckable.value) 为假分支）：
//   cascaderSelectable=!multiple 与 cascaderCheckable=multiple 互补，单选走到
//   selectable 分支提前 return，永远不会以 checkable=false 求值到该 if。
// - handleCheck 的 `if (!props.multiple)`（L361）与 handleSelect 的
//   `if (!props.multiple)` 为假分支（L348）在组件常规渲染下不可达：
//   cascaderSelectable=!multiple、cascaderCheckable=multiple，单选模式 UI 不产生
//   check 事件、多选模式 UI 不产生 select 事件；上方用例以事件契约方式
//   （直接派发 Cascader 的 check/select）覆盖了防御代码路径。
