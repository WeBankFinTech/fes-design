import type { InjectionKey, Ref, ToRefs } from 'vue';
import type { FileItem, UploadFile } from './interface';
import type { UploadProps } from './upload';

export const key: InjectionKey<
    {
        prefixCls: string;
        uploadFiles: Ref<FileItem[]>;
        onRemove: (rawFile: null | UploadFile, file?: FileItem) => void;
        onUploadFiles: (files: FileList | File[]) => void;
        inputRef: Ref<any>;
        isDragger: Ref<boolean>;
    } & ToRefs<UploadProps>
> = Symbol('FUpload');
