import { isServer } from './isServer';

const prefixStorage = '__fesd-storage';

export function getPrefixStorage(suffix: string) {
    return suffix ? `${prefixStorage}-${suffix}` : prefixStorage;
}

export type StorageType = 'local' | 'session';

export function getStorage(type: StorageType): Storage | undefined {
    // SSR：无 localStorage/sessionStorage，返回 undefined
    // （调用方 useStorage 已对 undefined 做读取保护；写入仅在客户端发生）
    if (isServer) {
        return undefined;
    }
    return type === 'local' ? localStorage : sessionStorage;
}
