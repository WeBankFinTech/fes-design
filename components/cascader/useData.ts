import { ref, reactive, watch, computed, Ref, nextTick } from 'vue';
import { isArray, isEmpty, isNil } from 'lodash-es';

import type {
    InnerCascaderOption,
    CascaderOption,
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

    const transformData = ref<CascaderNodeKey[]>([]);
    const initialLoaded = ref(true);
    const initLoadingKeys = ref<CascaderNodeKey[]>([]);

    watch([currentExpandedKeys, transformData, initLoadingKeys], () => {
        // 缓存每个节点的状态，性能更优
        transformData.value.forEach((key) => {
            const node = nodeList[key];
            node.isExpanded = currentExpandedKeys.value.includes(key);
            node.isInitLoading = initLoadingKeys.value.includes(key);
        });
    });

    const menuKeys = computed(() => {
        return [].concat(
            ROOT_MENU_KEY,
            currentExpandedKeys.value.filter((value) => {
                return nodeList[value]?.hasChildren;
            }),
        );
    });

    const transformNode = (
        item: InnerCascaderOption,
        indexPath: CascaderNodeKey[],
        level: number,
        path: CascaderOption[] = [],
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
        // 处理 path
        copy.path = [
            ...path,
            {
                value,
                label,
            },
        ];
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
        path: CascaderOption[] = [],
    ) =>
        nodes.reduce((res, node) => {
            const copy = transformNode(node, indexPath, level, path);
            // 扁平化
            nodeList[copy.value] = copy;
            res.push(copy.value);
            if (copy.hasChildren) {
                res = res.concat(
                    flatNodes(
                        copy.children,
                        copy.indexPath,
                        level + 1,
                        copy.path,
                    ),
                );
            }
            return res;
        }, []);

    watch(
        () => props.data,
        async () => {
            // 初始化加载，仅支持 props.data 为响应式空数组的场景
            if (props.remote && props.loadData && isEmpty(props.data)) {
                initialLoaded.value = false;

                try {
                    const children = await props.loadData(null);
                    isArray(children) &&
                        children.forEach((item) => props.data.push(item));
                    await nextTick();
                } catch (e) {
                    console.error(e);
                }

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

    const syncLoadNode = async (loadedKeys: CascaderNodeKey[] = []) => {
        const needLoadNodes = props.initLoadKeys
            .map((key) => nodeList[key])
            .filter(
                (node) =>
                    !!node &&
                    !node.isLeaf &&
                    !node.hasChildren &&
                    !loadedKeys.includes(node.value), // 避免因为加载失败而死循环
            );

        // 继续递归处理
        if (needLoadNodes.length) {
            needLoadNodes.forEach(async (node) => {
                initLoadingKeys.value.push(node.value);

                try {
                    const children = await props.loadData({
                        ...node.origin, // 避免直接操作原生对象
                    });
                    isArray(children) && (node.origin.children = children);
                    await nextTick();
                } catch (e) {
                    console.error(e);
                }

                initLoadingKeys.value = initLoadingKeys.value.filter(
                    (value) => value !== node.value,
                );
                loadedKeys.push(node.value);
                syncLoadNode(loadedKeys);
            });
        }
    };

    watch(
        [initialLoaded, () => props.initLoadKeys],
        () => {
            if (!initialLoaded.value) {
                return;
            }
            if (!(props.remote && props.loadData)) {
                return;
            }
            syncLoadNode();
        },
        {
            immediate: true,
        },
    );

    return {
        transformData,
        nodeList,
        menuKeys,
        initialLoaded,
    };
};
