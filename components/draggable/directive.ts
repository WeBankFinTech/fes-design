import {
    type DirectiveBinding,
    type SetupContext,
    computed,
    reactive,
    ref,
    toRaw,
    watch,
} from 'vue';
import type { FObjectDirective } from '../_util/interface';
import {
    DRAG_END_EVENT,
    DRAG_START_EVENT,
    UPDATE_MODEL_EVENT,
    useDraggable,
} from './useDraggable';
import type {
    BeforeDragEnd,
    DraggableItem,
} from './useDraggable';

const dragInstanceMap = new WeakMap();

const updateStyle = (el: HTMLElement, items: DraggableItem[]) => {
    if (!el?.children?.length) {
        return;
    }
    for (let index = 0; index < el.children.length; index++) {
        const node = el.children[index] as HTMLElement;
        const item = items[index];
        if (item?.draggable) {
            node.setAttribute('draggable', 'true');
        } else {
            node.removeAttribute('draggable');
        }
        const opacity = item?.style.opacity || item?.elStyle.opacity || '';
        const transition
            = item?.style.transition || item?.elStyle.transition || '';
        const transform
            = item?.style.transform || item?.elStyle.transform || '';
        const style = node.style as unknown as Record<string, unknown>;
        style.opacity = opacity;
        style.transition = transition;
        style.transform = transform;
    }
};

const init = (el: HTMLElement, binding: DirectiveBinding<any>) => {
    if (binding.modifiers.disabled) {
        return;
    }
    const bindArg = binding.arg as unknown as {
        onDragstart: (...args: unknown[]) => void;
        beforeDragend?: BeforeDragEnd;
        onDragend: (...args: unknown[]) => void;
    };
    // 归一化：binding 值统一解包为纯数组（toRaw 去响应式包装，缺省为 []）
    const rawList = Array.isArray(toRaw(binding.value))
        ? (toRaw(binding.value) as unknown[])
        : [];
    const props = reactive({
        list: rawList,
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
            // 归一化后整属性替换：next 恒为纯数组（toRaw 解包响应式包装 / 缺省 []），
            // props.list 属性类型恒定数组，杜绝 Ref↔undefined 类型跃迁引发的递归崩溃；
            // 同时替换引用，使 useDraggable 依赖同一引用的原地 arrayMove
            // 始终写回用户的最新数组（含整数组替换场景）。
            const next = Array.isArray(toRaw(binding.value))
                ? (toRaw(binding.value) as unknown[])
                : [];
            props.list = next;
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
            el.removeEventListener('mousemove', drag.onMousemove);
            dragInstanceMap.delete(el);
        }
    },
} as FObjectDirective;
