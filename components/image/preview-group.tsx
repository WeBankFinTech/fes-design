import { computed, ref, reactive, provide, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Preview from './preview.vue';
import { PREVIEW_PROVIDE_KEY } from './props';
import type { PreviewImageType } from './props';
import type { ExtractPublicPropTypes } from '../_util/interface';

let prevOverflow = '';

export const previewGroupProps = {
    hideOnClickModal: {
        type: Boolean,
        default: false,
    },
} as const;

export type PreviewGroupProps = ExtractPublicPropTypes<
    typeof previewGroupProps
>;

export default defineComponent({
    name: 'FPreviewGroup',
    props: previewGroupProps,
    setup(props, { slots }) {
        useTheme();
        const previewUrls = reactive<Record<number, PreviewImageType>>({});
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

        const registerImage = (param: PreviewImageType) => {
            previewUrls[param.id] = param;

            return () => {
                delete previewUrls[param.id];
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

        const next = () => {
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
        };

        const prev = () => {
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
        };

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
                        download={previewUrls[curIndex.value].download}
                        hideOnClickModal={props.hideOnClickModal}
                        onClose={closeViewer}
                    ></Preview>
                )}
            </>
        );
    },
});
