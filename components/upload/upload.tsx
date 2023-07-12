import { defineComponent, PropType } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Trigger from './trigger.vue';
import FileList from './fileList.vue';
import request from './ajax';
import useUpload from './useUpload';

import type { ExtractPublicPropTypes } from '../_util/interface';
import type { FileItem } from './interface';

type UploadListType = 'text' | 'picture-card';

export const uploadProps = {
    accept: {
        type: Array as PropType<string[]>,
        default: (): string[] => [],
    },
    action: String,
    headers: {
        type: Object,
        default: () => ({}),
    },
    data: {
        type: Object,
        default: () => ({}),
    },
    withCredentials: {
        type: Boolean,
        default: false,
    },
    timeout: {
        type: Number,
    },
    beforeUpload: Function,
    beforeRemove: Function,
    disabled: {
        type: Boolean,
        default: false,
    },
    fileList: {
        type: Array as PropType<FileItem[]>,
        default: (): FileItem[] => [],
    },
    listType: {
        type: String as PropType<UploadListType>,
        default: 'text',
    },
    multiple: {
        type: Boolean,
        default: false,
    },
    multipleLimit: Number,
    name: {
        type: String,
        default: 'file',
    },
    showFileList: {
        type: Boolean,
        default: true,
    },
    httpRequest: {
        type: Function,
        default: request,
    },
    transformResponse: Function,
} as const;

export type UploadProps = ExtractPublicPropTypes<typeof uploadProps>;

export default defineComponent({
    name: 'FUpload',
    props: uploadProps,
    emits: [
        'change',
        'remove',
        'success',
        'error',
        'progress',
        'exceed',
        'update:fileList',
    ],
    setup(props, ctx) {
        useTheme();
        const { uploadFiles, isDragger } = useUpload(props, ctx.emit);
        const getFileList = () => {
            if (!props.showFileList) {
                return null;
            }
            const fileListSlots = ctx.slots.fileList;
            if (!fileListSlots) {
                const file = ctx.slots.file;
                return <FileList v-slots={{ file }} />;
            }
            return fileListSlots({ uploadFiles: uploadFiles.value });
        };
        return () => {
            return (
                <>
                    {ctx.slots.default ? (
                        <Trigger class={isDragger.value && 'is-dragger'}>
                            {ctx.slots.default?.({
                                uploadFiles: uploadFiles.value,
                            })}
                        </Trigger>
                    ) : (
                        <Trigger class={isDragger.value && 'is-dragger'} />
                    )}
                    {ctx.slots.tip?.()}
                    {getFileList()}
                </>
            );
        };
    },
});
