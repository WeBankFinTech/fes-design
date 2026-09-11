import { ref } from 'vue';
import useFilter from '../useFilter';

const makeNode = (value: string, indexPath: string[]) =>
    ({ value, indexPath }) as any;

const makeEnv = () => {
    const allKeys = ref(['p1', 'p2', 'c1']);
    const nodeList = new Map<string, any>([
        ['p1', makeNode('p1', ['p1'])],
        ['p2', makeNode('p2', ['p2'])],
        ['c1', makeNode('c1', ['p1', 'c1'])],
    ]);
    return { allKeys, nodeList };
};

const baseProps = {
    filterMethod: (text: string, node: any) =>
        String(node.value).includes(text),
} as any;

describe('tree/useFilter', () => {
    test('filter 命中节点及其父链', () => {
        const { allKeys, nodeList } = makeEnv();
        const env = useFilter(baseProps, allKeys, nodeList);
        env.filter('c1');
        expect(env.isSearchingRef.value).toBe(true);
        // c1 命中，父链 p1 也进入 keys
        expect(env.filteredKeys.value).toContain('c1');
        expect(env.filteredKeys.value).toContain('p1');
        expect(env.filteredExpandedKeys.value).toEqual(['p1', 'c1']);
    });

    test('filter 空文本清空并退出搜索态', () => {
        const { allKeys, nodeList } = makeEnv();
        const env = useFilter(baseProps, allKeys, nodeList);
        env.filter('c1');
        env.filter('');
        expect(env.isSearchingRef.value).toBe(false);
        expect(env.filteredKeys.value).toEqual([]);
        expect(env.filteredExpandedKeys.value).toEqual([]);
    });

    test('filterMethod 非函数直接返回', () => {
        const { allKeys, nodeList } = makeEnv();
        const env = useFilter(
            { filterMethod: 'not a function' } as any,
            allKeys,
            nodeList,
        );
        env.filter('c1');
        expect(env.isSearchingRef.value).toBe(false);
        expect(env.filteredKeys.value).toEqual([]);
    });

    test('无命中时 keys 为空但处于搜索态', () => {
        const { allKeys, nodeList } = makeEnv();
        const env = useFilter(baseProps, allKeys, nodeList);
        env.filter('zzz');
        expect(env.isSearchingRef.value).toBe(true);
        expect(env.filteredKeys.value).toEqual([]);
    });
});
