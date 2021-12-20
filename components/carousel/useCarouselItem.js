import { ref } from 'vue';
import { CAROUSEL_NAME } from './const';

export default function useCarouselItem({ props, carouselState }) {
    // 子项集合
    const slideChildren = ref([]);

    const resetItemPosition = (oldIndex) => {
        slideChildren.value.forEach((item, index) => {
            item.translateItem(index, carouselState.activeIndex, oldIndex);
        });
    };

    function setActiveItem(itemIndex) {
        const index = Number(itemIndex);
        if (Number.isNaN(index) || index !== Math.floor(index)) {
            console.warn(
                `[${CAROUSEL_NAME}]: ${CAROUSEL_NAME} index must be an integer.`,
            );
            return;
        }
        const childrenCount = slideChildren.value.length;
        const oldIndex = carouselState.activeIndex;
        if (index < 0) {
            carouselState.activeIndex = props.loop ? childrenCount - 1 : 0;
        } else if (index >= childrenCount) {
            carouselState.activeIndex = props.loop ? 0 : childrenCount - 1;
        } else {
            carouselState.activeIndex = index;
        }
        if (oldIndex === carouselState.activeIndex) {
            resetItemPosition(oldIndex);
        }
    }

    function prev() {
        setActiveItem(carouselState.activeIndex - 1);
    }

    function next() {
        setActiveItem(carouselState.activeIndex + 1);
    }

    function addItem(item) {
        slideChildren.value.push(item);
    }

    function removeItem(uid) {
        const index = slideChildren.value.findIndex((item) => item.uid === uid);
        if (index !== -1) {
            slideChildren.value.splice(index, 1);
            if (carouselState.activeIndex === index) next();
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
