import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FTableCell from '../components/cell';
import { provideKey } from '../const';

const mockColumn = {
    id: 1,
    props: {
        action: [],
    },
    slots: {},
} as any;

describe('FTableCell action type', () => {
    it('renders action with default primary type when no type is provided', () => {
        const mockColumnWithDefaultAction = {
            ...mockColumn,
            props: {
                action: [
                    {
                        label: 'Edit',
                        func: vi.fn(),
                    },
                ],
            },
        } as any;
        const mockRow = { id: 1 };
        const wrapper = mount(FTableCell, {
            props: {
                row: mockRow,
                rowIndex: 0,
                column: mockColumnWithDefaultAction,
                columnIndex: 0,
                cellValue: null,
            },
            global: {
                provide: {
                    [provideKey]: { prefixCls: 'fes-table' },
                },
            },
        });
        const btn = wrapper.find('button');
        expect(btn.exists()).toBe(true);
        expect(btn.classes()).toContain('fes-table-action-item');
        expect(btn.classes()).toContain('fes-btn-type-primary');
    });

    it('renders action with warning type when type="warning"', () => {
        const mockColumnWithWarning = {
            ...mockColumn,
            props: {
                action: [
                    {
                        label: 'Warn',
                        func: vi.fn(),
                        type: 'warning',
                    },
                ],
            },
        } as any;
        const mockRow = { id: 1 };
        const wrapper = mount(FTableCell, {
            props: {
                row: mockRow,
                rowIndex: 0,
                column: mockColumnWithWarning,
                columnIndex: 0,
                cellValue: null,
            },
            global: {
                provide: {
                    [provideKey]: { prefixCls: 'fes-table' },
                },
            },
        });
        const btn = wrapper.find('button');
        expect(btn.exists()).toBe(true);
        expect(btn.classes()).toContain('fes-btn-type-warning');
    });

    it('renders action with danger type when type="danger"', () => {
        const mockColumnWithDanger = {
            ...mockColumn,
            props: {
                action: [
                    {
                        label: 'Delete',
                        func: vi.fn(),
                        type: 'danger',
                    },
                ],
            },
        } as any;
        const mockRow = { id: 1 };
        const wrapper = mount(FTableCell, {
            props: {
                row: mockRow,
                rowIndex: 0,
                column: mockColumnWithDanger,
                columnIndex: 0,
                cellValue: null,
            },
            global: {
                provide: {
                    [provideKey]: { prefixCls: 'fes-table' },
                },
            },
        });
        const btn = wrapper.find('button');
        expect(btn.exists()).toBe(true);
        expect(btn.classes()).toContain('fes-btn-type-danger');
    });
});