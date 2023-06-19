import { ref, Ref } from 'vue';
import { isFunction } from 'lodash-es';
import type { TreeNodeKey, InnerTreeOption } from './interface';
import type { TreeProps } from './props';

export default (
    props: TreeProps,
    allKeys: Ref<TreeNodeKey[]>,
    nodeList: Map<TreeNodeKey, InnerTreeOption>,
) => {
    const filteredKeys = ref<TreeNodeKey[]>([]);
    const filteredExpandedKeys = ref<TreeNodeKey[]>([]);
    const isSearchingRef = ref<boolean>(false);

    function traverse(
        filterMethod: (filterText: string, node: InnerTreeOption) => boolean,
        filterText: string,
    ) {
        const _filteredExpandedKeys: TreeNodeKey[] = [];
        const _filteredKeys: TreeNodeKey[] = [];
        const _filteredExpandedKeysMap = new Map<TreeNodeKey, boolean>();
        const _filteredKeysMap = new Map<TreeNodeKey, boolean>();
        allKeys.value.forEach((key) => {
            const node: InnerTreeOption = nodeList.get(key);
            if (filterMethod(filterText, node)) {
                const parentKeys = node.indexPath;
                parentKeys.forEach((_key) => {
                    if (!_filteredExpandedKeysMap.get(_key)) {
                        _filteredExpandedKeys.push(_key);
                        _filteredExpandedKeysMap.set(_key, true);
                    }
                    if (!_filteredKeysMap.get(_key)) {
                        _filteredKeys.push(_key);
                        _filteredKeysMap.set(_key, true);
                    }
                });
            }
        });
        _filteredExpandedKeysMap.clear();
        _filteredKeysMap.clear();
        return [_filteredExpandedKeys, _filteredKeys];
    }

    const filter = (filterText: string) => {
        const filterMethod = props.filterMethod;
        if (!isFunction(filterMethod)) {
            return;
        }
        if (filterText) {
            const [_filteredExpandedKeys, _filteredKeys] = traverse(
                filterMethod,
                filterText,
            );
            filteredExpandedKeys.value = _filteredExpandedKeys;
            filteredKeys.value = _filteredKeys;
        } else {
            filteredExpandedKeys.value = [];
            filteredKeys.value = [];
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
