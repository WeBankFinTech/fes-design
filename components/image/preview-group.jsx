import { ref, reactive, provide, defineComponent } from 'vue';
import Preview from './preview.vue';
import { KEY } from './const';

let prevOverflow = '';

export default defineComponent({
    name: 'FPreviewGroup',
    componentName: 'FPreviewGroup',
    components: {
        Preview,
    },
    props: {
        hideOnClickModal: {
            type: Boolean,
            default: false,
        },
    },
    setup(props, { slots }) {
        const previewUrls = reactive({});
        const curIndex = ref();
        const isGroup = ref(true);
        const isShowPreview = ref(false);
        const setCurrent = (val) => {
            curIndex.value = val;
        };
        const registerImage = (id, url) => {
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
        provide(KEY, {
            isGroup,
            previewUrls,
            registerImage,
            curIndex,
            setCurrent,
            setShowPreview,
        });

        return () => (
            <div>
                {slots.default?.()}
                {isShowPreview.value ? (
                    <Preview src={previewUrls[curIndex.value]} hideOnClickModal={props.hideOnClickModal} onClose={closeViewer}></Preview>
                ) : (
                    ''
                )}
            </div>
        );
    },
});
