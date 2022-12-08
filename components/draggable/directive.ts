import {
    computed,
    reactive,
    ref,
    SetupContext,
    watch,
    DirectiveBinding,
} from 'vue';
import {
    DraggableItem,
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
} from './useDraggable';
import type { BeforeDragEnd } from './useDraggable';

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

const init = (el: HTMLElement, binding: DirectiveBinding<any>) => {
    if (binding.modifiers.disabled) return;
    const bindArg = binding.arg as unknown as {
        onDragstart: (...args: unknown[]) => void;
        beforeDragend?: BeforeDragEnd;
        onDragend: (...args: unknown[]) => void;
    };
    const props = reactive({
        list: binding.value || [],
        droppable: binding.modifiers.droppable,
        disabled: binding.modifiers.disabled,
        isDirective: true,
        beforeDragend: bindArg?.beforeDragend,
    });
    const containerRef = ref(el);
    const propsRef = computed(() => props);
    const emit = (type: string, ...args: unknown[]) => {
        switch (type) {
            case DRAG_START_EVENT:
                bindArg?.onDragstart?.(...args);
                break;
            case DRAG_END_EVENT:
                bindArg?.onDragend?.(...args);
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
    el.addEventListener('mousedown', drag.onDragstart);
    el.addEventListener('dragover', drag.onDragover);
    el.addEventListener('drop', drag.onDragend);
    el.addEventListener('mouseup', drag.onDragend);
    el.addEventListener('dragend', drag.onDragend);
    el.addEventListener('transitionend', drag.onAnimationEnd);
    el.addEventListener('mousemove', drag.onMousemove);

    watch(
        () => drag.draggableItems,
        () => updateStyle(el, drag.draggableItems),
        { deep: true },
    );

    dragInstanceMap.set(el, { drag, props });
};

export default {
    name: 'drag',
    mounted(el: HTMLElement, binding) {
        init(el, binding);
    },
    updated(el: HTMLElement, binding) {
        const { drag, props } = dragInstanceMap.get(el) || {};
        if (drag && props) {
            props.list = binding.value || [];
            props.droppable = binding.modifiers.droppable;
            props.disabled = binding.modifiers.disabled;
            drag.onUpdated();
            return;
        }
        init(el, binding);
    },
    beforeUnmount(el) {
        const { drag } = dragInstanceMap.get(el) || {};
        if (drag) {
            el.removeEventListener('mousedown', drag.onDragstart);
            el.removeEventListener('dragover', drag.onDragover);
            el.removeEventListener('drop', drag.onDragend);
            el.removeEventListener('mouseup', drag.onDragend);
            el.removeEventListener('dragend', drag.onDragend);
            el.removeEventListener('transitionend', drag.onAnimationEnd);
        }
    },
} as FObjectDirective;
