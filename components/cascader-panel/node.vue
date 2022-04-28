<template>
    <li
        :id="`${menuId}-${node.nodeId}`"
        ref="elemRef"
        role="menuitem"
        :aria-haspopup="!isLeaf"
        :aria-owns="isLeaf ? null : menuId"
        :aria-expanded="inExpandingPath"
        :tabindex="node.isDisabled ? undefined : -1"
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
        <template v-if="multiple">
            <!-- 由于 Checkbox 不支持手动处理选中状态，所以改为 click 事件监听处理 -->
            <Tooltip
                v-if="node.isNeedLazyLoad"
                placement="top-start"
                :content="loadingRequiredMessage"
            >
                <Checkbox
                    :model-value="node.checked"
                    :indeterminate="node.indeterminate"
                    :disabled="true"
                    @click.stop="handleSelectClick"
                />
            </Tooltip>

            <Checkbox
                v-else
                :model-value="node.checked"
                :indeterminate="node.indeterminate"
                :disabled="isDisabled"
                @click.stop
                @change="handleSelectCheck"
            />
        </template>

        <!-- content -->
        <NodeContent :node="node" />

        <!-- postfix -->
        <template v-if="!isLeaf">
            <template v-if="node.loading">
                <LoadingOutlined
                    :class="`${prefixCls}-icon-loading`"
                ></LoadingOutlined>
            </template>
            <template v-else>
                <RightOutlined
                    :class="`${prefixCls}-icon-arrow`"
                ></RightOutlined>
            </template>
        </template>
        <template v-else-if="!multiple && node.checked">
            <CheckOutlined :class="`${prefixCls}-icon-check`"></CheckOutlined>
        </template>
    </li>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    inject,
    PropType,
    ref,
    watch,
    nextTick,
} from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import { CASCADER_PANEL_INJECTION_KEY } from './props';
import Checkbox from '../checkbox';
import Tooltip from '../tooltip';
import CheckOutlined from '../icon/CheckOutlined';
import RightOutlined from '../icon/RightOutlined';
import LoadingOutlined from '../icon/LoadingOutlined';
import NodeContent from './nodeContent';

import type { CascaderNode } from './getNode';
import { useLocale } from '../config-provider/useLocale';

const prefixCls = getPrefixCls('cascader-v1-node');

const cascaderNodeProps = {
    node: {
        type: Object as PropType<CascaderNode>,
        required: true,
    },
    menuId: {
        type: String,
        required: true,
    },
} as const;

export default defineComponent({
    name: 'FCascaderNode',
    components: {
        Checkbox,
        CheckOutlined,
        NodeContent,
        RightOutlined,
        LoadingOutlined,
        Tooltip,
    },
    props: cascaderNodeProps,
    setup(props) {
        const panel = inject(CASCADER_PANEL_INJECTION_KEY);
        const { t } = useLocale();

        const isLeaf = computed(() => props.node.isLeaf);
        const isDisabled = computed(() => props.node.isDisabled);
        const multiple = computed(() => panel.multiple);
        const isHoverMenu = computed(() => panel.isHoverMenu);

        const loadingRequiredMessage = computed(() =>
            t('cascader.loadingRequiredMessage', {
                label: props.node.label,
            }),
        );

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
        const isInPath = (node?: CascaderNode) => {
            const { level, nodeId } = props.node;
            return node?.pathNodes[level - 1]?.nodeId === nodeId;
        };
        const inExpandingPath = computed(() => isInPath(panel.expandingNode));
        const isCurrentToExpand = computed(() => isInPath(panel.toExpandNode));

        const doCheck = (checked: boolean) => {
            const { node } = props;
            if (checked === node.checked) return;
            if (node.isDisabled) return;
            panel.handleCheckChange(node, checked);
        };

        const doLoad = async () => {
            await panel.handleLoadNode(props.node);

            await nextTick(); // 等待节点状态更新

            // 兼容同时点击 load 多个节点的情况
            if (!isLeaf.value && isCurrentToExpand.value) {
                handleExpand();
            }
        };

        // 叶子节点也执行展开方法，以便跨级展开的时候更新菜单列表
        const handleExpand = () => {
            panel.updateToExpandNode(props.node);
            if (inExpandingPath.value || props.node.loading) return;

            if (props.node.loaded) {
                panel.handleExpandNode(props.node);
            } else {
                doLoad();
            }
        };

        const handleHoverExpand = () => {
            if (!isHoverMenu.value) return;
            handleExpand();
        };

        const handleCheck = (checked: boolean) => {
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

        const handleSelectClick = () => {
            // 自动加载子节点列表
            if (!props.node.loaded) {
                doLoad();
            }
        };

        const handleSelectCheck = (checked: boolean) => {
            handleCheck(checked);
        };

        return {
            elemRef,
            prefixCls,
            isLeaf,
            isDisabled,
            multiple,
            inExpandingPath,
            handleClick,
            handleSelectClick,
            handleSelectCheck,
            handleHoverExpand,
            loadingRequiredMessage,
        };
    },
});
</script>
