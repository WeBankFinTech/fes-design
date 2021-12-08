<template>
    <div ref="container" :style="containerStyle">
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
        <img v-else :class="`${prefixCls}__inner`" :src="src" :style="imageStyle" v-bind="imgCommonProps" @click="clickHandler" />

        <teleport v-show="preview" to="body">
            <preview v-if="isShowPreview" :src="src" :hide-on-click-modal="hideOnClickModal" @close="closeViewer"> </preview>
        </teleport>
    </div>
</template>
<script>
import { computed, watch, ref, nextTick, inject } from 'vue';
import { useEventListener, useThrottleFn } from '@vueuse/core';
import { isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { PictureOutlined, PictureFailOutlined } from '../icon';
import { ERROR_EVENT, CLOSE_EVENT, LOAD_EVENT } from '../_util/constants';
import { isHtmlElement, getScrollContainer, isInContainer } from '../_util/dom';
import { noop } from '../_util/utils';
import { KEY } from './const';
import Preview from './preview.vue';

const prefixCls = getPrefixCls('img');

let curIndex = 0;
let prevOverflow = '';

export default {
    name: 'FImage',
    componentName: 'FImage',
    components: {
        Preview,
        PictureOutlined,
        PictureFailOutlined,
    },
    props: {
        src: {
            type: String,
            default: '',
        },
        preview: {
            type: Boolean,
            default: false,
        },
        fit: {
            type: String,
            values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'],
            default: '',
        },
        lazy: {
            type: Boolean,
            default: false,
        },
        hideOnClickModal: {
            type: Boolean,
            default: false,
        },
        scrollContainer: {
            type: [String, Object],
        },
    },
    emits: [ERROR_EVENT, LOAD_EVENT],
    setup(props, { attrs, emit }) {
        const loading = ref(true);
        const isLoadError = ref(false);
        const container = ref(null);
        let clearScrollListener = () => {};
        const isShowPreview = ref(false);
        const currentId = ref(curIndex++);

        const { width, height, crossorigin, decoding, alt, sizes, srcset, usemap } = attrs;
        const imgCommonProps = {
            crossorigin,
            decoding,
            alt,
            sizes,
            srcset,
            usemap,
        };

        const { isGroup, setShowPreview, setCurrent, registerImage } = inject(KEY, {
            isGroup: ref(false),
            setShowPreview: noop,
            setCurrent: noop,
            registerImage: noop,
        });
        const canPreview = computed(() => (props.preview || isGroup.value) && !isLoadError.value);
        const containerStyle = computed(() => attrs.style);
        const _scrollContainer = computed(() => {
            let dom = '';
            const _container = props.scrollContainer;
            if (isString(_container) && _container !== '') {
                dom = document.querySelector(_container);
            }
            if (isHtmlElement(_container)) {
                dom = _container;
            } else if (container) {
                dom = getScrollContainer(container.value);
            }
            return dom;
        });
        const imageStyle = computed(() => {
            const { fit } = props;
            const styleObj = {};
            if (fit) {
                styleObj.objectFit = fit;
            }
            if (canPreview.value) {
                styleObj.cursor = 'pointer';
            }
            return styleObj;
        });

        const handleLoaded = (e) => {
            loading.value = false;
            isLoadError.value = false;
            emit(LOAD_EVENT, e);
        };
        const handleError = (e) => {
            loading.value = false;
            isLoadError.value = true;
            emit(ERROR_EVENT, e);
        };

        const loadImage = () => {
            if (!loading.value) return;

            const img = new Image();
            img.addEventListener('load', (e) => handleLoaded(e, img));
            img.addEventListener('error', handleError);

            img.src = props.src;
        };

        const lazyLoadHandler = useThrottleFn(() => {
            // load image until image enter the container
            if (isInContainer(container.value, _scrollContainer.value)) {
                loadImage();
            }
        }, 200);

        async function addLazyLoadListener() {
            await nextTick();
            clearScrollListener && clearScrollListener();

            if (_scrollContainer.value) {
                clearScrollListener = useEventListener(_scrollContainer, 'scroll', lazyLoadHandler);
            }
            lazyLoadHandler();
        }

        function clickHandler() {
            console.log('test---');
            if ((!props.preview && isGroup) || !canPreview.value) return;
            console.log('test---11');
            if (isGroup.value) {
                setCurrent(currentId.value);
                setShowPreview(true);
            } else {
                // prevent body scroll
                prevOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                isShowPreview.value = true;
                console.log('herre');
            }
        }

        function closeViewer() {
            if (isGroup.value) {
                setShowPreview(false);
            } else {
                document.body.style.overflow = prevOverflow;
                isShowPreview.value = false;
            }
            emit(CLOSE_EVENT);
        }

        let unRegister = () => {};
        watch(
            () => props.src,
            (_src) => {
                if (_src) {
                    if (props.lazy) {
                        addLazyLoadListener();
                    } else {
                        loadImage();
                    }
                }
            },
            { immediate: true },
        );

        watch(
            [() => props.src, canPreview],
            () => {
                unRegister();
                if (!isGroup.value) return;

                if (canPreview.value) {
                    unRegister = registerImage(currentId.value, props.src);
                }
            },
            { immediate: true },
        );
        return {
            width,
            height,
            imgCommonProps,
            imageStyle,
            containerStyle,
            clickHandler,
            isShowPreview,
            closeViewer,
            container,
            prefixCls,
            isLoadError,
            loading,
        };
    },
};
</script>
