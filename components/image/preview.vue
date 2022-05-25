<template>
    <teleport to="body">
        <div
            v-show="show"
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
                    @click="handleActions('zoomOut')"
                />
                <SearchPlusOutlined
                    :class="`${prefixCls}-zoom-in`"
                    @click="handleActions('zoomIn')"
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
                ref="img"
                :class="[`${prefixCls}__canvas`]"
                :src="src"
                :style="previewStyle"
            />
        </div>
    </teleport>
</template>

<script lang="ts">
import {
    inject,
    ref,
    computed,
    watch,
    onMounted,
    onUnmounted,
    defineComponent,
    PropType,
    CSSProperties,
} from 'vue';
import { useEventListener } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import { isFirefox, noop } from '../_util/utils';
import PopupManager from '../_util/popupManager';
import {
    LeftOutlined,
    RightOutlined,
    CloseOutlined,
    ReloadOutlined,
    RotateLeftOutlined,
    SearchPlusOutlined,
    SearchMinusOutlined,
    DownloadOutlined,
} from '../icon';
import { CLOSE_EVENT } from '../_util/constants';
import { PREVIEW_PROVIDE_KEY } from './props';

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
    size: Object as PropType<{ width: number; height: number }>,
    name: String,
} as const;

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
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        const zIndex = ref(PopupManager.nextZIndex());
        const transform = ref({
            scale: 1,
            rotateDeg: 0,
        });
        const { isGroup, next, prev } = inject(PREVIEW_PROVIDE_KEY, {
            isGroup: ref(false),
            next: noop,
            prev: noop,
        });

        const mousewheelEvent = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';

        const previewStyle = computed(() => {
            const { scale, rotateDeg } = transform.value;
            const style: CSSProperties = {
                transform: `scale(${scale}) rotate(${rotateDeg}deg)`,
                transition: 'transform .3s',
            };
            if (
                props.size.height > clientHeight ||
                props.size.width > clientWidth
            ) {
                if (
                    props.size.height / props.size.width >=
                    clientHeight / clientWidth
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

        const handleActions = (action: string, option?: object) => {
            const { zoomRate, rotateDeg } = {
                zoomRate: 0.2,
                rotateDeg: 90,
                ...option,
            };
            switch (action) {
                case 'zoomOut':
                    if (transform.value.scale > 0.2) {
                        transform.value.scale = parseFloat(
                            (transform.value.scale - zoomRate).toFixed(3),
                        );
                    }
                    break;
                case 'zoomIn':
                    transform.value.scale = parseFloat(
                        (transform.value.scale + zoomRate).toFixed(3),
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
        };

        const reset = () => {
            transform.value = {
                scale: 1,
                rotateDeg: 0,
            };
        };

        const handleScroll = (e: WheelEvent) => {
            e.stopPropagation();
            window.requestAnimationFrame(() => {
                const delta = e.deltaY ? e.deltaY : e.detail;
                if (delta < 0) {
                    handleActions('zoomIn', {
                        zoomRate: 0.015,
                    });
                } else {
                    handleActions('zoomOut', {
                        zoomRate: 0.015,
                    });
                }
            });
        };

        let clearScrollListener: () => void;
        const addMouseListener = () => {
            clearScrollListener = useEventListener(
                document,
                mousewheelEvent,
                handleScroll,
            );
        };

        const handleClose = () => {
            clearScrollListener && clearScrollListener();
            emit(CLOSE_EVENT);
        };

        watch(
            () => props.src,
            () => {
                reset();
            },
        );

        onMounted(() => {
            addMouseListener();
        });

        onUnmounted(() => {
            clearScrollListener && clearScrollListener();
        });

        return {
            prefixCls,
            handleClose,
            isGroup,
            prev,
            next,
            handleActions,
            previewStyle,
            zIndex,
        };
    },
});
</script>
