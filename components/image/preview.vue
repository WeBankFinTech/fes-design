<!--
 * @Author: your name
 * @Date: 2022-01-03 16:15:57
 * @LastEditTime: 2022-01-03 17:45:15
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fes-design/components/image/preview.vue
-->
<template>
    <div class="aa" :class="`${prefixCls}`" :style="{ zIndex }">
        <!-- close -->
        <div :class="[`${prefixCls}__close`, `${prefixCls}__btn`]" @click="handleClose">
            <CloseOutlined />
        </div>

        <!-- arrow -->
        <div v-if="isGroup" :class="[`${prefixCls}__arrow-left`, `${prefixCls}__btn`]" @click="prev">
            <LeftOutlined />
        </div>

        <div v-if="isGroup" :class="[`${prefixCls}__arrow-right`, `${prefixCls}__btn`]" @click="next">
            <RightOutlined />
        </div>

        <!-- toolBar -->
        <div :class="`${prefixCls}__toolBar`">
            <SearchMinusOutlined :class="`${prefixCls}-zoom-out`" @click="handleActions('zoomOut')" />
            <SearchPlusOutlined :class="`${prefixCls}-zoom-in`" @click="handleActions('zoomIn')" />
            <RotateLeftOutlined :class="`${prefixCls}-rotate-left`" @click="handleActions('rotateLeft')" />
            <ReloadOutlined :class="`${prefixCls}-rotate-right`" @click="handleActions('rotateRight')" />
        </div>

        <!-- canvas -->
        <div :class="[`${prefixCls}__canvas`, `${prefixCls}__mask`]" @click.self="hideOnClickModal && handleClose()">
            <img ref="img" :src="src" :style="previewStyle" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineComponent, inject, ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useEventListener } from '@vueuse/core';
import getPrefixCls from '../_util/getPrefixCls';
import { isFirefox, noop } from '../_util/utils';
import PopupManager from '../_util/popupManager';
import { LeftOutlined, RightOutlined, CloseOutlined, ReloadOutlined, RotateLeftOutlined, SearchPlusOutlined, SearchMinusOutlined } from '../icon';
import { KEY } from './const';
import type { CLOSE_EVENT } from '../_util/interface';


const prefixCls = getPrefixCls('preview');

type PreviewProps = {
    src: string;
    hideOnClickModal?: boolean;
};

type PreviewEmits = {
    (e: CLOSE_EVENT): void;
};

const props = withDefaults(defineProps<PreviewProps>(), {
    src: '',
    hideOnClickModal: false,
});

const emit = defineEmits<PreviewEmits>();

const zIndex = ref(PopupManager.nextZIndex());
const transform = ref({
    scale: 1,
    rotateDeg: 0,
});
const { isGroup, setCurrent, previewUrls, curIndex } = inject(KEY, {
    curIndex: ref(0),
    isGroup: ref(false),
    setCurrent: () => {},
    previewUrls: () => {},
});
const clearScrollListener = noop;
const mousewheelEvent = isFirefox() ? 'DOMMouseScroll' : 'mousewheel';
const previewUrlsKeys = computed(() => Object.keys(previewUrls));
const currentPreviewIndex = computed(() => previewUrlsKeys.value.indexOf(String(curIndex.value)));

const previewStyle = computed(() => {
    const { scale, rotateDeg } = transform.value;
    const style = {
        transform: `scale(${scale}) rotate(${rotateDeg}deg)`,
        transition: 'transform .3s',
    };

    return style;
});
const handleClose = () => {
    clearScrollListener.value && clearScrollListener.value();
    emit(CLOSE_EVENT);
};

const prev = () => {
    if (currentPreviewIndex.value > 0) {
        setCurrent(previewUrlsKeys.value[String(currentPreviewIndex.value - 1)]);
    } else {
        setCurrent(previewUrlsKeys.value[String(previewUrlsKeys.value.length - currentPreviewIndex.value - 1)]);
    }
};
const next = () => {
    if (currentPreviewIndex.value < previewUrlsKeys.value.length - 1) {
        setCurrent(previewUrlsKeys.value[currentPreviewIndex.value + 1]);
    } else {
        setCurrent(previewUrlsKeys.value[String(previewUrlsKeys.value.length - currentPreviewIndex.value - 1)]);
    }
};

const handleActions = (action: string, option: object) => {
    const { zoomRate, rotateDeg } = {
        zoomRate: 0.2,
        rotateDeg: 90,
        ...option,
    };
    switch (action) {
        case 'zoomOut':
            if (transform.value.scale > 0.2) {
                transform.value.scale = parseFloat((transform.value.scale - zoomRate).toFixed(3));
            }
            break;
        case 'zoomIn':
            transform.value.scale = parseFloat((transform.value.scale + zoomRate).toFixed(3));
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

const handleScroll = (e: MouseEvent) =>
    window.requestAnimationFrame(() => {
        const delta = e.wheelDelta ? e.wheelDelta : -e.detail;
        if (delta > 0) {
            handleActions('zoomIn', {
                zoomRate: 0.015,
            });
        } else {
            handleActions('zoomOut', {
                zoomRate: 0.015,
            });
        }
    });

const addMouseListener = () => {
    clearScrollListener.value = useEventListener(document, mousewheelEvent, handleScroll);
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
</script>

<script>
export default {
    name: 'FPreview',
};
</script>