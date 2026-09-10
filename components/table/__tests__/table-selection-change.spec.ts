import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import Table from '../table.tsx';

// Issue #812: v-model:checkedKeys 程序性变化不应触发 selectionChange
// selectionChange 仅由用户交互（行勾选 / 全选）触发

const mountTable = () => {
    const checkedKeys = ref<string[]>([]);
    const changeEvents: string[][] = [];
    const wrapper = mount(defineComponent({
        setup() {
            return () => h(Table, {
                'rowKey': 'name',
                'columns': [{ type: 'selection' }, { title: '名称', key: 'name' }],
                'data': [{ name: 'a' }, { name: 'b' }, { name: 'c' }],
                'checkedKeys': checkedKeys.value,
                'onUpdate:checkedKeys': (v: string[]) => {
                    checkedKeys.value = v;
                },
                'onSelectionChange': (v: string[]) => {
                    changeEvents.push([...v]);
                },
            });
        },
    }));
    return { wrapper, checkedKeys, changeEvents };
};

describe('#812 selectionChange 触发语义', () => {
    test('外部程序性修改 checkedKeys 不触发 selectionChange', async () => {
        const { checkedKeys, changeEvents, wrapper } = mountTable();
        await nextTick();
        expect(changeEvents.length).toBe(0);

        checkedKeys.value = ['a'];
        await nextTick();
        await nextTick();
        // 修复前：watch(deep) 触发 1 次；修复后：不应触发
        expect(changeEvents.length).toBe(0);
        // 但勾选状态本身已生效
        expect(checkedKeys.value).toEqual(['a']);
        wrapper.unmount();
    });

    test('用户点击行勾选仍触发 selectionChange（回归守护）', async () => {
        const { changeEvents, wrapper } = mountTable();
        await nextTick();
        const options = wrapper.findAll('.fes-checkbox, .fes-radio');
        expect(options.length).toBeGreaterThan(1);
        await options[1].trigger('click');
        await nextTick();
        await nextTick();
        expect(changeEvents.length).toBe(1);
        expect(changeEvents[0]).toEqual(['a']);
        wrapper.unmount();
    });

    test('用户点击全选触发 selectionChange（回归守护）', async () => {
        const { changeEvents, wrapper } = mountTable();
        await nextTick();
        // 表头全选 checkbox 是第一个
        const options = wrapper.findAll('.fes-checkbox, .fes-radio');
        await options[0].trigger('click');
        await nextTick();
        await nextTick();
        expect(changeEvents.length).toBe(1);
        expect(changeEvents[0]).toEqual(['a', 'b', 'c']);
        wrapper.unmount();
    });
});
