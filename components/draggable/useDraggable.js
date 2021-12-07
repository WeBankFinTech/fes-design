import { nextTick, ref, watch } from 'vue';

const GLOBAL_SHARE = Symbol('DRAGGABLE_DROP_SHARE');
export const emits = ['drag-start', 'drag-end', 'update:modelValue'];

class Setting {
    draggable = false

    first = {
        x: 0,
        y: 0,
    }

    last = {
        x: 0,
        y: 0,
    }

    style = {
        transition: '',
        transform: '',
        opacity: 1,
    }

    setDrag(draggable = false) {
        this.draggable = draggable;
        this.style.opacity = draggable ? 0.4 : 1;
    }
}

function pushAt(array = [], value, index) {
    if (index < 0) {
        return array.unshift(value);
    }
    if (index >= array.length) return array.push(value);
    const evens = array.splice(index, array.length - index);
    array.push(value, ...evens);
}

/**
 * 数组移动
 * @param {*} array 操作的数组
 * @param {*} source 移动时的元素下标，< 0时，为在target位置添加元素，若taget也是<-1,在添加在头部
 * @param {*} target 移动到的元素下标，< 0时，为在source位置删除元素
 * @param {*} value 添加时的值
 * @returns
 */
function arrayMove(array = [], source = -1, target = -1, value) {
    if (source < 0) { // add target
        return pushAt(array, value, target);
    }
    if (target < 0) { // remove source
        return array.splice(source, 1);
    }
    const evens = array.splice(source, 1);
    return pushAt(array, evens[0], target);
}

/**
 * 根据目标元素找到拖拽的元素
 * @param {Element} target 目标元素
 * @param {Element} parent 父容器
 * @returns {{
 *  el: Element,
 *  index: number
 * }}
 */
// 根据目标元素找到拖拽的元素
function findDragElement(target, parent) {
    const res = {};
    if (!parent || !target) return res;
    for (let index = 0; index < parent.children.length; index++) {
        const el = parent.children[index];
        if (el.contains(target)) {
            res.el = el;
            res.index = index;
            break;
        }
    }
    return res;
}


function resetDragWhenEnd(event, {
    settings, dragTarget, list, emitEvent, resetDragTarget,
}) {
    if (dragTarget.index < 0) return;
    const setting = settings.value[dragTarget.index];
    if (setting) setting.setDrag();
    emitEvent(emits[1], event, list[dragTarget.index]);
    resetDragTarget();
}

/**
 * Draggable逻辑
 * @param {import('vue').Ref<Document>} containerRef
 * @param { import('vue').Ref<{
 *  list: Array,
 *  droppable: Boolean,
 *  disabled: Boolean
 * }> } propsRef
 * @param { {
 *  emit: Function
 * } } ctx
 * @returns
 */
export function useDraggable(containerRef, propsRef, ctx = {}) {
    /**
     * 拖拽的item设置，与数据的索引对应
     * @type {import('vue').Ref<Array<Setting>>}
     */
    const settings = ref([]);
    const animation = {
        done: true,
        duration: 200,
    };

    /**
     * @type {{el: Element,index: number}}
     */
    const dragTarget = { el: null, index: -1 };

    /** 放置在条目上时，需要跳过当次的dragover事件 */
    let isDropOverItem = false;

    /**
     * FLIP动画 https://aerotwist.com/blog/flip-your-animations/
     * @param { boolean } isFirst 是否计算开始位置
     * @returns
     */
    function updateSettingStyle(isFirst = false) {
        for (let index = 0; index < containerRef.value.children.length; index++) {
            const node = containerRef.value.children[index];
            if (!settings.value[index]) settings.value[index] = new Setting();
            const setting = settings.value[index];
            const rect = node.getBoundingClientRect();
            if (isFirst) { // First
                setting.first.x = rect.left;
                setting.first.y = rect.top;
            } else {
                // Last
                setting.last.x = rect.left;
                setting.last.y = rect.top;
                // Invert
                setting.style.transform = `translate3d(${setting.first.x - setting.last.x}px, ${setting.first.y - setting.last.y}px , 0)`;
                setting.style.transition = '';
            }
        }
        if (isFirst) return;
        requestAnimationFrame(() => { // Play
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

    function emitEvent(...args) {
        if (typeof ctx.emit !== 'function') return;
        ctx.emit(...args);
    }

    /** 设置共享数据 */
    function setGlobalShare() {
        window[GLOBAL_SHARE] = {
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
     * @param { DragEvent } target
     */
    function computeDropPos(event) {
        const target = findDragElement(event.target, containerRef.value);
        if (!target.el) {
            if (event.clientY > containerRef.value.getBoundingClientRect().top) { // 底部
                target.index = propsRef.value.list.length;
            } else { // 顶部
                target.index = -1;
            }
        }
        return target;
    }

    function moveTarget(event, source, isCross) {
        // 目标位置
        const target = computeDropPos(event);
        let dragTargetIndex = dragTarget.index;
        let evens;
        let evens2;
        if (isCross) { // source框拖拽过来的
            isDropOverItem = !!target.el;
            source.updateSettingStyle(true);
            // 从source框移除拖拽
            evens = arrayMove(source.propsRef.value.list, source.dragTarget.index)[0];
            evens2 = arrayMove(source.settings.value, source.dragTarget.index)[0];
            source.animation.done = false;
            source.resetDragTarget();
            dragTargetIndex = -1;
            source.emitEvent(emits[2], source.propsRef.value.list);
        } else { // 当前框的
            if (target.index < 0) target.index = 0;
            if (target.index >= propsRef.value.list.length) target.index = propsRef.value.list.length - 1;
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
            dragTarget.el = containerRef.value.children[dragTarget.index];
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
     * @param { DragEvent } event
     */
    function handleSelectDrag(event) {
        if (propsRef.value.disabled) return;
        const target = findDragElement(event.target, containerRef.value);
        if (target.index < 0) return;

        dragTarget.index = target.index;
        dragTarget.el = target.el;
        // 设置开始拖拽状态
        handleTransitionEnd();
        if (settings.value.length <= 0) updateSettingStyle(true);
        const setting = settings.value[dragTarget.index];
        setting?.setDrag(true);

        if (propsRef.value.droppable) { // 共享容器拖拽的数据
            setGlobalShare();
        }
        emitEvent(emits[0], event, propsRef.value.list[dragTarget.index], setting);
    }

    /**
     * 拖拽元素到目标元素上时
     * @param { DragEvent } event
     */
    function handleDragover(event) {
        event.preventDefault();
        const source = window[GLOBAL_SHARE]; // 拖拽容器共享的数据
        if (!animation.done || (source && !source.animation.done)) return; // 如果动画没结束，就直接结束
        if (propsRef.value.droppable && !containerRef.value.contains(source?.dragTarget.el)) { // 从source框，拖拽到了当前框
            moveTarget(event, source, true);
            return;
        }
        if (dragTarget.index < 0 || isDropOverItem) return;
        moveTarget(event);
    }

    /**
     * 拖拽结束
     */
    function handleDragEnd(event) {
        const source = window[GLOBAL_SHARE];
        if (propsRef.value.droppable && source) { // reset source
            resetDragWhenEnd(event, { ...source, list: source.propsRef.value.list });
            delete window[GLOBAL_SHARE];
        }
        resetDragWhenEnd(event, { // reset current
            settings, dragTarget, list: propsRef.value.list, emitEvent, resetDragTarget,
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
