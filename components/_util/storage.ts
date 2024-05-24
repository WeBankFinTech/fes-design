const prefixStorage = '__fesd-storage';

export function getPrefixStorage(suffix: string) {
    return suffix ? `${prefixStorage}-${suffix}` : prefixStorage;
}

export type StorageType = 'local' | 'session';

export function getStorage(type: StorageType) {
    return type === 'local' ? localStorage : sessionStorage;
}
