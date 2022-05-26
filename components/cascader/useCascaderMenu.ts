import { inject, computed } from 'vue';
import { CASCADER_PROVIDE_KEY } from './props';

import type { CascaderMenuProps } from './cascaderMenu';
import type { InnerCascaderOption } from './interface';
import { ROOT_MENU_KEY } from './const';

export default (props: CascaderMenuProps) => {
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

    return {
        menuNodes,
    };
};
