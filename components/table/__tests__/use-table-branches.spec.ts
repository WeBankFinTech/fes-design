import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import FTable from '../table';
import { wait } from '../../_util/__tests__/helpers';

describe('FTable data 非数组兜底（useTable isArray 分支）', () => {
    test('data 非数组时告警并兜底为空表', async () => {
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        const wrapper = mount(FTable, {
            props: {
                data: null as unknown as Record<string, unknown>[],
                rowKey: 'id',
                columns: [{ prop: 'name', label: '姓名' }],
            },
        });
        await nextTick();
        await wait();
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining('data must be array'),
        );
        // 兜底 showData=[]：表头渲染、无数据行
        expect(wrapper.findAll('tbody tr').length).toBe(0);
        wrapper.unmount();
        warnSpy.mockRestore();
    });

    test('data 为数组时正常渲染数据行（对照）', async () => {
        const wrapper = mount(FTable, {
            props: {
                data: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
                rowKey: 'id',
                columns: [{ prop: 'name', label: '姓名' }],
            },
        });
        await nextTick();
        await wait();
        expect(wrapper.findAll('tbody tr').length).toBe(2);
        expect(wrapper.text()).toContain('张三');
        expect(wrapper.text()).toContain('李四');
        wrapper.unmount();
    });
});
