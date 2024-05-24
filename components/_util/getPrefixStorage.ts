const prefixStorage = 'fes-storage';

export default function getPrefixStorage(suffix: string) {
    return suffix ? `${prefixStorage}-${suffix}` : prefixStorage;
}
