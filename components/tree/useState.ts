import { useNormalModel } from '../_util/use/useModel';
import useFilter from './useFilter';

import type { TreeOption, TreeNodeKey } from './interface';
import type { TreeProps } from './props';

export default (props: TreeProps, { emit }: { emit: any }) => {
    const [currentExpandedKeys, updateExpandedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'expandedKeys', isEqual: true },
    );

    const [currentCheckedKeys, updateCheckedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'checkedKeys', isEqual: true },
    );

    const [currentSelectedKeys, updateSelectedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'selectedKeys', isEqual: true },
    );

    const { filter, hiddenKeys, filteredExpandedKeys } = useFilter(props);

    const hasSelected = (value: TreeNodeKey) =>
        currentSelectedKeys.value.includes(value);
    const hasChecked = (value: TreeNodeKey): boolean =>
        currentCheckedKeys.value.includes(value);
    const hasIndeterminate = (node: TreeOption): boolean => {
        if (hasChecked(node.value)) {
            return false;
        }
        if (node.isLeaf) {
            return false;
        }
        return (
            props.cascade &&
            Array.isArray(node.children) &&
            node.children.some(
                (item) => hasChecked(item.value) || hasIndeterminate(item),
            )
        );
    };

    return {
        currentExpandedKeys,
        updateExpandedKeys,
        currentCheckedKeys,
        updateCheckedKeys,
        currentSelectedKeys,
        updateSelectedKeys,
        filter,
        hiddenKeys,
        filteredExpandedKeys,
        hasSelected,
        hasChecked,
        hasIndeterminate,
    };
};
