<template>
    <teleport :disabled="!getContainer?.()" :to="getContainer?.()">
        <div
            v-show="show"
            ref="containerRef"
            :class="`${prefixCls}`"
            :style="{ zIndex }"
            @click.self="hideOnClickModal && handleClose()"
        >
            <!-- close -->
            <div
                :class="[`${prefixCls}__close`, `${prefixCls}__btn`]"
                @click="handleClose"
            >
                <CloseOutlined />
            </div>

            <!-- arrow -->
            <div
                v-if="isGroup"
                :class="[`${prefixCls}__arrow-left`, `${prefixCls}__btn`]"
                @click="prev"
            >
                <LeftOutlined />
            </div>

            <div
                v-if="isGroup"
                :class="[`${prefixCls}__arrow-right`, `${prefixCls}__btn`]"
                @click="next"
            >
                <RightOutlined />
            </div>

            <div v-if="name" :class="`${prefixCls}__name`">
                {{ `${name}(${size.width}x${size.height})` }}
            </div>
            <!-- toolBar -->
            <div :class="`${prefixCls}__toolBar`">
                <SearchMinusOutlined
                    :class="`${prefixCls}-zoom-out`"
                    @click="handleActions('zoomOut', { zoomRate: 1.2 })"
                />
                <SearchPlusOutlined
                    :class="`${prefixCls}-zoom-in`"
                    @click="handleActions('zoomIn', { zoomRate: 1.2 })"
                />
                <a
                    v-if="download"
                    :download="name || Date.now()"
                    :href="src"
                    target="_blank"
                    :class="`${prefixCls}-download`"
                >
                    <DownloadOutlined />
                </a>
                <RotateLeftOutlined
                    :class="`${prefixCls}-rotate-left`"
                    @click="handleActions('rotateLeft')"
                />
                <ReloadOutlined
                    :class="`${prefixCls}-rotate-right`"
                    @click="handleActions('rotateRight')"
                />
            </div>

            <!-- canvas -->
            <img
                :class="[`${prefixCls}__canvas`]"
                :src="src"
                :style="previewStyle"
                @mousedown="handleMouseDown"
            >
        </div>
    </teleport>
</template>

<script lang="ts">
import {
    type CSSProperties,
    type ComponentObjectPropsOptions,
    type PropType,
    computed,
    defineComponent,
    inject,
    ref,
    watch,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import { noop, requestAnimationFrame } from '../_util/utils';
import PopupManager from '../_util/popupManager';
import {
    CloseOutlined,
    DownloadOutlined,
    LeftOutlined,
    ReloadOutlined,
    RightOutlined,
    RotateLeftOutlined,
    SearchMinusOutlined,
    SearchPlusOutlined,
} from '../icon';
import { CLOSE_EVENT } from '../_util/constants';
import { useConfig } from '../config-provider';
import { PREVIEW_PROVIDE_KEY } from './props';
import usePreviewImageDrag from './useDrag';

const prefixCls = getPrefixCls('preview');

const previewProps = {
    show: {
        type: Boolean,
        default: true,
    },
    hideOnClickModal: {
        type: Boolean,
        default: false,
    },
    src: {
        type: String,
        default: '',
    },
    download: {
        type: Boolean,
        default: false,
    },
    getContainer: {
        type: Function as PropType<() => HTMLElement>,
    },
    size: Object as PropType<{ width: number; height: number }>,
    name: String,
} as const satisfies ComponentObjectPropsOptions;

export default defineComponent({
    name: 'FPreview',
    components: {
        LeftOutlined,
        RightOutlined,
        CloseOutlined,
        ReloadOutlined,
        RotateLeftOutlined,
        SearchPlusOutlined,
        SearchMinusOutlined,
        DownloadOutlined,
    },
    props: previewProps,
    emits: [CLOSE_EVENT],
    setup(props, { emit }) {
        const containerRef = ref<HTMLElement>();
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        const zIndex = ref(PopupManager.nextZIndex());
        const transform = ref({
            scale: 1,
            rotateDeg: 0,
            offsetX: 0,
            offsetY: 0,
            enableTransition: false,
        });
        const { isGroup, next, prev } = inject(PREVIEW_PROVIDE_KEY, {
            isGroup: ref(false),
            next: noop,
            prev: noop,
        });

        const config = useConfig();
        const getContainer = computed(
            () => props.getContainer || config.getContainer?.value,
        );

        const previewStyle = computed(() => {
            const { scale, rotateDeg, offsetX, offsetY, enableTransition }
                = transform.value;

            const style: CSSProperties = {
                transform: [
                    `translate(${offsetX}px, ${offsetY}px)`,
                    `scale(${scale})`,
                    `rotate(${rotateDeg}deg)`,
                ].join(' '),
                transition: enableTransition ? 'transform .3s' : '',
            };

            if (
                props.size.height > clientHeight
                || props.size.width > clientWidth
            ) {
                if (
                    props.size.height / props.size.width
                    >= clientHeight / clientWidth
                ) {
                    style.height = `${clientHeight}px`;
                    style.width = 'auto';
                } else {
                    style.width = `${clientWidth}px`;
                    style.height = 'auto';
                }
            }

            return style;
        });

        const handleActions = (
            action: string,
            option?: {
                zoomRate?: number;
                rotateDeg?: number;
                enableTransition?: boolean;
            },
        ) => {
            const { zoomRate, rotateDeg, enableTransition } = {
                zoomRate: 1.1,
                rotateDeg: 90,
                enableTransition: true,
                ...option,
            };
            switch (action) {
                case 'zoomOut':
                    if (transform.value.scale < 0.2) {
                        break;
                    }
                    transform.value.scale = Number.parseFloat(
                        (transform.value.scale / zoomRate).toFixed(3),
                    );
                    break;
                case 'zoomIn':
                    transform.value.scale = Number.parseFloat(
                        (transform.value.scale * zoomRate).toFixed(3),
                    );
                    break;
                case 'rotateLeft':
                    transform.value.rotateDeg -= rotateDeg;
                    break;
                case 'rotateRight':
                    transform.value.rotateDeg += rotateDeg;
                    break;
                default:
            }
            transform.value.enableTransition = enableTransition;
        };

        const reset = () => {
            transform.value = {
                scale: 1,
                rotateDeg: 0,
                offsetX: 0,
                offsetY: 0,
                enableTransition: false,
            };
        };

        useEventListener(
            containerRef,
            'wheel',
            (e: WheelEvent) => {
                e.preventDefault();
                requestAnimationFrame(() => {
                    const delta = e.deltaY ? e.deltaY : e.detail;
                    handleActions(delta < 0 ? 'zoomIn' : 'zoomOut', {
                        enableTransition: false,
                    });
                });
            },
            {
                passive: false,
            },
        );

        const { handleMouseDown } = usePreviewImageDrag(transform);

        const handleClose = () => {
            emit(CLOSE_EVENT);
        };

        watch(
            () => props.src,
            () => {
                reset();
            },
        );

        return {
            containerRef,
            prefixCls,
            handleClose,
            isGroup,
            prev,
            next,
            handleActions,
            previewStyle,
            zIndex,
            handleMouseDown,
            getContainer,
        };
    },
});
</script>
