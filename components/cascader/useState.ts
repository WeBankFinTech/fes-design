import { useNormalModel } from '../_util/use/useModel';

import type { CascaderOption, CascaderNodeKey } from './interface';
import type { CascaderProps } from './props';

export default (props: CascaderProps, { emit }: { emit: any }) => {
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

    const hasSelected = (value: CascaderNodeKey) =>
        currentSelectedKeys.value.includes(value);
    const hasChecked = (value: CascaderNodeKey): boolean =>
        currentCheckedKeys.value.includes(value);
    const hasIndeterminate = (node: CascaderOption): boolean => {
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
        hasSelected,
        hasChecked,
        hasIndeterminate,
    };
};
