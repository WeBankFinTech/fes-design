import { ref } from 'vue';
import { addUnit } from '../_util/utils';
import type { ScrollbarProps } from './interface';

export default (props: ScrollbarProps) => {
    const containerRef = ref<HTMLElement>();
    const ratioX = ref(1);
    const ratioY = ref(1);
    const thumbMoveX = ref(0);
    const thumbMoveY = ref(0);
    const sizeHeight = ref('0');
    const sizeWidth = ref('0');

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
            sizeHeight.value =
                height + GAP < offsetHeight ? addUnit(height) : '';
            sizeWidth.value = width + GAP < offsetWidth ? addUnit(width) : '';
        }
    };

    const onScroll = () => {
        const containerRefValue = containerRef.value;
        if (containerRefValue) {
            const offsetHeight = containerRefValue.offsetHeight - GAP;
            const offsetWidth = containerRefValue.offsetWidth - GAP;

            // 滚动条滚动比例
            // = (offsetHeight - H) / H
            // = (scrollHeight - offsetHeight) / offsetHeight
            // = scrollTop / offsetHeight
            thumbMoveY.value =
                ((containerRefValue.scrollTop * 100) / offsetHeight) *
                ratioY.value;
            thumbMoveX.value =
                ((containerRefValue.scrollLeft * 100) / offsetWidth) *
                ratioX.value;
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
    };
};
