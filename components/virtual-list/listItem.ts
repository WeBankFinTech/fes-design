/**
 * item component, we need to know their size change at any time
 */

import { defineComponent, ref, cloneVNode, onMounted } from 'vue';
import { ItemProps } from './props';
import useResize from '../_util/use/useResize';
import { getFirstValidNode } from '../_util/vnode';
import getElementFromRef from '../_util/getElementFromRef';

// wrapping for item
export const FVirtualListItem = defineComponent({
    name: 'FVirtualListItem',
    props: ItemProps,
    setup(props, { attrs }) {
        const itemRef = ref();
        const shapeKey = props.horizontal ? 'offsetWidth' : 'offsetHeight';

        // tell parent current size identify by unqiue key
        const dispatchSizeChange = () => {
            const s = itemRef.value ? itemRef.value[shapeKey] : 0;
            (attrs as any).onItemResized(props.uniqueKey, s);
        };

        onMounted(() => {
            useResize(itemRef, dispatchSizeChange);
        });

        return {
            itemRef,
        };
    },
    render() {
        const { index, source, slotComponent } = this;

        const vNode = getFirstValidNode(slotComponent({ index, source }), 1);
        return cloneVNode(
            vNode,
            {
                ref: (el) => {
                    if (el) this.itemRef = getElementFromRef(el);
                },
            },
            true,
        );
    },
});
