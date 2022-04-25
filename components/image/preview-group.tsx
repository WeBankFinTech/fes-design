import { h, ref, reactive, provide, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Preview from './preview.vue';
import { PREVIEW_PROVIDE_KEY } from './props';

let prevOverflow = '';

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
        const previewUrls = reactive<Record<number, string>>({});
        const curIndex = ref();
        const isGroup = ref(true);
        const isShowPreview = ref(false);
        const setCurrent = (val: number) => {
            curIndex.value = val;
        };
        const registerImage = (id: number, url: string) => {
            previewUrls[id] = url;

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

        provide(PREVIEW_PROVIDE_KEY, {
            isGroup,
            previewUrls,
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
                        src={previewUrls[curIndex.value]}
                        hideOnClickModal={props.hideOnClickModal}
                        onClose={closeViewer}
                    ></Preview>
                )}
            </>
        );
    },
});
