/*
 * @Author: your name
 * @Date: 2022-01-03 16:15:57
 * @LastEditTime: 2022-01-03 17:22:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: /fes-design/components/image/preview-group.tsx
 */
import type { Ref } from 'vue';
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
        
        type PreviewGroupContext = {
            isGroup?: Ref<boolean | undefined>;
            previewUrls: Record<number, string>;
            curIndex: Ref<number>;
            setCurrent: (val: number) => void;
            setShowPreview: () => void;
            registerImage: (id: number, url: string) => () => void;
        }

        let provideParams = {
            isGroup,
            previewUrls,
            registerImage,
            curIndex,
            setCurrent,
            setShowPreview,
        };
        provide(PREVIEW_PROVIDE_KEY, provideParams);

        return () => (
            <div>
                {slots.default?.()}
                {isShowPreview.value && (
                    <Preview
                        src={previewUrls[curIndex.value]}
                        hideOnClickModal={props.hideOnClickModal}
                        onClose={closeViewer}
                    ></Preview>
                )}
            </div>
        );
    },
});
