<!--
 * @Author: tgsx
 * @Date: 2022-01-03 16:15:57
 * @LastEditTime: 2022-01-03 17:51:14
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fes-design/components/image/image.vue
-->
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
        <img
            v-else
            :class="`${prefixCls}__inner`"
            :src="src"
            :style="imageStyle"
            v-bind="imgCommonProps"
            @click="clickHandler"
        />

        <teleport v-show="preview" to="body">
            <preview
                v-if="isShowPreview"
                :src="src"
                :hide-on-click-modal="hideOnClickModal"
                @close="closeViewer"
            >
            </preview>
        </teleport>
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
} from 'vue';
import { useEventListener, useThrottleFn } from '@vueuse/core';
import { isString } from 'lodash-es';
import getPrefixCls from '../_util/getPrefixCls';
import { PictureOutlined, PictureFailOutlined } from '../icon';
import { isHtmlElement, getScrollContainer, isInContainer } from '../_util/dom';
import { noop, noopInNoop } from '../_util/utils';
import { CLOSE_EVENT, LOAD_EVENT, ERROR_EVENT } from '../_util/constants';
import { useTheme } from '../_theme/useTheme';
import { PREVIEW_PROVIDE_KEY } from './props';
import Preview from './preview.vue';

const prefixCls = getPrefixCls('img');

let curIndex = 0;
let prevOverflow = '';

export default defineComponent({
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
    },
    emits: [ERROR_EVENT, LOAD_EVENT, CLOSE_EVENT],
    setup(props, { attrs, emit }) {
        useTheme();
        const loading = ref(true);
        const isLoadError = ref(false);
        const container = ref(null);
        let clearScrollListener = noop;
        const isShowPreview = ref(false);
        const currentId = ref(curIndex++);

        const {
            width = '',
            height = '',
            crossorigin = '',
            decoding = 'auto',
            alt = '',
            sizes = '',
            srcset = '',
            usemap = '',
        } = attrs as ImgHTMLAttributes;

        const imgCommonProps = {
            crossorigin,
            decoding,
            alt,
            sizes,
            srcset,
            usemap,
        };
        const { isGroup, setShowPreview, setCurrent, registerImage } = inject(
            PREVIEW_PROVIDE_KEY,
            {
                setShowPreview: noop,
                isGroup: ref(false),
                setCurrent: noop,
                registerImage: noopInNoop,
            },
        );
        const canPreview = computed(
            () => (props.preview || isGroup.value) && !isLoadError.value,
        );
        const containerStyle = computed(() => attrs.style);
        const _scrollContainer = computed(() => {
            let dom: any;
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
            const styleObj = { fit: '', cursor: '' };
            if (fit) {
                styleObj.fit = fit;
            }
            if (canPreview.value) {
                styleObj.cursor = 'pointer';
            }
            return styleObj;
        });
        const handleLoaded = (e: Event) => {
            loading.value = false;
            isLoadError.value = false;
            emit(LOAD_EVENT, e);
        };
        const handleError = (e: Event) => {
            loading.value = false;
            isLoadError.value = true;
            emit(ERROR_EVENT, e);
        };

        const loadImage = () => {
            if (!loading.value) return;

            const img = new Image();
            img.addEventListener('load', (e) => handleLoaded(e));
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
                clearScrollListener = useEventListener(
                    _scrollContainer,
                    'scroll',
                    lazyLoadHandler,
                );
            }
            lazyLoadHandler();
        }

        function clickHandler() {
            if ((!props.preview && isGroup) || !canPreview.value) return;
            if (isGroup.value) {
                setCurrent(currentId.value);
                setShowPreview(true);
            } else {
                // prevent body scroll
                prevOverflow = document.body.style.overflow;
                document.body.style.overflow = 'hidden';
                isShowPreview.value = true;
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

        let unRegister = noop;
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
});
</script>
