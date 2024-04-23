import type { Ref } from 'vue';
import { throttle } from 'lodash-es';
import { useEventListener } from '@vueuse/core';

const usePreviewImageDrag = (
    transform: Ref<{
        offsetX: number;
        offsetY: number;
        enableTransition: boolean;
    }>,
) => {
    let isMouseDown = false;

    let startX: number;
    let startY: number;
    let imgOffsetX: number;
    let imgOffsetY: number;

    const handleMouseDown = (event: MouseEvent) => {
        // 取消默认图片拖拽的行为
        event.preventDefault();
        isMouseDown = true;
        // 存储鼠标按下的偏移量和事件发生坐标
        const { offsetX, offsetY } = transform.value;
        startX = event.pageX;
        startY = event.pageY;
        imgOffsetX = offsetX;
        imgOffsetY = offsetY;

        transform.value.enableTransition = false;
    };

    const handleDrag = throttle((event: MouseEvent) => {
        transform.value = {
            ...transform.value,
            offsetX: imgOffsetX + event.pageX - startX,
            offsetY: imgOffsetY + event.pageY - startY,
        };
    });

    // mousemove 事件监听 document 拖拽效果更流畅
    useEventListener(document, 'mousemove', (event) => {
        if (!isMouseDown) return;
        handleDrag(event);
    });

    useEventListener(document, 'mouseup', () => {
        if (!isMouseDown) return;
        isMouseDown = false;
    });

    return {
        handleMouseDown,
    };
};

export default usePreviewImageDrag;
