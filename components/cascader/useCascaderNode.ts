import { inject, computed } from 'vue';
import { CASCADER_PROVIDE_KEY } from './props';

import type { CascaderNodeProps } from './cascaderNode';
import type { InnerCascaderOption } from './interface';

export default function useCascaderNode(props: CascaderNodeProps) {
    const root = inject(CASCADER_PROVIDE_KEY);

    const isExpanded = computed(() => root.nodeList[props.value].isExpanded);
    const isInitLoading = computed(
        () => root.nodeList[props.value].isInitLoading,
    );
    const isSelected = computed(() => root.hasSelected(props.value));
    const isChecked = computed(() => root.hasChecked(props.value));

    const isLoaded = computed(() => {
        return root.hasLoaded(root.nodeList[props.value]);
    });

    const isCheckLoaded = computed(() =>
        root.hasCheckLoaded(props.value, root.nodeList),
    );
    const isActive = computed(() => root.hasActive(props.value, root.nodeList));

    const hasIndeterminate = (node: InnerCascaderOption): boolean => {
        if (root.hasChecked(node.value)) {
            return false;
        }
        if (node.isLeaf) {
            return false;
        }
        return (
            root.props.cascade &&
            node.hasChildren &&
            node.childrenValues.some(
                (value) =>
                    root.hasChecked(value) ||
                    hasIndeterminate(root.nodeList[value]),
            )
        );
    };
    const isIndeterminate = computed(() =>
        hasIndeterminate(root.nodeList[props.value]),
    );

    return {
        root,
        isExpanded,
        isInitLoading,
        isSelected,
        isChecked,
        isIndeterminate,
        isLoaded,
        isCheckLoaded,
        isActive,
    };
}
