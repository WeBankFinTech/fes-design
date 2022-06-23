export interface UploadProgressEvent extends ProgressEvent {
    percent?: number;
}

export interface UploadFile extends File {
    uid?: number | string;
}
export interface FileItem {
    uid: number | string;
    name: string;
    size?: number;
    url?: string;
    status?: string;
    percentage?: number;
    response?: any;
    raw?: File;
    [prop: string]: any;
}

export interface UploadError extends Error {
    status?: number;
    method?: string;
    url?: string;
}

export interface UploadOption {
    headers?: object;
    withCredentials?: boolean;
    data?: object;
    file?: UploadFile;
    fileName?: string;
    action?: string;
    timeout?: number;
    transformResponse?: (xhr: XMLHttpRequest) => any;
    onProgress: (e: ProgressEvent) => void;
    onSuccess: (res: any) => void;
    onError: (err: Error) => void;
}
