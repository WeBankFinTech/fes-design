import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import { FTable } from '../index';

describe('Table selection - issue #968', () => {
    it('single-select mode: clicking multiple rows selects only one', async () => {
        const data = [
            { id: 1, name: 'Row 1' },
            { id: 2, name: 'Row 2' },
            { id: 3, name: 'Row 3' },
        ];

        const columns = [
            {
                type: 'selection',
                multiple: false,
            },
            {
                label: 'Name',
                prop: 'name',
            },
        ];

        const wrapper = mount(FTable, {
            props: {
                rowKey: 'id',
                checkedKeys: [] as number[],
                data,
                columns,
            },
            attachTo: document.body,
        });

        await wrapper.vm.$nextTick();

        const initialKeys = wrapper.props('checkedKeys');
        expect(initialKeys).toEqual([]);

        const vm = wrapper.vm as any;
        const exposed = (vm as any).$exposed;
        expect(exposed).toBeDefined();
        const { toggleRowSelection } = exposed;

        expect(toggleRowSelection).toBeDefined();

        toggleRowSelection({ id: 1, name: 'Row 1' });
        await wrapper.vm.$nextTick();
        expect(wrapper.props('checkedKeys')).toEqual([1]);

        toggleRowSelection({ id: 3, name: 'Row 3' });
        await wrapper.vm.$nextTick();
        expect(wrapper.props('checkedKeys')).toEqual([3]);

        wrapper.unmount();
    });

    it('multi-select mode: clicking multiple rows selects all clicked', async () => {
        const data = [
            { id: 1, name: 'Row 1' },
            { id: 2, name: 'Row 2' },
            { id: 3, name: 'Row 3' },
        ];

        const columns = [
            {
                type: 'selection',
                multiple: true,
            },
            {
                label: 'Name',
                prop: 'name',
            },
        ];

        const wrapper = mount(FTable, {
            props: {
                rowKey: 'id',
                checkedKeys: [] as number[],
                data,
                columns,
            },
            attachTo: document.body,
        });

        await wrapper.vm.$nextTick();

        const vm = wrapper.vm as any;
        const exposed = (vm as any).$exposed;
        expect(exposed).toBeDefined();
        const { toggleRowSelection } = exposed;

        expect(toggleRowSelection).toBeDefined();

        toggleRowSelection({ id: 1, name: 'Row 1' });
        await wrapper.vm.$nextTick();
        expect(wrapper.props('checkedKeys')).toEqual([1]);

        toggleRowSelection({ id: 3, name: 'Row 3' });
        await wrapper.vm.$nextTick();
        expect(wrapper.props('checkedKeys')).toEqual([1, 3]);

        wrapper.unmount();
    });
});
