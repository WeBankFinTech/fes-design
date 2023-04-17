import { useNormalModel } from '../_util/use/useModel';
import { getCascadeChildrenByKeys } from './helper';
import type {
    InnerCascaderOption,
    CascaderNodeKey,
    CascaderNodeList,
} from './interface';
import type { CascaderProps } from './props';

export default function useState(
    props: CascaderProps,
    { emit }: { emit: any },
) {
    const [currentExpandedKeys, updateExpandedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'expandedKeys' },
    );

    const [currentCheckedKeys, updateCheckedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'checkedKeys' },
    );

    const [currentSelectedKeys, updateSelectedKeys] = useNormalModel(
        props,
        emit,
        { prop: 'selectedKeys' },
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
    // 当前节点是否在选中节点的路径中
    const hasActive = (
        value: CascaderNodeKey,
        nodeList: CascaderNodeList,
    ): boolean => {
        return (
            !hasSelected(value) &&
            (currentSelectedKeys.value as CascaderNodeKey[]).some((key) => {
                return nodeList[key]?.indexPath.includes(value);
            })
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
        hasActive,
    };
}
