/**
 * item component, we need to know their size change at any time
 */

import { defineComponent, ref, createVNode, h } from 'vue';
import { ItemProps } from './props';
import useResize from '../_util/use/useResize';

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

        useResize(itemRef, dispatchSizeChange);

        return {
            itemRef,
        };
    },
    render() {
        const {
            tag,
            extraProps = {},
            index,
            source,
            scopedSlots = {},
            uniqueKey,
            slotComponent,
        } = this;

        const _props = {
            ...extraProps,
            source,
            index,
        };

        return h(
            tag,
            {
                key: uniqueKey,
                role: 'listItem',
                ref: (el) => {
                    if (el) this.itemRef = el;
                },
            },
            [
                createVNode(slotComponent, {
                    source,
                    index,
                    scope: _props,
                    slots: scopedSlots,
                }),
            ],
        );
    },
});
