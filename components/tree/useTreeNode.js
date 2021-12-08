import { inject, computed } from 'vue';
import { PROVIDE_KEY } from './const';

export default (props) => {
    const root = inject(PROVIDE_KEY);

    const hasSelected = value => root.currentSelectedKeys.value.includes(value);
    const hasChecked = value => root.currentCheckedKeys.value.includes(value);
    const hasIndeterminate = (node) => {
        const value = node[root.props.valueField];
        if (hasChecked(value)) {
            return false;
        }
        if (node.isLeaf) {
            return false;
        }
        return (
            Array.isArray(node.children)
            && node.children.some(
                item => hasChecked(item[root.props.valueField])
                    || hasIndeterminate(item),
            )
        );
    };

    const isExpanded = computed(() => {
        if (root.filteredExpandedKeys.length) {
            return root.filteredExpandedKeys.includes(props.value);
        }
        return root.currentExpandedKeys.value.includes(props.value);
    });
    const isSelected = computed(() => hasSelected(props.value));
    const isChecked = computed(() => hasChecked(props.value));
    const isIndeterminate = computed(() => hasIndeterminate(props.node));
    const isChildrenInline = computed(
        () => root.props.inline
            && !props.isLeaf
            && props.node.children.every(item => item.isLeaf),
    );

    return {
        root,
        isExpanded,
        isSelected,
        isChecked,
        isIndeterminate,
        isChildrenInline,
    };
};
