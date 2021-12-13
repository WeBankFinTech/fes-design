/**
 * item component, we need to know their size change at any time
 */

import { defineComponent, onMounted, onUpdated, onBeforeUnmount, ref, createVNode, cloneVNode } from 'vue';
import { ItemProps } from './props';

// wrapping for item
export const FVirtualListItem = defineComponent({
    name: 'FVirtualListItem',
    props: ItemProps,
    setup(props, { attrs }) {
        let resizeObserver = null;

        const itemRef = ref('item');

        const shapeKey = props.horizontal ? 'offsetWidth' : 'offsetHeight';

        const getCurrentSize = () => (itemRef.value ? itemRef.value[shapeKey] : 0);
        // tell parent current size identify by unqiue key
        const dispatchSizeChange = () => {
            attrs.itemresized(props.uniqueKey, getCurrentSize());
        };

        onMounted(() => {
            dispatchSizeChange();
            if (typeof MutationObserver !== 'undefined') {
                resizeObserver = new MutationObserver(() => {
                    dispatchSizeChange();
                });
                resizeObserver.observe(itemRef.value, { characterData: false, childList: true, attributes: true });
            }
        });

        // since componet will be reused, so disptach when onUpdated
        onUpdated(() => dispatchSizeChange());

        onBeforeUnmount(() => {
            if (resizeObserver) {
                resizeObserver.disconnect();
                resizeObserver = null;
            }
        });

        const { tag, extraProps = {}, index, source, scopedSlots = {}, uniqueKey, slotComponent } = props;

        const _props = {
            ...extraProps,
            source,
            index,
        };

        const tempNode = createVNode(
            tag,
            {
                key: uniqueKey,
                role: 'listitem',
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

        const renderNode = () => cloneVNode(tempNode, { ref: itemRef }, true);

        return () => renderNode();
    },
});
