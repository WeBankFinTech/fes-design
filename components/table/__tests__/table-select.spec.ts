import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import Table from '../table';

const data = [
    { id: 1, name: '张三', address: '地址 1' },
    { id: 2, name: '李四', address: '地址 2' },
    { id: 3, name: '王五', address: '地址 3' },
];

const getTableVm = async (props) => {
    const wrapper = mount(Table, {
        props: {
            data,
            rowKey: 'id',
            columns: [
                { type: 'selection', ...props.selectionColumn },
                { prop: 'name', label: '姓名' },
                { prop: 'address', label: '地址' },
            ],
            ...props.rest,
        },
    });
    await nextTick();
    return wrapper;
};

const getBodyRadios = (wrapper) => wrapper.findAll('.fes-table-body .fes-radio');

describe('Table 行选择', () => {
    describe('单选模式（multiple=false）', () => {
        test('选中另一行时替换旧选中，至多只有一行被选中', async () => {
            const wrapper = await getTableVm({
                selectionColumn: { multiple: false },
            });
            const radios = getBodyRadios(wrapper);
            expect(radios.length).toBe(3);

            await radios[0].trigger('click');
            await nextTick();
            expect(radios[0].classes()).toContain('is-checked');
            expect(
                wrapper.findAll('.fes-table-body .fes-radio.is-checked').length,
            ).toBe(1);

            // 点击另一行：应替换旧选中，而不是累加
            await radios[2].trigger('click');
            await nextTick();
            const checked = wrapper.findAll(
                '.fes-table-body .fes-radio.is-checked',
            );
            expect(checked.length).toBe(1);
            expect(checked[0].element).toBe(radios[2].element);

            wrapper.unmount();
        });

        test('再次点击已选中的行取消选中', async () => {
            const wrapper = await getTableVm({
                selectionColumn: { multiple: false },
            });
            const radios = getBodyRadios(wrapper);

            await radios[0].trigger('click');
            await nextTick();
            expect(radios[0].classes()).toContain('is-checked');

            await radios[0].trigger('click');
            await nextTick();
            expect(
                wrapper.findAll('.fes-table-body .fes-radio.is-checked').length,
            ).toBe(0);

            wrapper.unmount();
        });

        test('点击禁用行不改变选中状态', async () => {
            const wrapper = await getTableVm({
                selectionColumn: {
                    multiple: false,
                    selectable: ({ rowIndex }) => rowIndex !== 1,
                },
            });
            const radios = getBodyRadios(wrapper);
            expect(radios[1].classes()).toContain('is-disabled');

            await radios[1].trigger('click');
            await nextTick();
            expect(
                wrapper.findAll('.fes-table-body .fes-radio.is-checked').length,
            ).toBe(0);

            wrapper.unmount();
        });

        test('v-model:checkedKeys 始终至多包含一个 key，并触发 selectionChange', async () => {
            const wrapper = await getTableVm({
                selectionColumn: { multiple: false },
            });
            const radios = getBodyRadios(wrapper);

            await radios[0].trigger('click');
            await nextTick();
            expect(
                wrapper.emitted('update:checkedKeys')?.at(-1)?.[0],
            ).toEqual([1]);

            await radios[2].trigger('click');
            await nextTick();
            expect(
                wrapper.emitted('update:checkedKeys')?.at(-1)?.[0],
            ).toEqual([3]);
            expect(
                wrapper.emitted('selectionChange')?.at(-1)?.[0],
            ).toEqual([3]);

            wrapper.unmount();
        });

        test('toggleRowSelection 方法在单选模式下同样只保留一行', async () => {
            const wrapper = await getTableVm({
                selectionColumn: { multiple: false },
            });
            wrapper.vm.toggleRowSelection({ row: data[0] });
            await nextTick();
            expect(
                wrapper.emitted('selectionChange')?.at(-1)?.[0],
            ).toEqual([1]);

            wrapper.vm.toggleRowSelection({ row: data[2] });
            await nextTick();
            expect(
                wrapper.emitted('selectionChange')?.at(-1)?.[0],
            ).toEqual([3]);
            expect(
                wrapper.findAll('.fes-table-body .fes-radio.is-checked').length,
            ).toBe(1);

            wrapper.unmount();
        });
    });

    describe('多选模式（multiple 默认 true）', () => {
        test('可以同时选中多行', async () => {
            const wrapper = await getTableVm({ selectionColumn: {} });
            const checkboxes = wrapper.findAll(
                '.fes-table-body tbody .fes-checkbox',
            );
            expect(checkboxes.length).toBe(3);

            await checkboxes[0].trigger('click');
            await checkboxes[2].trigger('click');
            await nextTick();
            expect(
                wrapper.emitted('selectionChange')?.at(-1)?.[0],
            ).toEqual([1, 3]);
            expect(
                wrapper.findAll(
                    '.fes-table-body tbody .fes-checkbox.is-checked',
                ).length,
            ).toBe(2);

            wrapper.unmount();
        });
    });
});
