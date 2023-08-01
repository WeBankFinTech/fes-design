<template>
    <transition :name="`${prefixCls}-fade`">
        <div
            v-show="always || visible"
            ref="barRef"
            :class="[prefixCls, `is-${barMap.key}`]"
            @mousedown.stop.prevent="clickTrackHandler"
        >
            <div
                ref="thumbRef"
                :class="[`${prefixCls}-thumb`, cursorDown && `is-hovering`]"
                :style="thumbStyle"
                @mousedown.stop.prevent="clickThumbHandler"
            ></div>
        </div>
    </transition>
</template>

<script lang="ts">
import {
    computed,
    ref,
    onMounted,
    nextTick,
    CSSProperties,
    defineComponent,
    PropType,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import { BAR_MAP } from './const';

const prefixCls = getPrefixCls('scrollbar-track');

function renderThumbStyle({
    move,
    size,
    bar,
}: {
    move: number;
    size: string;
    bar: typeof BAR_MAP.vertical | typeof BAR_MAP.horizontal;
}) {
    const style: CSSProperties = {};
    const translate = `translate${bar.axis}(${move}%)`;

    style[bar.size] = size;
    style.transform = translate;

    return style;
}

const barProps = {
    vertical: Boolean,
    size: String,
    move: Number,
    ratio: Number,
    always: Boolean,
    scrollbarRef: Array as PropType<HTMLElement[]>,
    containerRef: Object as PropType<HTMLElement>,
} as const;

export default defineComponent({
    name: 'FBar',
    props: barProps,
    setup(props) {
        const containerRef = computed(() => props.containerRef);
        const barStore = ref<{
            [key: string]: number;
        }>({});
        const barRef = ref<HTMLElement>();
        const thumbRef = ref();

        const barMap = computed(
            () => BAR_MAP[props.vertical ? 'vertical' : 'horizontal'],
        );
        const thumbStyle = computed(() =>
            renderThumbStyle({
                size: props.size,
                move: props.move,
                bar: barMap.value,
            }),
        );
        const offsetRatio = computed(
            () =>
                barRef.value[barMap.value.offset] ** 2 /
                containerRef.value[barMap.value.scrollSize] /
                props.ratio /
                thumbRef.value[barMap.value.offset],
        );

        const visible = ref(false);

        const cursorLeave = ref();
        const cursorDown = ref();
        // eslint-disable-next-line no-undef
        let onselectstartStore: GlobalEventHandlers['onselectstart'] = null;
        const mouseMoveDocumentHandler = (e: MouseEvent) => {
            if (cursorDown.value === false) return;
            const prevPage = barStore.value[barMap.value.axis];

            if (!prevPage) return;

            const offset =
                (barRef.value.getBoundingClientRect()[barMap.value.direction] -
                    e[barMap.value.client]) *
                -1;
            const thumbClickPosition =
                thumbRef.value[barMap.value.offset] - prevPage;
            const thumbPositionPercentage =
                ((offset - thumbClickPosition) * 100 * offsetRatio.value) /
                barRef.value[barMap.value.offset];
            containerRef.value[barMap.value.scroll] =
                (thumbPositionPercentage *
                    containerRef.value[barMap.value.scrollSize]) /
                100;
        };

        let docMouseMoveClose: () => void;
        const mouseUpDocumentHandler = () => {
            cursorDown.value = false;
            barStore.value[barMap.value.axis] = 0;
            docMouseMoveClose?.();
            document.onselectstart = onselectstartStore;
            if (cursorLeave.value) {
                visible.value = false;
            }
        };

        const startDrag = (e: MouseEvent) => {
            e.stopImmediatePropagation();
            cursorDown.value = true;
            docMouseMoveClose = useEventListener(
                document,
                'mousemove',
                mouseMoveDocumentHandler,
            );
            useEventListener(document, 'mouseup', mouseUpDocumentHandler);
            onselectstartStore = document.onselectstart;
            document.onselectstart = () => false;
        };

        const mouseMoveScrollbarHandler = () => {
            cursorLeave.value = false;
            visible.value = !!props.size;
        };

        const mouseLeaveScrollbarHandler = () => {
            cursorLeave.value = true;
            visible.value = cursorDown.value;
        };
        onMounted(() => {
            nextTick(() => {
                props.scrollbarRef.forEach((item) => {
                    useEventListener(
                        item,
                        'mouseenter',
                        mouseMoveScrollbarHandler,
                    );
                    useEventListener(
                        item,
                        'mousemove',
                        mouseMoveScrollbarHandler,
                    );
                    useEventListener(
                        item,
                        'mouseleave',
                        mouseLeaveScrollbarHandler,
                    );
                });
            });
        });

        const clickTrackHandler = (e: MouseEvent) => {
            const offset = Math.abs(
                (e.target as HTMLElement).getBoundingClientRect()[
                    barMap.value.direction
                ] - e[barMap.value.client],
            );
            const thumbHalf = thumbRef.value[barMap.value.offset] / 2;
            const thumbPositionPercentage =
                ((offset - thumbHalf) * 100 * offsetRatio.value) /
                barRef.value[barMap.value.offset];
            containerRef.value[barMap.value.scroll] =
                (thumbPositionPercentage *
                    containerRef.value[barMap.value.scrollSize]) /
                100;
        };

        const clickThumbHandler = (e: MouseEvent) => {
            // prevent click event of middle and right button
            e.stopPropagation();
            if (e.ctrlKey || [1, 2].includes(e.button)) {
                return;
            }
            window.getSelection().removeAllRanges();
            startDrag(e);
            barStore.value[barMap.value.axis] =
                (e.currentTarget as HTMLElement)[barMap.value.offset] -
                (e[barMap.value.client] -
                    (e.currentTarget as HTMLElement).getBoundingClientRect()[
                        barMap.value.direction
                    ]);
        };

        return {
            prefixCls,
            barRef,
            thumbRef,
            visible,
            cursorDown,
            barMap,
            thumbStyle,
            clickTrackHandler,
            clickThumbHandler,
        };
    },
});
</script>
