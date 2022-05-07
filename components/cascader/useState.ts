import { useNormalModel } from '../_util/use/useModel';

import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderNodeList,
} from './interface';
import type { CascaderProps } from './props';
import { getCascadeChildrenByKeys } from '../select-cascader/helper';

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
        // 兼容异步加载，未匹配到节点的情况
        if (
            node &&
            !node.isLeaf &&
            props.remote &&
            props.loadData &&
            !node.hasChildren
        ) {
            return false;
        }
        return true;
    };
    // 选中需要判断子节点是否全部加载完毕
    const hasCheckLoaded = (
        value: CascaderNodeKey,
        nodeList: CascaderNodeList,
    ): boolean => {
        return getCascadeChildrenByKeys(nodeList, [value]).every((key) =>
            hasLoaded(nodeList[key]),
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
        hasLoaded,
        hasCheckLoaded,
    };
};
