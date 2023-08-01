import { onBeforeUnmount, onMounted, Ref } from 'vue';

export default function useScrollX(targetRef: Ref<HTMLElement>) {
    function handleWheelEvent(event: WheelEvent) {
        const currentTarget = event.currentTarget as HTMLElement;
        if (!currentTarget) return;
        const preventYWheel =
            currentTarget.offsetWidth < currentTarget.scrollWidth;
        if (!preventYWheel || event.deltaY === 0) return;
        currentTarget.scrollLeft += event.deltaY + event.deltaX;
        event.preventDefault();
    }

    // eslint-disable-next-line no-undef
    function scrollTo(options: ScrollToOptions) {
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
}
