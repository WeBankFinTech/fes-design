import { reactive } from 'vue';
import { isFunction } from 'lodash-es';

import type { TreeOption, TreeNodeKey } from './interface';
import type { TreeProps } from './props';

export default (props: TreeProps) => {
    const hiddenKeys = reactive([]);
    const filteredExpandedKeys = reactive<TreeNodeKey[]>([]);

    const filter = (filterText: string) => {
        const filterMethod = props.filterMethod;
        if (!isFunction(filterMethod)) {
            return;
        }
        filteredExpandedKeys.length = 0;
        hiddenKeys.length = 0;
        const family: TreeOption[] = [];
        const expandKeySet = new Set<TreeNodeKey>();
        function traverse(nodes: TreeOption[]) {
            nodes.forEach((node) => {
                family.push(node);
                if (filterMethod(filterText, node)) {
                    family.forEach((member) => {
                        expandKeySet.add(member.value);
                    });
                } else if (node.isLeaf) {
                    hiddenKeys.push(node.value);
                }
                const children = node.children;
                if (children) {
                    traverse(children);
                }
                if (!node.isLeaf) {
                    if (!expandKeySet.has(node.value)) {
                        if (!children) {
                            hiddenKeys.push(node.value);
                        } else if (
                            children.every(
                                (childNode) =>
                                    !expandKeySet.has(childNode.value),
                            )
                        ) {
                            hiddenKeys.push(node.value);
                        }
                    }
                }
                family.pop();
            });
        }
        if (filterText) {
            traverse(props.data);
            expandKeySet.forEach((key) => {
                filteredExpandedKeys.push(key);
            });
        }
    };

    return {
        hiddenKeys,
        filteredExpandedKeys,
        filter,
    };
};
