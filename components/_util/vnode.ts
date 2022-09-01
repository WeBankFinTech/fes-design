import {
    Fragment,
    Text,
    Comment,
    createTextVNode,
    VNode,
    VNodeChild,
    isVNode,
    Slots,
} from 'vue';

const TEMPLATE = 'template';

export const isFragment = (node: VNode) => node.type === Fragment;

export const isText = (node: VNode) => node.type === Text;

export const isComment = (node: VNode) => node.type === Comment;

export const isTemplate = (node: VNode) => node.type === TEMPLATE;

/**
 * determine if the element is a valid element type rather than fragments and comment e.g. <template> v-if
 * @param node {VNode} node to be tested
 */
export const isValidElementNode = (node: VNode) =>
    !(isFragment(node) || isComment(node));

export function getFirstValidNode(vNodes: VNodeChild[]): VNode | null {
    const slotContent = flatten(vNodes);
    // vue will normalize the slot, so slot must be an array
    if (slotContent.length === 1) {
        return slotContent[0];
    } else {
        console.warn(
            'getFirstSlotVNode',
            `vNodes should have exactly one child`,
        );
        return null;
    }
}

export function getSlot(
    slots: Slots,
    slotName = 'default',
    props: unknown = undefined,
) {
    const slot = slots[slotName];
    if (slot === undefined) {
        console.warn('getSlot', `slot[${slotName}] is empty.`);
        return null;
    }
    return slot(props);
}

// o(n) flatten
export function flatten(
    vNodes: VNodeChild[],
    result: VNode[] = [],
    key?: string,
) {
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
            const currentKey = key
                ? `${key}_${String(vNode.key)}`
                : String(vNode.key);
            if (Array.isArray(vNode.children)) {
                vNode.children.forEach((node: VNodeChild, index: number) => {
                    if (isVNode(node)) {
                        if (node.key === undefined || node.key === null) {
                            node.key = `${currentKey}_${index}`;
                        }
                    }
                });
                flatten(vNode.children, result, currentKey);
            }
        }
        // rawSlot
        else if (vNode.type !== Comment) {
            result.push(vNode);
        }
    });
    return result;
}
