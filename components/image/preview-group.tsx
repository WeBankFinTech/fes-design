import { h, computed, ref, reactive, provide, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Preview from './preview.vue';
import { PREVIEW_PROVIDE_KEY } from './props';

let prevOverflow = '';

type UrlType = {
    url: string;
    name: string | undefined;
    size: {width: number; height: number}
}

export default defineComponent({
    name: 'FPreviewGroup',
    props: {
        hideOnClickModal: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { slots }) {
        useTheme();
        const previewUrls = reactive<Record<number, UrlType>>({});
        const curIndex = ref();
        const isGroup = ref(true);
        const isShowPreview = ref(false);
        const setCurrent = (val: number) => {
            curIndex.value = val;
        };
        const previewUrlsKeys: any = computed(() => Object.keys(previewUrls));
        const currentPreviewIndex = computed(() =>
            previewUrlsKeys.value.indexOf(String(curIndex.value)),
        );
        
        const registerImage = (id: number, url: string, name: string | undefined, size: {width: number; height: number}) => {
            previewUrls[id] = {
                url,
                name,
                size,
            };

            return () => {
                delete previewUrls[id];
            };
        };

        const setShowPreview = () => {
            prevOverflow = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            isShowPreview.value = true;
        };

        const closeViewer = () => {
            document.body.style.overflow = prevOverflow;
            isShowPreview.value = false;
        };

        const next = ()=>{
            if (currentPreviewIndex.value < previewUrlsKeys.value.length - 1) {
                setCurrent(
                    previewUrlsKeys.value[currentPreviewIndex.value + 1],
                );
            } else {
                setCurrent(
                    previewUrlsKeys.value[
                        previewUrlsKeys.value.length -
                            currentPreviewIndex.value -
                            1
                    ],
                );
            }
        }

        const prev = ()=>{
            if (currentPreviewIndex.value > 0) {
                setCurrent(
                    previewUrlsKeys.value[
                        String(currentPreviewIndex.value - 1)
                    ],
                );
            } else {
                setCurrent(
                    previewUrlsKeys.value[
                        previewUrlsKeys.value.length -
                            currentPreviewIndex.value -
                            1
                    ],
                );
            }
        }

        provide(PREVIEW_PROVIDE_KEY, {
            isGroup,
            prev,
            next,
            registerImage,
            curIndex,
            setCurrent,
            setShowPreview,
        });

        return () => (
            <>
                {slots.default?.()}
                {isShowPreview.value && (
                    <Preview
                        src={previewUrls[curIndex.value].url}
                        name={previewUrls[curIndex.value].name}
                        size={previewUrls[curIndex.value].size}
                        hideOnClickModal={props.hideOnClickModal}
                        onClose={closeViewer}
                    ></Preview>
                )}
            </>
        );
    },
});
