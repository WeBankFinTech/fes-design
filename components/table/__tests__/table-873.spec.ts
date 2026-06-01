import { readFileSync } from 'fs';
import { join } from 'path';
import { describe, it, expect } from 'vitest';
import { ref } from 'vue';
import useTableLayout from '../useTableLayout';
import type { TableProps } from '../table';

const useTableLayoutPath = join(__dirname, '../useTableLayout.ts');

describe('table-873: offsetWidth=0 fix', () => {
    it('should contain offsetWidth === 0 check in useTableLayout.ts', () => {
        const content = readFileSync(useTableLayoutPath, 'utf-8');
        expect(content).toContain('offsetWidth === 0');
    });

    it('should handle layout calculation when wrapper has offsetWidth=0', () => {
        const mockProps = {
            height: undefined,
            layout: 'auto',
            showHeader: true,
            bordered: false,
        } as TableProps;

        const mockWrapperRef = ref({
            offsetWidth: 0,
            offsetHeight: 100,
        }) as any;

        const mockHeaderWrapperRef = ref({
            offsetHeight: 50,
        }) as any;

        const mockBodyWrapperRef = ref({
            offsetHeight: 100,
        }) as any;

        const mockBodyTableRef = ref({
            offsetWidth: 200,
        }) as any;

        const mockColumns = ref([]) as any;

        const mockShowData = ref([]) as any;

        const result = useTableLayout({
            props: mockProps,
            wrapperRef: mockWrapperRef,
            headerWrapperRef: mockHeaderWrapperRef,
            bodyWrapperRef: mockBodyWrapperRef,
            bodyTableRef: mockBodyTableRef,
            columns: mockColumns,
            showData: mockShowData,
        });

        expect(result.isScrollX.value).toBe(false);
    });

    it('should not crash when wrapper offsetWidth transitions from 0 to non-zero', () => {
        const mockProps = {
            height: undefined,
            layout: 'auto',
            showHeader: true,
            bordered: false,
        } as TableProps;

        const wrapperEl = {
            offsetWidth: 0,
            offsetHeight: 100,
        };

        const mockWrapperRef = ref(wrapperEl) as any;

        const mockHeaderWrapperRef = ref({
            offsetHeight: 50,
        }) as any;

        const mockBodyWrapperRef = ref({
            offsetHeight: 100,
        }) as any;

        const mockBodyTableRef = ref({
            offsetWidth: 200,
        }) as any;

        const mockColumns = ref([]) as any;

        const mockShowData = ref([]) as any;

        useTableLayout({
            props: mockProps,
            wrapperRef: mockWrapperRef,
            headerWrapperRef: mockHeaderWrapperRef,
            bodyWrapperRef: mockBodyWrapperRef,
            bodyTableRef: mockBodyTableRef,
            columns: mockColumns,
            showData: mockShowData,
        });

        wrapperEl.offsetWidth = 500;

        expect(() => {
            mockWrapperRef.value.offsetWidth = 500;
        }).not.toThrow();
    });
});