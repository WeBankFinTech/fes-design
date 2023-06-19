import { Ref } from 'vue';
import { cloneDeep } from 'lodash-es';
import type { TreeNodeKey, InnerTreeOption } from './interface';
import type { TreeProps } from './props';

export default ({
    nodeList,
    currentSelectedKeys,
    updateSelectedKeys,
    props,
    emit,
}: {
    nodeList: Map<TreeNodeKey, InnerTreeOption>;
    currentSelectedKeys: Ref<TreeNodeKey[]>;
    updateSelectedKeys: (keys: TreeNodeKey[]) => void;
    props: TreeProps;
    emit: any;
}) => {
    const selectNode = (val: TreeNodeKey, event: Event) => {
        if (!props.selectable) {
            return;
        }
        const node = nodeList.get(val);
        const values = cloneDeep(currentSelectedKeys.value);
        const index = values.indexOf(val);
        if (props.multiple) {
            if (index !== -1) {
                if (props.cancelable) {
                    values.splice(index, 1);
                }
            } else {
                values.push(val);
            }
        } else if (index !== -1) {
            if (props.cancelable) {
                values.splice(index, 1);
            }
        } else {
            values[0] = val;
        }
        updateSelectedKeys(values);
        emit('select', {
            selectedKeys: values,
            event,
            node,
            selected: values.includes(val),
        });
    };

    return {
        selectNode,
    };
};
