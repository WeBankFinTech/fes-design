import { ref, watch } from 'vue';
import { isNil, isUndefined } from 'lodash-es';
import { concat } from '../_util/utils';
import type { InnerTreeOption, TreeNodeKey } from './interface';
import type { TreeProps } from './props';

let uid = 1;
const getUid = () => {
    return uid++;
};

export default ({ props, emit }: { props: TreeProps; emit: any }) => {
    const nodeList: Map<TreeNodeKey, InnerTreeOption> = new Map();

    const allKeys = ref<TreeNodeKey[]>([]);

    watch(
        allKeys,
        () => {
            emit('update:nodeList', nodeList);
        },
        {
            immediate: true,
        },
    );

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
            disabled: item.disabled,
            selectable: item.selectable,
            checkable: item.checkable,
            draggable: isUndefined(item.draggable) ? true : item.draggable,
            value,
            label,
            isLeaf,
            children,
            hasChildren,
            level,
            indexPath: [...indexPath, value],
        };
        if (!nodeList.get(value)) {
            // Object.assign比解构快很多
            copy = Object.assign({}, newItem);
            copy.isExpanded = ref(false);
            copy.isIndeterminate = ref(false);
            copy.isChecked = ref(false);
        } else {
            copy = nodeList.get(value);
            Object.assign(copy, newItem);
        }
        copy.uid = getUid();
        return copy;
    };

    const flatNodes = (
        nodes: InnerTreeOption[] = [],
        children: InnerTreeOption[] = [],
        indexPath: TreeNodeKey[] = [],
        level = 1,
    ) =>
        nodes.reduce((res, node) => {
            const copy = transformNode(node, indexPath, level);
            // 扁平化
            nodeList.set(copy.value, copy);
            res.push(copy.value);
            children.push(copy);
            if (copy.hasChildren) {
                const children: InnerTreeOption[] = [];
                const keys = flatNodes(
                    copy.children,
                    children,
                    copy.indexPath,
                    level + 1,
                );
                copy.children = children;
                copy.childrenPath = keys;
                // 比Array.concat快
                concat(res, keys);
            }
            return res;
        }, []);

    watch(
        [() => props.data],
        () => {
            allKeys.value = flatNodes(props.data);
        },
        {
            immediate: true,
            deep: true,
        },
    );

    return {
        nodeList,
        allKeys,
    };
};
