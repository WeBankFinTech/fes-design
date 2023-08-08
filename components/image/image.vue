<template>
    <div ref="container" :class="prefixCls" :style="style">
        <slot v-if="loading" name="placeholder">
            <div :class="`${prefixCls}__placeholder`">
                <PictureOutlined />
                <span>加载中</span>
            </div>
        </slot>

        <slot v-else-if="isLoadError" name="error">
            <div :class="`${prefixCls}__error`">
                <PictureFailOutlined />
                <span>加载失败</span>
            </div>
        </slot>

        <div v-else :class="`${prefixCls}__inner`" @click="clickHandler">
            <slot>
                <img
                    :src="src"
                    :class="`${prefixCls}__inner-image`"
                    :style="imageStyle"
                    v-bind="imgAttrs"
                />
            </slot>
        </div>

        <template v-if="isShowPreview">
            <Preview
                :src="src"
                :name="name"
                :size="imageSize"
                :download="download"
                :hide-on-click-modal="hideOnClickModal"
                :getContainer="previewContainer"
                @close="closeViewer"
            >
            </Preview>
        </template>
    </div>
</template>
<script lang="ts">
import {
    computed,
    watch,
    ref,
    nextTick,
    inject,
    ImgHTMLAttributes,
    defineComponent,
    PropType,
    onUnmounted,
    reactive,
} from 'vue';
import { useEventListener, useThrottleFn } from '@vueuse/core';
import { isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { PictureOutlined, PictureFailOutlined } from '../icon';
import { isHtmlElement, getScrollContainer, isInContainer } from '../_util/dom';
import { noop, noopInNoop, pxfy } from '../_util/utils';
import { CLOSE_EVENT, LOAD_EVENT, ERROR_EVENT } from '../_util/constants';
import download from '../_util/download';
import { useTheme } from '../_theme/useTheme';
import { PREVIEW_PROVIDE_KEY } from './props';
import Preview from './preview.vue';
import type { ExtractPublicPropTypes } from '../_util/interface';

import type { CSSProperties } from 'vue';

const prefixCls = getPrefixCls('img');

let curIndex = 0;
let prevOverflow = '';

export const imageProps = {
    src: {
        type: String,
        default: '',
    },
    name: String,
    preview: {
        type: Boolean,
        default: false,
    },
    fit: {
        type: String as PropType<
            'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
        >,
    },
    lazy: {
        type: Boolean,
        default: false,
    },
    hideOnClickModal: {
        type: Boolean,
        default: false,
    },
    scrollContainer: [String, Object] as PropType<string | HTMLElement>,
    download: {
        type: Boolean,
        default: false,
    },
    previewContainer: {
        type: Function as PropType<() => HTMLElement>,
    },
    height: [String, Number] as PropType<string | number>,
    width: [String, Number] as PropType<string | number>,
} as const;

export type ImageProps = ExtractPublicPropTypes<typeof imageProps>;

export default defineComponent({
    name: 'FImage',
    componentName: 'FImage',
    components: {
        Preview,
        PictureOutlined,
        PictureFailOutlined,
    },
    props: imageProps,
    emits: [ERROR_EVENT, LOAD_EVENT, CLOSE_EVENT],
    setup(props, { attrs, emit }) {
        useTheme();
        const loading = ref(true);
        const isLoadError = ref(false);
        const container = ref(null);
        const isShowPreview = ref(false);
        const currentId = ref(curIndex++);

        const imgAttrs = computed(() => {
            const {
                crossorigin = undefined,
                decoding = 'auto',
                alt = undefined,
                sizes = undefined,
                srcset = undefined,
                usemap = undefined,
            } = attrs as ImgHTMLAttributes;

            return {
                crossorigin,
                decoding,
                alt,
                sizes,
                srcset,
                usemap,
            };
        });

        const style = computed(() => {
            const { width, height } = props;

            return {
                width: pxfy(width),
                height: pxfy(height),
            };
        });

        const imageSize = reactive({
            height: 0,
            width: 0,
        });

        const { isGroup, setShowPreview, setCurrent, registerImage } = inject(
            PREVIEW_PROVIDE_KEY,
            {
                setShowPreview: noop,
                isGroup: ref(false),
                setCurrent: noop,
                registerImage: noopInNoop,
            },
        );

        const canPreview = computed(() => props.preview && !isLoadError.value);

        const canGroupPreview = computed(
            () => isGroup.value && !isLoadError.value,
        );

        const _scrollContainer = computed(() => {
            let dom: any;
            const _container = props.scrollContainer;
            if (isString(_container) && _container !== '') {
                dom = document.querySelector(_container);
            }
            if (isHtmlElement(_container)) {
                dom = _container;
            } else if (container.value) {
                dom = getScrollContainer(container.value);
            }
            return dom;
        });

        const imageStyle = computed<CSSProperties>(() => {
            const { fit } = props;
            const styleObj: CSSProperties = { objectFit: 'fill', cursor: '' };
            if (fit) {
                styleObj.objectFit = fit;
            }
            if (props.download || canPreview.value || canGroupPreview.value) {
                styleObj.cursor = 'pointer';
            }
            return styleObj;
        });

        const handleLoaded = (e: Event, img: HTMLImageElement) => {
            imageSize.width = img.width;
            imageSize.height = img.height;
            loading.value = false;
            isLoadError.value = false;
            emit(LOAD_EVENT, e);
        };

        const handleError = (e: Event) => {
            loading.value = false;
            isLoadError.value = true;
            emit(ERROR_EVENT, e);
        };

        let currentImageId = 0;

        const loadImage = () => {
            // loading 为true 才会加载图片
            if (!loading.value) return;

            const img = new Image();

            const imageId = ++currentImageId;
            img.addEventListener('load', (e) => {
                // 检查 imageId 是否与 currentImageId 相同
                if (imageId !== currentImageId) return;
                handleLoaded(e, img);
            });
            img.addEventListener('error', (e) => {
                // 检查 imageId 是否与 currentImageId 相同
                if (imageId !== currentImageId) return;
                handleError(e);
            });

            // 赋值开始加载图片src
            img.src = props.src;
        };

        const lazyLoadHandler = useThrottleFn(() => {
            // load image until image enter the container
            if (isInContainer(container.value, _scrollContainer.value)) {
                loadImage();
            }
        }, 200);

        let clearScrollListener = noop;
        async function addLazyLoadListener() {
            await nextTick();
            if (clearScrollListener) {
                clearScrollListener();
            }

            if (_scrollContainer.value) {
                clearScrollListener = useEventListener(
                    _scrollContainer,
                    'scroll',
                    lazyLoadHandler,
                );
            }
            lazyLoadHandler();
        }

        function clickHandler() {
            if (canGroupPreview.value) {
                setCurrent(currentId.value);
                setShowPreview(true);
            } else if (canPreview.value) {
                // prevent body scroll
                prevOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                isShowPreview.value = true;
            } else if (props.download) {
                // 下载
                download({
                    href: props.src,
                    name: props.name,
                });
            }
        }

        function closeViewer() {
            document.body.style.overflow = prevOverflow;
            isShowPreview.value = false;
            emit(CLOSE_EVENT);
        }

        watch(
            () => props.src,
            (_src) => {
                if (_src) {
                    // 将 loading 状态设置为 true
                    loading.value = true;
                    // 重置 isLoadError 状态
                    isLoadError.value = false;
                    if (props.lazy) {
                        addLazyLoadListener();
                    } else {
                        loadImage();
                    }
                }
            },
            { immediate: true },
        );

        let unRegister = noop;
        watch(
            [
                () => props.src,
                () => props.name,
                () => props.download,
                canGroupPreview,
            ],
            () => {
                unRegister();
                if (canGroupPreview.value) {
                    unRegister = registerImage({
                        id: currentId.value,
                        url: props.src,
                        name: props.name,
                        size: imageSize,
                        download: props.download,
                    });
                }
            },
            { immediate: true },
        );

        onUnmounted(() => {
            if (unRegister) {
                unRegister();
            }
            if (clearScrollListener) {
                clearScrollListener();
            }
        });

        return {
            imgAttrs,
            imageStyle,
            isShowPreview,
            clickHandler,
            closeViewer,
            container,
            prefixCls,
            isLoadError,
            loading,
            imageSize,
            style,
        };
    },
});
</script>
