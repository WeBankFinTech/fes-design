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
    const overInfo = ref<{ node: InnerTreeOption; position: DropPosition }>();

    let overBeginTimeMap: { [propName: TreeNodeKey]: number } = {};

    const handleDragstart = (value: TreeNodeKey, event: DragEvent) => {
        const node = nodeList[value];
        console.log('dragstart:', node, event);
        dragNode = node;
        emit('dragstart', { node, event });
    };

    const handleDragend = (value: TreeNodeKey, event: DragEvent) => {
        dragNode = null;
        overBeginTimeMap = {};
        overInfo.value = null;
        const node = nodeList[value];
        console.log('dragend:', node, event);
        emit('dragend', { node, event });
    };

    const handleDragenter = (value: TreeNodeKey, event: DragEvent) => {
        if (!dragNode) return;
        const node = nodeList[value];
        if (node.indexPath.includes(dragNode.value)) return;
        console.log('dragenter:', node, event);
        emit('dragenter', { node, event });
    };

    const handleDragover = (value: TreeNodeKey, event: DragEvent) => {
        event.preventDefault();
        const node = nodeList[value];
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
        overInfo.value = {
            node: node,
            position: mousePosition,
        };
    };

    const handleDragleave = (value: TreeNodeKey, event: DragEvent) => {
        const node = nodeList[value];
        if (node.indexPath.includes(dragNode.value)) return;
        console.log('dragleave:', node, event);
        emit('dragleave', { node, event });
    };

    const handleDrop = (value: TreeNodeKey, event: DragEvent) => {
        const node = nodeList[value];
        if (node.indexPath.includes(dragNode.value)) return;
        console.log('drop:', node, dragNode);
        emit('drop', { node, dragNode, event });
    };

    return {
        handleDragstart,
        handleDragenter,
        handleDragover,
        handleDragleave,
        handleDragend,
        handleDrop,
        overInfo,
    };
};
