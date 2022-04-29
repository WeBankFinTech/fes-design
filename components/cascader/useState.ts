import { useNormalModel } from '../_util/use/useModel';

import type { InnerCascaderOption, CascaderNodeKey } from './interface';
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

    const hasSelected = (value: CascaderNodeKey): boolean =>
        currentSelectedKeys.value.includes(value);
    const hasChecked = (value: CascaderNodeKey): boolean =>
        currentCheckedKeys.value.includes(value);
    const hasLoaded = (node: InnerCascaderOption): boolean => {
        if (
            !node.isLeaf &&
            props.remote &&
            props.loadData &&
            !node.hasChildren
        ) {
            return false;
        }
        return true;
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
        hasLoaded,
    };
};
