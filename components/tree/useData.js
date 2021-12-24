import { ref, reactive, watch } from 'vue';
import { isNil, isArray } from 'lodash-es';

export default (props) => {
    const nodeList = reactive({});

    const currentData = ref([]);

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

    const handleData = (arr = [], indexPath = [], level = 1) =>
        arr.map((item) => {
            const copy = transformNode(item, indexPath, level);
            // 扁平化
            nodeList[copy.value] = copy;
            if (copy.hasChildren) {
                copy.children = handleData(
                    copy.children,
                    copy.indexPath,
                    level + 1,
                );
            }
            return copy;
        });

    watch(
        () => props.data,
        () => {
            currentData.value = handleData(props.data);
        },
        {
            immediate: true,
            deep: true,
        },
    );

    return {
        nodeList,
        currentData,
        handleData,
        getChildrenByValues,
        getParentByValues,
    };
};
