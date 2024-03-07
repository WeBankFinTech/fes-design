import { computed, onUnmounted, ref } from 'vue';
import getPrefixCls from '../_util/getPrefixCls';
import type { InnerTreeOption, TreeNodeKey, DropPosition } from './interface';

const prefixCls = getPrefixCls('tree-node');

function allowDrop(node: InnerTreeOption, dropPosition: DropPosition): boolean {
    if (node.isLeaf === false) return true;
    if (node.children) {
        return true;
    }
    return dropPosition !== 'inside';
}

export default ({
    nodeList,
    emit,
    expandNode,
}: {
    nodeList: Map<TreeNodeKey, InnerTreeOption>;
    emit: any;
    expandNode: (value: TreeNodeKey, event: Event) => void;
}) => {
    let dragNode: InnerTreeOption | null;
    let overBeginTimeMap: { [propName: TreeNodeKey]: number } = {};
    const dragOverInfo = ref<{
        node: InnerTreeOption;
        position: DropPosition;
    }>();
    let timer: number;

    const dragHighlightNode = computed(() => {
        if (!dragOverInfo.value) {
            return;
        }
        const node = dragOverInfo.value.node;
        const position = dragOverInfo.value.position;
        if (position === 'after' || position === 'before') {
            return node.parent;
        }
        return node;
    });

    onUnmounted(() => {
        if (timer) {
            clearTimeout(timer);
        }
    });

    function resetDragState(): void {
        dragNode = null;
        overBeginTimeMap = {};
        dragOverInfo.value = null;
    }

    const handleDragstart = (value: TreeNodeKey, event: DragEvent) => {
        const node = nodeList.get(value);
        if (!node.draggable) {
            // 阻止默认事件，默认事件会有拖拽效果
            event.preventDefault();
            return;
        }
        dragNode = node;
        emit('dragstart', { node, event });
    };

    const handleDragend = (value: TreeNodeKey, event: DragEvent) => {
        resetDragState();
        const node = nodeList.get(value);
        if (!node.draggable) {
            event.preventDefault();
            return;
        }
        emit('dragend', {
            node,
            event,
        });
    };

    function getTargetNode(value: TreeNodeKey) {
        if (!dragNode) return;
        const node = nodeList.get(value);
        if (!node) return;
        if (node.indexPath.includes(dragNode.value)) return;
        return node;
    }

    const handleDragenter = (value: TreeNodeKey, event: DragEvent) => {
        const node = getTargetNode(value);
        if (!node) return;
        emit('dragenter', { node, event });
    };

    const handleDragleave = (value: TreeNodeKey, event: DragEvent) => {
        const node = getTargetNode(value);
        if (!node) return;
        emit('dragleave', { node, event });
    };

    const handleDragover = (value: TreeNodeKey, event: DragEvent) => {
        event.preventDefault();
        const node = getTargetNode(value);
        if (!node) {
            dragOverInfo.value = null;
            return;
        }
        emit('dragover', { node, event });
        // 悬浮1s以上展开节点
        if (!overBeginTimeMap[value]) {
            overBeginTimeMap[value] = Date.now();
        } else {
            if (
                Date.now() - overBeginTimeMap[value] > 1000 &&
                node.hasChildren &&
                !node.isExpanded.value
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

        const allowDropInside = allowDrop(node, 'inside');

        if (allowDropInside) {
            if (eventOffsetY <= 8) {
                mousePosition = 'before';
            } else if (eventOffsetY >= targetElOffsetHeight - 8) {
                mousePosition = 'after';
            } else {
                mousePosition = 'inside';
            }
        } else {
            if (eventOffsetY <= targetElOffsetHeight / 2) {
                mousePosition = 'before';
            } else {
                mousePosition = 'after';
            }
        }

        dragOverInfo.value = {
            node: node,
            position: mousePosition,
        };
        // 300毫秒后没有后续则表示已经移出
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            dragOverInfo.value = null;
        }, 300);
    };

    const handleDrop = (value: TreeNodeKey, event: DragEvent) => {
        const node = getTargetNode(value);
        if (!node) return;
        if (!dragOverInfo.value) {
            return;
        }
        emit('drop', {
            position: dragOverInfo.value.position,
            node: dragOverInfo.value.node,
            dragNode: dragNode,
            originNode: dragOverInfo.value.node.origin,
            originDragNode: dragNode.origin,
            event,
        });
    };

    return {
        handleDragstart,
        handleDragenter,
        handleDragover,
        handleDragleave,
        handleDragend,
        handleDrop,
        dragOverInfo,
        dragHighlightNode,
    };
};
