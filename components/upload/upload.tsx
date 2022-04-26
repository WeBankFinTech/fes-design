import { h, Fragment, defineComponent, PropType, ExtractPropTypes } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Trigger from './trigger.vue';
import FileList from './fileList.vue';
import request from './ajax';
import useUpload from './useUpload';

import type { FileListItem } from './interface';

type UploadListType = 'text' | 'picture-card';

const uploadProps = {
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
    beforeUpload: Function,
    beforeRemove: Function,
    drag: {
        type: Boolean,
        default: false,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    fileList: {
        type: Array as PropType<FileListItem[]>,
        default: (): FileListItem[] => [],
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
} as const;

export type UploadProps = Partial<ExtractPropTypes<typeof uploadProps>>;

export default defineComponent({
    name: 'FUpload',
    props: uploadProps,
    emits: ['change', 'remove', 'success', 'error', 'progress', 'exceed'],
    setup(props, ctx) {
        useTheme();
        const { uploadFiles } = useUpload(props, ctx.emit);
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
                        <Trigger>
                            {ctx.slots.default?.({
                                uploadFiles: uploadFiles.value,
                            })}
                        </Trigger>
                    ) : (
                        <Trigger />
                    )}
                    {ctx.slots.tip?.()}
                    {getFileList()}
                </>
            );
        };
    },
});
