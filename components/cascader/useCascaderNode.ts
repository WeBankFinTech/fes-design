import { inject, computed } from 'vue';
import { CASCADER_PROVIDE_KEY } from './props';

import type { CascaderNodeProps } from './cascaderNode';
import { CascaderNodeKey, InnerCascaderOption } from './interface';

export default (props: CascaderNodeProps) => {
    const root = inject(CASCADER_PROVIDE_KEY);

    const isExpanded = computed(() => root.nodeList[props.value].isExpanded);
    const isSelected = computed(() => root.hasSelected(props.value));
    const isChecked = computed(() => root.hasChecked(props.value));

    const isLoaded = computed(() => {
        return root.hasLoaded(root.nodeList[props.value]);
    });

    const hasChildLoaded = (value: CascaderNodeKey): boolean => {
        return root.nodeList[value].childrenValues.every((childValue) =>
            root.hasLoaded(root.nodeList[childValue]),
        );
    };
    const isCheckNeedLoad = computed(
        () => !isLoaded.value || !hasChildLoaded(props.value),
    );

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
        isSelected,
        isChecked,
        isIndeterminate,
        isLoaded,
        isCheckNeedLoad,
    };
};
