import { hasOwn } from '../_util/utils';
import type { UploadProgressEvent } from './interface';

import type { UploadOption, UploadError } from './interface';

function getError(action: string, option: UploadOption, xhr: XMLHttpRequest) {
    let msg;
    if (xhr.response) {
        msg = `${xhr.response.error || xhr.response}`;
    } else if (xhr.responseText) {
        msg = `${xhr.responseText}`;
    } else {
        msg = `fail to post ${action} ${xhr.status}`;
    }

    const err = new Error(msg) as UploadError;
    err.status = xhr.status;
    err.method = 'post';
    err.url = action;
    return err;
}

function getBody(xhr: XMLHttpRequest) {
    const text = xhr.responseText || xhr.response;
    if (!text) {
        return text;
    }

    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

export default function upload(option: UploadOption) {
    if (typeof XMLHttpRequest === 'undefined') {
        return;
    }

    const xhr = new XMLHttpRequest();
    const action = option.action;

    if (xhr.upload) {
        xhr.upload.onprogress = function progress(e: UploadProgressEvent) {
            if (e.total > 0) {
                e.percent = (e.loaded / e.total) * 100;
            }
            option.onProgress(e);
        };
    }

    const formData = new FormData();

    if (option.data) {
        Object.keys(option.data).forEach((key) => {
            formData.append(key, option.data[key as keyof typeof option.data]);
        });
    }

    formData.append(option.fileName, option.file, option.file.name);

    xhr.onerror = function error() {
        option.onError(getError(action, option, xhr));
    };

    xhr.onload = function onload() {
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr));
        }
        if (option.transformResponse) {
            try {
                option.onSuccess(option.transformResponse(xhr));
            } catch (e: any) {
                const msg =
                    e?.message || `fail to post ${action} ${xhr.status}`;
                const err = new Error(msg) as UploadError;
                err.status = xhr.status;
                err.method = 'post';
                err.url = action;
                option.onError(err);
            }
        } else {
            option.onSuccess(getBody(xhr));
        }
    };

    xhr.open('post', action, true);

    // eslint-disable-next-line no-restricted-syntax
    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }

    if (option.timeout) {
        xhr.timeout = option.timeout;
    }

    const headers = option.headers || {};

    Object.keys(headers).forEach((item) => {
        if (
            hasOwn(headers, item) &&
            headers[item as keyof typeof headers] !== null
        ) {
            xhr.setRequestHeader(item, headers[item as keyof typeof headers]);
        }
    });

    xhr.send(formData);
    return xhr;
}
