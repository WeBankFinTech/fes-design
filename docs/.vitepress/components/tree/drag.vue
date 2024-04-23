<template>
    <FTree :data="data" draggable @drop="onDrop" />
</template>
<script>
import { h, reactive } from 'vue';
import { PictureOutlined, PlusCircleOutlined } from '@fesjs/fes-design/icon';

function createData(level = 1, baseKey = '', prefix, suffix) {
    if (!level) return undefined;
    return Array.apply(null, { length: 2 }).map((_, index) => {
        const key = `${baseKey}${level}${index}`;
        return {
            label: key + createLabel(level),
            value: key,
            children: createData(level - 1, key, prefix, suffix),
            prefix: prefix ? () => h(PictureOutlined) : null,
            suffix: suffix ? () => h(PlusCircleOutlined) : null,
        };
    });
}

function createLabel(level) {
    if (level === 4) return '道生一';
    if (level === 3) return '一生二';
    if (level === 2) return '二生三';
    if (level === 1) return '三生万物';
}

function findSiblingsAndIndex(node, nodes) {
    if (!nodes) return [null, null];
    for (let i = 0; i < nodes.length; ++i) {
        const siblingNode = nodes[i];
        if (siblingNode.value === node.value) return [nodes, i];
        const [siblings, index] = findSiblingsAndIndex(
            node,
            siblingNode.children,
        );
        if (siblings && index !== null) return [siblings, index];
    }
    return [null, null];
}

export default {
    setup() {
        const data = reactive(createData(4));

        const onDrop = ({ originNode, originDragNode, position }) => {
            const [dragNodeSiblings, dragNodeIndex] = findSiblingsAndIndex(
                originDragNode,
                data,
            );
            if (dragNodeSiblings === null || dragNodeIndex === null) return;
            dragNodeSiblings.splice(dragNodeIndex, 1);
            if (position === 'before') {
                const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
                    originNode,
                    data,
                );
                if (nodeSiblings === null || nodeIndex === null) return;
                nodeSiblings.splice(nodeIndex, 0, originDragNode);
            } else if (position === 'after') {
                const [nodeSiblings, nodeIndex] = findSiblingsAndIndex(
                    originNode,
                    data,
                );
                if (nodeSiblings === null || nodeIndex === null) return;
                nodeSiblings.splice(nodeIndex + 1, 0, originDragNode);
            } else if (position === 'inside') {
                if (!originNode.children) {
                    originNode.children = [];
                }
                originNode.children.splice(0, 0, originDragNode);
            }
        };

        return {
            data,
            onDrop,
        };
    },
};
</script>
