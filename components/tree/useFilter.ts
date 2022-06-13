import { ref } from 'vue';
import { isFunction } from 'lodash-es';

import type { TreeNodeKey, TreeNodeList, InnerTreeOption } from './interface';
import type { TreeProps } from './props';

export default (props: TreeProps, nodeList: TreeNodeList) => {
    const filteredKeys = ref<TreeNodeKey[]>([]);
    const filteredExpandedKeys = ref<TreeNodeKey[]>([]);
    const isSearchingRef = ref(false);

    const filter = (filterText: string) => {
        const filterMethod = props.filterMethod;
        if (!isFunction(filterMethod)) {
            return;
        }
        function traverse() {
            const _filteredExpandedKeys: TreeNodeKey[] = [];
            const _filteredKeys: TreeNodeKey[] = [];
            Object.keys(nodeList).forEach((key) => {
                const node: InnerTreeOption = nodeList[key];
                if (filterMethod(filterText, node)) {
                    _filteredKeys.push(key);
                    const parentKeys = node.indexPath.slice(
                        0,
                        node.isLeaf
                            ? node.indexPath.length - 1
                            : node.indexPath.length,
                    );
                    parentKeys.forEach((_key) => {
                        if (!_filteredExpandedKeys.includes(_key)) {
                            _filteredExpandedKeys.push(_key);
                        }
                        if (!_filteredKeys.includes(_key)) {
                            _filteredKeys.push(_key);
                        }
                    });
                }
            });
            filteredExpandedKeys.value = _filteredExpandedKeys;
            filteredKeys.value = _filteredKeys;
        }
        if (filterText) {
            traverse();
        }
        isSearchingRef.value = filterText ? true : false;
    };

    return {
        filteredKeys,
        filteredExpandedKeys,
        filter,
        isSearchingRef,
    };
};
