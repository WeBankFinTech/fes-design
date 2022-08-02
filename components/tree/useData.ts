import { ref, reactive, watch, Ref } from 'vue';
import { isNil, debounce } from 'lodash-es';
import useFilter from './useFilter';
import type { InnerTreeOption, TreeNodeKey, TreeNodeList } from './interface';
import type { TreeProps } from './props';

export default ({
    props,
    currentExpandedKeys,
}: {
    props: TreeProps;
    currentExpandedKeys: Ref<TreeNodeKey[]>;
}) => {
    const nodeList = reactive<TreeNodeList>({});

    const transformData = ref<TreeNodeKey[]>([]);

    const { filter, filteredExpandedKeys, filteredKeys, isSearchingRef } =
        useFilter(props, transformData, nodeList);

    const currentData = ref<TreeNodeKey[]>([]);

    const computeCurrentData = () => {
        const res: TreeNodeKey[] = [];
        const expandedKeys = isSearchingRef.value
            ? filteredExpandedKeys.value
            : currentExpandedKeys.value;

        // 缓存每个节点的展开状态，性能更优
        (isSearchingRef.value
            ? filteredKeys.value
            : transformData.value
        ).forEach((key) => {
            const node = nodeList[key];
            node.isExpanded = node.hasChildren
                ? expandedKeys.includes(key)
                : true;
            const indexPath = node.indexPath;
            const len = indexPath.length;
            // 根节点一直显示
            if (len === 1) {
                res.push(key);
                return;
            }
            let index = 0;
            let parentExpanded = true;
            while (index < len - 1) {
                const parentNode = nodeList[indexPath[index]];
                if (!parentNode.isExpanded) {
                    parentExpanded = false;
                    break;
                }
                index += 1;
            }
            if (parentExpanded) {
                res.push(key);
            }
        });
        currentData.value = res;
    };

    watch(
        [filteredExpandedKeys, filteredKeys],
        debounce(() => {
            if (!isSearchingRef.value) return;
            computeCurrentData();
        }, 10),
    );

    watch(
        [currentExpandedKeys, transformData],
        debounce(() => {
            if (isSearchingRef.value) return;
            computeCurrentData();
        }, 10),
    );

    watch([isSearchingRef], () => {
        computeCurrentData();
    });

    const transformNode = (
        item: InnerTreeOption,
        indexPath: TreeNodeKey[],
        level: number,
    ) => {
        const copy = { ...item };
        // TODO 有没更好的写法？
        const value = (copy as any)[props.valueField];
        const label = (copy as any)[props.labelField];
        const children = (copy as any)[props.childrenField];
        const hasChildren = !!(Array.isArray(children) && children.length);
        let isLeaf;
        if (!isNil(copy.isLeaf)) {
            isLeaf = copy.isLeaf;
        } else if (hasChildren) {
            isLeaf = false;
        } else if (props.remote) {
            isLeaf = false;
        } else {
            isLeaf = true;
        }
        copy.origin = item;
        copy.value = value;
        copy.label = label;
        copy.isLeaf = isLeaf;
        // 处理indexPath
        copy.indexPath = [...indexPath, value];
        copy.level = level;
        copy.hasChildren = hasChildren;
        if (hasChildren) {
            copy.isExpanded = false;
        }
        return copy;
    };

    const flatNodes = (
        nodes: InnerTreeOption[] = [],
        indexPath: TreeNodeKey[] = [],
        level = 1,
    ) =>
        nodes.reduce((res, node) => {
            const copy = transformNode(node, indexPath, level);
            // 扁平化
            nodeList[copy.value] = copy;
            res.push(copy.value);
            if (copy.hasChildren) {
                const keys = flatNodes(
                    copy.children,
                    copy.indexPath,
                    level + 1,
                );
                copy.children = keys.map((key) => {
                    return nodeList[key];
                });
                res = res.concat(keys);
            }
            return res;
        }, []);

    watch(
        [() => props.data],
        () => {
            transformData.value = flatNodes(props.data);
        },
        {
            immediate: true,
            deep: true,
        },
    );

    return {
        nodeList,
        transformData,
        currentData,
        filter,
        filteredExpandedKeys,
        isSearchingRef,
    };
};
