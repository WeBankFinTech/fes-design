import { getBrotherKeys, getChildrenByValues, getParentByValues } from '../helper';
import type { InnerTreeOption, TreeNodeKey } from '../interface';

// 按源码 useData.transformNode 产出的节点形状构造 nodeList
const makeNode = (
    value: TreeNodeKey,
    indexPath: TreeNodeKey[],
    children: InnerTreeOption[] = [],
    level = indexPath.length,
): InnerTreeOption =>
    ({
        value,
        level,
        indexPath: [...indexPath, value],
        hasChildren: children.length > 0,
        children,
        childrenPath: children.length
            ? children.flatMap((c) => [
                    c.value,
                    ...(c.childrenPath ?? []),
                ])
            : [],
        origin: { label: value, value },
    }) as any;

const c1 = makeNode('c1', ['p1']);
const c2 = makeNode('c2', ['p1']);
const p1 = makeNode('p1', [], [c1, c2]);
const p2 = makeNode('p2', []);

const nodeList = new Map<string, InnerTreeOption>([
    ['p1', p1],
    ['p2', p2],
    ['c1', c1],
    ['c2', c2],
]);

const treeProps = { data: [p1.origin, p2.origin], valueField: 'value' } as any;

describe('tree/helper', () => {
    test('getChildrenByValues 返回子孙 keys', () => {
        const res = getChildrenByValues(nodeList, ['p1']);
        expect(res).toContain('c1');
        expect(res).toContain('c2');
        expect(res).toContain('p1');
    });

    test('getChildrenByValues 空数组返回空', () => {
        expect(getChildrenByValues(nodeList, [])).toEqual([]);
    });

    test('getChildrenByValues 叶子无子孙', () => {
        const res = getChildrenByValues(nodeList, ['p2']);
        expect(res).toEqual(['p2']);
    });

    test('getParentByValues 兄弟全选中时收拢父级', () => {
        const res = getParentByValues(nodeList, ['c1', 'c2']);
        expect(res).toContain('p1');
    });

    test('getParentByValues 部分选中不收拢', () => {
        const res = getParentByValues(nodeList, ['c1']);
        expect(res).not.toContain('p1');
        expect(res).toContain('c1');
    });

    test('getBrotherKeys 返回同级兄弟（不含自身）', () => {
        const res = getBrotherKeys(c1, treeProps, nodeList);
        expect(res).toContain('c2');
        expect(res).not.toContain('c1');
    });

    test('getBrotherKeys 根级节点返回其他根', () => {
        const res = getBrotherKeys(p1, treeProps, nodeList);
        expect(res).toContain('p2');
        expect(res).not.toContain('p1');
    });
});
