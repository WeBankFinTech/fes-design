import { computed } from 'vue';

export const defaultNamespace = 'fes';
const statePrefix = 'is-';

const _bem = (
    namespace: string,
    block: string,
    blockSuffix: string,
    element: string,
    modifier: string,
) => {
    let cls = `${namespace}-${block}`;
    if (blockSuffix) {
        cls += `-${blockSuffix}`;
    }
    if (element) {
        cls += `__${element}`;
    }
    if (modifier) {
        cls += `--${modifier}`;
    }
    return cls;
};

export const useNamespace = (block: string) => {
    const namespace = computed(() => defaultNamespace);
    const b = (blockSuffix = '') =>
        _bem(namespace.value, block, blockSuffix, '', '');
    const e = (element?: string) =>
        element ? _bem(namespace.value, block, '', element, '') : '';
    const m = (modifier?: string) =>
        modifier ? _bem(namespace.value, block, '', '', modifier) : '';
    const be = (blockSuffix?: string, element?: string) =>
        blockSuffix && element
            ? _bem(namespace.value, block, blockSuffix, element, '')
            : '';
    const em = (element?: string, modifier?: string) =>
        element && modifier
            ? _bem(namespace.value, block, '', element, modifier)
            : '';
    const bm = (blockSuffix?: string, modifier?: string) =>
        blockSuffix && modifier
            ? _bem(namespace.value, block, blockSuffix, '', modifier)
            : '';
    const bem = (blockSuffix?: string, element?: string, modifier?: string) =>
        blockSuffix && element && modifier
            ? _bem(namespace.value, block, blockSuffix, element, modifier)
            : '';
    const is: {
        (name: string, state: boolean | undefined): string;
        (name: string): string;
    } = (name: string, ...args: [boolean | undefined] | []) => {
        const state = args.length >= 1 ? args[0]! : true;
        return name && state ? `${statePrefix}${name}` : '';
    };

    return {
        namespace,
        b,
        e,
        m,
        be,
        em,
        bm,
        bem,
        is,
    };
};
