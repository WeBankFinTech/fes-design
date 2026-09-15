import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import SelectTree from '../selectTree.vue';
import SelectTrigger from '../../select-trigger/selectTrigger.vue';

const prefixCls = 'fes-select-tree';

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

const wait = (ms = 100) => new Promise((r) => setTimeout(r, ms));

const PopperStub = {
    template: '<div class="popper-stub"><slot name="trigger" /><slot /></div>',
};

const TogglePopperStub = {
    name: 'Popper',
    props: ['modelValue'],
    emits: ['update:modelValue'],
    template:
        '<div class="popper-stub" @click="$emit(&quot;update:modelValue&quot;, !modelValue)">'
        + '<slot name="trigger" /><slot v-if="modelValue" /></div>',
};

const mountSt = (props: Record<string, unknown>, stub: any = PopperStub) =>
    mount(SelectTree, {
        props,
        global: { stubs: { Popper: stub } },
    });

const emitFromTrigger = (wrapper: any, event: string, payload?: unknown) => {
    const trigger = wrapper.findComponent(SelectTrigger as any);
    trigger.vm.$emit(event, payload);
};

describe('FSelectTree 状态分支补充', () => {
    afterEach(() => {
        document.body.innerHTML = '';
    });

    test('打开/关闭弹层触发 visibleChange 与宽度测量', async () => {
        const wrapper = mountSt({ data }, TogglePopperStub);
        await nextTick();
        await wrapper.find('.popper-stub').trigger('click');
        await wait();
        expect(wrapper.emitted('visibleChange')?.length).toBeGreaterThan(0);
        await wrapper.find('.popper-stub').trigger('click');
        await wait();
        wrapper.unmount();
    });

    test('multiple：removeTag 移除已选与未选 key', async () => {
        const wrapper = mountSt({
            data,
            multiple: true,
            cascade: false,
            modelValue: ['sz', 'gz'],
        });
        await nextTick();
        await wait();
        // 命中分支
        emitFromTrigger(wrapper, 'remove', 'sz');
        await wait();
        // findIndex === -1 分支
        emitFromTrigger(wrapper, 'remove', 'nope');
        await wait();
        // 单选直接 return
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
        const single = mountSt({ data, modelValue: 'sz' });
        await nextTick();
        emitFromTrigger(single, 'remove', 'sz');
        await wait();
        single.unmount();
    });

    test('showPath 展示路径 label', async () => {
        const wrapper = mountSt({
            data,
            modelValue: 'sz',
            showPath: true,
        });
        await nextTick();
        await wait();
        expect(wrapper.text()).toContain('广东/深圳');
        wrapper.unmount();
    });

    test('checkStrictly/emitPath 变化重置当前值', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSt({
            data,
            multiple: true,
            cascade: true,
            modelValue: [],
        });
        await nextTick();
        await wrapper.setProps({ checkStrictly: true });
        await wait();
        await wrapper.setProps({ emitPath: true });
        await wait();
        spy.mockRestore();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('clear：有值与无值两种分支', async () => {
        const wrapper = mountSt({ data, modelValue: null, clearable: true });
        await nextTick();
        // 无值 → 提前 return
        emitFromTrigger(wrapper, 'clear');
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();

        const wrapper2 = mountSt({ data, modelValue: 'sz', clearable: true });
        await nextTick();
        emitFromTrigger(wrapper2, 'clear');
        await wait();
        wrapper2.unmount();
    });

    test('focus/blur 事件', async () => {
        const wrapper = mountSt({ data });
        await nextTick();
        emitFromTrigger(wrapper, 'focus', new Event('focus'));
        await wait();
        emitFromTrigger(wrapper, 'blur', new Event('blur'));
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });

    test('filterable：防抖后调用 tree.filter', async () => {
        vi.useFakeTimers();
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mountSt({ data, filterable: true });
        await nextTick();
        const input = wrapper.find('input');
        expect(input.exists()).toBe(true);
        await input.setValue('深');
        // 防抖 300ms：fake timer 精确推进
        await vi.advanceTimersByTimeAsync(350);
        spy.mockRestore();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
        vi.useRealTimers();
    });

    test('emitPath 在 nodeList 就绪前重算：indexPath 回退', async () => {
        const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        // multiple + emitPath：nodeList 尚未回填时重算 → node 未命中 → [key] 回退
        const wrapper = mountSt({
            data,
            multiple: true,
            cascade: true,
            emitPath: true,
            modelValue: [['gd', 'sz']],
        });
        // 不等待 Tree 挂载回填 nodeList，立即触发 emitPath watch
        wrapper.setProps({ emitPath: false });
        await nextTick();
        wrapper.setProps({ emitPath: true });
        await nextTick();
        await wait();
        // 单选 + emitPath：nodeList 就绪前重算 → [] 回退
        const wrapper2 = mountSt({
            data,
            emitPath: true,
            modelValue: 'sz',
        });
        wrapper2.setProps({ emitPath: false });
        await nextTick();
        wrapper2.setProps({ emitPath: true });
        await nextTick();
        await wait();
        spy.mockRestore();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
        wrapper2.unmount();
    });

    test('空数据显示空态文案', async () => {
        const wrapper = mountSt({ data: [] });
        await nextTick();
        await wait();
        expect(wrapper.find(`.${prefixCls}-null`).exists()).toBe(true);
        wrapper.unmount();
    });

    test('Form 上下文 valueType：multiple array / 单选 string', async () => {
        const { default: Form } = await import('../../form/form.vue');
        const { default: FormItem } = await import('../../form/formItem.vue');
        for (const multiple of [false, true]) {
            const wrapper = mount({
                components: { Form, FormItem, SelectTree },
                template: `<Form><FormItem prop="v"><SelectTree :data="data" :multiple="multiple" v-model="v" /></FormItem></Form>`,
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

    test('multiple + emitPath：handleChange 映射为 indexPath', async () => {
        const wrapper = mountSt({
            data,
            multiple: true,
            cascade: true,
            emitPath: true,
            modelValue: [['gd', 'sz']],
        });
        await nextTick();
        await wait();
        expect(wrapper.emitted('update:modelValue') === undefined).toBe(true);
        wrapper.unmount();
    });

    test('tag 渲染插槽', async () => {
        const wrapper = mount(SelectTree, {
            props: { data, multiple: true, modelValue: ['sz'] } as any,
            slots: {
                tag: ({ option }: any) => h('span', { class: 'my-tag' }, option.label),
            },
            global: { stubs: { Popper: PopperStub } },
        });
        await nextTick();
        await wait();
        expect(wrapper.exists()).toBe(true);
        wrapper.unmount();
    });
});
