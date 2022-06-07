import { ref } from 'vue';
import type {
    InnerTreeOption,
    TreeNodeKey,
    TreeNodeList,
    DropPosition,
} from './interface';
import getPrefixCls from '../_util/getPrefixCls';

const prefixCls = getPrefixCls('tree-node');

export default ({
    nodeList,
    emit,
    expandNode,
}: {
    nodeList: TreeNodeList;
    emit: any;
    expandNode: (value: TreeNodeKey, event: Event) => void;
}) => {
    let dragNode: InnerTreeOption | null;
    let overBeginTimeMap: { [propName: TreeNodeKey]: number } = {};
    const dragOverInfo = ref<{
        node: InnerTreeOption;
        position: DropPosition;
    }>();

    function resetDragState(): void {
        dragNode = null;
        overBeginTimeMap = {};
        dragOverInfo.value = null;
    }

    const handleDragstart = (value: TreeNodeKey, event: DragEvent) => {
        const node = nodeList[value];
        dragNode = node;
        emit('dragstart', { node, event });
    };

    const handleDragend = (value: TreeNodeKey, event: DragEvent) => {
        resetDragState();
        const node = nodeList[value];
        emit('dragend', { node, event });
    };

    const handleDragenter = (value: TreeNodeKey, event: DragEvent) => {
        if (!dragNode) return;
        const node = nodeList[value];
        if (!node) return;
        if (node.indexPath.includes(dragNode.value)) return;
        emit('dragenter', { node, event });
    };

    const handleDragover = (value: TreeNodeKey, event: DragEvent) => {
        event.preventDefault();
        if (!dragNode) return;
        const node = nodeList[value];
        if (!node) return;
        if (node.indexPath.includes(dragNode.value)) return;
        emit('dragover', { node, event });
        // 悬浮1s以上展开节点
        if (!overBeginTimeMap[value]) {
            overBeginTimeMap[value] = Date.now();
        } else {
            if (
                Date.now() - overBeginTimeMap[value] > 1000 &&
                !node.isExpanded
            ) {
                expandNode(value, event);
            }
        }
        const targetNodeEl = document.querySelector(
            `.${prefixCls}[data-value='${value}']`,
        );
        // 悬浮节点大小位置信息
        const { height: targetElOffsetHeight } =
            targetNodeEl.getBoundingClientRect();
        let mousePosition: DropPosition;
        const targeEl = event.currentTarget as HTMLElement;
        // 焦点节点大小位置信息
        const { top: elClientTop } = targeEl.getBoundingClientRect();
        const eventOffsetY = event.clientY - elClientTop;
        if (eventOffsetY <= targetElOffsetHeight / 2) {
            mousePosition = 'before';
        } else {
            mousePosition = 'after';
        }
        dragOverInfo.value = {
            node: node,
            position: mousePosition,
        };
    };

    const handleDragleave = (value: TreeNodeKey, event: DragEvent) => {
        if (!dragNode) return;
        const node = nodeList[value];
        if (!node) return;
        if (node.indexPath.includes(dragNode.value)) return;
        emit('dragleave', { node, event });
    };

    const handleDrop = (value: TreeNodeKey, event: DragEvent) => {
        if (!dragNode) return;
        const node = nodeList[value];
        if (!node) return;
        if (node.indexPath.includes(dragNode.value)) return;
        if (!dragOverInfo.value) {
            return;
        }
        emit('drop', { ...dragOverInfo.value, dragNode, event });
    };

    return {
        handleDragstart,
        handleDragenter,
        handleDragover,
        handleDragleave,
        handleDragend,
        handleDrop,
        dragOverInfo,
    };
};
