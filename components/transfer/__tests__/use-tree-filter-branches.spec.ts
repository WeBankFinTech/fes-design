import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { useTreeFilter } from '../useTreeFilter';

const mountConsumer = (options: unknown[]) => {
    let api: ReturnType<typeof useTreeFilter> | null = null;
    const Consumer = defineComponent({
        setup() {
            api = useTreeFilter({ rootProps: { options } as any });
            return () => h('div');
        },
    });
    mount(Consumer);
    return {
        getApi: () => api!,
    };
};

describe('useTreeFilter 分支补全（真实交互语义）', () => {
    test('filterText 变更但 tree 尚未挂载：守卫分支直接返回且不抛错', async () => {
        const { getApi } = mountConsumer([]);
        const api = getApi();
        expect(api.treeRef.value).toBeNull();
        // 触发 watch(filterText)，treeRef 为空 → 走 L18 守卫 return
        api.filterText.value = '关键词';
        await nextTick();
        expect(api.filterText.value).toBe('关键词');
        expect(api.treeRef.value).toBeNull();
    });

    test('filterText 变更时 tree 已挂载：调用 tree.filter 同步过滤', async () => {
        let api: ReturnType<typeof useTreeFilter> | null = null;
        const treeFilter = vi.fn();
        const treeRefValue = { filter: treeFilter };
        const Consumer = defineComponent({
            setup() {
                api = useTreeFilter({ rootProps: { options: [] } as any });
                // 模拟 Tree 组件挂载后回填 ref
                api!.treeRef.value = treeRefValue as any;
                return () => h('div');
            },
        });
        mount(Consumer);
        api!.filterText.value = 'x';
        await nextTick();
        expect(treeFilter).toHaveBeenCalledWith('x');
    });

    test('defaultFilterForTree：命中/未命中 label 与未知节点语义', () => {
        const { getApi } = mountConsumer([{ value: 'a', label: '选项A' }]);
        const filterMethod = getApi().defaultFilterForTree();
        expect(filterMethod('A', { value: 'a' } as any)).toBe(true);
        expect(filterMethod('B', { value: 'a' } as any)).toBe(false);
        // 树节点不在 options 中 → 直接 false
        expect(filterMethod('A', { value: 'zzz' } as any)).toBe(false);
    });
});
