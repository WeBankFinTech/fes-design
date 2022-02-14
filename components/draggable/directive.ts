import { computed, reactive, ref, watch } from 'vue';
import { useDraggable } from './useDraggable';

import type { FObjectDirective } from '../_util/interface';

const dragMap = reactive<{
    [key: string]: {
        props: {
            list: never[];
            droppable: boolean;
            disabled: boolean;
        };
        drag?: any; // TODO Ref 和 ReturnType 不能一起工作？
    };
}>({});

export default {
    name: 'drag',
    mounted(el: HTMLElement, binding) {
        const key = `drag_${Date.now()}_${Math.round(10000 * Math.random())}`;
        dragMap[key] = {
            props: {
                list: binding.value || [],
                droppable: binding.modifiers.droppable,
                disabled: binding.modifiers.disabled,
            },
        };
        const containerRef = ref(el);
        const propsRef = computed(() => dragMap[key].props);
        const drag = useDraggable(containerRef, propsRef);
        el.addEventListener('mousedown', drag.handleSelectDrag);
        el.addEventListener('dragover', drag.handleDragover);
        el.addEventListener('drop', drag.handleDragEnd);
        el.addEventListener('mouseup', drag.handleDragEnd);
        el.addEventListener('dragend', drag.handleDragEnd);
        el.addEventListener('transitionend', drag.handleTransitionEnd);

        dragMap[key].drag = drag;

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
        el.setAttribute('data-drag-key', key);
    },
    updated(el: HTMLElement, binding) {
        const key = el.getAttribute('data-drag-key');
        if (!key) return;
        dragMap[key].props = {
            list: binding.value || [],
            droppable: binding.modifiers.droppable,
            disabled: binding.modifiers.disabled,
        };
    },
    beforeUnmount(el) {
        const key = el.getAttribute('data-drag-key');
        const drag = dragMap[key].drag;
        if (drag) {
            el.removeEventListener('mousedown', drag.handleSelectDrag);
            el.removeEventListener('dragover', drag.handleDragover);
            el.removeEventListener('drop', drag.handleDragEnd);
            el.removeEventListener('mouseup', drag.handleDragEnd);
            el.removeEventListener('dragend', drag.handleDragEnd);
            el.removeEventListener('transitionend', drag.handleTransitionEnd);
        }
        delete dragMap[key];
    },
} as FObjectDirective;
