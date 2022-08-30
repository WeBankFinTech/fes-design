import { isFunction } from 'lodash-es';
import { nextTick, watch, Ref, ComputedRef, SetupContext, reactive } from 'vue';

export const UPDATE_MODEL_EVENT = 'update:modelValue';
export const DRAG_START_EVENT = 'drag-start';
export const DRAG_END_EVENT = 'drag-end';

export type BeforeDragEnd = (
    drag: {
        item: unknown;
        index: number;
        list: unknown[];
        resultList: unknown[];
    },
    drop: {
        item: unknown;
        index: number;
        list: unknown[];
        resultList: unknown[];
    },
) => Promise<boolean> | boolean;

type PropsRef = ComputedRef<{
    list: unknown[];
    droppable: boolean;
    disabled: boolean;
    beforeDragEnd?: BeforeDragEnd;
    isDirective?: boolean;
}>;

type CurrentStatus = {
    drag?: { el: Element; index: number };
    animationEnd?: boolean;
    /** 放置在条目上时，需要跳过当次的dragover事件 */
    isDropOverItem?: boolean;
};

type DragContext = {
    propsRef: PropsRef;
    current: CurrentStatus;
    draggableItems: DraggableItem[];
    FLIP: (isFirst: boolean) => void;
    emit: (event: string, ...args: unknown[]) => void;
    resetDragWhenEnd: (event?: Event) => void;
};

type BackupContext = {
    draggableItems?: DraggableItem[];
    list?: unknown[];
    index?: number;
    revertStatus?: () => void;
    resetDragWhenEnd?: (event?: Event) => void;
};

let dragSourceCxt: DragContext | null;
let sourceBackup: BackupContext | null;

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

// 根据目标元素
function findElement(target?: Element, parent?: Element) {
    if (!parent || !target) return;
    for (let index = 0; index < parent.children.length; index++) {
        const el = parent.children[index];
        if (el.contains(target)) {
            return { el: el as Element, index };
        }
    }
    return;
}
class DraggableItem {
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

    setDraggable(draggable = false) {
        this.draggable = draggable;
        this.style.opacity = draggable ? 0.4 : 1;
    }
}

export const useDraggable = (
    containerRef: Ref<Element | undefined>,
    propsRef: PropsRef,
    ctx?: SetupContext,
) => {
    const draggableItems: DraggableItem[] = reactive([]);
    const current: CurrentStatus = {};
    const backup: BackupContext = {};
    const emit = ctx?.emit || (() => null);
    const onUpdated = (fn: () => void) => {
        if (propsRef.value.isDirective) {
            isFunction(fn) && fn();
        } else {
            nextTick(fn);
        }
    };
    const FLIP = (isFirst: boolean) => {
        if (!containerRef.value) return;
        for (
            let index = 0;
            index < containerRef.value.children.length;
            index++
        ) {
            const node = containerRef.value.children[index];
            if (!draggableItems[index])
                draggableItems[index] = new DraggableItem();
            const item = draggableItems[index];
            const rect = node.getBoundingClientRect();
            if (isFirst) {
                // First
                item.first.x = rect.left;
                item.first.y = rect.top;
            } else {
                // Last
                item.last.x = rect.left;
                item.last.y = rect.top;
                // Invert
                item.style.transform = `translate3d(${
                    item.first.x - item.last.x
                }px, ${item.first.y - item.last.y}px , 0)`;
                item.style.transition = '';
            }
        }
        if (isFirst) return;
        requestAnimationFrame(() => {
            // Play
            draggableItems.forEach((item) => {
                item.style.transition = 'transform 200ms ease';
                item.style.transform = '';
            });
        });
    };

    // 从backup中恢复状态
    const revertStatus = () => {
        FLIP(true);
        backup.list.forEach((item, index) => {
            draggableItems[index] = backup.draggableItems?.[index];
        });
        emit(UPDATE_MODEL_EVENT, backup.list);
        onUpdated(() => {
            FLIP(false);
        });
    };

    const computeDropTarget = (event: DragEvent) => {
        const target = findElement(event.target as Element, containerRef.value);
        if (!target) {
            if (event.target === containerRef.value) {
                // 放最后
                return {
                    el: null,
                    index: propsRef.value.list.length,
                };
            }
            return null;
        }
        return target;
    };

    const resetDragWhenEnd = (event?: Event) => {
        const index = current.drag?.index;
        if (event && index >= 0) {
            emit(
                DRAG_END_EVENT,
                event,
                propsRef.value.list[index],
                draggableItems[index],
                index,
            );
        }
        backup.list = null;
        if (sourceBackup?.list) {
            sourceBackup.list = null;
        }
        backup.draggableItems = [];
        backup.index = -1;
        current.drag = null;
        current.animationEnd = true;
        current.isDropOverItem = false;
        draggableItems.forEach((item) => {
            item.setDraggable(false);
        });
    };

    const shareSource = () => {
        dragSourceCxt = {
            propsRef,
            current,
            draggableItems,
            FLIP,
            emit,
            resetDragWhenEnd,
        };
    };

    const backupStatus = () => {
        backup.list = [...propsRef.value.list];
        backup.draggableItems = [...draggableItems];
        backup.index = current.drag?.index;
        backup.revertStatus = revertStatus;
        backup.resetDragWhenEnd = resetDragWhenEnd;
    };

    const onAnimationEnd = () => {
        current.animationEnd = true;
        current.isDropOverItem = false;
    };

    /** 拖拽开始 */
    const onDragStart = (event: Event) => {
        const { disabled, droppable, list } = propsRef.value;
        if (disabled) return;
        current.drag = findElement(event.target as Element, containerRef.value);
        if (!current.drag) return;

        const index = current.drag.index;
        const item = draggableItems[index];
        onAnimationEnd(); // 动画结束
        item.setDraggable(true); // 设置选中元素为可拖拽
        backupStatus();
        if (droppable) {
            shareSource(); // 跨容器，当前即是源，分享其他方法给目标容器
            sourceBackup = { ...backup };
        }
        emit(DRAG_START_EVENT, event, list[index], item, index);
    };

    const onDragOver = (event: DragEvent) => {
        event.preventDefault();
        const { droppable, list } = propsRef.value;
        const { animationEnd, isDropOverItem, drag } = current;
        const s = dragSourceCxt;

        // 如果动画没结束，就直接结束
        if (!animationEnd || (s && !s.current.animationEnd)) return;
        // 目标位置
        const drop = computeDropTarget(event);
        if (!drop) return;

        let listEvens: unknown; // 差值
        let draggableItemEvens: DraggableItem; // 差值
        let dragIndex = -1;
        if (droppable && s && !containerRef.value.contains(s.current.drag.el)) {
            // 从source容器拖拽到当前容器，source容器移除
            s.FLIP(true);
            current.isDropOverItem = !!drop.el;
            const sDragIndex = s.current.drag.index;
            if (!backup.list) {
                // 跨框时，记录当前首次状态
                backupStatus();
                backup.index = sDragIndex;
            }
            listEvens = arrayMove(s.propsRef.value.list, sDragIndex)[0];
            draggableItemEvens = arrayMove(s.draggableItems, sDragIndex)[0];
            s.current.animationEnd = false; // 动画开始
            s.current.drag = null;
            s.emit(UPDATE_MODEL_EVENT, s.propsRef.value.list);
        } else {
            // 拖拽目标在当前容器上
            dragIndex = drag.index;
            if (drop.index < 0) drop.index = 0;
            if (drop.index >= list.length) drop.index = list.length - 1;
            if (dragIndex === drop.index || isDropOverItem) return;
        }

        // 更新当前容器数据
        FLIP(true);
        arrayMove(list, dragIndex, drop.index, listEvens);
        arrayMove(draggableItems, dragIndex, drop.index, draggableItemEvens);
        emit(UPDATE_MODEL_EVENT, list);
        current.animationEnd = false; // 动画开始
        onUpdated(() => {
            current.drag = {
                index: drop.index === -1 ? 0 : drop.index,
                el: null,
            };
            current.drag.el = containerRef.value.children[drop.index];
            if (droppable) {
                shareSource();
                s.FLIP(false);
            }
            FLIP(false);
        });
    };

    const checkDragEnd = async () => {
        const { beforeDragEnd, list } = propsRef.value;
        const index = current?.drag?.index;
        if (isFunction(beforeDragEnd) && index >= 0) {
            // 校验是否需要可以放置
            let isTrue = false;
            let drag = {
                list: backup.list,
                index: backup.index,
                item: backup.list[backup.index],
                resultList: list, // 预期结果
            };
            const drop = { ...drag, index };
            if (sourceBackup?.list && backup.list !== sourceBackup.list) {
                const resultList = [...sourceBackup.list];
                arrayMove(resultList, sourceBackup.index);
                drag = {
                    list: sourceBackup.list,
                    index: sourceBackup.index,
                    item: sourceBackup.list[sourceBackup.index],
                    resultList,
                };
                drop.item = drag.item;
            }
            try {
                isTrue = await beforeDragEnd(drag, drop);
            } catch (error) {
                console.error(error);
                isTrue = false;
            }
            if (!isTrue) {
                revertStatus();
                sourceBackup?.revertStatus();
            }
        }
    };

    const onDragEnd = async (event: Event) => {
        const { droppable } = propsRef.value;
        await checkDragEnd();
        if (droppable && dragSourceCxt) {
            sourceBackup?.resetDragWhenEnd(event);
            dragSourceCxt = null;
        }
        resetDragWhenEnd(event);
    };
    resetDragWhenEnd();
    watch(containerRef, () => FLIP(true), { immediate: true });
    watch(
        propsRef,
        () => {
            onUpdated(() => FLIP(true));
        },
        { immediate: true, deep: true },
    );

    return {
        onAnimationEnd,
        onDragStart,
        onDragOver,
        onDragEnd,
        onUpdated,
        draggableItems,
    };
};
