import { computed } from 'vue';
import { useNormalModel } from '../_util/use/useModel';

import type { TreeNodeKey } from './interface';
import type { TreeProps } from './props';

export default ({ props, emit }: { props: TreeProps; emit: any }) => {
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

    const hasSelected = (value: TreeNodeKey) =>
        currentSelectedKeys.value.includes(value);

    const hasNoExpandableNode = computed<boolean>(() =>
        props.data.every(
            (firstLevelNode) =>
                !firstLevelNode.children ||
                firstLevelNode.children.length === 0,
        ),
    );

    return {
        currentExpandedKeys,
        updateExpandedKeys,
        currentCheckedKeys,
        updateCheckedKeys,
        currentSelectedKeys,
        updateSelectedKeys,
        hasSelected,
        hasNoExpandableNode,
    };
};
