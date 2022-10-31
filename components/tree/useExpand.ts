import { Ref, shallowRef, onMounted } from 'vue';
import { cloneDeep } from 'lodash-es';
import { getBrotherKeys } from './helper';
import type { TreeNodeKey, InnerTreeOption } from './interface';
import type { TreeProps } from './props';

export default ({
    isSearchingRef,
    filteredExpandedKeys,
    nodeList,
    currentExpandedKeys,
    updateExpandedKeys,
    props,
    emit,
    allKeys,
}: {
    isSearchingRef: Ref<boolean>;
    filteredExpandedKeys: Ref<TreeNodeKey[]>;
    nodeList: Map<TreeNodeKey, InnerTreeOption>;
    currentExpandedKeys: Ref<TreeNodeKey[]>;
    updateExpandedKeys: (keys: TreeNodeKey[]) => void;
    props: TreeProps;
    emit: any;
    allKeys: Ref<TreeNodeKey[]>;
}) => {
    const expandingNode: Ref<InnerTreeOption | null> = shallowRef(null);

    const expandNode = (val: TreeNodeKey, event: Event) => {
        if (isSearchingRef.value) {
            const _value = cloneDeep(filteredExpandedKeys.value);
            const index = _value.indexOf(val);
            // 已经展开
            if (index !== -1) {
                _value.splice(index, 1);
            } else {
                _value.push(val);
            }
            filteredExpandedKeys.value = _value;
            return;
        }
        const node = nodeList.get(val);
        expandingNode.value = node;
        let values: TreeNodeKey[] = cloneDeep(currentExpandedKeys.value);
        const index = values.indexOf(val);
        // 已经展开
        if (index !== -1) {
            values.splice(index, 1);
            // 让动画早点动起来
            node.isExpanded.value = false;
        } else {
            if (props.accordion) {
                const brotherKeys = getBrotherKeys(node, props, nodeList);
                values = values.filter((item) => !brotherKeys.includes(item));
            }
            values.push(val);
            // 让动画早点动起来
            node.isExpanded.value = true;
        }
        updateExpandedKeys(values);
        emit('expand', {
            expandedKeys: values,
            event,
            node,
            expanded: values.includes(val),
        });
    };

    onMounted(() => {
        if (props.defaultExpandAll && currentExpandedKeys.value.length === 0) {
            updateExpandedKeys(
                allKeys.value.filter((value) => !nodeList.get(value).isLeaf),
            );
        }
    });

    return {
        expandNode,
        expandingNode,
    };
};
