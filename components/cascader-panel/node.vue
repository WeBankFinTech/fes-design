<template>
    <li
        :id="`${menuId}-${node.nodeId}`"
        ref="elemRef"
        role="menuitem"
        :tabindex="node.isDisabled ? null : -1"
        :class="[
            prefixCls,
            node.checked && 'is-checked',
            node.isDisabled && 'is-disabled',
            inExpandingPath && 'in-active-path',
        ]"
        @mouseenter="handleHoverExpand"
        @focus="handleHoverExpand"
        @click="handleClick"
    >
        <!-- prefix -->
        <Checkbox
            v-if="multiple"
            :model-value="node.checked"
            :indeterminate="node.indeterminate"
            :disabled="isDisabled"
            @click.stop
            @change="handleCheck"
        />

        <!-- content -->
        <NodeContent :node="node" />

        <!-- postfix -->
        <template v-if="!isLeaf">
            <RightOutlined :class="`${prefixCls}-icon-arrow`"></RightOutlined>
        </template>
        <template v-else-if="!multiple && node.checked">
            <CheckOutlined :class="`${prefixCls}-icon-check`"></CheckOutlined>
        </template>
    </li>
</template>

<script>
import { computed, defineComponent, inject, ref, watch } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './const';
import Checkbox from '../checkbox';
import CheckOutlined from '../icon/CheckOutlined';
import RightOutlined from '../icon/RightOutlined';
import NodeContent from './nodeContent';

const prefixCls = getPrefixCls('cascader-node');

export default defineComponent({
    name: 'FCascaderNode',
    components: {
        Checkbox,
        CheckOutlined,
        NodeContent,
        RightOutlined,
    },
    props: {
        node: {
            type: Object,
            required: true,
        },
        menuId: {
            type: String,
            required: true,
        },
    },
    emits: [],
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);

        const isLeaf = computed(() => props.node.isLeaf);
        const isDisabled = computed(() => props.node.isDisabled);
        const multiple = computed(() => panel.multiple);
        const isHoverMenu = computed(() => panel.isHoverMenu);

        const elemRef = ref(null);

        watch(
            () => elemRef.value,
            () => {
                panel.setNodeElem(props.node, elemRef.value);
            },
        );

        /**
         * 判断节点是否在当前的展开路径
         * 通过当前节点的 level 即可判断当前节点是否在展开路径节点中
         */
        const isInPath = (expandingNode) => {
            const { level, nodeId } = props.node;
            return expandingNode?.pathNodes[level - 1]?.nodeId === nodeId;
        };
        const inExpandingPath = computed(() => isInPath(panel.expandingNode));

        const doCheck = (checked) => {
            const { node } = props;
            if (checked === node.checked) return;
            if (node.isDisabled) return;
            panel.handleCheckChange(node, checked);
        };

        // 叶子节点也执行展开方法，以便跨级展开的时候更新菜单列表
        const handleExpand = () => {
            if (inExpandingPath.value) return;
            panel.handleExpandNode(props.node);
        };

        const handleHoverExpand = () => {
            if (!isHoverMenu.value) return;
            handleExpand();
        };

        const handleCheck = (checked) => {
            doCheck(checked);
            handleExpand();
        };

        const handleClick = () => {
            // 单选情况，单击区分展开和选中
            if (!multiple.value) {
                if (isLeaf.value && !isDisabled.value) {
                    handleCheck(true);
                } else if (!isLeaf.value) {
                    handleExpand();
                }
            } else {
                // 多选情况，单击仅考虑展开即可
                handleExpand();
            }
        };

        return {
            elemRef,
            prefixCls,
            isLeaf,
            isDisabled,
            multiple,
            inExpandingPath,
            handleClick,
            handleCheck,
            handleHoverExpand,
        };
    },
});
</script>
