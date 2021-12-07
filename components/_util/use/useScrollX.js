import { onBeforeUnmount, onMounted } from 'vue';

/**
 * @param { import('vue').Ref<HTMLElement> } targetRef
 */
export default (targetRef) => {
    /**
     *  处理绑定事件
     * @param {WheelEvent} event
     */
    function handleWheelEvent(event) {
        if (!event.currentTarget) return;
        const preventYWheel = event.currentTarget.offsetWidth < event.currentTarget.scrollWidth;
        if (!preventYWheel || event.deltaY === 0) return;
        event.currentTarget.scrollLeft += event.deltaY + event.deltaX;
        event.preventDefault();
    }

    /**
     *
     * @param  { ScrollToOptions } options
     */
    function scrollTo(options) {
        targetRef.value?.scrollTo(options);
    }

    onMounted(() => {
        targetRef.value.addEventListener('wheel', handleWheelEvent);
    });

    onBeforeUnmount(() => {
        targetRef.value.removeEventListener('wheel', handleWheelEvent);
    });

    return {
        scrollTo,
    };
};
