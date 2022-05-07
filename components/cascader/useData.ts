import { ref, reactive, watch, computed, Ref } from 'vue';
import { isArray, isEmpty, isNil } from 'lodash-es';

import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderNodeList,
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
    const initialLoaded = ref(true);

    watch([currentExpandedKeys, transformData], () => {
        const expandedKeys = currentExpandedKeys.value;
        // 缓存每个节点的展开状态，性能更优
        transformData.value.forEach((key) => {
            const node = nodeList[key];
            node.isExpanded = expandedKeys.includes(key);
        });
    });

    const menuKeys = computed(() => {
        return [].concat(ROOT_MENU_KEY, currentExpandedKeys.value);
    });

    const getMenuNodes = (key: CascaderNodeKey) => {
        let nodes: InnerCascaderOption[];

        if (key === ROOT_MENU_KEY) {
            nodes = transformData.value
                .filter((value) => {
                    const node = nodeList[value];
                    return node.indexPath.length === 1;
                })
                .map((value) => nodeList[value]);
        } else {
            nodes = nodeList[key].childrenValues.map(
                (value) => nodeList[value],
            );
        }

        return nodes;
    };

    const transformNode = (
        item: InnerCascaderOption,
        indexPath: CascaderNodeKey[],
        level: number,
        labelPath: string[],
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
        // 处理 labelPath
        copy.labelPath = [...labelPath, label];
        copy.level = level;
        copy.hasChildren = hasChildren;
        copy.childrenValues = hasChildren
            ? children?.map((node) => node.value)
            : [];
        return copy;
    };

    const flatNodes = (
        nodes: InnerCascaderOption[] = [],
        indexPath: CascaderNodeKey[] = [],
        level = 1,
        labelPath: string[] = [],
    ) =>
        nodes.reduce((res, node) => {
            const copy = transformNode(node, indexPath, level, labelPath);
            // 扁平化
            nodeList[copy.value] = copy;
            res.push(copy.value);
            if (copy.hasChildren) {
                res = res.concat(
                    flatNodes(
                        copy.children,
                        copy.indexPath,
                        level + 1,
                        copy.labelPath,
                    ),
                );
            }
            return res;
        }, []);

    watch(
        [() => props.data],
        async () => {
            // 初始化加载，仅支持 props.data 为响应式空数组的场景
            if (props.remote && props.loadData && isEmpty(props.data)) {
                initialLoaded.value = false;

                const children = await props.loadData(null);
                isArray(children) &&
                    children.forEach((item) => props.data.push(item));

                initialLoaded.value = true;
            } else {
                transformData.value = flatNodes(props.data);
            }
        },
        {
            immediate: true,
            deep: true,
        },
    );

    // TODO: 初始化加载完毕后，syncLoadNode

    return {
        nodeList,
        getMenuNodes,
        menuKeys,
        initialLoaded,
    };
};
