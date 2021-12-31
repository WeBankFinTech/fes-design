import { inject, computed } from 'vue';
import { isNil } from 'lodash-es';
import { PROVIDE_KEY } from './const';

export default (props) => {
    const root = inject(PROVIDE_KEY);

    const isExpanded = computed(() => root.hasExpanded(props.value));
    const isSelected = computed(() => root.hasSelected(props.value));
    const isChecked = computed(() => root.hasChecked(props.value));
    const isIndeterminate = computed(() =>
        root.hasIndeterminate(root.nodeList[props.value]),
    );
    const isInline = computed(() => {
        if (!root.props.inline) {
            return false;
        }
        if (!props.isLeaf) {
            return false;
        }
        const nodeList = root.nodeList;
        const node = nodeList[props.value];
        const parentNodePath = node.indexPath[node.indexPath.length - 2];
        const parentNode = nodeList[parentNodePath];
        return parentNode.children.every((item) => {
            const hasChildren =
                Array.isArray(item.children) && item.children.length;
            let isLeaf;
            if (!isNil(item.isLeaf)) {
                isLeaf = item.isLeaf;
            } else if (hasChildren) {
                isLeaf = false;
            } else if (props.remote) {
                isLeaf = false;
            } else {
                isLeaf = true;
            }
            return isLeaf;
        });
    });

    const isFirst = computed(() => {
        if (!isInline.value) {
            return false;
        }
        const nodeList = root.nodeList;
        const node = nodeList[props.value];
        const parentNodePath = node.indexPath[node.indexPath.length - 2];
        const parentNode = nodeList[parentNodePath];
        return parentNode.children[0].value === props.value;
    });

    return {
        root,
        isExpanded,
        isSelected,
        isChecked,
        isIndeterminate,
        isInline,
        isFirst,
    };
};
