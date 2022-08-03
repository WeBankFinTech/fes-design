import { inject, computed } from 'vue';
import { isNil } from 'lodash-es';
import { TREE_PROVIDE_KEY } from './props';

import type { TreeNodeProps } from './treeNode';

export default (props: TreeNodeProps) => {
    const root = inject(TREE_PROVIDE_KEY);

    const node = root.nodeList.get(props.value);

    const isSelected = computed(() => root.hasSelected(props.value));

    const isExpanded = computed(() => node.isExpanded?.value);

    const isChecked = computed(() => node.isChecked.value);

    const isIndeterminate = computed(() => node.isIndeterminate.value);

    const isInline = computed(() => {
        if (!root.props.inline) {
            return false;
        }
        if (!props.isLeaf) {
            return false;
        }
        const nodeList = root.nodeList;
        const node = nodeList.get(props.value);
        const parentNodePath = node.indexPath[node.indexPath.length - 2];
        const parentNode = nodeList.get(parentNodePath);
        return parentNode.children.every((item) => {
            const hasChildren =
                Array.isArray(item.children) && item.children.length;
            let isLeaf;
            if (!isNil(item.isLeaf)) {
                isLeaf = item.isLeaf;
            } else if (hasChildren) {
                isLeaf = false;
            } else if (root.props.remote) {
                isLeaf = false;
            } else {
                isLeaf = true;
            }
            return isLeaf;
        });
    });

    const isFirst = computed(() => {
        if (!isInline.value) {
            return false;
        }
        const nodeList = root.nodeList;
        const node = nodeList.get(props.value);
        const parentNodePath = node.indexPath[node.indexPath.length - 2];
        const parentNode = nodeList.get(parentNodePath);
        return parentNode.children[0].value === props.value;
    });

    return {
        root,
        isExpanded,
        isSelected,
        isChecked,
        isIndeterminate,
        isInline,
        isFirst,
    };
};
