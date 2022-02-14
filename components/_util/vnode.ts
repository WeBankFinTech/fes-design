import { Fragment, Text, Comment, createTextVNode, VNode } from 'vue';

const TEMPLATE = 'template';

export const isFragment = (node: VNode) => node.type === Fragment;

export const isText = (node: VNode) => node.type === Text;

export const isComment = (node: VNode) => node.type === Comment;

export const isTemplate = (node: VNode) => node.type === TEMPLATE;

export function getChildren(node: VNode, depth: number): VNode | undefined {
    if (isComment(node)) return;
    if (isFragment(node) || isTemplate(node)) {
        return depth > 0
            ? // eslint-disable-next-line no-use-before-define
              getFirstValidNode(node.children as VNode[], depth - 1)
            : // eslint-disable-next-line no-undefined
              undefined;
    }
    return node;
}

/**
 * determine if the element is a valid element type rather than fragments and comment e.g. <template> v-if
 * @param node {VNode} node to be tested
 */
export const isValidElementNode = (node: VNode) =>
    !(isFragment(node) || isComment(node));

export function getFirstValidNode(nodes: VNode | VNode[], maxDepth = 3) {
    if (Array.isArray(nodes)) {
        return getChildren(nodes[0], maxDepth);
    }
    return getChildren(nodes, maxDepth);
}

export function getSlot(slots: any, slotName = 'default') {
    const slot = slots[slotName];
    if (slot === undefined) {
        throw new Error(`slot[${slotName}] is empty.`);
    }
    return slot();
}

// o(n) flatten
export function flatten(vNodes: VNode[], result: VNode[] = []) {
    vNodes.forEach((vNode) => {
        if (vNode === null) return;
        if (typeof vNode !== 'object') {
            if (typeof vNode === 'string' || typeof vNode === 'number') {
                result.push(createTextVNode(String(vNode)));
            }
            return;
        }
        if (Array.isArray(vNode)) {
            flatten(vNode, result);
            return;
        }
        if (vNode.type === Fragment) {
            if (vNode.children === null) return;
            if (Array.isArray(vNode.children)) {
                flatten(vNode.children as VNode[], result);
            }
            // rawSlot
        } else {
            result.push(vNode);
        }
    });
    return result;
}
