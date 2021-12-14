/**
 * item component, we need to know their size change at any time
 */

import { defineComponent, onMounted, ref, createVNode, h } from 'vue';
import { ItemProps } from './props';

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
            attrs.onItemResized(props.uniqueKey, s);
        };

        onMounted(() => {
            dispatchSizeChange();
        });

        return {
            itemRef,
        };
    },
    render() {
        const { tag, extraProps = {}, index, source, scopedSlots = {}, uniqueKey, slotComponent } = this;

        const _props = {
            ...extraProps,
            source,
            index,
        };

        return h(
            tag,
            {
                key: uniqueKey,
                role: 'listitem',
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
