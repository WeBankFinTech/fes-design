import { computed, onMounted, ref, shallowRef, watch } from 'vue';
import { useEventListener, useThrottleFn } from '@vueuse/core';
import type { SetupContext } from 'vue';
import PopupManager from '../_util/popupManager';
import { noop } from '../_util/utils';
import type { BackTopEmits, BackTopProps } from './props';

export const useBackTop = (
    props: BackTopProps,
    emit: SetupContext<BackTopEmits>['emit'],
) => {
    const container = shallowRef< HTMLElement>(null);
    const visible = ref(false);
    let clearScrollListener = noop;

    const handleScroll = () => {
        if (container.value) {
            visible.value = container.value.scrollTop >= props.visibilityHeight;
        }
    };

    const handleClick = (event: MouseEvent) => {
        container.value?.scrollTo({ top: 0, behavior: 'smooth' });
        emit('click', event);
    };

    const handleScrollThrottled = useThrottleFn(handleScroll, 300, true);

    function init() {
        container.value = document.documentElement;

        if (props.target instanceof HTMLElement) {
            container.value = props.target;
        }

        clearScrollListener();
        if (container.value === document.documentElement) {
            clearScrollListener = useEventListener(document, 'scroll', handleScrollThrottled);
        } else {
            clearScrollListener = useEventListener(container.value, 'scroll', handleScrollThrottled);
        }

        // Give visible an initial value
        handleScroll();
    }

    onMounted(() => {
        init();
    });

    watch(
        () => props.target,
        () => {
            init();
        },
    );

    const zIndex = ref(PopupManager.nextZIndex());
    watch(
        visible,
        () => {
            if (visible) {
                zIndex.value = PopupManager.nextZIndex();
            }
        },
    );

    const backTopStyle = computed(() => ({
        right: `${props.right}px`,
        bottom: `${props.bottom}px`,
        zIndex: zIndex.value,
    }));

    return {
        visible,
        handleClick,
        backTopStyle,
    };
};
