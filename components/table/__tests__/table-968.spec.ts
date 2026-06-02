import { describe, expect, it, vi } from 'vitest';
import { ref, nextTick, isReactive } from 'vue';
import useTableSelect from '../useTableSelect';

const makeSetup = (multiple: boolean) => {
    const checkedKeysRef = ref<(string | number)[]>([]);
    const emit = vi.fn((event: string, ...args: any[]) => {
        // Simulate v-model: update:checkedKeys would normally update the
        // parent's `checkedKeys` prop. In our mock, that prop reads from
        // checkedKeysRef, so we need to write back to keep selectionList
        // (which is bound BEFORE clearSelect) in sync with the parent's state.
        if (event === 'update:checkedKeys') {
            checkedKeysRef.value = args[0] as (string | number)[];
        }
    });
    const ctx = {
        emit,
        attrs: {},
        slots: {},
        expose: vi.fn(),
    };
    const props = {
        get checkedKeys() {
            return checkedKeysRef.value;
        },
        rowKey: 'id',
    };
    // IMPORTANT: showData must be created BEFORE the composable so that
    // isReactive-wrapped rows are the same identity that the composable sees.
    // Then use the SAME showData.value[i] reference when calling handleSelect.
    const showData = ref<{ id: number }[]>([{ id: 1 }, { id: 2 }, { id: 3 }]);
    const columns = ref([
        {
            id: 1,
            props: { type: 'selection', multiple },
            slots: {},
            exposed: {},
        },
    ]);
    const getRowKey = ({ row }: { row: { id: number } }) => row.id;

    const composable = useTableSelect({
        // @ts-expect-error minimal mock for test
        props,
        // @ts-expect-error SetupContext shape
        ctx,
        // @ts-expect-error
        showData,
        // @ts-expect-error
        columns,
        getRowKey,
    });

    return {
        composable,
        emit,
        checkedKeysRef,
        showData,
    };
};

describe('Table selection - issue #968', () => {
    it('single-select mode: clicking multiple rows keeps only the last selected', async () => {
        const { composable, emit, showData } = makeSetup(false);

        composable.handleSelect({ row: showData.value[0] });
        await nextTick();
        let lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([1]);

        composable.handleSelect({ row: showData.value[1] });
        await nextTick();
        lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([2]);

        composable.handleSelect({ row: showData.value[2] });
        await nextTick();
        lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([3]);
    });

    it('multi-select mode: clicking multiple rows adds each one', async () => {
        const { composable, emit, showData } = makeSetup(true);

        composable.handleSelect({ row: showData.value[0] });
        await nextTick();
        let lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([1]);

        composable.handleSelect({ row: showData.value[2] });
        await nextTick();
        lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([1, 3]);

        // re-click an already-selected row removes it
        composable.handleSelect({ row: showData.value[0] });
        await nextTick();
        lastUpdate = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdate?.[1]).toEqual([3]);
    });

    it('single-select: re-clicking the selected row keeps only the most recent click (semantically selects again)', async () => {
        const { composable, emit, showData } = makeSetup(false);

        composable.handleSelect({ row: showData.value[1] });
        await nextTick();

        // re-click the same row — in single-select mode, clearSelect() runs
        // first which empties the selection, then handleSelect adds the same
        // row back. The visible behaviour: the row is still selected.
        composable.handleSelect({ row: showData.value[1] });
        await nextTick();

        // The last 'select' emit should be checked: true (we just re-selected
        // the same row, not toggled it off).
        const lastSelectCall = emit.mock.calls
            .filter(([event]) => event === 'select')
            .pop();
        expect(lastSelectCall?.[1]).toEqual(
            expect.objectContaining({
                row: showData.value[1],
                checked: true,
            }),
        );
        const lastUpdateCall = emit.mock.calls
            .filter(([event]) => event === 'update:checkedKeys')
            .pop();
        expect(lastUpdateCall?.[1]).toEqual([2]);
    });
});
