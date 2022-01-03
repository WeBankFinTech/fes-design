/*
 * @Author: your name
 * @Date: 2022-01-03 16:15:57
 * @LastEditTime: 2022-01-03 17:22:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fes-design/components/image/preview-group.tsx
 */
import { h, ref, reactive, provide, defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Preview from './preview.vue';
import { KEY } from './const';

let prevOverflow: string = '';

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
        useTheme();
        const previewUrls = reactive({});
        const curIndex = ref();
        const isGroup = ref(true);
        const isShowPreview = ref(false);
        const setCurrent = (val: Number) => {
            curIndex.value = val;
        };
        const registerImage = (id: Number, url: String) => {
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
                    <Preview
                        src={previewUrls[curIndex.value]}
                        hideOnClickModal={props.hideOnClickModal}
                        onClose={closeViewer}
                    ></Preview>
                ) : (
                    ''
                )}
            </div>
        );
    },
});
