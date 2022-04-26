import { ref, reactive, watch, computed, Ref } from 'vue';
import { isNil } from 'lodash-es';

import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderNodeList,
} from './interface';
import type { CascaderProps } from './props';

export default ({
    props,
    filteredExpandedKeys,
    currentExpandedKeys,
    hiddenKeys,
}: {
    props: CascaderProps;
    filteredExpandedKeys: CascaderNodeKey[];
    currentExpandedKeys: Ref<CascaderNodeKey[]>;
    hiddenKeys: CascaderNodeKey[];
}) => {
    const nodeList = reactive<CascaderNodeList>({});

    const transformData = ref([]);

    watch([filteredExpandedKeys, currentExpandedKeys, transformData], () => {
        const expandedKeys = filteredExpandedKeys.length
            ? filteredExpandedKeys
            : currentExpandedKeys.value;
        // 缓存每个节点的展开状态，性能更优
        transformData.value.forEach((key) => {
            const node = nodeList[key];
            node.isExpanded = expandedKeys.includes(key);
        });
    });

    const currentData = computed(() =>
        transformData.value.filter((value) => {
            if (hiddenKeys.includes(value)) {
                return false;
            }
            const node = nodeList[value];
            const isRoot = node.indexPath.length === 1;
            if (isRoot) {
                return true;
            }
            const indexPath = node.indexPath;
            const len = indexPath.length;
            let index = 0;
            while (index < len - 1) {
                const parentNode = nodeList[indexPath[index]];
                if (!parentNode.isExpanded) {
                    return false;
                }
                index += 1;
            }
            return true;
        }),
    );

    const transformNode = (
        item: InnerCascaderOption,
        indexPath: CascaderNodeKey[],
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
        return copy;
    };

    const flatNodes = (
        nodes: InnerCascaderOption[] = [],
        indexPath: CascaderNodeKey[] = [],
        level = 1,
    ) =>
        nodes.reduce((res, node) => {
            const copy = transformNode(node, indexPath, level);
            // 扁平化
            nodeList[copy.value] = copy;
            res.push(copy.value);
            if (copy.hasChildren) {
                res = res.concat(
                    flatNodes(copy.children, copy.indexPath, level + 1),
                );
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
    };
};
