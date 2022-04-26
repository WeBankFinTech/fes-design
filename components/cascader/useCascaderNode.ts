import { inject, computed } from 'vue';
import { CASCADER_PROVIDE_KEY } from './props';

import type { CascaderNodeProps } from './cascaderNode';

export default (props: CascaderNodeProps) => {
    const root = inject(CASCADER_PROVIDE_KEY);

    const isExpanded = computed(() => root.nodeList[props.value].isExpanded);
    const isSelected = computed(() => root.hasSelected(props.value));
    const isChecked = computed(() => root.hasChecked(props.value));
    const isIndeterminate = computed(() =>
        root.hasIndeterminate(root.nodeList[props.value]),
    );

    return {
        root,
        isExpanded,
        isSelected,
        isChecked,
        isIndeterminate,
    };
};
