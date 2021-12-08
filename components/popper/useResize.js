import {
    onBeforeUnmount,
    onMounted,
} from 'vue';
import { addResizeListener, removeResizeListener } from '../_util/resizeEvent';
import getElementFromRef from '../_util/getElementFromRef';

export default (triggerRef, update, props) => {
    const handleResize = () => {
        if (props.disabled) return;
        update();
    };

    onMounted(() => {
        addResizeListener(getElementFromRef(triggerRef.value), handleResize);
    });
    onBeforeUnmount(() => {
        removeResizeListener(getElementFromRef(triggerRef.value), handleResize);
    });
};
