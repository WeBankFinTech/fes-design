import { computed, reactive, ref, watch } from 'vue';
import { useDraggable } from './useDraggable';

import type { FObjectDirective } from '../_util/interface';

export default {
    name: 'drag',
    mounted(el: HTMLElement, binding) {
        const fesDrag = reactive({
            props: {
                list: binding.value || [],
                droppable: binding.modifiers.droppable,
                disabled: binding.modifiers.disabled,
            },
            drag: null,
        });
        const containerRef = ref(el);
        const propsRef = computed(() => fesDrag.props);
        const drag = useDraggable(containerRef, propsRef);
        el.addEventListener('mousedown', drag.handleSelectDrag);
        el.addEventListener('dragover', drag.handleDragover);
        el.addEventListener('drop', drag.handleDragEnd);
        el.addEventListener('mouseup', drag.handleDragEnd);
        el.addEventListener('dragend', drag.handleDragEnd);
        el.addEventListener('transitionend', drag.handleTransitionEnd);

        fesDrag.drag = drag;

        watch(
            () => drag.settings,
            () => {
                for (
                    let index = 0;
                    index < containerRef.value.children.length;
                    index++
                ) {
                    const node = containerRef.value.children[
                        index
                    ] as HTMLElement;
                    const setting = drag.settings.value[index];
                    node.setAttribute('draggable', String(setting?.draggable));
                    node.style.transform = setting?.style.transform;
                    node.style.transition = setting?.style.transition;
                    node.style.opacity = '' + setting?.style.opacity;
                }
            },
            { deep: true },
        );
        (binding.instance as any).__fes_drag = fesDrag;
    },
    updated(el: HTMLElement, binding) {
        const fesDrag = (binding.instance as any).__fes_drag;
        if (!fesDrag) return;
        fesDrag.props = {
            list: binding.value || [],
            droppable: binding.modifiers.droppable,
            disabled: binding.modifiers.disabled,
        };
    },
    beforeUnmount(el, binding) {
        const fesDrag = (binding.instance as any).__fes_drag;
        const drag = fesDrag?.drag;
        if (drag) {
            el.removeEventListener('mousedown', drag.handleSelectDrag);
            el.removeEventListener('dragover', drag.handleDragover);
            el.removeEventListener('drop', drag.handleDragEnd);
            el.removeEventListener('mouseup', drag.handleDragEnd);
            el.removeEventListener('dragend', drag.handleDragEnd);
            el.removeEventListener('transitionend', drag.handleTransitionEnd);
        }
    },
} as FObjectDirective;
