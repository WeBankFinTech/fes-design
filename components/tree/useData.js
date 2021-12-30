import { ref, reactive, watch, computed } from 'vue';
import { isNil, isArray } from 'lodash-es';

export default ({ props, hasExpanded, hiddenKeys }) => {
    const nodeList = reactive({});

    const transformData = ref([]);

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
            const parentNodePath = node.indexPath.slice(
                0,
                node.indexPath.length - 1,
            );
            return parentNodePath.every((path) => hasExpanded(path));
        }),
    );

    const getChildrenByValues = (values = []) => {
        let arr = [...values];
        values.forEach((value) => {
            const node = nodeList[value];
            if (isArray(node.children)) {
                arr = arr.concat(
                    getChildrenByValues(
                        node.children.map((child) => child.value),
                    ),
                );
            }
        });
        return arr;
    };

    const getParentByValues = (values = []) => {
        const res = {};
        values.forEach((value) => {
            const node = nodeList[value];
            if (!res[node.level]) {
                res[node.level] = [];
            }
            res[node.level].push(node.value);
        });
        const levels = Object.keys(res);
        const maxLevel = levels[levels.length - 1];
        for (let level = maxLevel; level > 0; level--) {
            const levelValues = res[level];
            if (levelValues) {
                levelValues.forEach((value) => {
                    const node = nodeList[value];
                    const parentValue =
                        node.indexPath[node.indexPath.length - 2];
                    if (parentValue) {
                        const parentNode = nodeList[parentValue];
                        if (
                            parentNode.children.every((child) =>
                                levelValues.includes(child.value),
                            )
                        ) {
                            if (!res[level - 1]) {
                                res[level - 1] = [];
                            }
                            if (!res[level - 1].includes(parentValue)) {
                                res[level - 1].push(parentValue);
                            }
                        }
                    }
                });
            }
        }
        let arr = [];
        Object.values(res).forEach((levelValues) => {
            arr = arr.concat(levelValues);
        });
        return arr;
    };

    const transformNode = (item, indexPath, level) => {
        const copy = { ...item };
        const value = copy[props.valueField];
        const label = copy[props.labelField];
        const children = copy[props.childrenField];
        const hasChildren = Array.isArray(children) && children.length;
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

    const flatNodes = (nodes = [], indexPath = [], level = 1) =>
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
        currentData,
        getChildrenByValues,
        getParentByValues,
    };
};
