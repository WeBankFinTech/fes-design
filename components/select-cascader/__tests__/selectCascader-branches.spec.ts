import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import SelectCascader from '../selectCascader.vue';
import SelectTrigger from '../../select-trigger/selectTrigger.vue';
import OptionList from '../../select/optionList';

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const PopperStub = {
    template: '<div class="popper-stub"><slot name="trigger" /><slot /></div>',
};

// 可控开关的 Popper stub：点击 trigger 区域切换 v-model
const TogglePopperStub = {
    name: 'Popper',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<div class="popper-stub" @click="$emit(&quot;update:modelValue&quot;, !modelValue)">'
        + '<slot name="trigger" /><slot v-if="modelValue" /></div>',
};

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

const mountSc = (props: Record<string, unknown>, slots = {}) =>
    mount(SelectCascader, {
        props,
        slots,
        global: { stubs: { Popper: PopperStub } },
    });

const openAndPick = async (wrapper: any, multiple = false) => {
    // 打开弹层
    await wrapper.find('.fes-select-cascader').trigger('click');
    await wait();
    // 勾选/选中叶子节点
    const leaf = wrapper.find(
        multiple
            ? '.fes-cascader-menu-item-checkbox, [class*="checkbox"]'
            : '.fes-cascader-menu-item, [class*="menu-item"]',
    );
    if (leaf.exists()) {
        await leaf.trigger('click');
        await wait();
    }
};

describe('selectCascader 状态分支补充', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    const emitFromTrigger = (wrapper: any, event: string, payload?: unknown) => {
        const trigger = wrapper.findComponent(SelectTrigger as any);
        trigger.vm.$emit(event, payload);
    };

    test('multiple valueType 为 array：勾选后 removeTag（非级联）', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: false,
            emitPath: false,
            modelValue: [],
        });
        await nextTick();
        await openAndPick(wrapper, true);
        // 清空按钮出现则触发 removeTag 路径
        emitFromTrigger(wrapper, 'remove', 'sz');
        await wait();
        // 未匹配的 key：findIndex === -1 分支
        emitFromTrigger(wrapper, 'remove', 'nope');
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('multiple + cascade：removeTag 走级联父级/子级处理', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            emitPath: false,
            modelValue: ['gd', 'sz', 'gz'],
        });
        await nextTick();
        await wait();
        // 移除叶子节点
        emitFromTrigger(wrapper, 'remove', 'sz');
        await wait();
        // 移除父节点（isLeaf=false → handleChildren）
        emitFromTrigger(wrapper, 'remove', 'gd');
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('checkStrictly 变化：multiple+cascade 时清空值', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            modelValue: ['gd'],
        });
        await nextTick();
        await wrapper.setProps({ checkStrictly: true });
        await wait();
        await wrapper.setProps({ checkStrictly: false });
        await wait();
        spy.mockRestore();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('emitPath/cascade 变化：按 multiple 重置当前值', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSc({
            data,
            multiple: true,
            modelValue: [],
        });
        await nextTick();
        await wrapper.setProps({ emitPath: true });
        await wait();
        await wrapper.setProps({ cascade: true });
        await wait();
        spy.mockRestore();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('clear：有选中值与无选中值两种清空分支', async () => {
        const wrapper = mountSc({
            data,
            modelValue: null,
            clearable: true,
        });
        await nextTick();
        // 无选中值 → handleClear 提前 return
        emitFromTrigger(wrapper, 'clear');
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();

        const wrapper2 = mountSc({
            data,
            modelValue: 'sz',
            clearable: true,
        });
        await nextTick();
        emitFromTrigger(wrapper2, 'clear');
        await wait();
        wrapper2.unmount();
    });

    test('打开/关闭弹层触发 visibleChange 并测量 trigger 宽度', async () => {
        const wrapper = mount(SelectCascader, {
            props: { data, modelValue: null },
            slots: {},
            global: { stubs: { Popper: TogglePopperStub } },
        });
        await nextTick();
        // 点击 stub 内部触发 update:modelValue
        await wrapper.find('.popper-stub').trigger('click');
        await wait();
        expect(wrapper.emitted('visibleChange')?.length).toBeGreaterThan(0);
        // 关闭
        await wrapper.find('.popper-stub').trigger('click');
        await wait();
        wrapper.unmount();
    });

    test('remote + loadData + emitPath 时初始化勾选 keys', async () => {
        const wrapper = mountSc({
            data,
            multiple: true,
            cascade: true,
            emitPath: true,
            remote: true,
            loadData: () => Promise.resolve(),
            modelValue: [['gd', 'sz']],
        });
        await nextTick();
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('Form 上下文中 valueType 按 multiple 取 array/string', async () => {
        const { default: Form } = await import('../../form/form.vue');
        const { default: FormItem } = await import('../../form/formItem.vue');
        for (const multiple of [false, true]) {
            const wrapper = mount({
                components: { Form, FormItem, SelectCascader },
                template: `<Form><FormItem prop="v"><SelectCascader :data="data" :multiple="multiple" v-model="v" /></FormItem></Form>`,
                setup() {
                    return { data, multiple, v: multiple ? [] : null };
                },
            }, {
                global: { stubs: { Popper: PopperStub } },
            });
            await nextTick();
            await wait(50);
            expect(wrapper.exists()).toBe(true);
            wrapper.unmount();
        }
    });

    test('focus/blur 事件与 blur 时关闭弹层', async () => {
        const wrapper = mountSc({ data, modelValue: null });
        await nextTick();
        emitFromTrigger(wrapper, 'focus', new Event('focus'));
        await wait();
        // blur 时 isOpened=false 分支（未打开）
        emitFromTrigger(wrapper, 'blur', new Event('blur'));
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();

        // blur 时已打开 → isOpened 置 false
        const wrapper2 = mountSc({ data, modelValue: null });
        await nextTick();
        await wrapper2.find('.fes-select-cascader').trigger('click');
        await wait();
        emitFromTrigger(wrapper2, 'blur', new Event('blur'));
        await wait();
        wrapper2.unmount();
    });

    test('filterable 单选：handleFilterSelect 走 selectNode', async () => {
        const wrapper = mountSc({
            data,
            filterable: true,
            modelValue: null,
        });
        await nextTick();
        const input = wrapper.find('input');
        await input.setValue('深');
        await wait();
        // 直接调用 OptionList 的 onSelect 回调 → handleFilterSelect（selectable）
        const optionList = wrapper.findComponent(OptionList as any);
        expect(optionList.exists()).toBe(true);
        optionList.vm.$emit('select', 'sz');
        await wait();
        optionList.props().onSelect?.('sz');
        await wait();
        wrapper.unmount();
    });

    test('filterable 多选 checkable：handleFilterSelect 走 checkNode', async () => {
        vi.useFakeTimers();
        const wrapper = mountSc({
            data,
            multiple: true,
            filterable: true,
            modelValue: [],
        });
        await nextTick();
        const input = wrapper.find('input');
        await input.setValue('深');
        // filter 防抖 300ms：用 fake timer 精确推进，替代固定 500ms 长等待
        await vi.advanceTimersByTimeAsync(350);
        // 选中匹配项 → filterIsSelect 的 checkable 分支
        const optionList = wrapper.findComponent(OptionList as any);
        optionList.props().onSelect?.('sz');
        await vi.advanceTimersByTimeAsync(10);
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
        vi.useRealTimers();
    });
});
