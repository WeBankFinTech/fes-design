import { computed, reactive, ref, SetupContext, watch } from 'vue';
import {
    BeforeDragEnd,
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    useDraggable,
} from './useDraggable';

import type { FObjectDirective } from '../_util/interface';

export default {
    name: 'drag',
    mounted(el: HTMLElement, binding) {
        const bindArg = binding.arg as unknown as {
            onDragStart: (...args: unknown[]) => void;
            beforeDragEnd?: BeforeDragEnd;
            onDragEnd: (...args: unknown[]) => void;
        };
        const fesDrag = reactive({
            props: {
                list: binding.value || [],
                droppable: binding.modifiers.droppable,
                disabled: binding.modifiers.disabled,
                isDirective: true,
                beforeDragEnd: bindArg?.beforeDragEnd,
            },
            drag: null,
        });
        const emit = (type: string, ...args: unknown[]) => {
            switch (type) {
                case DRAG_START_EVENT:
                    bindArg?.onDragStart?.(...args);
                    break;
                case DRAG_END_EVENT:
                    bindArg?.onDragStart?.(...args);
                    break;
            }
        };
        const containerRef = ref(el);
        const propsRef = computed(() => fesDrag.props);
        const drag = useDraggable(containerRef, propsRef, {
            emit,
        } as SetupContext);
        el.addEventListener('mousedown', drag.onDragStart);
        el.addEventListener('dragover', drag.onDragOver);
        el.addEventListener('drop', drag.onDragEnd);
        el.addEventListener('mouseup', drag.onDragEnd);
        el.addEventListener('dragend', drag.onDragEnd);
        el.addEventListener('transitionend', drag.onAnimationEnd);

        fesDrag.drag = drag;

        watch(
            () => drag.draggableItems,
            () => {
                for (
                    let index = 0;
                    index < containerRef.value.children.length;
                    index++
                ) {
                    const node = containerRef.value.children[
                        index
                    ] as HTMLElement;
                    const item = drag.draggableItems[index];
                    if (item) {
                        node.setAttribute('draggable', String(item?.draggable));
                        node.style.transform = item?.style.transform;
                        node.style.transition = item?.style.transition;
                        node.style.opacity = '' + item?.style.opacity;
                    }
                }
            },
            { deep: true },
        );
        (binding.instance as any).__fes_drag = fesDrag;
    },
    updated(el: HTMLElement, binding) {
        const fesDrag = (binding.instance as any).__fes_drag;
        if (!fesDrag) return;
        fesDrag.props.list = binding.value || [];
        fesDrag.props.droppable = binding.modifiers.droppable;
        fesDrag.props.disabled = binding.modifiers.disabled;
        fesDrag.drag.onUpdated();
    },
    beforeUnmount(el, binding) {
        const fesDrag = (binding.instance as any).__fes_drag;
        const drag = fesDrag?.drag;
        if (drag) {
            el.removeEventListener('mousedown', drag.onDragStart);
            el.removeEventListener('dragover', drag.onDragOver);
            el.removeEventListener('drop', drag.onDragEnd);
            el.removeEventListener('mouseup', drag.onDragEnd);
            el.removeEventListener('dragend', drag.onDragEnd);
            el.removeEventListener('transitionend', drag.onAnimationEnd);
        }
    },
} as FObjectDirective;
