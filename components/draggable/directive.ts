import { computed, reactive, ref, SetupContext, watch } from 'vue';
import {
    BeforeDragEnd,
    DraggableItem,
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
} from './useDraggable';

import type { FObjectDirective } from '../_util/interface';

const dragInstanceMap = new WeakMap();

const updateStyle = (el: HTMLElement, items: DraggableItem[]) => {
    if (!el?.children?.length) return;
    for (let index = 0; index < el.children.length; index++) {
        const node = el.children[index] as HTMLElement;
        const item = items[index];
        if (item?.draggable) {
            node.setAttribute('draggable', 'true');
        } else {
            node.removeAttribute('draggable');
        }
        const opacity = item?.style.opacity || item?.elStyle.opacity || '';
        const transition =
            item?.style.transition || item?.elStyle.transition || '';
        const transform =
            item?.style.transform || item?.elStyle.transform || '';
        const style = node.style as unknown as Record<string, unknown>;
        style.opacity = opacity;
        style.transition = transition;
        style.transform = transform;
    }
};

export default {
    name: 'drag',
    mounted(el: HTMLElement, binding) {
        const bindArg = binding.arg as unknown as {
            onDragStart: (...args: unknown[]) => void;
            beforeDragEnd?: BeforeDragEnd;
            onDragEnd: (...args: unknown[]) => void;
        };
        const props = reactive({
            list: binding.value || [],
            droppable: binding.modifiers.droppable,
            disabled: binding.modifiers.disabled,
            isDirective: true,
            beforeDragEnd: bindArg?.beforeDragEnd,
        });
        const containerRef = ref(el);
        const propsRef = computed(() => props);
        const emit = (type: string, ...args: unknown[]) => {
            switch (type) {
                case DRAG_START_EVENT:
                    bindArg?.onDragStart?.(...args);
                    break;
                case DRAG_END_EVENT:
                    bindArg?.onDragStart?.(...args);
                    break;
                case UPDATE_MODEL_EVENT:
                    const list: unknown[] = (args[0] as unknown[]) || [];
                    list.forEach((item, index) => {
                        propsRef.value.list[index] = list[index];
                    });
                    propsRef.value.list.length = list.length;
                    break;
            }
        };
        const drag = useDraggable(containerRef, propsRef, {
            emit,
        } as SetupContext);
        el.addEventListener('mousedown', drag.onDragStart);
        el.addEventListener('dragover', drag.onDragOver);
        el.addEventListener('drop', drag.onDragEnd);
        el.addEventListener('mouseup', drag.onDragEnd);
        el.addEventListener('dragend', drag.onDragEnd);
        el.addEventListener('transitionend', drag.onAnimationEnd);

        watch(
            () => drag.draggableItems,
            () => updateStyle(el, drag.draggableItems),
            { deep: true },
        );

        dragInstanceMap.set(el, { drag, props });
    },
    updated(el: HTMLElement, binding) {
        const { drag, props } = dragInstanceMap.get(el) || {};
        if (!props) return;
        props.list = binding.value || [];
        props.droppable = binding.modifiers.droppable;
        props.disabled = binding.modifiers.disabled;
        drag.onUpdated();
    },
    beforeUnmount(el) {
        const { drag } = dragInstanceMap.get(el) || {};
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
