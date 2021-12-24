import { inject, computed } from 'vue';
import { PROVIDE_KEY } from './const';

export default (props) => {
    const root = inject(PROVIDE_KEY);

    const isExpanded = computed(() => root.hasExpanded(props.value));
    const isSelected = computed(() => root.hasSelected(props.value));
    const isChecked = computed(() => root.hasChecked(props.value));
    const isIndeterminate = computed(() => root.hasIndeterminate(props.node));
    const isChildrenInline = computed(
        () =>
            root.props.inline &&
            !props.isLeaf &&
            props.node.children.every((item) => item.isLeaf),
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
