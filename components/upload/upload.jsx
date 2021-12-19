import { defineComponent } from 'vue';
import { useTheme } from '../_theme/useTheme';
import Trigger from './trigger';
import FileList from './fileList';
import request from './ajax';
import useUpload from './useUpload';

export default defineComponent({
    name: 'FUpload',
    components: {
        Trigger,
        FileList,
    },
    props: {
        accept: {
            type: Array,
            default: () => [],
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
            type: Array,
            validator: (value) => value.every((file) => file.name && file.url),
            default: () => [],
        },
        listType: {
            type: String,
            default: 'text',
            validator: (value) => ['text', 'picture-card'].includes(value),
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
    },
    emits: ['change', 'remove', 'success', 'error', 'progress', 'exceed'],
    setup(props, ctx) {
        useTheme();
        const { uploadFiles } = useUpload(props, ctx);
        const getFileList = () => {
            if (!props.showFileList) {
                return null;
            }
            const fileListSlots = ctx.slots.fileList;
            if (!fileListSlots) {
                return <FileList />;
            }
            return fileListSlots({ uploadFiles: uploadFiles.value });
        };
        return () => {
            const UploadTrigger = ctx.slots.default ? (
                <Trigger>
                    {ctx.slots.default?.({ uploadFiles: uploadFiles.value })}
                </Trigger>
            ) : (
                <Trigger />
            );

            return (
                <>
                    <UploadTrigger />
                    {ctx.slots.tip?.()}
                    {getFileList()}
                </>
            );
        };
    },
});
