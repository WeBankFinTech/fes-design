import { ref, reactive, watch, computed, Ref } from 'vue';
import { isNil } from 'lodash-es';

import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderNodeList,
    CascaderMenu,
} from './interface';
import type { CascaderProps } from './props';
import { ROOT_MENU_KEY } from './const';

export default ({
    props,
    currentExpandedKeys,
}: {
    props: CascaderProps;
    currentExpandedKeys: Ref<CascaderNodeKey[]>;
}) => {
    const nodeList = reactive<CascaderNodeList>({});

    const transformData = ref([]);

    watch([currentExpandedKeys, transformData], () => {
        const expandedKeys = currentExpandedKeys.value;
        // 缓存每个节点的展开状态，性能更优
        transformData.value.forEach((key) => {
            const node = nodeList[key];
            node.isExpanded = expandedKeys.includes(key);
        });
    });

    const rootMenu = computed<CascaderMenu>(() => {
        const nodes = transformData.value
            .filter((value) => {
                const node = nodeList[value];
                return node.indexPath.length === 1;
            })
            .map((value) => nodeList[value]);

        return {
            key: ROOT_MENU_KEY,
            nodes: nodes,
        };
    });

    const currentData = computed<CascaderMenu[]>(() => {
        const expandedKeys = currentExpandedKeys.value;
        const expandedMenus = expandedKeys.map((key) => {
            const childrenValues = nodeList[key].children.map(
                (node) => node.value,
            );
            return {
                key,
                nodes: childrenValues.map((value) => nodeList[value]),
            };
        });

        return [].concat(rootMenu.value, expandedMenus);
    });

    const transformNode = (
        item: InnerCascaderOption,
        indexPath: CascaderNodeKey[],
        level: number,
    ) => {
        const copy = { ...item };
        const value = copy[props.valueField as 'value'];
        const label = copy[props.labelField as 'label'];
        const children = copy[props.childrenField as 'children'];
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
        // 处理 indexPath
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
