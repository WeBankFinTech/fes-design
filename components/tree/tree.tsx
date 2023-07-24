import { defineComponent, provide, VNodeChild } from 'vue';
import { isFunction, isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { useTheme } from '../_theme/useTheme';
import VirtualList from '../virtual-list';
import TreeNode from './treeNode';
import { COMPONENT_NAME } from './const';
import useData from './useData';
import useState from './useState';
import useDrag from './useDrag';
import useFilter from './useFilter';
import useExpand from './useExpand';
import useSelect from './useSelect';
import useCheck from './useCheck';
import useCurrentData from './useCurrentData';

import { treeProps, TREE_PROVIDE_KEY } from './props';

import type { TreeNodeKey } from './interface';

const prefixCls = getPrefixCls('tree');

export default defineComponent({
    name: COMPONENT_NAME.TREE,
    props: {
        ...treeProps,
    },
    emits: [
        'update:expandedKeys',
        'update:checkedKeys',
        'update:selectedKeys',
        'update:nodeList',
        'check',
        'expand',
        'load',
        'select',
        'dragstart',
        'dragenter',
        'dragover',
        'dragleave',
        'dragend',
        'drop',
    ],
    setup(props, { emit, expose }) {
        useTheme();
        const { nodeList, allKeys } = useData({
            props,
            emit,
        });

        const {
            currentExpandedKeys,
            updateExpandedKeys,
            currentCheckedKeys,
            updateCheckedKeys,
            currentSelectedKeys,
            updateSelectedKeys,
            hasSelected,
        } = useState({ props, emit });

        const { filter, filteredExpandedKeys, filteredKeys, isSearchingRef } =
            useFilter(props, allKeys, nodeList);

        const { expandNode, expandingNode } = useExpand({
            allKeys,
            isSearchingRef,
            filteredExpandedKeys,
            nodeList,
            currentExpandedKeys,
            updateExpandedKeys,
            props,
            emit,
        });

        const { selectNode } = useSelect({
            nodeList,
            currentSelectedKeys,
            updateSelectedKeys,
            props,
            emit,
        });

        const { checkNode } = useCheck({
            allKeys,
            nodeList,
            currentCheckedKeys,
            updateCheckedKeys,
            props,
            emit,
        });

        const { currentData } = useCurrentData({
            props,
            isSearchingRef,
            filteredExpandedKeys,
            currentExpandedKeys,
            filteredKeys,
            allKeys,
            expandingNode,
            nodeList,
        });

        const {
            handleDragstart,
            handleDragenter,
            handleDragover,
            handleDragleave,
            handleDragend,
            handleDrop,
            dragOverInfo,
        } = useDrag({ nodeList, emit, expandNode });

        if (expose) {
            expose({
                selectNode,
                expandNode,
                checkNode,
                filter,
            });
        }

        provide(TREE_PROVIDE_KEY, {
            props,
            selectNode,
            expandNode,
            checkNode,
            hasSelected,
            nodeList,
            handleDragstart,
            handleDragenter,
            handleDragover,
            handleDragleave,
            handleDragend,
            handleDrop,
            dragOverInfo,
        });

        const renderNode = (value: TreeNodeKey) => {
            const node = nodeList.get(value);
            const itemSlots: {
                [key: string]: () => VNodeChild | string;
            } = {};
            if (isFunction(node.prefix)) {
                itemSlots.prefix = node.prefix;
            }
            if (isString(node.prefix)) {
                itemSlots.prefix = () => node.prefix as string;
            }
            if (isFunction(node.suffix)) {
                itemSlots.suffix = node.suffix;
            }
            if (isString(node.suffix)) {
                itemSlots.suffix = () => node.suffix as string;
            }
            return (
                <TreeNode
                    key={node.uid}
                    level={node.level}
                    value={node.value}
                    label={node.label}
                    disabled={node.disabled}
                    selectable={node.selectable}
                    checkable={node.checkable}
                    isLeaf={node.isLeaf}
                    v-slots={itemSlots}
                    draggable={
                        props.draggable && !props.inline && !node.disabled
                    }
                ></TreeNode>
            );
        };

        const renderChildren = (arr: TreeNodeKey[]) =>
            arr.map((value) => renderNode(value));

        const renderDefault = ({ source }: { source: TreeNodeKey }) =>
            renderNode(source);

        return () =>
            props.virtualList && !props.inline ? (
                <VirtualList
                    dataSources={currentData.value}
                    dataKey={(source: TreeNodeKey) => {
                        return source;
                    }}
                    estimateSize={32}
                    keeps={14}
                    observeResize={false}
                    class={prefixCls}
                    v-slots={{ default: renderDefault }}
                />
            ) : (
                <div class={prefixCls} role="tree">
                    {renderChildren(currentData.value)}
                </div>
            );
    },
});
