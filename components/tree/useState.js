import { useNormalModel } from '../_util/use/useModel';
import useFilter from './useFilter';

export default (props, { emit }) => {
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

    const hasSelected = (value) => currentSelectedKeys.value.includes(value);
    const hasChecked = (value) => currentCheckedKeys.value.includes(value);
    const hasIndeterminate = (node) => {
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
                (item) => hasChecked(node.value) || hasIndeterminate(item),
            )
        );
    };

    const hasExpanded = (value) => {
        if (filteredExpandedKeys.length) {
            return filteredExpandedKeys.includes(value);
        }
        return currentExpandedKeys.value.includes(value);
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
        hasExpanded,
    };
};
