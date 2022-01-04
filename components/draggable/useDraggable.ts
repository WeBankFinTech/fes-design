import { nextTick, ref, watch, Ref, ComputedRef } from 'vue';

class Setting {
    draggable = false;

    first = {
        x: 0,
        y: 0,
    };

    last = {
        x: 0,
        y: 0,
    };

    style = {
        transition: '',
        transform: '',
        opacity: 1,
    };

    setDrag(draggable = false) {
        this.draggable = draggable;
        this.style.opacity = draggable ? 0.4 : 1;
    }
}

export const emits = ['drag-start', 'drag-end', 'update:modelValue'] as const;

interface DragTarget {
    el?: Element | null;
    index: number;
}

type PropsRef = ComputedRef<{
    list: never[];
    droppable: boolean;
    disabled: boolean;
}>;

interface Animation {
    done: boolean;
    duration: number;
}

type FDragEvent = typeof emits[number];

type DragSource = {
    dragTarget: DragTarget;
    containerRef: Ref<HTMLElement | undefined>;
    propsRef: PropsRef;
    settings: Ref<Setting[]>;
    animation: Animation;
    emitEvent: (event: FDragEvent, ...args: any[]) => void;
    updateSettingStyle: (isFirst?: boolean) => void;
    resetDragTarget: () => void;
};

let dragSource: DragSource | null;

function pushAt<T>(array: T[] = [], value: T, index: number) {
    if (index < 0) {
        return array.unshift(value);
    }
    if (index >= array.length) return array.push(value);
    const evens = array.splice(index, array.length - index);
    array.push(value, ...evens);
}

/**
 * 数组移动
 */
function arrayMove<T>(
    array: T[] = [],
    source = -1,
    target = -1,
    value?: T,
): T[] {
    if (source < 0) {
        // add target
        pushAt(array, value, target);
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return [value!];
    }
    if (target < 0) {
        // remove source
        return array.splice(source, 1);
    }
    const evens = array.splice(source, 1);
    pushAt(array, evens[0], target);
    return evens;
}

// 根据目标元素找到拖拽的元素
function findDragElement(target?: Element, parent?: Element) {
    if (!parent || !target) return;
    for (let index = 0; index < parent.children.length; index++) {
        const el = parent.children[index];
        if (el.contains(target)) {
            return {
                el,
                index,
            };
        }
    }
}

function resetDragWhenEnd(
    event: Event,
    {
        settings,
        dragTarget,
        list,
        emitEvent,
        resetDragTarget,
    }: Omit<
        DragSource,
        'updateSettingStyle' | 'propsRef' | 'animation' | 'containerRef'
    > & {
        list: never[];
    },
) {
    if (dragTarget.index < 0) return;
    const setting = settings.value[dragTarget.index];
    if (setting) setting.setDrag();
    emitEvent(emits[1], event, list[dragTarget.index]);
    resetDragTarget();
}

export function useDraggable(
    containerRef: Ref<HTMLElement | undefined>,
    propsRef: PropsRef,
    ctx: object = {},
) {
    const settings = ref<Setting[]>([]);
    const animation = {
        done: true,
        duration: 200,
    };

    const dragTarget: {
        el?: Element | null;
        index: number;
    } = { el: null, index: -1 };

    /** 放置在条目上时，需要跳过当次的dragover事件 */
    let isDropOverItem = false;

    /**
     * FLIP动画 https://aerotwist.com/blog/flip-your-animations/
     */
    function updateSettingStyle(isFirst = false) {
        if (!containerRef.value) return;
        for (
            let index = 0;
            index < containerRef.value.children.length;
            index++
        ) {
            const node = containerRef.value.children[index];
            if (!settings.value[index]) settings.value[index] = new Setting();
            const setting = settings.value[index];
            const rect = node.getBoundingClientRect();
            if (isFirst) {
                // First
                setting.first.x = rect.left;
                setting.first.y = rect.top;
            } else {
                // Last
                setting.last.x = rect.left;
                setting.last.y = rect.top;
                // Invert
                setting.style.transform = `translate3d(${
                    setting.first.x - setting.last.x
                }px, ${setting.first.y - setting.last.y}px , 0)`;
                setting.style.transition = '';
            }
        }
        if (isFirst) return;
        requestAnimationFrame(() => {
            // Play
            settings.value.forEach((item) => {
                item.style.transition = 'transform 200ms ease';
                item.style.transform = '';
            });
        });
    }

    function init() {
        if (containerRef.value) {
            updateSettingStyle(true);
        }
    }
    watch(containerRef, init, { immediate: true });

    function resetDragTarget() {
        dragTarget.el = null;
        dragTarget.index = -1;
    }

    function emitEvent(event: typeof emits[number], ...args: any[]) {
        if (typeof ctx.emit !== 'function') return;
        ctx.emit(event as any, ...args);
    }

    /** 设置共享数据 */
    function setGlobalShare() {
        dragSource = {
            dragTarget,
            containerRef,
            propsRef,
            settings,
            animation,
            emitEvent,
            updateSettingStyle,
            resetDragTarget,
        };
    }

    /**
     * 计算落点位置
     */
    function computeDropPos(event: DragEvent) {
        if (!containerRef.value) return;
        const target = findDragElement(
            event.target as Element,
            containerRef.value,
        );
        if (!target) {
            if (
                event.clientY > containerRef.value.getBoundingClientRect().top
            ) {
                // 底部
                return {
                    el: null,
                    index: propsRef.value.list.length,
                };
            }
            return {
                el: null,
                index: -1,
            };
        }
        return target;
    }

    function moveTarget(
        event: DragEvent,
        source?: DragSource | null,
        isCross?: boolean,
    ) {
        // 目标位置
        const target = computeDropPos(event);
        if (!target) return;
        let dragTargetIndex = dragTarget.index;
        let evens;
        let evens2;
        if (isCross && source) {
            // source框拖拽过来的
            isDropOverItem = !!target.el;
            source.updateSettingStyle(true);
            // 从source框移除拖拽
            // TODO evens
            evens = arrayMove(
                source.propsRef.value.list,
                source.dragTarget.index,
            )[0];
            evens2 = arrayMove(
                source.settings.value,
                source.dragTarget.index,
            )[0];
            source.animation.done = false;
            source.resetDragTarget();
            dragTargetIndex = -1;
            source.emitEvent(emits[2], source.propsRef.value.list);
        } else {
            // 当前框的
            if (target.index < 0) target.index = 0;
            if (target.index >= propsRef.value.list.length)
                target.index = propsRef.value.list.length - 1;
            if (target.index === dragTargetIndex) return;
        }
        // 先计算起始位置
        updateSettingStyle(true);
        // 在target框放入拖拽
        arrayMove(propsRef.value.list, dragTargetIndex, target.index, evens);
        arrayMove(settings.value, dragTargetIndex, target.index, evens2);
        emitEvent(emits[2], propsRef.value.list);
        animation.done = false;

        nextTick(() => {
            dragTarget.index = target.index === -1 ? 0 : target.index;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            dragTarget.el = containerRef.value!.children[dragTarget.index];
            if (source) {
                setGlobalShare(); // 反转共享数据
                source.updateSettingStyle(); // 计算移动后位置
            }
            // 计算移动后位置
            updateSettingStyle();
        });
    }

    /**
     * 过渡动画结束
     */
    function handleTransitionEnd() {
        animation.done = true;
        isDropOverItem = false;
    }

    /**
     * 选中拖拽条目
     */
    function handleSelectDrag(event: Event) {
        if (propsRef.value.disabled) return;
        const target = findDragElement(
            event.target as Element,
            containerRef.value,
        );

        if (!target || target.index < 0) return;

        dragTarget.index = target.index;
        dragTarget.el = target.el;
        // 设置开始拖拽状态
        handleTransitionEnd();
        if (settings.value.length <= 0) updateSettingStyle(true);
        const setting = settings.value[dragTarget.index];
        setting?.setDrag(true);

        if (propsRef.value.droppable) {
            // 共享容器拖拽的数据
            setGlobalShare();
        }
        emitEvent(
            emits[0],
            event,
            propsRef.value.list[dragTarget.index],
            setting,
        );
    }

    /**
     * 拖拽元素到目标元素上时
     */
    function handleDragover(event: DragEvent) {
        event.preventDefault();
        const source = dragSource; // 拖拽容器共享的数据
        if (!animation.done || (source && !source.animation.done)) return; // 如果动画没结束，就直接结束
        if (
            propsRef.value.droppable &&
            source &&
            containerRef.value &&
            !containerRef.value.contains(source?.dragTarget.el as Node)
        ) {
            // 从source框，拖拽到了当前框
            moveTarget(event, source, true);
            return;
        }
        if (dragTarget.index < 0 || isDropOverItem) return;
        moveTarget(event);
    }

    /**
     * 拖拽结束
     */
    function handleDragEnd(event: Event) {
        const source = dragSource;
        if (propsRef.value.droppable && source) {
            // reset source
            resetDragWhenEnd(event, {
                ...source,
                list: source.propsRef.value.list,
            });
            dragSource = null;
        }
        resetDragWhenEnd(event, {
            // reset current
            settings,
            dragTarget,
            list: propsRef.value.list,
            emitEvent,
            resetDragTarget,
        });
    }

    return {
        settings,
        handleSelectDrag,
        handleDragover,
        handleDragEnd,
        handleTransitionEnd,
    };
}
