import { ref, Ref } from 'vue';
import { CAROUSEL_NAME } from './const';
import type { CarouselItemData } from './interface';

interface UseCarouselItemType {
    loop: boolean;
    activeIndex: Ref<number>;
}

export default function useCarouselItem({
    loop,
    activeIndex,
}: UseCarouselItemType) {
    // 子项集合
    const slideChildren: Ref<CarouselItemData[]> = ref([]);

    const resetItemPosition = (oldIndex?: number | unknown): void => {
        slideChildren.value.forEach((item, index) => {
            item.translateItem(index, activeIndex.value, oldIndex);
        });
    };

    function setActiveItem(itemIndex: number | string) {
        const index = Number(itemIndex);
        if (Number.isNaN(index) || index !== Math.floor(index)) {
            console.warn(
                `[${CAROUSEL_NAME}]: ${CAROUSEL_NAME} index must be an integer.`,
            );
            return;
        }
        const childrenCount = slideChildren.value.length;
        const oldIndex = activeIndex.value;
        if (index < 0) {
            activeIndex.value = loop ? childrenCount - 1 : 0;
        } else if (index >= childrenCount) {
            activeIndex.value = loop ? 0 : childrenCount - 1;
        } else {
            activeIndex.value = index;
        }
        if (oldIndex === activeIndex.value) {
            resetItemPosition(oldIndex);
        }
    }

    function prev() {
        setActiveItem(activeIndex.value - 1);
    }

    function next() {
        setActiveItem(activeIndex.value + 1);
    }

    function addItem(item: CarouselItemData) {
        slideChildren.value.push(item);
    }

    function removeItem(uid: number) {
        const index = slideChildren.value.findIndex((item) => item.uid === uid);
        if (index !== -1) {
            slideChildren.value.splice(index, 1);
            if (activeIndex.value === index) next();
        }
    }

    return {
        slideChildren,
        addItem,
        removeItem,
        resetItemPosition,
        setActiveItem,
        prev,
        next,
    };
}
