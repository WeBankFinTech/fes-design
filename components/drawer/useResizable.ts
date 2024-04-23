import { type Ref, computed, onMounted, ref } from 'vue';
import { useEventListener, useWindowSize } from '@vueuse/core';
import { isNil, isNumber } from 'lodash-es';
import { type DrawerInnerProps as Props } from './props';
import { COMPONENT_NAME, DRAWER_MIN_SIZE, prefixCls } from './const';

const calcResizableRange = (
    props: Props,
    drawerDimension: Ref<Props['dimension']>,
    windowDimension: Ref<number>,
): { max?: number; min?: number } => {
    if (!props.resizable) return {};

    const clientMaxSize = windowDimension.value;
    const formatSize = (
        size: Props['resizeMax'] | Props['resizeMin'],
    ): number | undefined => {
        if (isNil(size)) return undefined;
        if (isNumber(size)) return size;

        const pixelStrMatch = size.match(/^(\d+)px$/);
        if (pixelStrMatch) {
            return Number(pixelStrMatch[1]);
        }

        const percentageStrMatch = size.match(/^(\d+)%$/);
        if (percentageStrMatch) {
            return (clientMaxSize * Number(percentageStrMatch[1])) / 100;
        }

        return undefined;
    };

    // 如果 resize 的范围和 height, width 冲突，优先使用后者的值
    let max: number | undefined = formatSize(props.resizeMax);
    let min: number | undefined = formatSize(props.resizeMin);

    if (!isNil(max) && !isNil(min) && min > max) {
        console.warn(`[${COMPONENT_NAME}]: resizable range error, min > max`);
        return {};
    }

    const calculatedDimension = formatSize(drawerDimension.value);
    if (!isNil(calculatedDimension)) {
        if (!isNil(max)) {
            max = Math.max(max, calculatedDimension);
        }
        if (!isNil(min)) {
            min = Math.min(min, calculatedDimension);
        }
    }

    return { max, min };
};

export const useResizable = ({
    props,
    drawerDimension,
}: {
    props: Props;
    drawerDimension: Ref<Props['dimension']>;
}) => {
    const drawerRef = ref<HTMLElement | null>(null);
    const placement = computed(() => props.placement);
    const resizable = computed(() => props.resizable);

    const popDirection = computed(() =>
        ['top', 'bottom'].includes(props.placement) ? 'vertical' : 'horizontal',
    );

    const { height: windowHeight, width: windowWidth } = useWindowSize();
    const windowDimension = computed(() =>
        popDirection.value === 'vertical'
            ? windowHeight.value
            : windowWidth.value,
    );

    const resizableRange = computed(() =>
        calcResizableRange(props, drawerDimension, windowDimension),
    );

    let start = 0;

    let lastSizeValue: number | undefined;

    const isActive = ref(false);

    const onMousedown = (e: MouseEvent) => {
        if (drawerRef.value) {
            // 鼠标按下时的初始位置
            start = popDirection.value === 'horizontal' ? e.clientX : e.clientY;

            isActive.value = true;

            // 拖拽的时候拿到实时的宽度或者高度
            lastSizeValue
                = popDirection.value === 'horizontal'
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
        const offset
            = (popDirection.value === 'horizontal'
                ? event.clientX
                : event.clientY) - start;

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
        // 配置的范围限制
        const { min: configMin, max: configMax } = resizableRange.value;
        if (!isNil(configMin) && nextSize < configMin) {
            nextSize = configMin;
        } else if (!isNil(configMax) && nextSize > configMax) {
            nextSize = configMax;
        }
        // 兜底的范围限制
        const maxSize = windowDimension.value;
        if (nextSize < DRAWER_MIN_SIZE) {
            nextSize = DRAWER_MIN_SIZE;
        } else if (nextSize > maxSize) {
            nextSize = maxSize;
        }

        drawerDimension.value = nextSize;
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
        onMousedown,
        drawerRef,
        dragClass,
    };
};
