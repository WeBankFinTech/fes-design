const prefixStorage = 'fesd-storage';

export default function getPrefixStorage(suffix: string) {
    return suffix ? `${prefixStorage}-${suffix}` : prefixStorage;
}
