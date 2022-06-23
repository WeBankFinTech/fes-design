import { ref, provide, watch, toRefs } from 'vue';
import { isEqual, isFunction, cloneDeep } from 'lodash-es';
import { noop, hasOwn } from '../_util/utils';
import getPrefixCls from '../_util/getPrefixCls';
import { key } from './const';

import type { UploadProps } from './upload';

const prefixCls = getPrefixCls('upload');

import type {
    FileListItem,
    UploadFile,
    UploadProgressEvent,
} from './interface';

function genUid(seed: number) {
    return Date.now() + seed;
}

function getFile(rawFile: UploadFile, uploadFiles: UploadFile[]) {
    return uploadFiles.find((file) => file.uid === rawFile.uid);
}

export default (props: UploadProps, emit: any) => {
    const isDragger = ref(false);
    const inputRef = ref();
    const uploadFiles = ref([]);
    const requestList = ref<{
        [key: number | string]: XMLHttpRequest;
    }>({});
    let cachedFiles: FileListItem[] = [];
    let tempIndex = 1;

    function initFile(rawFile: UploadFile) {
        const uid = genUid(tempIndex++);
        rawFile.uid = uid;
        const file = {
            name: rawFile.name,
            percentage: 0,
            status: 'ready',
            size: rawFile.size,
            raw: rawFile,
            uid,
            url: '',
        };
        return file;
    }

    function abort(file?: UploadFile) {
        const _requestList = requestList.value;
        if (file) {
            const uid = file.uid;
            if (_requestList[uid]) {
                _requestList[uid].abort();
            }
        } else {
            Object.keys(_requestList).forEach((uid) => {
                const _uid = uid as keyof typeof _requestList;
                if (_requestList[_uid]) _requestList[_uid].abort();
                delete _requestList[_uid];
            });
        }
    }

    function onStart(rawFile: UploadFile) {
        const file = initFile(rawFile);
        if (props.listType === 'picture-card') {
            try {
                file.url = URL.createObjectURL(rawFile);
            } catch (error) {
                console.error('[Upload]', error);
                emit('error', { error, file, fileList: uploadFiles.value });
            }
        }
        uploadFiles.value.push(file);
        emit('change', { file, fileList: uploadFiles.value });
    }

    function onExceed(files: UploadFile[]) {
        emit('exceed', { files, fileList: uploadFiles.value });
    }

    function onProgress({
        event,
        rawFile,
    }: {
        event: UploadProgressEvent;
        rawFile: UploadFile;
    }) {
        const file = getFile(rawFile, uploadFiles.value);
        if (!file) {
            return;
        }
        file.status = 'uploading';
        file.percentage = event.percent || 0;
        emit('progress', { event, file, fileList: uploadFiles.value });
    }

    function onSuccess({
        response,
        rawFile,
    }: {
        response: any;
        rawFile: UploadFile;
    }) {
        const file = getFile(rawFile, uploadFiles.value);
        if (!file) return;
        file.status = 'success';
        file.response = response;
        emit('success', { response, file, fileList: uploadFiles.value });
        emit('change', { file, fileList: uploadFiles.value });
    }

    function onError({
        error,
        rawFile,
    }: {
        error: Error;
        rawFile: UploadFile;
    }) {
        const uploadFilesValue = uploadFiles.value;
        const file = getFile(rawFile, uploadFilesValue);
        if (!file) return;
        file.status = 'error';
        emit('error', { error, file, fileList: uploadFilesValue });
        emit('change', { file, fileList: uploadFilesValue });
    }

    function onRemove(rawFile: null | UploadFile, file?: UploadFile) {
        const uploadFilesValue = uploadFiles.value;
        file = file || getFile(rawFile, uploadFilesValue);
        if (!file) {
            return;
        }
        const doRemove = () => {
            abort(file);
            uploadFilesValue.splice(uploadFilesValue.indexOf(file), 1);
            emit('remove', { file, fileList: uploadFilesValue });
            emit('change', { file, fileList: uploadFilesValue });
        };
        if (!props.beforeRemove) {
            return doRemove();
        }
        if (isFunction(props.beforeRemove)) {
            const before = props.beforeRemove(file, uploadFilesValue);
            if (before instanceof Promise) {
                before
                    .then(() => {
                        doRemove();
                    })
                    .catch(noop);
            } else if (before !== false) {
                doRemove();
            }
        }
    }

    const post = (rawFile: UploadFile) => {
        if (!props.action) {
            onRemove(rawFile);
            console.error('[FUpload] 需配置action地址，才能执行上传');
            return;
        }
        const { uid } = rawFile;
        const options = {
            headers: props.headers,
            withCredentials: props.withCredentials,
            data: props.data,
            file: rawFile,
            fileName: props.name,
            action: props.action,
            timeout: props.timeout,
            onProgress: (e: ProgressEvent) => {
                onProgress({
                    event: e,
                    rawFile,
                });
            },
            onSuccess: (res: any) => {
                onSuccess({
                    response: res,
                    rawFile,
                });
                delete requestList.value[uid];
            },
            onError: (err: Error) => {
                onError({
                    error: err,
                    rawFile,
                });
                delete requestList.value[uid];
            },
        };
        const req = props.httpRequest(options);
        requestList.value[uid] = req;
        if (req instanceof Promise) {
            req.then(options.onSuccess, options.onError);
        }
    };

    const upload = async (rawFile: UploadFile) => {
        inputRef.value.value = null;
        if (!props.beforeUpload) {
            return post(rawFile);
        }
        try {
            let processedFile = await props.beforeUpload(rawFile);
            if (processedFile === false) {
                return onRemove(rawFile);
            }
            const fileType = Object.prototype.toString.call(processedFile);
            if (fileType === '[object File]' || fileType === '[object Blob]') {
                if (fileType === '[object Blob]') {
                    processedFile = new File([processedFile], rawFile.name, {
                        type: rawFile.type,
                    });
                }
                Object.keys(rawFile).forEach((p) => {
                    if (hasOwn(rawFile, p)) {
                        processedFile[p] = rawFile[p as keyof typeof rawFile];
                    }
                });
                post(processedFile);
            } else {
                post(rawFile);
            }
        } catch (e) {
            onRemove(rawFile);
        }
    };

    const onUploadFiles = (files: UploadFile[]) => {
        if (
            props.multipleLimit &&
            props.fileList.length + files.length > props.multipleLimit
        ) {
            onExceed(files);
            return;
        }
        let postFiles = Array.from(files);
        if (!props.multiple) {
            postFiles = postFiles.slice(0, 1);
        }
        if (postFiles.length === 0) {
            return;
        }
        postFiles.forEach((rawFile) => {
            onStart(rawFile);
            upload(rawFile);
        });
    };

    provide(key, {
        ...toRefs(props),
        prefixCls,
        uploadFiles,
        onRemove,
        onUploadFiles,
        inputRef,
        isDragger,
    });

    watch(
        () => props.fileList,
        (fileList) => {
            if (!isEqual(cachedFiles, fileList)) {
                cachedFiles = [];
                uploadFiles.value = fileList.map((file) => {
                    const cloneFile = cloneDeep(file);
                    cachedFiles.push(cloneFile);
                    return {
                        ...cloneFile,
                        uid: file.uid || genUid(tempIndex++),
                        status: file.status || 'success',
                    };
                });
            }
        },
        {
            immediate: true,
            deep: true,
        },
    );

    return {
        uploadFiles,
        isDragger,
    };
};
