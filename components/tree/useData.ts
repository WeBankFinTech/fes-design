import { ref, watch, Ref } from 'vue';
import { isNil, debounce } from 'lodash-es';
import useFilter from './useFilter';
import type { InnerTreeOption, TreeNodeKey, TreeNodeList } from './interface';
import type { TreeProps } from './props';

let uid = 1;
const getUid = () => {
    return uid++;
};

export default ({
    props,
    currentExpandedKeys,
}: {
    props: TreeProps;
    currentExpandedKeys: Ref<TreeNodeKey[]>;
}) => {
    const nodeList: TreeNodeList = {};

    const transformData = ref<TreeNodeKey[]>([]);

    const { filter, filteredExpandedKeys, filteredKeys, isSearchingRef } =
        useFilter(props, transformData, nodeList);

    const currentData = ref<TreeNodeKey[]>([]);

    const computeCurrentData = () => {
        const res: TreeNodeKey[] = [];
        const expandedKeys = isSearchingRef.value
            ? filteredExpandedKeys.value
            : currentExpandedKeys.value;

        const keys = isSearchingRef.value
            ? filteredKeys.value
            : transformData.value;

        // 缓存每个节点的展开状态，性能更优
        keys.forEach((key) => {
            const node = nodeList[key];
            if (node.hasChildren) {
                node.isExpanded.value = expandedKeys.includes(key);
            }
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
                if (!parentNode.isExpanded.value) {
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
        const value = item[props.valueField];
        const label = item[props.labelField];
        const children = item[props.childrenField];
        const hasChildren = !!(Array.isArray(children) && children.length);
        let isLeaf;
        if (!isNil(item.isLeaf)) {
            isLeaf = item.isLeaf;
        } else if (hasChildren) {
            isLeaf = false;
        } else if (props.remote) {
            isLeaf = false;
        } else {
            isLeaf = true;
        }
        let copy: InnerTreeOption;
        const newItem = {
            origin: item,
            prefix: item.prefix,
            suffix: item.suffix,
            value,
            label,
            isLeaf,
            children,
            hasChildren,
            level,
            indexPath: [...indexPath, value],
        };
        if (!nodeList[value]) {
            copy = {
                ...newItem,
                isExpanded: ref(false),
                isIndeterminate: ref(false),
                isChecked: ref(false),
            };
        } else {
            copy = nodeList[value];
            Object.assign(copy, newItem);
        }
        copy.uid = getUid();
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
                copy.children = copy.children.map((item) => {
                    return nodeList[item[props.valueField]];
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
