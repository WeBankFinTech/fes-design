export interface FileListItem {
    uid?: number | string;
    status?: string;
    name: string;
    url: string;
}

export interface UploadProgressEvent extends ProgressEvent {
    percent?: number;
}

export interface UploadFile extends File {
    url?: string;
    uid?: number;
    status?: string;
    percentage?: number;
    response?: any;
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
    timeout: number;
    onProgress: (e: ProgressEvent) => void;
    onSuccess: (res: any) => void;
    onError: (err: Error) => void;
}
