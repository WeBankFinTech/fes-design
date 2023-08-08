import { ref } from 'vue';
import { pxfy } from '../_util/utils';
import type { ScrollbarProps } from './const';

export default (props: ScrollbarProps) => {
    const containerRef = ref<HTMLElement>();
    const ratioX = ref(1);
    const ratioY = ref(1);
    const thumbMoveX = ref(0);
    const thumbMoveY = ref(0);
    const sizeHeight = ref('0');
    const sizeWidth = ref('0');
    const scrollX = ref(false);
    const scrollXRatio = ref(0);
    const scrollY = ref(false);
    const scrollYRatio = ref(0);

    const GAP = 4;

    const onUpdate = () => {
        if (containerRef.value) {
            const offsetHeight = containerRef.value.offsetHeight - GAP;
            const offsetWidth = containerRef.value.offsetWidth - GAP;

            const originalThumbHeight =
                offsetHeight ** 2 / containerRef.value.scrollHeight;
            const originalThumbWidth =
                offsetWidth ** 2 / containerRef.value.scrollWidth;
            const height = Math.max(originalThumbHeight, props.minSize);
            const width = Math.max(originalThumbWidth, props.minSize);
            ratioY.value =
                originalThumbHeight /
                (offsetHeight - originalThumbHeight) /
                (height / (offsetHeight - height));
            ratioX.value =
                originalThumbWidth /
                (offsetWidth - originalThumbWidth) /
                (width / (offsetWidth - width));
            sizeHeight.value = height + GAP < offsetHeight ? pxfy(height) : '';
            sizeWidth.value = width + GAP < offsetWidth ? pxfy(width) : '';
        }
    };

    const onScroll = () => {
        const containerRefValue = containerRef.value;
        if (containerRefValue) {
            const offsetHeight = containerRefValue.offsetHeight - GAP;
            const offsetWidth = containerRefValue.offsetWidth - GAP;

            // 滚动条滚动比例
            thumbMoveY.value =
                ((containerRefValue.scrollTop * 100) / offsetHeight) *
                ratioY.value;
            thumbMoveX.value =
                ((containerRefValue.scrollLeft * 100) / offsetWidth) *
                ratioX.value;

            scrollY.value =
                containerRefValue.scrollHeight > containerRefValue.offsetHeight;

            scrollYRatio.value =
                containerRefValue.scrollTop /
                (containerRefValue.scrollHeight -
                    containerRefValue.offsetHeight);

            scrollX.value =
                containerRefValue.scrollWidth > containerRefValue.offsetWidth;

            scrollXRatio.value =
                containerRefValue.scrollLeft /
                (containerRefValue.scrollWidth - containerRefValue.offsetWidth);
        }
    };

    return {
        containerRef,
        onUpdate,
        onScroll,
        ratioX,
        ratioY,
        thumbMoveX,
        thumbMoveY,
        sizeHeight,
        sizeWidth,
        scrollX,
        scrollXRatio,
        scrollY,
        scrollYRatio,
    };
};
