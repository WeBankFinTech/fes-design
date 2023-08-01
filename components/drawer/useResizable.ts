import { computed, onMounted, ref } from 'vue';
import { useEventListener } from '@vueuse/core';

export const useResizable = (config: {
    propsKey: 'width' | 'height';
    placement: string;
    drawerSize: {
        width: string | number;
        height: string | number;
    };
    resizable: boolean;
    prefixCls: string;
}) => {
    const { propsKey, drawerSize, placement, resizable, prefixCls } = config;

    const drawerRef = ref<HTMLElement | null>(null);

    let start = 0;

    let lastSizeValue: number | undefined;

    const isActive = ref(false);

    const isHover = ref(false);

    let timer: number | undefined;

    const onMouseenter = () => {
        timer = setTimeout(() => {
            isHover.value = true;
        }, 300);
    };

    const onMouseleave = () => {
        isHover.value = false;
        if (timer) clearTimeout(timer);
    };

    const onMousedown = (e: MouseEvent) => {
        if (drawerRef.value) {
            // 鼠标按下时的初始位置
            start = propsKey === 'width' ? e.clientX : e.clientY;

            isActive.value = true;

            // 拖拽的时候拿到实时的宽度或者高度
            lastSizeValue =
                propsKey === 'width'
                    ? drawerRef.value.offsetWidth
                    : drawerRef.value.offsetHeight;
        }
    };

    const onMouseup = () => {
        if (!isActive.value) return;

        start = 0;
        isActive.value = false;
    };

    const doResize = (event: MouseEvent) => {
        if (!isActive.value) return;

        // 偏移量
        const offset =
            (propsKey === 'width' ? event.clientX : event.clientY) - start;

        // 根据 位置 偏移量正负加减
        if (['left', 'top'].includes(placement)) {
            // 鼠标移动时改变宽度或者高度
            drawerSize[propsKey] = lastSizeValue + offset;
        } else {
            // 鼠标移动时改变宽度或者高度
            drawerSize[propsKey] = lastSizeValue - offset;
        }
    };

    // 拖拽的dom 的位置和样式
    const dragClass = computed(() => {
        const classArr = [`${prefixCls}-drag`];
        if (isHover.value) {
            classArr.push(`${prefixCls}-drag-hover`);
        }
        switch (placement) {
            case 'left':
                classArr.push(`${prefixCls}-drag-left`);
                break;
            case 'right':
                classArr.push(`${prefixCls}-drag-right`);
                break;
            case 'top':
                classArr.push(`${prefixCls}-drag-top`);
                break;
            case 'bottom':
                classArr.push(`${prefixCls}-drag-bottom`);
                break;
        }
        return classArr;
    });

    // 可拖拽的时候才发起事件监听
    onMounted(() => {
        if (resizable) {
            useEventListener(window.document, 'mousemove', doResize);
            useEventListener(window.document, 'mouseup', onMouseup);
        }
    });

    return {
        onMouseenter,
        onMouseleave,
        onMousedown,
        drawerRef,
        dragClass,
    };
};
