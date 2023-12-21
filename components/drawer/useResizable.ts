import { computed, onMounted, ref, type ComputedRef } from 'vue';
import { useEventListener } from '@vueuse/core';
import { type DrawerPlacement } from './props';
import { DRAWER_MIN_SIZE } from './const';

const getDrawerMaxSize = (placement: DrawerPlacement): number =>
    ['left', 'right'].includes(placement)
        ? window.innerWidth
        : window.innerHeight;

export const useResizable = (config: {
    propsKey: ComputedRef<'width' | 'height'>;
    placement: ComputedRef<DrawerPlacement>;
    drawerSize: {
        width: string | number;
        height: string | number;
    };
    resizable: ComputedRef<boolean>;
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
            start = propsKey.value === 'width' ? e.clientX : e.clientY;

            isActive.value = true;

            // 拖拽的时候拿到实时的宽度或者高度
            lastSizeValue =
                propsKey.value === 'width'
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

        event.preventDefault();

        // 偏移量
        const offset =
            (propsKey.value === 'width' ? event.clientX : event.clientY) -
            start;

        let nextSize: number;
        // 根据 位置 偏移量正负加减
        if (['left', 'top'].includes(placement.value)) {
            // 鼠标移动时改变宽度或者高度
            nextSize = lastSizeValue + offset;
        } else {
            // 鼠标移动时改变宽度或者高度
            nextSize = lastSizeValue - offset;
        }

        // 限制抽屉最小、最大可拖拽尺寸
        if (nextSize < DRAWER_MIN_SIZE) {
            nextSize = DRAWER_MIN_SIZE;
        } else if (nextSize > getDrawerMaxSize(placement.value)) {
            nextSize = getDrawerMaxSize(placement.value);
        }

        drawerSize[propsKey.value] = nextSize;
    };

    // 拖拽的 dom 的位置和样式
    const dragClass = computed(() => {
        const classArr = [`${prefixCls}-drag`];
        switch (placement.value) {
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
        if (resizable.value) {
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
