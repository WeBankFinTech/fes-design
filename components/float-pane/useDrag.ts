import { type Ref, computed, ref } from 'vue';
import { throttle } from 'lodash-es';
import { useEventListener } from '@vueuse/core';
import { depx } from '../_util/utils';
import type { PanePosition } from './props';

export const useDrag = (
    transform: Ref<{
        offsetX: number;
        offsetY: number;
    }>,
    domRef: Ref<HTMLElement>,
    domHeaderRef: Ref<HTMLElement>,
    getContainer: Ref<() => HTMLElement>,
    defaultPosition: PanePosition,
) => {
    const isDragging = ref(false);

    let startX: number;
    let startY: number;
    let imgOffsetX: number;
    let imgOffsetY: number;

    const limitTransformOffsetY = computed(() => {
        const containerRef = getContainer.value?.();
        // 不考虑非整个窗口拖拽超出边界的情况
        if (containerRef !== document.body) {
            return null;
        }
        // 仅考虑以 px 为单位的初始位置进行边界碰撞计算
        if (defaultPosition.bottom && defaultPosition.bottom?.endsWith('px')) {
            const bottom = depx(defaultPosition.bottom);
            return {
                min: -(window.innerHeight - bottom - domRef.value.offsetHeight),
                max: bottom + (domRef.value.offsetHeight - domHeaderRef.value.offsetHeight),
            };
        } else if (defaultPosition.top && defaultPosition.top?.endsWith('px')) {
            const top = depx(defaultPosition.top);
            return {
                min: top > 0 ? -top : 0,
                max: (window.innerHeight - top) - domHeaderRef.value.offsetHeight,
            };
        }
        return null;
    });

    const limitTransformOffsetX = computed(() => {
        const containerRef = getContainer.value?.();
        // 不考虑非整个窗口拖拽超出边界的情况
        if (containerRef !== document.body) {
            return null;
        }
        // 仅考虑以 px 为单位的初始位置进行边界碰撞计算
        // 左右保留 100px 的缓冲区
        if (defaultPosition.right && defaultPosition.right.endsWith('px')) {
            const right = depx(defaultPosition.right);
            return {
                min: -(window.innerWidth - right - 100),
                max: right + (domRef.value.offsetWidth - 100),
            };
        } else if (defaultPosition.left && defaultPosition.left.endsWith('px')) {
            const left = depx(defaultPosition.left);
            return {
                min: left > 0 ? -left : 0,
                max: (window.innerWidth - left) - 100,
            };
        }
        return null;
    });

    const handleMouseDown = (event: MouseEvent) => {
        // 取消默认图片拖拽的行为
        event.preventDefault();
        isDragging.value = true;
        // 存储鼠标按下的偏移量和事件发生坐标
        const { offsetX, offsetY } = transform.value;
        startX = event.pageX;
        startY = event.pageY;
        imgOffsetX = offsetX;
        imgOffsetY = offsetY;
    };

    const handleDrag = throttle((event: MouseEvent) => {
        // 避免移动到窗口外
        if (event.clientY <= 0 || event.clientX <= 0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight) {
            return;
        }

        const offsetX = imgOffsetX + event.pageX - startX;
        const offsetY = imgOffsetY + event.pageY - startY;

        if (limitTransformOffsetY) {
            if (offsetY < limitTransformOffsetY.value.min) {
                return;
            }
            if (offsetY > limitTransformOffsetY.value.max) {
                return;
            }
        }
        if (limitTransformOffsetX) {
            if (offsetX < limitTransformOffsetX.value.min) {
                return;
            }
            if (offsetX > limitTransformOffsetX.value.max) {
                return;
            }
        }

        transform.value = {
            ...transform.value,
            offsetX,
            offsetY,
        };
    });

    // mousemove 事件监听 document 拖拽效果更流畅
    useEventListener(document, 'mousemove', (event) => {
        if (!isDragging.value) {
            return;
        }
        handleDrag(event);
    });

    useEventListener(document, 'mouseup', () => {
        if (!isDragging.value) {
            return;
        }
        isDragging.value = false;
    });

    return {
        handleMouseDown,
        isDragging,
    };
};
