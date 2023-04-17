import { inject, computed } from 'vue';
import { CASCADER_PROVIDE_KEY } from './props';

import { ROOT_MENU_KEY } from './const';
import type { CascaderMenuProps } from './cascaderMenu';
import type { InnerCascaderOption } from './interface';

export default function useCascaderMenu(props: CascaderMenuProps) {
    const root = inject(CASCADER_PROVIDE_KEY);

    const menuNodes = computed(() => {
        let nodes: InnerCascaderOption[] = [];

        if (props.menuKey === ROOT_MENU_KEY) {
            nodes = root.transformData.value
                .filter((value) => {
                    const node = root.nodeList[value];
                    return node.indexPath.length === 1;
                })
                .map((value) => root.nodeList[value]);
        } else {
            nodes =
                root.nodeList[props.menuKey]?.childrenValues.map(
                    (value) => root.nodeList[value],
                ) || [];
        }

        return nodes;
    });

    const isCascaderOpened = computed(() => root.props.isOpened);

    const menuScrollNode = computed(() => {
        return menuNodes.value.find((node) => {
            if (root.props.selectable) {
                return (
                    root.hasActive(node.value, root.nodeList) ||
                    root.hasSelected(node.value)
                );
            }
            if (root.props.checkable) {
                return root.hasChecked(node.value);
            }
            return false;
        });
    });

    return {
        menuNodes,
        isCascaderOpened,
        menuScrollNode,
    };
}
